import assert from 'node:assert/strict';
import test from 'node:test';
import {buildForest,reachableCells,TILE} from '../src/world.js';
import {spawnMurinCreatures,MURIN_BEASTS,monsterDecision,canDetect,hasSight,environmentAt,safeRetreat,worldWeather} from '../src/encounters.js';
for(let i=0;i<100;i++)test(`M1b seed ${i} gera seis criaturas distintas e acessíveis`,()=>{
 const w=buildForest(`m1b-${i}`),beasts=spawnMurinCreatures(w),again=spawnMurinCreatures(w);const reachable=reachableCells(w);
 assert.equal(beasts.length,6);
 assert.deepEqual(beasts,again);
 assert.equal(new Set(beasts.map(b=>b.instanceId)).size,6);
 assert.equal(new Set(beasts.map(b=>b.type)).size,3);
 for(const b of beasts){assert.ok(reachable.has(`${b.spawn.x},${b.spawn.y}`));assert.equal(w.blocked.has(`${b.spawn.x},${b.spawn.y}`),false);assert.ok(!w.nodes.some(n=>Math.hypot(n.x-b.spawn.x,n.y-b.spawn.y)<2));}
});
test('percepção, cobertura e névoa são calculadas por distância/obstrução',()=>{
 const w=buildForest('percepcao'),b=spawnMurinCreatures(w)[0], near={x:b.x+5,y:b.y+5};
 assert.ok(canDetect(w,b,near));assert.ok(hasSight(w,b,near));
 assert.equal(canDetect(w,b,{x:-9999,y:-9999}),false);
 assert.equal(canDetect(w,b,{x:b.x+800,y:b.y}),false);
 assert.ok(['neblina','sereno'].includes(worldWeather(w.seed)));
 assert.equal(environmentAt(w,b.x,b.y).walkable,true);
});
test('encontro só ocorre perto e cooldown impede loop de encontros',()=>{
 const w=buildForest('escape'),beast=spawnMurinCreatures(w)[2];const player={x:beast.x+8,y:beast.y};
 const first=monsterDecision(w,beast,player,16,{sprint:true});
 assert.equal(first.encounter,true);assert.equal(first.next.state,'perseguicao');
 const cooled={...beast,cooldown:8000};
 const second=monsterDecision(w,cooled,player,16);
 assert.equal(second.encounter,false);assert.equal(second.next.state,'retirada');
 assert.ok(second.next.cooldown>7900);
});
test('recuo cria posição navegável longe da criatura',()=>{
 const w=buildForest('escape-logic'),beast=spawnMurinCreatures(w)[1];
 const safe=safeRetreat(w,{x:beast.x,y:beast.y},beast);
 assert.equal(environmentAt(w,safe.x,safe.y).walkable,true);
 assert.ok(Math.hypot(safe.x-beast.x,safe.y-beast.y)>=TILE*5);
});
test('cada inimigo usa IDs existentes e comportamentos específicos',()=>{
 const ids=MURIN_BEASTS.map(x=>x.id);assert.deepEqual(ids,['mob-galho-infectado','mob-fungo-violeta','mob-ettercap']);
 assert.deepEqual(new Set(MURIN_BEASTS.map(x=>x.behavior)).size,3);
});