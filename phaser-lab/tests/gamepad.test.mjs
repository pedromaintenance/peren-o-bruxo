import test from 'node:test';
import assert from 'node:assert/strict';
import {XboxPadTracker,readXboxPad,XBOX,GAMEPAD_DEADZONE} from '../src/gamepad.js';
const pad=()=>({id:'Xbox Wireless Controller',index:0,mapping:'standard',connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))});
function press(p,i){p.buttons[i]={pressed:true,value:1};}

test('desconectado não mantém movimento ou sprint',()=>{
 const tracker=new XboxPadTracker();const p=pad();p.axes[0]=1;tracker.poll([p]);assert.equal(tracker.poll([]).move.x,0);assert.equal(tracker.poll([]).connected,false);
});
test('zona morta impede drift e analógico progride suavemente',()=>{
 const p=pad();p.axes[0]=.12;p.axes[1]=.12;assert.deepEqual(readXboxPad([p]).move,{x:0,y:0});
 p.axes[0]=.6;p.axes[1]=0;const m=readXboxPad([p]).move;assert.ok(m.x>.45&&m.x<.55);assert.equal(m.y,0);
 p.axes[0]=1;p.axes[1]=1;const diag=readXboxPad([p]).move;assert.ok(Math.hypot(diag.x,diag.y)<=1.00001);
 assert.equal(GAMEPAD_DEADZONE,.20);
});
test('direcional funciona e respeita diagonais',()=>{
 const p=pad();p.axes[0]=.6;press(p,XBOX.LEFT);press(p,XBOX.UP);const s=readXboxPad([p]);assert.ok(s.move.x<0&&s.move.y<0);assert.ok(Math.hypot(s.move.x,s.move.y)<=1.000001);
});
test('RB / RT / L3 ativam corrida',()=>{
 for(const b of [XBOX.RB,XBOX.RT,XBOX.L3]){const p=pad();press(p,b);assert.equal(readXboxPad([p]).sprint,true);}
});
test('todos os botões do Xbox e bordas de acionamento',()=>{
 const tracker=new XboxPadTracker(),p=pad();const keys=['A','B','X','Y','VIEW','MENU'];
 for(const k of keys){press(p,XBOX[k]);const s=tracker.poll([p]);assert.equal(s.justPressed[k.toLowerCase()],true,k);assert.equal(tracker.poll([p]).justPressed[k.toLowerCase()],false,k);p.buttons[XBOX[k]].pressed=false;p.buttons[XBOX[k]].value=0;tracker.poll([p]);}
});
test('mudança ou desconexão do dispositivo limpa bordas e lida com API ausente',()=>{
 const tracker=new XboxPadTracker(),p=pad();press(p,XBOX.A);assert.equal(tracker.poll([p]).justPressed.a,true);
 assert.equal(tracker.poll([p]).justPressed.a,false);
 assert.equal(tracker.poll(()=>{throw Error('API bloqueada')}).connected,false);
 assert.equal(tracker.poll([p]).justPressed.a,true);
});
test('botões acessíveis por value e preferência por mapping standard',()=>{
 const p=pad();p.buttons[XBOX.A]={value:.9};const legacy={...pad(),id:'legacy',index:1,mapping:'',axes:[1,1]};assert.equal(readXboxPad([legacy,p]).id,p.id);assert.equal(readXboxPad([legacy,p]).buttons.a,true);
});
