import assert from 'node:assert/strict';
import test from 'node:test';
import {newBattle,stepBattle,settleBattle,settleEscape,defaultProfile,encounterKey,BATTLE_MONSTERS,SPELLS,battleRng,animationKey,maxHp,maxMp} from '../src/combat.js';
import {readFileSync,existsSync} from 'node:fs';
const catalog=name=>{
 const local=new URL(`../data/${name}.json`,import.meta.url);
 const repository=new URL(`../../data/${name}.json`,import.meta.url);
 return JSON.parse(readFileSync(existsSync(local)?local:repository,'utf8'));
};
const monsters=catalog('monstros'),spells=catalog('magias'),items=catalog('itens');
const names={'mob-galho-infectado':'Galho Infectado','mob-fungo-violeta':'Fungo Violeta','mob-ettercap':'Ettercap'};
const beast=id=>({type:id,name:names[id]});
const battle=id=>newBattle(beast(id),defaultProfile(),encounterKey('murin-001','beast-0'));
test('stats de monstros e 3 magias reutilizam IDs e custos reais do catálogo',()=>{
 for(const [id,c] of Object.entries(BATTLE_MONSTERS)){
  const m=monsters.find(x=>x.id===id);assert.ok(m);
  assert.equal(c.hp,m.hp);assert.equal(c.attack,m.ataque);assert.equal(c.defense,m.defesa);assert.equal(c.xp,m.xp);assert.equal(c.gold,m.ouro);
  assert.ok(items.some(it=>it.id===c.drop&&it.categoria==='ingrediente'));
 }
 for(const s of SPELLS){const c=spells.find(x=>x.id===s.id);assert.ok(c);assert.equal(s.mana,c.mana);assert.equal(s.power,c.potencia);assert.equal(s.effect,c.tipo)}
});
test('batalha consome magia, aplica dano e gera contra-ataque',()=>{
 const b=battle('mob-ettercap');const r=stepBattle(b,'spell:mag-raio-de-fogo',()=>.4);
 assert.equal(r.state.playerMp,b.playerMp-3);assert.ok(r.state.hp<b.hp);assert.ok(r.state.playerHp<b.playerHp);assert.ok(r.events.some(e=>e.effect==='fire'));
 assert.equal(b.hp,51,'motor não deve mutar estado anterior');
});
test('gelo congela turno inimigo e defesa reduz dano',()=>{
 const b=battle('mob-ettercap');const ice=stepBattle(b,'spell:mag-raio-de-gelo',()=>.3);
 assert.equal(ice.state.playerHp,b.playerHp);assert.ok(ice.events.some(e=>e.kind==='frozen'));
 const def=stepBattle(b,'defend',()=>.3);
 const atk=stepBattle(b,'attack',()=>.3);
 assert.ok(def.state.playerHp>atk.state.playerHp);
 assert.equal(def.state.playerMp,b.playerMp,'mana respeita teto do personagem');
});
test('magia e poção inválidas não gastam turno; poção cura e reduz estoque',()=>{
 let b=battle('mob-ettercap');b.playerMp=0;
 let x=stepBattle(b,'spell:mag-raio-de-fogo',()=>.1);assert.equal(x.state,b);assert.ok(x.error);
 b.potions=0;x=stepBattle(b,'potion');assert.equal(x.state,b);assert.ok(x.error);
 b.potions=1;b.playerHp=35;x=stepBattle(b,'potion',()=>.1);assert.equal(x.state.potions,0);assert.ok(x.state.playerHp>35);
});
test('fuga e derrota não concedem XP, ouro ou loot',()=>{
 const p=defaultProfile();const b=battle('mob-galho-infectado');const f=stepBattle(b,'flee');assert.equal(f.state.status,'fled');
 assert.equal(settleBattle(p,f.state).applied,false);assert.deepEqual(settleEscape(p,f.state).bag,p.bag);
 const d={...b,status:'lost',playerHp:0};assert.equal(settleBattle(p,d).reward,null);assert.ok(settleEscape(p,d).hp>0);
});
test('vitória é idempotente e XP / drops / ouro são contabilizados uma vez',()=>{
 const p=defaultProfile();const b={...battle('mob-ettercap'),hp:0,status:'won',playerHp:77,playerMp:50,potions:2};
 const first=settleBattle(p,b);assert.equal(first.applied,true);assert.equal(first.profile.gold,38);assert.equal(first.profile.kills,1);
 assert.equal(first.profile.bag['ing-spider-egg'],1);assert.equal(first.profile.xp,49);
 const second=settleBattle(first.profile,b);assert.equal(second.applied,false);assert.strictEqual(second.profile,first.profile);
 const another={...b,key:encounterKey('murin-001','beast-2')};const third=settleBattle(second.profile,another);assert.equal(third.applied,true);assert.equal(third.profile.gold,76);
});
test('progressão de nível usa custo 62 × nível, sem while infinito',()=>{
 let p=defaultProfile();for(let i=0;i<60;i++){
  const b={...battle('mob-ettercap'),key:`fight:${i}`,status:'won',hp:0,playerHp:p.hp,playerMp:p.mp,potions:p.potions};
  p=settleBattle(p,b).profile;
 }
 assert.ok(p.level>1&&p.level<200);assert.ok(p.xp<p.level*62);assert.ok(p.hp<=maxHp(p.level));assert.ok(p.mp<=maxMp(p.level));
});
test('ações em combate encerrado não alteram o resultado',()=>{
 const b={...battle('mob-galho-infectado'),status:'won'};const x=stepBattle(b,'attack');assert.strictEqual(x.state,b);assert.ok(x.error);
});
test('escolhas desconhecidas rejeitadas sem custos e VFX por magia',()=>{
 const b=battle('mob-galho-infectado');assert.strictEqual(stepBattle(b,'spell:???').state,b);assert.strictEqual(stepBattle(b,'hack').state,b);
 assert.equal(animationKey('spell:mag-raio-de-fogo'),'fire');assert.equal(animationKey('spell:mag-raio-de-gelo'),'ice');assert.equal(animationKey('spell:mag-misseis-magicos'),'arcane');
});
for(let i=0;i<90;i++)test('luta determinística '+i+' conclui sem loops / duplicação',()=>{
 const id=Object.keys(BATTLE_MONSTERS)[i%3];let b=battle(id);const rng=battleRng('deterministic-'+i);
 let iterations=0;while(b.status==='active'&&iterations++<80){const action=i%4===0?'attack':SPELLS[(iterations+i)%3];
 const result=stepBattle(b,typeof action==='string'?action:'spell:'+action.id,rng);
 if(result.error){b=stepBattle(b,'attack',rng).state;}else b=result.state;
 }
 assert.ok(['won','lost'].includes(b.status));assert.ok(iterations<80);if(b.status==='won')assert.equal(settleBattle(defaultProfile(),b).applied,true);
});
