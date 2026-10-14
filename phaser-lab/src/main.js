import Phaser from 'phaser';
import { ExplorationScene } from './exploration.js';
import {HERBS} from './world.js';
import {XboxPadTracker} from './gamepad.js';
import {BattleScene} from './battle-scene.js';
import {SPELLS,defaultProfile} from './combat.js';

// M1a isolated sandbox. Does not read or overwrite Peren's classic save.
const $=id=>document.getElementById(id);
const app=new Phaser.Game({type:Phaser.AUTO,parent:'phaser',backgroundColor:'#101b1b',
  scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH,width:390,height:844},
  render:{pixelArt:true,antialias:false},input:{gamepad:true},physics:{default:'arcade',arcade:{debug:false}},
  scene:[ExplorationScene,BattleScene]});
window.__perenLab=app;
const seed=String(new URLSearchParams(location.search).get('seed')||'murin-001').slice(0,60);
app.registry.set('seed',seed);
app.registry.set('combatProfile',defaultProfile());
let last='';
function updateHud(){
  const bag=app.registry.get('collected')||{};
  const total=Object.values(bag).reduce((a,b)=>a+b,0);
  const msg=app.registry.get('status')||'Busque recursos na Floresta de Mürin.';
  const signature=total+msg;
  if(last!==signature){last=signature;$('inventory-count').textContent=total;$('feedback').textContent=msg;
    $('collected').textContent=HERBS.filter(h=>bag[h.id]).map(h=>`${h.name}: ${bag[h.id]}`).join(' · ')||'Nenhum ingrediente coletado';}
  $('returnBtn').hidden=!app.registry.get('atExit');
  $('weather').textContent='Tempo: '+(app.registry.get('weather')||'sereno');
  $('threat').textContent=app.registry.get('threat')||'Patrulhas distantes';
  $('bagContents').textContent=$('collected').textContent;
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
// M1b encounter preview: no battle calculation and no mutation of classic saves.
const beastLore={
 'mob-galho-infectado':'Galhos profanados se movem quando a mata percebe intrusos. A cobertura densa reduz sua percepção.',
 'mob-fungo-violeta':'Esporos púrpuras denunciam sua presença. Prefere vagar em terrenos úmidos e entre raízes.',
 'mob-ettercap':'Caçador aracnídeo da mata. Enxerga mais longe que os outros e persegue corredores descuidados.'
};
app.events.on('peren-encounter',info=>{
 $('encounterModal').hidden=false;
 $('beastName').textContent=info.name;
 $('beastPortrait').src=`./art/monsters/${info.type}/portrait.png`;
 $('beastPortrait').alt=`Retrato de ${info.name}`;
 $('beastDescription').textContent=beastLore[info.type]||'Uma ameaça se aproxima.';
 $('encounterHint').textContent='A floresta exige decisões. Enfrente a criatura no combate Phaser ou recue.';
});
function retreatBeast(){const s=joyScene();if(s?.retreatEncounter()){$('encounterModal').hidden=true;}}
$('retreatBeast').addEventListener('click',retreatBeast);
$('observeBeast').addEventListener('click',()=>{
  const scene=joyScene();if(!scene?.fightEncounter())return;
  $('encounterModal').hidden=true;$('controls').hidden=true;$('battleUI').hidden=false;
  selectedBattleIndex=0;syncBattleButtons();
});
// Standalone hub shown first. Real Peren HTML hub remains untouched in main.
$('hub').hidden=false;$('controls').hidden=true;
// Expedition pause is applied inside the scene after assets have loaded.


// A standard Xbox controller drives *both* paused HTML menus and the Phaser scene.
// Poll from the game clock: scene.update() stops when the city hub pauses exploration.
// Browsers generally reveal a new controller only after the user presses a button.
const xbox=new XboxPadTracker();
let lastPadLabel='', hubChoice=0, forestVisited=false;
const hubButtons=[$('goForest'),$('resetForest')];
function selectHubChoice(index){
  hubChoice=Math.max(0,Math.min(hubButtons.length-1,index));
  hubButtons.forEach((button,i)=>button.classList.toggle('pad-selected',i===hubChoice));
}
selectHubChoice(0);
function toggleBag(show){
  $('bagPanel').hidden=!show;
  if(show)$('bagContents').textContent=$('collected').textContent;
}
const originalHub=hub;
// Wrap the existing hub transition so pause, controller selection and bag agree.
hub=function(show){originalHub(show);if(show){toggleBag(false);selectHubChoice(0);}else forestVisited=true;};
function pollXbox(){
  const state=xbox.poll(()=>navigator.getGamepads?.()||[]);
  const label=state.connected?`🎮 Xbox / gamepad conectado: ${state.id}`:'🎮 Xbox: conecte o controle e pressione um botão';
  if(label!==lastPadLabel){lastPadLabel=label;$('gamepad-status').textContent=label;$('gamepad-hud').textContent=state.connected?'🎮 Xbox conectado':'';}
  const scene=joyScene();
  if(scene)scene.gamepadInput={move:state.move,sprint:state.sprint};
  if(!state.connected)return;
  const key=state.justPressed;
  if(!$('battleUI').hidden){
    if(key.up||key.left)selectBattleChoice(selectedBattleIndex-1);
    else if(key.down||key.right)selectBattleChoice(selectedBattleIndex+1);
    if(key.a)activateBattleChoice();
    else if(key.x)battleAction('potion');
    else if(key.y)battleAction('spell:mag-raio-de-fogo');
    else if(key.b||key.menu)battleAction($('battleFinish').hidden?'flee':'finish');
    return;
  }
  if(!$('encounterModal').hidden){if(key.a||key.x)$('observeBeast').click();else if(key.b||key.menu)retreatBeast();return;}
  if(!$('hub').hidden){
    if(key.down)selectHubChoice(hubChoice+1);
    if(key.up)selectHubChoice(hubChoice-1);
    if(key.a)hubButtons[hubChoice].click();
    else if((key.b||key.menu)&&forestVisited)hub(false);
    return;
  }
  if(!$('bagPanel').hidden){
    if(key.b||key.y||key.view||key.menu)toggleBag(false);
    return;
  }
  if(key.a||key.x)scene?.command('gather');
  if(key.y||key.view)toggleBag(true);
  else if(key.b||key.menu)hub(true);
}
app.events.on('step',pollXbox);
window.addEventListener('keydown',event=>{
  if(event.code!=='Escape')return;
  if(!$('battleUI').hidden){battleAction($('battleFinish').hidden?'flee':'finish');return;}
  if(!$('encounterModal').hidden){retreatBeast();return;}
  if(!$('bagPanel').hidden){toggleBag(false);return;}
  hub($('hub').hidden);
});
$('bagClose').addEventListener('click',()=>toggleBag(false));


// M1c: illustrated turn battle. Same catalog IDs and monster values as classic,
// but a completely isolated in-memory testing profile. Never reads Peren's save.
let selectedBattleIndex=0;
const battleOptions=[...document.querySelectorAll('[data-battle]')];
function selectBattleChoice(i){selectedBattleIndex=(i+battleOptions.length)%battleOptions.length;syncBattleButtons();}
function syncBattleButtons(){battleOptions.forEach((b,i)=>b.classList.toggle('pad-selected',i===selectedBattleIndex));}
function activateBattleChoice(){const b=battleOptions[selectedBattleIndex];if(b&&!b.disabled)battleAction(b.dataset.battle);}
function battleScene(){try{return app.scene.getScene('BattleScene')}catch{return null}}
async function battleAction(action){
  const scene=battleScene();if(!scene||scene.resolved)return;
  if(action==='finish'){if(scene.endBattle())$('battleUI').hidden=true;return;}
  await scene.takeTurn(action);
}
for(const button of battleOptions)button.addEventListener('click',()=>battleAction(button.dataset.battle));
$('battleFinish').addEventListener('click',()=>battleAction('finish'));
function renderBattleState(state){
  if(!state)return;
  $('battleRound').textContent=state.status==='active'?`RODADA ${state.round}`:'DESFECHO';
  $('battleMonster').textContent=`${state.monster} · ${state.enemyHp}/${state.enemyMaxHp} PV`;
  $('battleStats').textContent=`Peren ${state.hp}/${state.maxHp} PV · ${state.mp}/${state.maxMp} PM · ${state.potions} poções`;
  $('battleJournal').textContent=state.log.join(' · ');
  const finished=state.status!=='active';
  $('battleCommands').hidden=finished;
  $('battleFinish').hidden=!finished;
  $('battleFinish').textContent=state.status==='won'?'RECOLHER SAQUE E VOLTAR':state.status==='lost'?'ACEITAR RESGATE':'RETORNAR À FLORESTA';
  $('battleEndHint').textContent=state.status==='won'?'Vitória! A recompensa é entregue uma única vez.':state.status==='lost'?'Peren caiu, mas esta prévia não causa perda de save.':state.status==='fled'?'Fuga concluída; sem XP nem loot.':'';
  battleOptions.forEach(b=>{
    b.disabled=!!state.busy || (b.dataset.battle.startsWith('spell:')&&state.mp<(SPELLS.find(s=>s.id===b.dataset.battle.slice(6))?.mana||0)) || (b.dataset.battle==='potion'&&state.potions<=0);
  });
}
app.events.on('peren-battle-change',renderBattleState);
app.events.on('peren-battle-error',msg=>{$('battleJournal').textContent=msg;});
app.events.on('peren-battle-end',({result,reward,profile})=>{
  $('battleUI').hidden=true;$('controls').hidden=false;
  const itemLabel=reward?Object.keys(reward.items).join(', '):'nenhum material';
  $('feedback').textContent=result==='won'?`Vitória! +${reward.xp} XP, +${reward.gold} moedas, ${itemLabel}.`:'Retorno à floresta sem recompensa.';
  $('combatWallet').textContent=`Vitórias: ${profile.kills} · Ouro: ${profile.gold} · Nível: ${profile.level}`;
});
window.addEventListener('keydown',event=>{
  if($('battleUI').hidden)return;
  if(event.code==='ArrowUp'){event.preventDefault();selectBattleChoice(selectedBattleIndex-1)}
  if(event.code==='ArrowDown'){event.preventDefault();selectBattleChoice(selectedBattleIndex+1)}
  if(event.code==='Enter'||event.code==='Space'){event.preventDefault();activateBattleChoice()}
  if(event.code==='Digit1')battleAction('attack');
  if(event.code==='Digit2')battleAction('defend');
  if(event.code==='Digit3')battleAction('spell:mag-raio-de-fogo');
  if(event.code==='Digit4')battleAction('spell:mag-raio-de-gelo');
  if(event.code==='Digit5')battleAction('spell:mag-misseis-magicos');
});
syncBattleButtons();
