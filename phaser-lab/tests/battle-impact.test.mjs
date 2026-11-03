import test from 'node:test';
import assert from 'node:assert/strict';
import {battleImpact} from '../src/battle-impact.js';
const s=(o={})=>({key:'murin-a',enemyHp:24,enemyMaxHp:24,hp:114,maxHp:114,status:'active',...o});
test('M1h-F.12 shows actual damage only when resolved HP decreases',()=>{
 const result=battleImpact(s(),s({enemyHp:17,hp:105}));
 assert.deepEqual(result,{enemy:{kind:'damage',amount:7},hero:{kind:'damage',amount:9}});
 assert.equal(battleImpact(s(),s()),null);
});
test('M1h-F.12 distinguishes healing from damage and clamps to max',()=>{
 assert.deepEqual(battleImpact(s({hp:40}),s({hp:70})),
  {enemy:null,hero:{kind:'heal',amount:30}});
 assert.deepEqual(battleImpact(s({enemyHp:19}),s({enemyHp:30})),
  {enemy:{kind:'heal',amount:5},hero:null});
});
test('M1h-F.12 never attributes damage across encounters or broken snapshots',()=>{
 assert.equal(battleImpact(s(),s({key:'murin-b',hp:4})),null);
 assert.equal(battleImpact(null,s()),null);
 assert.equal(battleImpact(s(),s({enemyHp:NaN,hp:114})),null);
 assert.equal(battleImpact(s(),s({maxHp:0,hp:0,enemyHp:24})),null);
 const old=s(),next=s({enemyHp:20});const before=JSON.stringify({old,next});
 battleImpact(old,next);assert.equal(JSON.stringify({old,next}),before);
});
