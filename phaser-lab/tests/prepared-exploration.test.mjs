import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {applyExplorationPreparation} from '../src/prepared-use.js';
import {buildCatalogs,newClassicState,stageFromClassic,applyTransaction,createProgressBridge,toCombatProfile,maxClassicHp,maxClassicMp,PHASER_KEY} from '../src/progress.js';
import {inventoryViewModel} from '../src/ui-inventory.js';

const get=name=>{
 const local=new URL('../data/'+name+'.json',import.meta.url),root=new URL('../../data/'+name+'.json',import.meta.url);
 return JSON.parse(readFileSync(existsSync(local)?local:root,'utf8'));
};
const c=buildCatalogs({...Object.fromEntries(['itens','receitas','magias','monstros','cidades'].map(x=>[x,get(x)])),curadoria_ingredientes:get('curadoria_ingredientes')});
const p=(id='preparo-qa',effects=['restaurar_saude'])=>({id,family:'pocao',ingredients:['ing-blue-mountain-flower','ing-butterfly-wing'],effects:effects.map(x=>({id:x,nome:x})),createdDay:1});
const state=(preparations=[p()],hp=50,mp=30)=>({...newClassicState(),hp,mp,alchemy:{known:{},preparations,failed:0}});
const env=()=>stageFromClassic(state(),c);
const command=(id='preparo-qa',context='exploration')=>({type:'usePreparation',id,context});
class MemoryStorage{
 constructor(){this.values=new Map();this.fail=false}
 getItem(k){return this.values.get(k)??null}
 setItem(k,v){if(this.fail)throw Error('QuotaExceededError');this.values.set(k,String(v))}
}
test('Exploração reutiliza executor e restaura PV sem gastar ação diária',()=>{
 const before=env(),out=applyTransaction(before,command(),c);
 assert.equal(out.applied,true);
 assert.equal(out.next.character.hp,74);
 assert.equal(out.next.character.mp,30);
 assert.equal(out.next.character.actions,3);
 assert.equal(out.next.character.alchemy.preparations.length,0);
 assert.equal(before.character.alchemy.preparations.length,1);
 assert.equal(out.result.cost.dailyActions,0);
});
test('Restauração de magia altera somente MP e mantém teto',()=>{
 const e=stageFromClassic(state([p('preparo-m',['restaurar_magia'])],50,60),c);
 const x=applyTransaction(e,command('preparo-m'),c);
 assert.equal(x.next.character.mp,Math.min(60+12,maxClassicMp(e.character)));
 assert.equal(x.next.character.hp,50);
});
test('Dois efeitos restauradores são aplicados no mesmo frasco, com gasto único',()=>{
 const e=stageFromClassic(state([p('preparo-d',['restaurar_saude','restaurar_magia'])]),c);
 const x=applyTransaction(e,command('preparo-d'),c);
 assert.equal(x.next.character.hp,74);
 assert.equal(x.next.character.mp,42);
 assert.equal(x.next.character.alchemy.preparations.length,0);
 assert.equal(x.result.quantityConsumed,1);
});
test('Com recursos no máximo, não consome uma preparação inútil',()=>{
 const base=state([p()]);base.hp=maxClassicHp(base,c);base.mp=maxClassicMp(base);
 const e=stageFromClassic(base,c),snapshot=JSON.stringify(e);
 assert.throws(()=>applyTransaction(e,command(),c),/máximo/);
 assert.equal(JSON.stringify(e),snapshot);
});
test('Uma mistura com propriedade sem execução bloqueia todos os efeitos',()=>{
 const e=stageFromClassic(state([p('preparo-x',['restaurar_saude','dano_magia'])]),c);
 assert.throws(()=>applyTransaction(e,command('preparo-x'),c),/indisponível/);
 assert.equal(e.character.hp,50);
 assert.equal(e.character.alchemy.preparations.length,1);
});
test('Veneno e Tônico não podem ser bebidos no fluxo de Poções',()=>{
 for(const family of ['veneno','tonico','elixir','balsamo']){
  const prep={...p(),family};
  const e=stageFromClassic(state([prep]),c);
  assert.throws(()=>applyTransaction(e,command(),c),/indisponível/,family);
 }
});
test('Uso repetido da mesma instância é idempotente mesmo com outro contexto',()=>{
 const first=applyTransaction(env(),command(),c);
 const duplicate=applyTransaction(first.next,command('preparo-qa','combat'),c);
 assert.equal(duplicate.applied,false);
 assert.strictEqual(duplicate.next,first.next);
 assert.equal(first.next.ledger['prepared-use:preparo-qa'].quantityConsumed,1);
});
test('Sem frasco, não reduz recursos nem move estado',()=>{
 const e=stageFromClassic(state([]),c),before=JSON.stringify(e);
 assert.throws(()=>applyTransaction(e,command(),c),/indisponível/);
 assert.equal(JSON.stringify(e),before);
});
test('Contexto estranho não habilita o uso',()=>{
 assert.throws(()=>applyTransaction(env(),command('preparo-qa','rest'),c),/contexto/);
});
test('IDs de preparados não permitem injection nem chave especial',()=>{
 assert.throws(()=>applyTransaction(env(),command('..:hack'),c),/Identidade/);
 assert.throws(()=>applyTransaction(env(),command('preparo-qa/../bad'),c),/Identidade/);
});
test('PV zero não permite revivificação silenciosa e não gasta o frasco',()=>{
 const e=stageFromClassic(state([p()],0,30),c);
 assert.throws(()=>applyTransaction(e,command(),c),/indisponível/);
 assert.equal(e.character.alchemy.preparations.length,1);
});
test('Recibo público e diário não revelam efeitos de frasco não identificado',()=>{
 const x=applyTransaction(env(),command(),c);
 assert.equal(JSON.stringify(x.result).includes('restaurar_saude'),false);
 assert.equal(x.next.character.journal[0].includes('restaurar_saude'),false);
});
test('Frasco permanece no combate se outro foi consumido na exploração',()=>{
 const e=stageFromClassic(state([p('preparo-1'),p('preparo-2')]),c);
 const used=applyTransaction(e,command('preparo-1'),c);
 const battleProfile=toCombatProfile(used.next,c);
 assert.deepEqual(battleProfile.preparations.map(x=>x.id),['preparo-2']);
});
test('Persistência no bridge: salvar, recarregar, não cobrar o mesmo frasco',()=>{
 const storage=new MemoryStorage(),bridge=createProgressBridge(storage,c);
 const payload=bridge.read();payload.character=state([p()],45,30);
 bridge.restore(JSON.stringify(payload));
 const before=bridge.read().revision,tx=bridge.execute(command());
 assert.equal(tx.applied,true);
 assert.equal(bridge.read().revision,before+1);
 const loaded=createProgressBridge(storage,c);
 assert.equal(loaded.state.hp,69);
 assert.equal(loaded.state.alchemy.preparations.length,0);
 assert.equal(loaded.execute(command()).applied,false);
 assert.ok(storage.getItem(PHASER_KEY));
});
test('Falha de armazenamento não debita frasco nem grava PV',()=>{
 const storage=new MemoryStorage(),bridge=createProgressBridge(storage,c);
 const payload=bridge.read();payload.character=state([p()],45,30);
 bridge.restore(JSON.stringify(payload));
 const before=bridge.export();storage.fail=true;
 assert.throws(()=>bridge.execute(command()),/QuotaExceededError/);
 assert.equal(bridge.export(),before);
});
test('Duas abas não devem sobrescrever consumo da mesma instância',()=>{
 const storage=new MemoryStorage(),a=createProgressBridge(storage,c);
 const payload=a.read();payload.character=state([p()],45,30);a.restore(JSON.stringify(payload));
 const b=createProgressBridge(storage,c);
 a.execute(command());
 assert.throws(()=>b.execute(command()),/outra aba/);
});
test('Inventário apresenta instâncias como consumíveis reais, não como itens de bag',()=>{
 const vm=inventoryViewModel(state([p('preparo-1'),p('preparo-2')]),c,{category:'consumable'});
 const rows=vm.filtered.filter(x=>x.isPreparation);
 assert.equal(rows.length,2);
 assert.deepEqual(rows.map(x=>x.id).sort(),['preparo-1','preparo-2']);
 assert.ok(rows.every(x=>x.amount===1 && x.value===null));
 assert.equal(JSON.stringify(rows).includes('restaurar_saude'),false);
});
test('Busca pelo nome encontra preparados sem revelar conteúdo oculto',()=>{
 const vm=inventoryViewModel(state([p('preparo-1')]),c,{query:'preparo'});
 assert.equal(vm.filtered.some(x=>x.id==='preparo-1'),true);
 assert.equal(JSON.stringify(vm.filtered).includes('restaurar_saude'),false);
});
test('Percurso integral: ingredientes, bancada, exploração e combate compartilham saldo',()=>{
 let e=stageFromClassic({...newClassicState(),hp:50,mp:30},c);
 const craft=applyTransaction(e,{type:'brewPair',ingredients:['ing-blue-mountain-flower','ing-butterfly-wing']},c);
 assert.equal(craft.result.valid,true);
 const bottle=craft.result.preparation;
 assert.deepEqual(bottle.effects.map(x=>x.id),['restaurar_saude']);
 const consumed=applyTransaction(craft.next,command(bottle.id),c);
 assert.equal(consumed.next.character.hp,74);
 assert.equal(consumed.next.character.alchemy.preparations.length,0);
 assert.equal(toCombatProfile(consumed.next,c).preparations.length,0);
});
