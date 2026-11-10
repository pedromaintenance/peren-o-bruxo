import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REGIONS,REGION_BY_ID,regionFromSeed,expeditionSeed,buildExpedition,spawnRegionalCreatures} from '../src/regions.js';
import {validExit,reachableCells} from '../src/world.js';
import {BATTLE_MONSTERS} from '../src/combat.js';
import {buildCatalogs,newClassicState,stageFromClassic,applyTransaction,createProgressBridge,PHASER_KEY,CLASSIC_KEY} from '../src/progress.js';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const cats=buildCatalogs(Object.fromEntries(['itens','receitas','magias','monstros','cidades','curadoria_ingredientes'].map(id=>[id,read('../../data/'+id+'.json')])));
const curated=cats.curadoria_ingredientes.itens;
const locationSet=new Set();
test('o atlas possui 10 regiões, biomas diferentes e cidades canônicas',()=>{
 assert.equal(REGIONS.length,10);
 assert.equal(new Set(REGIONS.map(r=>r.id)).size,10);
 assert.ok(new Set(REGIONS.map(r=>r.kind)).size>=8);
 for(const region of REGIONS){
  assert.ok(cats.cidadesById[region.city],region.id+': cidade ausente');
  assert.equal(regionFromSeed(expeditionSeed(region.id,'a01')).id,region.id);
  assert.ok(region.resources.length>=4);
  for(const item of region.resources){
   assert.ok(cats.itensById[item.id],item.id+': item inexistente');
   assert.ok(curated[item.id],item.id+': curadoria inexistente');
  }
 }
});
for(const region of REGIONS){
 test('procedural '+region.id+' é determinístico, coletável e com saída real',()=>{
  for(let index=0;index<15;index++){
   const seed=expeditionSeed(region.id,'teste-'+index);
   const a=buildExpedition(seed),b=buildExpedition(seed);
   assert.equal(a.seed,seed);assert.equal(a.regionId,region.id);
   assert.equal(a.width,48);assert.equal(a.height,36);
   assert.deepEqual(a.ground,b.ground);assert.deepEqual(a.nodes,b.nodes);assert.deepEqual(a.obstacles,b.obstacles);
   assert.ok(validExit(a),'Saída bloqueada: '+seed);
   assert.ok(a.nodes.length>=12,'Poucos ingredientes em '+seed);
   const reachable=reachableCells(a);
   for(const n of a.nodes){
    assert.ok(reachable.has(n.x+','+n.y),'Ingrediente inacessível '+seed+': '+n.id);
    assert.ok(region.resources.some(i=>i.id===n.itemId)||region.id==='murin');
    assert.ok(n.count>=1&&n.count<=3);
    assert.ok(!a.blocked.has(n.x+','+n.y));
    locationSet.add(n.itemId);
   }
   const foes=spawnRegionalCreatures(a);
   assert.ok(foes.length>=3,'Faltam criaturas em '+seed);
   assert.deepEqual(foes,spawnRegionalCreatures(a));
   for(const beast of foes){
    assert.ok(BATTLE_MONSTERS[beast.type],'Inimigo sem engine');
    assert.ok(reachable.has(beast.spawn.x+','+beast.spawn.y));
   }
  }
 });
}
test('Pena de Gaivota aparece só na Costa Sul, nunca fora do bioma',()=>{
 for(const region of REGIONS){
  const all=Array.from({length:16},(_,i)=>buildExpedition(expeditionSeed(region.id,'exclusivo-'+i)));
  const present=all.some(w=>w.nodes.some(n=>n.itemId==='ing-felsaad-tern-feathers'));
  assert.equal(present,region.id==='costa-sul',region.id);
 }
});
test('viajar entre cidades integra mercado, ofício e save sem custo inventado',()=>{
 const initial=stageFromClassic(newClassicState(),cats);
 let state=initial;
 for(const id of ['costa-sul','thargrid','ironwood','garganta','drakport','caatinga','eldroth','vandar','boca-abismo']){
  const region=REGION_BY_ID[id],seed=expeditionSeed(id,'save-001');
  const tx=applyTransaction(state,{type:'selectRegion',regionId:id,seed},cats);
  assert.equal(tx.applied,true);state=tx.next;
  assert.equal(state.character.city,region.city);
  assert.equal(state.worlds.activeSeed,seed);
  assert.ok(state.character.day>=1);assert.equal(state.character.actions,3);assert.equal(state.character.gold,180);
  assert.equal(tx.result.cost.dailyActions,0);
 }
 assert.throws(()=>applyTransaction(state,{type:'selectRegion',regionId:'inexistente',seed:'inexistente-001'},cats),/não cadastrada/);
 assert.throws(()=>applyTransaction(state,{type:'selectRegion',regionId:'murin',seed:'thargrid-001'},cats),/incompatível/);
 const storage=new Map();
 const adapter={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 const bridge=createProgressBridge(adapter,cats);
 bridge.execute({type:'selectRegion',regionId:'ironwood',seed:'ironwood-salvo'});
 assert.equal(createProgressBridge(adapter,cats).state.city,'ironwood');
 assert.equal(createProgressBridge(adapter,cats).read().worlds.activeSeed,'ironwood-salvo');
 assert.equal(storage.has(CLASSIC_KEY),false);assert.equal(storage.has(PHASER_KEY),true);
});
