import assert from 'node:assert/strict';
import test from 'node:test';
import {buildForest,validExit,reachableCells,nearestResource,HERBS,WIDTH,HEIGHT,TILE} from '../src/world.js';
for(const seed of ['murin-001','murin-002','floresta-murin-209','12345','🌳 Mürin 🌳']) {
 test(`seed ${seed} é determinística e tem saída alcançável`,()=>{
   const a=buildForest(seed),b=buildForest(seed);
   assert.deepEqual(a.ground,b.ground);
   assert.deepEqual(a.obstacles,b.obstacles);
   assert.deepEqual(a.nodes,b.nodes);
   assert.equal(validExit(a),true,'saida sem acesso');
   assert.equal(a.width,WIDTH);assert.equal(a.height,HEIGHT);
   assert.ok(a.nodes.length>=20,'poucos recursos');
   const seen=reachableCells(a);
   for(const n of a.nodes){assert.ok(seen.has(`${n.x},${n.y}`));assert.ok(HERBS.some(h=>h.id===n.itemId));}
   assert.equal(a.blocked.has(`${a.entry.x},${a.entry.y}`),false);
   assert.equal(a.blocked.has(`${a.exit.x},${a.exit.y}`),false);
 });
}
test('coleta encontra o recurso próximo e respeita colhidos',()=>{
  const world=buildForest('near');const n=world.nodes[0];const p={x:(n.x+.5)*TILE,y:(n.y+.5)*TILE};
  assert.equal(nearestResource(world,p.x,p.y,new Set(),30)?.id,n.id);
  assert.notEqual(nearestResource(world,p.x,p.y,new Set([n.id]),20)?.id,n.id);
  assert.equal(nearestResource(world,-999,-999),null);
});
for(let i=0;i<80;i++)test(`seed aleatória determinística ${i} preserva saída`,()=>{const w=buildForest('regression-seed-'+i);assert.ok(validExit(w));assert.ok(w.nodes.length>=10)});