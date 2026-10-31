import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newClassicState,buildCatalogs,stageFromClassic,applyTransaction,tradeQuote,createProgressBridge,PHASER_KEY,CLASSIC_KEY} from '../src/progress.js';
import {marketplaceViewModel,PORTOMONTE_SUPPLIES} from '../src/ui-marketplace.js';

const names=['itens','receitas','magias','monstros','cidades'];
const data=Object.fromEntries(names.map(n=>[n,JSON.parse(readFileSync(new URL('../data/'+n+'.json',import.meta.url)))]));
const c=buildCatalogs(data);
test('M1g-D identifica os tres mercadores oficiais sem inventar estoques individuais',()=>{
 const s=newClassicState(),raw=JSON.stringify(s),city=c.cidadesById[s.city];
 assert.deepEqual(city.mercadores.map(m=>m.nome),['Sofia do Porto Seguro','Jonathan, o Taberneiro','Alina das Conchas']);
 const model=marketplaceViewModel(s,c);
 assert.equal(model.merchants.length,3);
 assert.equal(model.merchant.nome,city.mercadores[0].nome);
 assert.match(model.stockNotice,/não define estoques individuais/);
 assert.deepEqual(new Set(model.items.map(x=>x.id)),new Set(PORTOMONTE_SUPPLIES));
 assert.equal(JSON.stringify(s),raw,'apresentação não modifica character');
 for(const merchant of model.merchants){
  const selected=marketplaceViewModel(s,c,{merchantId:merchant.id});
  assert.equal(selected.merchant.id,merchant.id);
  assert.equal(selected.items.length,model.items.length,'Trocar NPC não cria estoque particular');
 }
});
test('M1g-D compra atomica por lote equivale a N negociacoes unitarias',()=>{
 const s={...newClassicState(),gold:30000};
 const item=c.itensById['mat-agua-purificada'],city=c.cidadesById[s.city];
 const quote=tradeQuote(s,item,city,'buy',8);
 const env=stageFromClassic(s,c);
 const batch=applyTransaction(env,{type:'buy',id:item.id,quantity:8},c);
 let seq=env;
 for(let i=0;i<8;i++)seq=applyTransaction(seq,{type:'buy',id:item.id},c).next;
 assert.equal(batch.next.character.gold,seq.character.gold);
 assert.equal(batch.next.character.skills.comercio,seq.character.skills.comercio);
 assert.equal(batch.next.character.bag[item.id],seq.character.bag[item.id]);
 assert.equal(batch.result.gold,quote.gold);
 assert.equal(batch.result.quantity,8);
 assert.equal(batch.next.revision,1,'um unico commit para o lote');
 assert.equal(seq.revision,8);
 assert.equal(env.character.gold,30000,'original nao muda');
});
test('M1g-D venda em lote segue precificacao progressiva e contagem de unidades',()=>{
 const s={...newClassicState(),bag:{...newClassicState().bag,'mat-agua-purificada':25}};
 const env=stageFromClassic(s,c),item=c.itensById['mat-agua-purificada'],city=c.cidadesById.portomonte;
 const quote=tradeQuote(s,item,city,'sell',15);
 const batch=applyTransaction(env,{type:'sell',id:item.id,quantity:15},c);
 let seq=env;
 for(let i=0;i<15;i++)seq=applyTransaction(seq,{type:'sell',id:item.id},c).next;
 assert.equal(batch.result.gold,quote.gold);
 assert.equal(batch.next.character.gold,seq.character.gold);
 assert.equal(batch.next.character.bag[item.id],10);
 assert.equal(batch.next.character.sales,seq.character.sales);
 assert.equal(batch.next.character.skills.comercio,seq.character.skills.comercio);
});
test('M1g-D bloqueia lotes invalidos sem efeitos parciais e protege equipado',()=>{
 const env=stageFromClassic(newClassicState(),c);
 for(const quantity of [0,-1,1.2,NaN,100,'3',null]){
   assert.throws(()=>applyTransaction(env,{type:'buy',id:'mat-agua-purificada',quantity},c),/Quantidade/);
 }
 assert.throws(()=>applyTransaction(env,{type:'buy',id:'mat-agua-purificada',quantity:99},c),/Ouro insuficiente/);
 assert.throws(()=>applyTransaction(env,{type:'sell',id:'mat-agua-purificada',quantity:99},c),/Quantidade indisponível/);
 assert.throws(()=>applyTransaction(env,{type:'sell',id:'eq-adaga-de-ferrugem'},c),/equipado/);
 assert.equal(env.character.gold,180);
 assert.equal(env.character.bag['mat-agua-purificada'],4);
 assert.equal(env.revision,0);
});
test('M1g-D interface calcula cotacao exata e bloqueios',()=>{
 const s=newClassicState();
 let vm=marketplaceViewModel(s,c,{mode:'buy',selectedId:'mat-agua-purificada',quantity:2});
 assert.equal(vm.selected.id,'mat-agua-purificada');
 assert.equal(vm.quote?.gold,tradeQuote(s,c.itensById[vm.selected.id],c.cidadesById[s.city],'buy',2).gold);
 vm=marketplaceViewModel({...s,gold:0},c,{mode:'buy',selectedId:'mat-agua-purificada'});
 assert.equal(vm.quote,null);assert.match(vm.problem,/Ouro insuficiente/);
 vm=marketplaceViewModel(s,c,{mode:'sell',selectedId:'mat-agua-purificada',quantity:5});
 assert.equal(vm.quote,null);assert.match(vm.problem,/Quantidade/);
 const filtered=marketplaceViewModel(s,c,{mode:'sell',query:'purificada'});
 assert.ok(filtered.items.some(x=>x.id==='mat-agua-purificada'));
});
test('M1g-D bridge preserva o save classico na compra/venda por lote',()=>{
 class Store{constructor(){this.m=new Map()}getItem(k){return this.m.get(k)||null}setItem(k,v){this.m.set(k,v)}}
 const storage=new Store(),original={...newClassicState(),gold:10000};
 storage.setItem(CLASSIC_KEY,JSON.stringify(original));
 const bridge=createProgressBridge(storage,c);
 const prior=JSON.stringify(bridge.read());
 bridge.execute({type:'buy',id:'mat-agua-purificada',quantity:4});
 bridge.execute({type:'sell',id:'mat-agua-purificada',quantity:4});
 assert.equal(storage.getItem(CLASSIC_KEY),JSON.stringify(original));
 assert.equal(JSON.parse(storage.getItem(PHASER_KEY)).revision,2);
 assert.notEqual(JSON.stringify(bridge.read()),prior);
});
test('M1g-D DOM do comercio separado de inventario e oficina',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/ui-marketplace.js',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 for(const id of ['tradeUI','tradeItems','tradeMerchants','tradePortrait','tradeSearch','tradeQuantity','tradeConfirm','tradeClose','tradeFeedback']){
  assert.match(html,new RegExp('id="'+id+'"'));
 }
 assert.match(html,/ui-marketplace\.css/);
 assert.match(main,/createMarketplaceScreen/);
 assert.match(main,/marketplace\.open\('buy'\)/);
 assert.match(main,/marketplace\.open\('sell'\)/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|setItem\(|removeItem\(/);
});
