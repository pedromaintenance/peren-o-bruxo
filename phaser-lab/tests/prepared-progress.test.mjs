import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {buildCatalogs,newClassicState,stageFromClassic,toCombatProfile,applyTransaction,createProgressBridge,PHASER_KEY} from '../src/progress.js';
import {newBattle,stepBattle} from '../src/combat.js';
const names=['itens','receitas','magias','monstros','cidades'];
const catalogs={};
for(const k of names){
 const p=new URL('../data/'+k+'.json',import.meta.url),up=new URL('../../data/'+k+'.json',import.meta.url);
 catalogs[k]=JSON.parse(readFileSync(existsSync(p)?p:up,'utf8'));
}
const curatedLocal=new URL('../data/curadoria_ingredientes.json',import.meta.url);
const curatedRoot=new URL('../../data/curadoria_ingredientes.json',import.meta.url);
catalogs.curadoria_ingredientes=JSON.parse(readFileSync(existsSync(curatedLocal)?curatedLocal:curatedRoot,'utf8'));
const c=buildCatalogs(catalogs);
const p=id=>({id,family:'pocao',ingredients:['ing-blue-mountain-flower','ing-red-mountain-flower'],effects:[{id:'restaurar_saude',nome:'Restaurar Saúde'}],createdDay:1});
const fresh=()=>stageFromClassic({...newClassicState(),hp:50,mp:30,alchemy:{known:{},preparations:[p('preparo-1'),p('preparo-2')],failed:0}},c);
const begin=(env,key='murin::prepared-1')=>newBattle({type:'mob-ettercap',name:'Ettercap'},toCombatProfile(env,c),key);
const use=(b,id='preparo-1')=>stepBattle(b,'prepared:'+id,()=>.1).state;
test('Combat profile receives actual prepared instances, separate from legacy bag',()=>{
 const env=fresh(),profile=toCombatProfile(env,c);
 assert.deepEqual(profile.preparations.map(x=>x.id),['preparo-1','preparo-2']);
 assert.equal(profile.potions,3);
 assert.equal(env.character.bag['preparo-1'],undefined);
});
test('Victory commits one spent dynamic flask, rewards loot once',()=>{
 const env=fresh(),battle=use(begin(env)),done={...battle,status:'won',hp:0};
 const first=applyTransaction(env,{type:'victory',battle:done},c);
 assert.equal(first.applied,true);
 assert.deepEqual(first.next.character.alchemy.preparations.map(x=>x.id),['preparo-2']);
 assert.equal(first.next.character.bag['ger-pocao-restauradora'],3);
 assert.equal(first.next.character.bag['ing-spider-egg'],1);
 const duplicate=applyTransaction(first.next,{type:'victory',battle:done},c);
 assert.equal(duplicate.applied,false);assert.strictEqual(duplicate.next,first.next);
});
test('Escape commits spent dynamic flask, no loot and no double-commit',()=>{
 const env=fresh(),battle=use(begin(env,'murin::escape-1'));
 const end={...battle,status:'fled'};
 const first=applyTransaction(env,{type:'escape',battle:end},c);
 assert.deepEqual(first.next.character.alchemy.preparations.map(x=>x.id),['preparo-2']);
 assert.equal(first.next.character.bag['ing-spider-egg'],undefined);
 assert.equal(first.next.character.hp,end.playerHp);
 assert.equal(applyTransaction(first.next,{type:'escape',battle:end},c).applied,false);
});
test('Defeat commits spent dynamic flask once and applies rescue rules',()=>{
 const env=fresh(),battle=use(begin(env,'murin::lost-1'));
 const end={...battle,status:'lost',playerHp:0};
 const first=applyTransaction(env,{type:'escape',battle:end},c);
 assert.equal(first.applied,true);assert.equal(first.next.character.alchemy.preparations.length,1);
 assert.ok(first.next.character.hp>0);
 assert.equal(applyTransaction(first.next,{type:'escape',battle:end},c).applied,false);
});
test('Replaying a different settlement with the same battle key is refused',()=>{
 const env=fresh(),battle=use(begin(env,'murin::cross-1'));
 const escaped=applyTransaction(env,{type:'escape',battle:{...battle,status:'fled'}},c);
 const fakeWon=applyTransaction(escaped.next,{type:'victory',battle:{...battle,status:'won',hp:0}},c);
 assert.equal(fakeWon.applied,false);
 assert.equal(fakeWon.next.character.bag['ing-spider-egg'],undefined);
});
test('Each battle consumes only the matching dynamic identity',()=>{
 const env=fresh(),end1={...use(begin(env,'murin::one')),status:'fled'};
 const after1=applyTransaction(env,{type:'escape',battle:end1},c).next;
 const end2={...use(begin(after1,'murin::two'),'preparo-2'),status:'fled'};
 const after2=applyTransaction(after1,{type:'escape',battle:end2},c).next;
 assert.equal(after2.character.alchemy.preparations.length,0);
 assert.equal(after2.character.bag['ger-pocao-restauradora'],3);
});
test('Unspent dynamically produced flasks remain across combat settlement',()=>{
 const env=fresh(),before=begin(env);
 const after=applyTransaction(env,{type:'victory',battle:{...before,status:'won',hp:0}},c);
 assert.deepEqual(after.next.character.alchemy.preparations.map(x=>x.id),['preparo-1','preparo-2']);
});
test('Do not accept a synthetic extra flask fabricated in the battle payload',()=>{
 const env=fresh(),b=begin(env);
 b.preparations.push(p('preparo-hack'));
 assert.throws(()=>applyTransaction(env,{type:'victory',battle:{...b,status:'won',hp:0}},c),/divergente/);
});
test('Do not accept a duplicate flask in battle payload',()=>{
 const env=fresh(),b=begin(env);
 b.preparations.push({...b.preparations[0]});
 assert.throws(()=>applyTransaction(env,{type:'escape',battle:{...b,status:'fled'}},c),/divergente/);
});
test('Legacy battle potion count remains authoritative at settlement',()=>{
 const env=fresh(),b=begin(env),potion=stepBattle(b,'potion',()=>.1).state;
 const after=applyTransaction(env,{type:'victory',battle:{...potion,status:'won',hp:0}},c);
 assert.equal(after.next.character.bag['ger-pocao-restauradora'],2);
 assert.equal(after.next.character.alchemy.preparations.length,2);
});
test('No partial save mutation after an invalid prepared settlement',()=>{
 const env=fresh(),before=JSON.stringify(env),b=begin(env);
 b.preparations=[p('fake')];
 assert.throws(()=>applyTransaction(env,{type:'victory',battle:{...b,status:'won',hp:0}},c),/divergente/);
 assert.equal(JSON.stringify(env),before);
});
class MemStorage{constructor(){this.map=new Map()}getItem(k){return this.map.get(k)||null}setItem(k,v){this.map.set(k,String(v))}}
test('Recorded battle settlement stays idempotent across bridge reload',()=>{
 const storage=new MemStorage(),bridge=createProgressBridge(storage,c);
 // The save is pre-alpha: inject fresh QA prepared instances using a valid restore envelope.
 const payload=bridge.read();payload.character.alchemy.preparations=[p('preparo-1'),p('preparo-2')];
 bridge.restore(JSON.stringify(payload));
 const env=bridge.read(),battle=use(begin(env,'murin::reload-1'));
 const end={...battle,status:'won',hp:0};
 bridge.finishBattle(end);
 const reloaded=createProgressBridge(storage,c);
 assert.deepEqual(reloaded.state.alchemy.preparations.map(x=>x.id),['preparo-2']);
 assert.equal(reloaded.finishBattle(end).applied,false);
 assert.equal(reloaded.state.bag['ing-spider-egg'],1);
});

test('Novo jogo da pré-alfa tem fontes reais para duas restaurações',()=>{
 const starter=newClassicState();
 for(const id of ['ing-blue-mountain-flower','ing-red-mountain-flower','ing-butterfly-wing','ing-white-cap'])
  assert.ok(starter.bag[id]>=2,id);
 const x=stageFromClassic(starter,c);
 assert.ok(x.character.bag['ing-butterfly-wing']>=2);
});
test('Percurso integral: ingredientes canônicos, bancada, frasco, batalha e inventário',()=>{
 const env=stageFromClassic(newClassicState(),c);
 const ingredients=['ing-blue-mountain-flower','ing-butterfly-wing'];
 const brew=applyTransaction(env,{type:'brewPair',ingredients},c);
 assert.equal(brew.applied,true);assert.equal(brew.result.valid,true);
 assert.deepEqual(brew.result.preparation.effects.map(e=>e.id),['restaurar_saude']);
 const prepId=brew.result.preparation.id;
 assert.equal(brew.next.character.alchemy.preparations.length,1);
 assert.equal(brew.next.character.actions,3);
 for(const id of ingredients)assert.equal(brew.next.character.bag[id],1);
 const b=newBattle({type:'mob-ettercap',name:'Ettercap'},toCombatProfile(brew.next,c),'murin::real-brew');
 const consumed=stepBattle(b,'prepared:'+prepId,()=>.1);
 assert.equal(consumed.error,undefined);
 assert.equal(consumed.state.preparations.length,0);
 assert.ok(consumed.state.playerHp>b.playerHp);
 const final=applyTransaction(brew.next,{type:'victory',battle:{...consumed.state,status:'won',hp:0}},c);
 assert.equal(final.applied,true);
 assert.equal(final.next.character.alchemy.preparations.length,0);
 assert.equal(final.next.character.bag['ger-pocao-restauradora'],3);
 assert.equal(final.next.character.bag['ing-spider-egg'],1);
 assert.equal(applyTransaction(final.next,{type:'victory',battle:{...consumed.state,status:'won',hp:0}},c).applied,false);
});
test('Percurso integral de PM: Flor Vermelha e Chapéu Branco',()=>{
 const env=stageFromClassic(newClassicState(),c);
 const result=applyTransaction(env,{type:'brewPair',ingredients:['ing-red-mountain-flower','ing-white-cap']},c);
 assert.equal(result.result.valid,true);
 assert.deepEqual(result.result.preparation.effects.map(e=>e.id),['restaurar_magia']);
 const b=newBattle({type:'mob-ettercap',name:'Ettercap'},toCombatProfile(result.next,c),'murin::real-mp');
 b.playerMp=4;
 const out=stepBattle(b,'prepared:'+result.result.preparation.id,()=>.1);
 assert.equal(out.error,undefined);
 assert.equal(out.state.playerMp,16);
 assert.equal(out.state.preparations.length,0);
});
