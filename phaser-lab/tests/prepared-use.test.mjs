import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectBattlePreparation,applyBattlePreparation,reconcileBattlePreparations,PREALPHA_RESTORATION} from '../src/prepared-use.js';
import {newBattle,stepBattle,defaultProfile,settleBattle,settleEscape} from '../src/combat.js';
const prep=(id,effects=['restaurar_saude'])=>({id,family:'pocao',ingredients:['ing-a','ing-b'],effects:effects.map(id=>({id,nome:id}))});
const profile=()=>({...defaultProfile(),hp:60,mp:30,preparations:[prep('preparo-a'),prep('preparo-b',['restaurar_magia']),prep('preparo-c',['aumentar_forca'])]});
const battle=()=>newBattle({type:'mob-ettercap',name:'Ettercap'},profile(),'qa::ettercap');
test('A pré-alfa explicita valores temporários e limita-se a restauração',()=>{
 assert.deepEqual(Object.keys(PREALPHA_RESTORATION).sort(),['restaurar_magia','restaurar_saude']);
 assert.equal(PREALPHA_RESTORATION.restaurar_saude.amount,24);
});
test('Batalha recebe as três instâncias distintas, sem tocar no perfil original',()=>{
 const p=profile(),b=newBattle({type:'mob-ettercap',name:'Ettercap'},p,'qa::ettercap');
 assert.deepEqual(b.preparations.map(x=>x.id),['preparo-a','preparo-b','preparo-c']);
 b.preparations.pop();assert.equal(p.preparations.length,3);
});
test('Preparo de vida cura e então recebe contra-ataque; consome uma vez',()=>{
 const b=battle(),x=stepBattle(b,'prepared:preparo-a',()=>.2);
 assert.equal(x.state.playerHp,79);assert.deepEqual(x.state.preparations.map(p=>p.id),['preparo-b','preparo-c']);
 assert.equal(b.preparations.length,3);assert.ok(x.events.some(e=>e.kind==='prepared'));
});
test('Preparo de Magia altera apenas MP antes da reação inimiga',()=>{
 const b=battle(),x=stepBattle(b,'prepared:preparo-b',()=>.2);
 assert.equal(x.state.playerMp,42);assert.equal(x.state.preparations.length,2);
});
test('Preparo desconhecido não usa, não consome turno nem aciona adversário',()=>{
 const b=battle(),x=stepBattle(b,'prepared:nao-existe',()=>.2);
 assert.strictEqual(x.state,b);assert.ok(x.error);
});
test('Propriedade não implementada bloqueia todo o frasco',()=>{
 const b=battle(),x=stepBattle(b,'prepared:preparo-c',()=>.2);
 assert.strictEqual(x.state,b);assert.match(x.error,/propriedades/);
});
test('Frasco de duas propriedades aplica PV e PM, depois recebe contra-ataque',()=>{
 const b=battle();b.preparations[0]=prep('preparo-a',['restaurar_saude','restaurar_magia']);
 const x=stepBattle(b,'prepared:preparo-a',()=>.2);
 assert.equal(x.state.playerHp,79);assert.equal(x.state.playerMp,42);
});
test('Frasco parcialmente incompatível com executor bloqueia ambos os efeitos',()=>{
 const b=battle();b.preparations[0]=prep('preparo-a',['restaurar_saude','dano_saude']);
 const x=stepBattle(b,'prepared:preparo-a',()=>.2);
 assert.strictEqual(x.state,b);assert.equal(x.state.playerHp,60);
});
test('Não é permitido beber Veneno como Poção',()=>{
 const b=battle();b.preparations[0].family='veneno';
 const x=stepBattle(b,'prepared:preparo-a',()=>.2);
 assert.strictEqual(x.state,b);assert.match(x.error,/via de uso/);
});
test('Não permite identidade de efeito repetida no mesmo frasco',()=>{
 const x=inspectBattlePreparation(prep('a',['restaurar_saude','restaurar_saude']));
 assert.equal(x.ok,false);
});
test('Recuperação respeita teto antes do contra-ataque do inimigo',()=>{
 const b=battle();b.playerHp=b.playerMaxHp-2;b.playerMp=b.playerMaxMp-1;
 b.preparations[0]=prep('preparo-a',['restaurar_saude','restaurar_magia']);
 const x=stepBattle(b,'prepared:preparo-a',()=>.2);
 assert.equal(x.state.playerHp,b.playerMaxHp-5);assert.equal(x.state.playerMp,b.playerMaxMp);
});
test('Zero PV não é revivido pelo módulo de preparados',()=>{
 const b=battle();b.playerHp=0;
 const x=stepBattle(b,'prepared:preparo-a');
 assert.strictEqual(x.state,b);assert.match(x.error,/Derrota/);
});
test('Consumível fixo da batalha conserva seu funcionamento no ensaio',()=>{
 const b=battle(),x=stepBattle(b,'potion',()=>.2);
 assert.equal(x.state.potions,b.potions-1);assert.equal(x.state.preparations.length,b.preparations.length);
});
test('Tentativa repetida do mesmo frasco não usa novamente sua identidade',()=>{
 const first=stepBattle(battle(),'prepared:preparo-a',()=>.1);
 const replay=stepBattle(first.state,'prepared:preparo-a',()=>.1);
 assert.strictEqual(replay.state,first.state);assert.ok(replay.error);
});
test('Conciliação de vitória remove somente IDs realmente usados',()=>{
 const p=profile(),b=battle(),used=stepBattle(b,'prepared:preparo-a',()=>.1).state;
 const won={...used,status:'won',playerHp:75,hp:0};
 const after=settleBattle(p,won);
 assert.equal(after.applied,true);
 assert.deepEqual(after.profile.preparations.map(x=>x.id),['preparo-b','preparo-c']);
 assert.equal(after.profile.bag['ing-spider-egg'],1);
});
test('Conciliação de fuga remove somente frasco usado e não concede saque',()=>{
 const p=profile(),used=stepBattle(battle(),'prepared:preparo-a',()=>.1).state;
 const fled={...used,status:'fled'};
 const after=settleEscape(p,fled);
 assert.deepEqual(after.preparations.map(x=>x.id),['preparo-b','preparo-c']);
 assert.equal(after.gold,p.gold);assert.equal(after.bag['ing-spider-egg'],undefined);
});
test('Conciliação de derrota também preserva saldo e restaura personagem',()=>{
 const p=profile(),used=stepBattle(battle(),'prepared:preparo-b',()=>.1).state;
 const lost={...used,status:'lost',playerHp:0};
 const after=settleEscape(p,lost);
 assert.deepEqual(after.preparations.map(x=>x.id),['preparo-a','preparo-c']);
 assert.ok(after.hp>0);
});
test('Frasco de identidade fictícia não é criado pela conciliação',()=>{
 assert.throws(()=>reconcileBattlePreparations(profile().preparations,[prep('inexistente')]),/divergente/);
});
test('Conciliação rejeita IDs duplicados para evitar duplicar itens',()=>{
 assert.throws(()=>reconcileBattlePreparations(profile().preparations,[prep('preparo-a'),prep('preparo-a')]),/divergente/);
});
test('Conciliação não altera propriedades de um frasco preservado',()=>{
 const arr=profile().preparations;
 const fake=[{...arr[0],effects:[{id:'invisibilidade',nome:'não aprovado'}]}];
 const result=reconcileBattlePreparations(arr,fake);
 assert.deepEqual(result[0].effects,arr[0].effects);
});
test('Fim de combate encerra ações de consumíveis mesmo se o frasco restar',()=>{
 const b={...battle(),status:'won'};
 const x=stepBattle(b,'prepared:preparo-a');
 assert.strictEqual(x.state,b);assert.ok(x.error);
});
