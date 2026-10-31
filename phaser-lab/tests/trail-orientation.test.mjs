import test from 'node:test';
import assert from 'node:assert/strict';
import {buildForest,TILE} from '../src/world.js';
import {trailOrientation} from '../src/trail-orientation.js';
const center=p=>({x:(p.x+.5)*TILE,y:(p.y+.5)*TILE});
test('M1h-F.10 reconhece marcos reais e retorno na mesma distancia do jogo',()=>{
 for(const seed of ['murin-001','rota-leste','murin-ponte']){
  const w=buildForest(seed),p=center(w.entry),bridge=center(w.bridge),exit=center(w.exit);
  assert.equal(trailOrientation(w,p.x,p.y).phase,'west');
  assert.equal(trailOrientation(w,bridge.x,bridge.y).phase,'bridge');
  assert.equal(trailOrientation(w,exit.x,exit.y).phase,'exit');
  assert.match(trailOrientation(w,exit.x,exit.y).hint,/PORTOMONTE/);
  assert.notEqual(trailOrientation(w,exit.x+40,exit.y)?.phase,'exit','40px e fora do limiar estrito');
 }
});
test('M1h-F.10 sinaliza trilha aproximada sem inventar rota ou mapa',()=>{
 const w=buildForest('fora-da-trilha');
 const path=center(w.bridge),north=path.y-8*TILE,south=path.y+8*TILE;
 const a=trailOrientation(w,path.x,north),b=trailOrientation(w,path.x,south);
 assert.equal(a.phase,'lost');assert.equal(b.phase,'lost');
 assert.match(a.hint,/ao sul/);assert.match(b.hint,/ao norte/);
 assert.match(a.hint,/aproximada/);
});
test('M1h-F.10 ignora tiles obstruidos, usa apenas mapa e nao muda saves',()=>{
 const w=buildForest('sem-saves'),before=JSON.stringify(w.ground);
 const result=trailOrientation(w,300,150);
 assert.ok(result&&result.label&&result.hint);
 assert.equal(JSON.stringify(w.ground),before);
 assert.equal(trailOrientation(null,3,8),null);
 assert.equal(trailOrientation(w,Infinity,0),null);
});
