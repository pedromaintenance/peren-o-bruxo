import test from 'node:test';
import assert from 'node:assert/strict';
import {sneakActive,travelSpeed,SNEAK_SPEED,SNEAK_SIGHT_MODIFIER} from '../src/stealth.js';
test('F.19: toque/teclado/LT alternam discrição; corrida vence',()=>{
 assert.equal(SNEAK_SPEED,82);assert.ok(SNEAK_SIGHT_MODIFIER<0);
 for(const mode of ['touch','keyboard','gamepad']){
  assert.equal(sneakActive({[mode]:true}),true);
  assert.equal(sneakActive({[mode]:true,sprint:true}),false);
 }
 assert.equal(sneakActive({}),false);
});
test('F.19: furtividade reduz velocidade inclusive em terreno úmido',()=>{
 assert.equal(travelSpeed({}),135);
 assert.equal(travelSpeed({sneak:true}),82);
 assert.equal(travelSpeed({sneak:true,wet:true}),82*.78);
 assert.equal(travelSpeed({sprint:true,sneak:true}),205);
});
