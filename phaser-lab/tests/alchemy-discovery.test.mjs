import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ALCHEMY_FAMILIES,effectFamily,resolveAlchemyPair,effectDirectory,ingredientOptions,
  nextStudyEffect} from '../src/alchemy.js';
import {buildCatalogs,newClassicState,stageFromClassic,applyTransaction,createProgressBridge} from '../src/progress.js';
const get=(name)=>JSON.parse(readFileSync(new URL('../../data/'+name+'.json',import.meta.url),'utf8'));
const cur=get('curadoria_ingredientes');
const data=Object.fromEntries(['itens','receitas','magias','monstros','cidades'].map(x=>[x,get(x)]));
const c=buildCatalogs({...data,curadoria_ingredientes:cur});
const a='ing-felsaad-tern-feathers',b='ing-garlic';
const rich=()=>{
 const state=newClassicState();
 state.bag[a]=2;state.bag[b]=2;
 return state;
};
test('hierarquia contém cinco famílias sem atribuir permanência ou bálsamo arbitrariamente',()=>{
 assert.deepEqual(ALCHEMY_FAMILIES.map(x=>x.id),['pocao','veneno','tonico','elixir','balsamo']);
 assert.equal(effectFamily('aumentar_constituicao'),'pocao');
 assert.equal(effectFamily('diminuir_sabedoria'),'veneno');
 assert.equal(effectFamily('voar'),'tonico');
 assert.equal(effectFamily('vampirismo'),'tonico');
});
test('interseção pura aceita desconhecidos, não revela efeito isolado e é comutativa',()=>{
 const before=JSON.stringify(cur);
 const ab=resolveAlchemyPair(cur,[a,b]),ba=resolveAlchemyPair(cur,[b,a]);
 assert.deepEqual(ab,ba);
 assert.equal(ab.valid,true);
 assert.deepEqual(ab.effects.map(e=>e.id),['aumentar_constituicao','curar_doenca']);
 assert.deepEqual(ab.effects.find(e=>e.id==='curar_doenca').origens.map(x=>x.intensidade).sort(),[2,3]);
 assert.equal(JSON.stringify(cur),before,'Curadoria não pode mudar');
 assert.throws(()=>resolveAlchemyPair(cur,[a,a]),/distintos/);
});
test('diretório só mostra propriedades descobertas; pronto depende de DUAS fontes conhecidas e possuídas',()=>{
 const bag={[a]:1,[b]:1},knowledge={[a]:['curar_doenca'],[b]:['curar_doenca']};
 let dir=effectDirectory(cur,{},bag,3);
 assert.ok(dir.every(f=>f.effects.length===0));
 dir=effectDirectory(cur,knowledge,bag,3);
 const potion=dir.find(f=>f.id==='pocao').effects;
 assert.deepEqual(potion.map(e=>e.id),['curar_doenca']);
 assert.equal(potion[0].ready,true);
 assert.equal(effectDirectory(cur,knowledge,{[a]:1},3).find(f=>f.id==='pocao').effects[0].ready,false);
 assert.equal(effectDirectory(cur,knowledge,bag,0).find(f=>f.id==='pocao').effects[0].ready,false);
 assert.deepEqual(ingredientOptions(cur,knowledge,bag,{effectId:'curar_doenca'}).map(x=>x.id).sort(),[a,b].sort());
 assert.deepEqual(ingredientOptions(cur,{},bag,{effectId:'curar_doenca'}),[]);
 assert.equal(ingredientOptions(cur,{},bag).length,2,'Modo livre não exige conhecimento');
});
test('estudo revela UMA propriedade, custa uma ação, não consome ingrediente, não adianta segredos',()=>{
 const env=stageFromClassic(rich(),c),before=env.character.bag[a];
 const effect=nextStudyEffect(cur,{},a);
 const result=applyTransaction(env,{type:'studyIngredient',id:a},c);
 assert.equal(result.next.character.actions,2);
 assert.equal(result.next.character.bag[a],before);
 assert.deepEqual(result.next.character.alchemy.known[a],[effect.id]);
 assert.ok(!result.next.character.alchemy.known[a].includes('curar_doenca')||effect.id==='curar_doenca');
 assert.deepEqual(env.character.alchemy.known,{});
});
test('experimento cego fabrica todos efeitos comuns e descobre seus atributos sem potência inventada',()=>{
 const old=stageFromClassic(rich(),c);
 const tx=applyTransaction(old,{type:'brewPair',ingredients:[b,a]},c);
 assert.equal(tx.result.valid,true);
 assert.deepEqual(tx.result.preparation.effects.map(e=>e.id),['aumentar_constituicao','curar_doenca']);
 assert.ok(tx.next.character.alchemy.known[a].includes('curar_doenca'));
 assert.ok(tx.next.character.alchemy.known[b].includes('curar_doenca'));
 assert.equal(tx.next.character.alchemy.preparations.length,1);
 assert.equal(tx.next.character.alchemy.preparations[0].effects[0].potencia,undefined);
 assert.equal(tx.next.character.actions,2);
 assert.equal(tx.next.character.bag[a],1);assert.equal(tx.next.character.bag[b],1);
 assert.equal(old.character.bag[a],2,'O estado anterior é imutável');
});
test('experimento inválido consome os dois ingredientes e uma ação, sem fabricar resultado',()=>{
 const all=Object.keys(cur.itens);
 let pair=null;
 for(let i=0;i<all.length&&!pair;i++)for(let j=i+1;j<all.length;j++)
  if(!resolveAlchemyPair(cur,[all[i],all[j]]).valid){pair=[all[i],all[j]];break;}
 assert.ok(pair);
 const s=rich();for(const id of pair)s.bag[id]=(s.bag[id]||0)+1;
 const tx=applyTransaction(stageFromClassic(s,c),{type:'brewPair',ingredients:pair},c);
 assert.equal(tx.result.valid,false);
 assert.equal(tx.next.character.alchemy.failed,1);
 assert.equal(tx.next.character.alchemy.preparations.length,0);
 assert.equal(tx.next.character.actions,2);
 for(const id of pair)assert.equal(tx.next.character.bag[id]||0,(s.bag[id]||0)-1);
});
test('ingredientes ausentes ou repetidos falham atomicamente e nunca consomem ações',()=>{
 const e=stageFromClassic(rich(),c);
 assert.throws(()=>applyTransaction(e,{type:'brewPair',ingredients:[a,a]},c));
 assert.throws(()=>applyTransaction(e,{type:'brewPair',ingredients:[a,'ing-no-existe']},c));
 assert.equal(e.character.actions,3);
 assert.equal(e.character.bag[a],2);
});
test('descobertas e preparações sobrevivem reload do save Phaser',()=>{
 class Store{constructor(){this.data=new Map()}getItem(k){return this.data.get(k)||null}setItem(k,v){this.data.set(k,v)}}
 const storage=new Store();
 const first=createProgressBridge(storage,c);
 // start without relevant ingredients; studio bridge remains isolated.
 const s=stageFromClassic(rich(),c);
 const result=applyTransaction(s,{type:'brewPair',ingredients:[a,b]},c);
 assert.equal(result.result.valid,true);
 storage.setItem('peren_phaser_save_m1d_v1',JSON.stringify(result.next));
 const reopened=createProgressBridge(storage,c);
 assert.equal(reopened.state.alchemy.preparations.length,1);
 assert.ok(reopened.state.alchemy.known[a].includes('curar_doenca'));
 assert.equal(reopened.state.actions,2);
 assert.equal(first.state.alchemy.preparations.length,0);
});
test('a interface oferece as duas rotas e não utiliza dados de save fora do bridge',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/ui-alchemy.js',import.meta.url),'utf8');
 for(const id of ['alchemyFamilies','alchemyEffectList','alchemyKnownMode','alchemyFreeMode',
   'alchemyA','alchemyB','alchemyStudy','alchemyBrew','alchemyCreated'])
  assert.ok(html.includes('id="'+id+'"'),id);
 assert.match(ui,/bridge\.execute\(command\)/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|setItem\(/);
});
