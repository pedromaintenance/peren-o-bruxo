import test from 'node:test';
import assert from 'node:assert/strict';
import {harvestProximity} from '../src/harvest-proximity.js';
import {TILE,nearestResource,buildForest} from '../src/world.js';

test('M1h-F.9 usa estritamente a mesma distancia e o mesmo alvo de collect()',()=>{
 const w={nodes:[{id:'erva-1',x:8,y:5,name:'Erva de Mürin',count:2},{id:'erva-2',x:12,y:5,name:'Fungo',count:3}]};
 const x=(8.5)*TILE,y=(5.5)*TILE;
 assert.deepEqual(harvestProximity(w,x,y),{nodeId:'erva-1',name:'Erva de Mürin',count:2});
 assert.equal(nearestResource(w,x,y)?.id,harvestProximity(w,x,y)?.nodeId);
 assert.equal(harvestProximity(w,x+57,y),null,'Raio estrito: na borda nao coleta');
 assert.deepEqual(harvestProximity(w,x+56,y),{nodeId:'erva-1',name:'Erva de Mürin',count:2});
});
test('M1h-F.9 respeita colheita anterior e animacao em curso',()=>{
 const w={nodes:[{id:'a',x:1,y:2,name:'Flor',count:1}]};
 const x=1.5*TILE,y=2.5*TILE;
 assert.equal(harvestProximity(w,x,y,new Set(['a'])),null);
 assert.equal(harvestProximity(w,x,y,new Set(),true),null);
 assert.equal(harvestProximity(w,Number.NaN,y),null);
});
test('M1h-F.9 valida varias seeds reais e nao altera o mundo',()=>{
 for(const seed of ['murin-001','murin-teste-9','murin-bosque']){
  const w=buildForest(seed),node=w.nodes[0],original=JSON.stringify(w.nodes);
  const got=harvestProximity(w,(node.x+.5)*TILE,(node.y+.5)*TILE,new Set());
  assert.equal(got.nodeId,nearestResource(w,(node.x+.5)*TILE,(node.y+.5)*TILE)?.id);
  assert.equal(JSON.stringify(w.nodes),original);
 }
});
