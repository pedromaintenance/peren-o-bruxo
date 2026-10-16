import test from 'node:test';
import assert from 'node:assert/strict';
import {fieldAwareness} from '../src/field-awareness.js';

test('M1h-F.8: cover and fog show rules already used by enemy detection',()=>{
 const state=fieldAwareness({cover:true,weather:'neblina',wet:true});
 assert.equal(state.title,'SOB COBERTURA');
 assert.equal(state.state,'quiet');
 assert.match(state.detail,/Folhagem/);
 assert.match(state.detail,/Névoa/);
 assert.match(state.detail,/Solo úmido/);
});
test('M1h-F.8: sprint warns even in cover without claiming an automatic encounter',()=>{
 const state=fieldAwareness({sprint:true,cover:true,weather:'neblina'});
 assert.equal(state.title,'PASSOS RUIDOSOS');
 assert.match(state.detail,/Corrida aumenta/);
 assert.doesNotMatch(state.detail,/detectaram Peren/);
});
test('M1h-F.8: genuine detection supersedes sprint and cover',()=>{
 const one=fieldAwareness({detected:1,cover:true}),many=fieldAwareness({detected:3,sprint:true});
 assert.equal(one.state,'danger');assert.match(one.detail,/Uma criatura detectou/);
 assert.equal(many.state,'danger');assert.match(many.detail,/3 criaturas detectaram/);
});
test('M1h-F.8: investigation reflects last known position, not current sight',()=>{
 const state=fieldAwareness({investigating:2});
 assert.equal(state.state,'warning');
 assert.match(state.detail,/investiga o último paradeiro/);
 assert.doesNotMatch(state.detail,/detectou Peren/);
});
test('M1h-F.8: defaults are safe, no hidden state or new save field',()=>{
 assert.deepEqual(fieldAwareness(),{state:'neutral',title:'PASSOS CONTIDOS',detail:'Sem cobertura: mantenha distância das patrulhas'});
 assert.equal(fieldAwareness({detected:-1,investigating:-2}).state,'neutral');
});
