import Phaser from 'phaser';
import { ExplorationScene } from './exploration.js';
import {HERBS} from './world.js';

// M1a isolated sandbox. Does not read or overwrite Peren's classic save.
const $=id=>document.getElementById(id);
const app=new Phaser.Game({type:Phaser.AUTO,parent:'phaser',backgroundColor:'#101b1b',
  scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH,width:390,height:844},
  render:{pixelArt:true,antialias:false},physics:{default:'arcade',arcade:{debug:false}},
  scene:[ExplorationScene]});
window.__perenLab=app;
const seed=String(new URLSearchParams(location.search).get('seed')||'murin-001').slice(0,60);
app.registry.set('seed',seed);
let last='';
function updateHud(){
  const bag=app.registry.get('collected')||{};
  const total=Object.values(bag).reduce((a,b)=>a+b,0);
  const msg=app.registry.get('status')||'Busque recursos na Floresta de Mürin.';
  const signature=total+msg;
  if(last!==signature){last=signature;$('inventory-count').textContent=total;$('feedback').textContent=msg;
    $('collected').textContent=HERBS.filter(h=>bag[h.id]).map(h=>`${h.name}: ${bag[h.id]}`).join(' · ')||'Nenhum ingrediente coletado';}
  $('returnBtn').hidden=!app.registry.get('atExit');
}
app.events.on('step',updateHud);
// Touch joystick lives in DOM so camera zoom and map scrolling never crop it.
const pad=$('joystick'),knob=$('joystick-knob');
function joyScene(){return app.scene.getScene('ExplorationScene')}
function moveJoy(event){
  const scene=joyScene();if(!scene?.joy)return;
  const rect=pad.getBoundingClientRect();
  const dx=event.clientX-(rect.x+rect.width/2),dy=event.clientY-(rect.y+rect.height/2);
  const len=Math.max(1,Math.hypot(dx,dy)),scale=Math.min(1,len/42);
  scene.joy.x=dx/len*scale;scene.joy.y=dy/len*scale;
  scene.joy.active=true;
  knob.style.transform=`translate(${scene.joy.x*36}px,${scene.joy.y*36}px)`;
}
function releaseJoy(event){
  const scene=joyScene();if(scene?.joy){scene.joy.x=0;scene.joy.y=0;scene.joy.active=false;}
  knob.style.transform='translate(0px,0px)';
  try{if(pad.hasPointerCapture(event.pointerId))pad.releasePointerCapture(event.pointerId)}catch{}
}
pad.addEventListener('pointerdown',event=>{event.preventDefault();pad.setPointerCapture(event.pointerId);moveJoy(event)});
pad.addEventListener('pointermove',event=>{if(pad.hasPointerCapture(event.pointerId)){event.preventDefault();moveJoy(event)}});
for(const name of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(name,releaseJoy);
$('gatherBtn').addEventListener('click',()=>app.scene.getScene('ExplorationScene')?.command('gather'));
$('sprintBtn').addEventListener('pointerdown',()=>app.scene.getScene('ExplorationScene')?.command('sprint'));
for(const evt of ['pointerup','pointercancel','pointerleave'])$('sprintBtn').addEventListener(evt,()=>app.scene.getScene('ExplorationScene')?.command('walk'));
function hub(show){$('hub').hidden=!show;$('controls').hidden=show;if(show){app.scene.pause('ExplorationScene');$('hubStatus').textContent='Os recursos coletados permanecem nesta sessão de teste. A economia clássica ainda não foi conectada.';}else app.scene.resume('ExplorationScene')}
$('returnBtn').addEventListener('click',()=>hub(true));
$('goForest').addEventListener('click',()=>hub(false));
$('resetForest').addEventListener('click',()=>{app.registry.set('seed',String(Date.now()));app.registry.set('atExit',false);app.scene.stop('ExplorationScene');app.scene.start('ExplorationScene');hub(false)});
// Standalone hub shown first. Real Peren HTML hub remains untouched in main.
$('hub').hidden=false;$('controls').hidden=true;
// Expedition pause is applied inside the scene after assets have loaded.
