/** M1h-F.15: local Gamepad API inspector for Teste de Campo (never persists anything). */
import {readXboxPad} from './field-gamepad-adapter.js';
const $=id=>document.getElementById(id);
const keys=['a','b','x','y','up','down','left','right','menu','view'];
let signature='',lastActive='';
const present=value=>Math.round(value*100)+'%';
function inspect(){
 const supported=typeof navigator.getGamepads==='function';
 let pads=[];
 if(supported){try{pads=navigator.getGamepads()||[]}catch{}}
 const state=readXboxPad(pads);
 const current=keys.filter(key=>state.buttons[key]);
 const movement=Math.hypot(state.move.x,state.move.y)>.01;
 const axes=movement?`${present(state.move.x)} horizontal · ${present(state.move.y)} vertical`:'Neutro · 0%, 0%';
 const signatureNow=JSON.stringify([supported,state.connected,state.index,state.id,state.move,state.sprint,state.buttons]);
 if(signatureNow===signature)return;
 signature=signatureNow;
 const status=$('padStatus');
 status.dataset.connected=String(state.connected);
 status.textContent=!supported?'Gamepad API indisponível neste navegador.':state.connected?'Controle detectado. Botões e analógico em leitura local.':'Controle não detectado. Conecte-o e pressione um botão.';
 $('padIdentity').textContent=state.connected?`${state.id.slice(0,100)} · ${pads[state.index]?.mapping==='standard'?'mapeamento padrão':'mapeamento não padrão (confirmar botões)'}`:'Nenhum controle reconhecido';
 $('padMovement').textContent=axes;
 $('padSprint').textContent=state.sprint?'CORRENDO · RT/RB/L3 pressionado':'Inativa';
 for(const key of keys){
  const button=document.querySelector('[data-pad-key="'+key+'"]');
  if(button)button.dataset.active=String(state.buttons[key]);
 }
 const active=current.map(key=>key.toUpperCase()).join(', ');
 if(active||movement||state.sprint)lastActive=(active||'Analógico')+(state.sprint?' + corrida':'');
 $('padFeedback').textContent=!state.connected?'Aguardando interação':lastActive||'Nenhuma entrada ainda';
}
$('padRefresh').addEventListener('click',()=>{signature='';inspect()});
window.addEventListener('gamepadconnected',()=>{signature='';inspect()});
window.addEventListener('gamepaddisconnected',()=>{signature='';lastActive='';inspect()});
let previous=0;
function frame(time){
 if(!document.hidden && time-previous>=90){previous=time;inspect();}
 requestAnimationFrame(frame);
}
inspect();requestAnimationFrame(frame);
