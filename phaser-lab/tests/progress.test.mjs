import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildForest} from '../src/world.js';
import {buildCatalogs,newClassicState,normalizeClassic,toCombatProfile,skillLevel,
  applyTransaction,stageFromClassic,createProgressBridge,CLASSIC_KEY,PHASER_KEY,
  craftable,purchasePrice,salePrice} from '../src/progress.js';
const data={};for(const key of ['itens','receitas','magias','monstros','cidades'])data[key]=JSON.parse(readFileSync(new URL('../data/'+key+'.json',import.meta.url)));
const c=buildCatalogs(data);
class MemoryStorage{constructor(){this.map=new Map();this.fail=false}getItem(k){return this.map.get(k)??null}setItem(k,v){if(this.fail)throw Error('QuotaExceededError');this.map.set(k,String(v))}}
const classic=newClassicState();
const victory=(key='seed::galho')=>({key,enemyId:'mob-galho-infectado',status:'won',playerHp:78,playerMp:61,potions:2});
const round=(typ,x)=>applyTransaction(x,{type:typ,battle:victory()},c);

test('catalog preserves 2785 items and 2316 recipes; real default classic profile',()=>{
 assert.equal(c.itens.length,2785);assert.equal(c.receitas.length,2316);
 assert.equal(c.magias.length,354);assert.equal(c.monstros.length,222);
 const s=normalizeClassic(classic,c);assert.equal(s.gold,180);assert.equal(s.bag['ger-pocao-restauradora'],3);
 assert.equal(skillLevel(20),9); // raw XP is not the displayed skill level!
 assert.ok(toCombatProfile(stageFromClassic(s,c),c).attack>=20);
});
test('pré-alfa nunca importa save clássico mesmo quando existe; preserva dados anteriores',()=>{
 const storage=new MemoryStorage(),original={...classic,level:7,gold:751,city:'portomonte',actions:1,exp:101,bag:{...classic.bag,'ing-hanging-moss':4},completed:['quest-alpha'],flags:{example:true}};
 storage.setItem(CLASSIC_KEY,JSON.stringify(original));const before=storage.getItem(CLASSIC_KEY);
 const bridge=createProgressBridge(storage,c);
 assert.equal(bridge.state.level,1);assert.equal(bridge.state.gold,180);
 assert.equal(bridge.state.bag['ing-hanging-moss'],undefined);
 assert.notEqual(bridge.source,'classic-import');
 bridge.execute({type:'buy',id:'mat-agua-purificada'});
 assert.equal(storage.getItem(CLASSIC_KEY),before);
 assert.equal(JSON.parse(storage.getItem(PHASER_KEY)).character.gold,bridge.state.gold);
});
test('no classic file creates a valid fresh state, no classic save created',()=>{
 const storage=new MemoryStorage(),bridge=createProgressBridge(storage,c);
 assert.equal(bridge.state.level,1);bridge.execute({type:'endDay'});
 assert.equal(storage.getItem(CLASSIC_KEY),null);assert.equal(bridge.state.day,2);
});
test('collection transactions are keyed per map seed and node; idempotent after reload',()=>{
 const world=buildForest('bridge-murin-43'),node=world.nodes[0],store=new MemoryStorage(),b=createProgressBridge(store,c);
 const before=b.state.bag[node.itemId]||0;
 const a=b.execute({type:'collect',seed:world.seed,nodeId:node.id,world});assert.equal(a.applied,true);
 assert.equal(b.state.bag[node.itemId],before+node.count);
 assert.equal(b.execute({type:'collect',seed:world.seed,nodeId:node.id,world}).applied,false);
 const loaded=createProgressBridge(store,c);assert.deepEqual(loaded.collectedIds(world.seed),[node.id]);
 assert.equal(loaded.state.bag[node.itemId],before+node.count);
 assert.equal(loaded.execute({type:'collect',seed:world.seed,nodeId:node.id,world}).applied,false);
 assert.equal(loaded.state.bag[node.itemId],before+node.count);
});
test('98 generated maps have stable unique collectible IDs',()=>{
 for(let i=0;i<98;i++){const w=buildForest('seed-m1d-'+i);const unique=new Set(w.nodes.map(n=>n.id));assert.equal(unique.size,w.nodes.length);
  assert.ok(w.nodes.every(n=>c.itensById[n.itemId]));}
});
test('real victory pays classic save exactly once and consumes potions',()=>{
 const store=new MemoryStorage(),bridge=createProgressBridge(store,c);const a=bridge.finishBattle(victory());
 assert.equal(a.applied,true);assert.equal(bridge.state.kills,1);assert.equal(bridge.state.exp,13);
 assert.equal(bridge.state.gold,188);assert.equal(bridge.state.bag['ing-hanging-moss'],1);
 assert.equal(bridge.state.bag['ger-pocao-restauradora'],2);
 const reread=createProgressBridge(store,c);const again=reread.finishBattle(victory());assert.equal(again.applied,false);
 assert.equal(reread.state.kills,1);assert.equal(reread.state.gold,188);
 assert.equal(reread.state.exp,13);assert.equal(reread.state.bag['ing-hanging-moss'],1);
});
test('level threshold matches classic XP formula, avoiding level-up loops',()=>{
 const b=stageFromClassic({...classic,exp:61},c);
 const a=applyTransaction(b,{type:'victory',battle:victory()},c);
 assert.equal(a.next.character.level,2);assert.equal(a.next.character.exp,12);
 assert.equal(a.next.character.skills.combate,classic.skills.combate+7);
 assert.ok(a.next.character.hp>=78);
});
test('escape and defeat consume resources but give no loot or XP',()=>{
 const e=stageFromClassic(classic,c);
 const s=applyTransaction(e,{type:'escape',battle:{status:'fled',playerHp:42,playerMp:10,potions:1}},c);
 assert.equal(s.next.character.hp,42);assert.equal(s.next.character.bag['ger-pocao-restauradora'],1);
 assert.equal(s.next.character.gold,180);assert.equal(s.next.character.exp,0);
 const defeat=applyTransaction(e,{type:'escape',battle:{status:'lost',playerHp:0,playerMp:0,potions:0}},c);
 assert.ok(defeat.next.character.hp>=24);assert.equal(defeat.next.character.gold,180);
});
test('crafting uses real recipe requirements and cost of daily action',()=>{
 const store=new MemoryStorage(),b=createProgressBridge(store,c);const r=c.receitasById['rec-pocao-restauradora'];
 assert.equal(craftable(b.state,r,c),true);
 const a=b.execute({type:'craft',id:r.id});assert.equal(a.applied,true);
 assert.equal(b.state.bag['ger-pocao-restauradora'],4);
 assert.equal(b.state.bag['ing-blue-mountain-flower'],1);
 assert.equal(b.state.bag['mat-agua-purificada'],3);assert.equal(b.state.actions,2);
 assert.equal(b.state.crafted,1);
 b.execute({type:'craft',id:r.id});assert.equal(b.state.actions,1);
 assert.throws(()=>b.execute({type:'craft',id:r.id}),/Faltam materiais/);
});
test('buy/sell use classic commerce pricing and preserve other inventory',()=>{
 const b=createProgressBridge(new MemoryStorage(),c);
 const i=c.itensById['mat-agua-purificada'];const city=c.cidadesById.portomonte;
 const price=purchasePrice(b.state,i,city),sale=salePrice(b.state,i,city);
 const start=b.state.gold,qty=b.state.bag[i.id];
 b.execute({type:'buy',id:i.id});assert.equal(b.state.gold,start-price);assert.equal(b.state.bag[i.id],qty+1);
 b.execute({type:'sell',id:i.id});assert.equal(b.state.bag[i.id],qty);
 assert.ok(sale<=price*3);
 assert.throws(()=>b.execute({type:'sell',id:'eq-adaga-de-ferrugem'}),/equipado/);
});
test('failed storage write is atomic and does not mutate running state',()=>{
 const store=new MemoryStorage(),b=createProgressBridge(store,c),before=JSON.stringify(b.read());store.fail=true;
 assert.throws(()=>b.execute({type:'buy',id:'mat-agua-purificada'}),/QuotaExceededError/);
 assert.equal(JSON.stringify(b.read()),before);assert.equal(store.getItem(PHASER_KEY),null);
});
test('two tabs with divergent revisions cannot clobber each other',()=>{
 const store=new MemoryStorage(),a=createProgressBridge(store,c),b=createProgressBridge(store,c);
 a.execute({type:'endDay'});assert.throws(()=>b.execute({type:'endDay'}),/outra aba/);
 assert.equal(createProgressBridge(store,c).state.day,2);
});
test('recovery exports/imports v2 with full ledger',()=>{
 const storage=new MemoryStorage(),b=createProgressBridge(storage,c),w=buildForest('reload');
 b.execute({type:'collect',world:w,seed:w.seed,nodeId:w.nodes[0].id});b.finishBattle(victory());
 const text=b.export(),other=new MemoryStorage(),next=createProgressBridge(other,c);
 next.restore(text);assert.equal(next.state.gold,b.state.gold);
 assert.equal(next.collectedIds(w.seed).length,1);
 assert.equal(next.finishBattle(victory()).applied,false);
 assert.equal(other.getItem(CLASSIC_KEY),null);
});
test('bad backup fails validation without replacing active save',()=>{
 const b=createProgressBridge(new MemoryStorage(),c),before=b.export();
 assert.throws(()=>b.restore(JSON.stringify({schema:2,character:{version:9}})));
 assert.equal(b.export(),before);
 assert.throws(()=>normalizeClassic({...classic,version:2},c),/incompatível/);
});
test('new map seed persists and recovered resource ledger remains per map',()=>{
 const storage=new MemoryStorage(),b=createProgressBridge(storage,c);
 b.execute({type:'selectSeed',seed:'murin-nova-188'});
 assert.equal(createProgressBridge(storage,c).read().worlds.activeSeed,'murin-nova-188');
 assert.throws(()=>b.execute({type:'selectSeed',seed:'../../file'}),/Seed inválida/);
});
