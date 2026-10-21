import assert from 'node:assert/strict';
import test from 'node:test';
import {buildForest,reachableCells,TILE} from '../src/world.js';
import {spawnMurinCreatures,MURIN_BEASTS,monsterDecision,canDetect,hasSight,canHearFootsteps,RUN_HEARING_RADIUS_TILES,environmentAt,safeRetreat,worldWeather} from '../src/encounters.js';
import {RETREAT_GRACE_MS,tickRetreatGrace,retreatGraceActive,retreatGraceReadout} from '../src/retreat-grace.js';
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
test('recuo evita outras criaturas próximas',()=>{
 const w=buildForest('many-beasts'),beasts=spawnMurinCreatures(w);
 const safe=safeRetreat(w,{x:beasts[0].x,y:beasts[0].y},beasts[0],beasts.slice(1));
 assert.equal(environmentAt(w,safe.x,safe.y).walkable,true);
 for(const b of beasts)assert.ok(Math.hypot(safe.x-b.x,safe.y-b.y)>=TILE*5);
});

test('M1h-F.18: recuo protege tres segundos sem mutar regras puras de percepcao',()=>{
 const world=buildForest('f18-safety'),beast=spawnMurinCreatures(world)[0];
 const player={x:beast.x+5,y:beast.y};
 const original=JSON.stringify(beast);
 assert.equal(RETREAT_GRACE_MS,3000);
 assert.equal(monsterDecision(world,beast,player,16).encounter,true);
 assert.equal(retreatGraceActive(RETREAT_GRACE_MS),true);
 assert.equal(tickRetreatGrace(3000,1000),2000);
 assert.equal(retreatGraceReadout(1000).seconds,1);
 assert.equal(tickRetreatGrace(1000,1001),0);
 assert.equal(retreatGraceReadout(0),null);
 assert.equal(retreatGraceActive(-1),false);
 assert.equal(tickRetreatGrace(100,Number.NaN),100);
 assert.equal(JSON.stringify(beast),original);
 assert.equal(monsterDecision(world,beast,player,16).encounter,true,'AI default unchanged');
});

test('F.19: passos silenciosos alteram detecção somente se ativos e não se houver corrida',()=>{
 const w={ground:Array.from({length:36},()=>Array(48).fill(0)),blocked:new Set()};
 const beast={x:320,y:320,sight:5};
 const player={x:320+132,y:320};
 assert.equal(canDetect(w,beast,player),true);
 assert.equal(canDetect(w,beast,player,{sneak:true}),false);
 assert.equal(canDetect(w,beast,player,{sneak:true,sprint:true}),true);
 assert.equal(canDetect(w,beast,{x:321,y:320},{sneak:true}),true,'encostado continua detectável');
 assert.equal(monsterDecision(w,{...beast,spawn:{x:10,y:10},state:'patrulha',cooldown:0},player,16,{sneak:true}).detected,false);
});

test('F.20: corrida real atrai um monstro sem linha de visão, mas nunca inicia combate só pelo som',()=>{
 const world={ground:Array.from({length:36},()=>Array(48).fill(0)),blocked:new Set(['12,10'])};
 const beast={x:10.5*TILE,y:10.5*TILE,sight:5,spawn:{x:10,y:10},
   cooldown:0,state:'patrulha',patrolIndex:0,target:null,lastSeen:null};
 const player={x:13.5*TILE,y:10.5*TILE};
 assert.equal(RUN_HEARING_RADIUS_TILES,3.25);
 assert.equal(hasSight(world,beast,player),false);
 assert.equal(canDetect(world,beast,player,{sprint:true}),false);
 assert.equal(canHearFootsteps(beast,player,{running:true}),true);
 assert.equal(canHearFootsteps(beast,player),false);
 const heard=monsterDecision(world,beast,player,16,{sprint:true,noise:true});
 assert.equal(heard.detected,false);
 assert.equal(heard.heard,true);
 assert.equal(heard.encounter,false);
 assert.equal(heard.next.state,'investigacao');
 assert.deepEqual(heard.next.target,player);
 assert.equal(beast.state,'patrulha','a pure decision must not mutate the beast');
 const quiet=monsterDecision(world,beast,player,16,{sprint:true,noise:false});
 assert.equal(quiet.heard,false,'stationary sprint must not make noise');
 assert.equal(quiet.next.state,'patrulha');
 assert.equal(canHearFootsteps(beast,{x:beast.x+TILE*4,y:beast.y},{running:true}),false);
});
test('F.20: investigação pelo som persiste até destino; visão e cooldown continuam prioritários',()=>{
 const world={ground:Array.from({length:36},()=>Array(48).fill(0)),blocked:new Set(['12,10'])};
 const start={x:10.5*TILE,y:10.5*TILE,sight:5,spawn:{x:10,y:10},state:'patrulha',cooldown:0,patrolIndex:0,target:null,lastSeen:null};
 const point={x:13.5*TILE,y:10.5*TILE};
 const hearing=monsterDecision(world,start,point,16,{sprint:true,noise:true});
 const following=monsterDecision(world,hearing.next,{x:30*TILE,y:30*TILE},16);
 assert.equal(following.next.state,'investigacao');
 const reached=monsterDecision(world,{...following.next,x:point.x,y:point.y},{x:30*TILE,y:30*TILE},16);
 assert.equal(reached.next.state,'patrulha');
 const visible=monsterDecision(world,start,{x:start.x+8,y:start.y},16,{sprint:true,noise:true});
 assert.equal(visible.next.state,'perseguicao');assert.equal(visible.heard,false);assert.equal(visible.encounter,true);
 const cooldown=monsterDecision(world,{...start,cooldown:9000},point,16,{sprint:true,noise:true});
 assert.equal(cooldown.heard,false);assert.equal(cooldown.next.state,'retirada');assert.equal(cooldown.encounter,false);
});
