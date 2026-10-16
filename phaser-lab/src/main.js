import Phaser from 'phaser';
import { ExplorationScene } from './exploration.js';
import {HERBS} from './world.js';
import {XboxPadTracker} from './gamepad.js';
import {BattleScene} from './battle-scene.js';
import {SPELLS,defaultProfile} from './combat.js';
import {buildCatalogs,createProgressBridge,inventoryTotal,purchasePrice,salePrice,craftable,skillLevel,PHASER_KEY,CLASSIC_KEY} from './progress.js';
import {hubViewModel,applyHubViewModel} from './ui-hub.js';
import {createInventoryScreen} from './ui-inventory.js';
import {createWorkshopScreen} from './ui-workshop.js';
import {createMarketplaceScreen} from './ui-marketplace.js';
import {expeditionViewModel,battleViewModel,battleOutcomeViewModel,fillGauge,actionDetails} from './ui-adventure.js';
import {M1HF_PREVIEW} from './progress.js';
import {createDiagnosticLog,buildDiagnosticReport} from './diagnostics.js';
// Canonical catalog from the classic Peren repository, packaged with Vite for offline execution.
async function bootstrap(){
const data={};
for(const name of ['itens','receitas','magias','monstros','cidades']){
  const response=await fetch(`./data/${name}.json`);
  if(!response.ok)throw Error('Não foi possível carregar o catálogo '+name);
  data[name]=await response.json();
}
const catalogs=buildCatalogs(data);
const bridge=createProgressBridge(localStorage,catalogs);
// Experimental visual flag only. Existing game and save remain unchanged by default.
const chosenArt=new URLSearchParams(location.search).get('art');
if(['m1h','m1hb','m1hc','m1hd'].includes(chosenArt)){
  const dir=({'m1h':'art-m1h','m1hb':'art-m1hb','m1hc':'art-m1hc','m1hd':'art-m1hd'})[chosenArt];
  for(const img of document.querySelectorAll('img[src*="art/characters/peren/portrait"]'))
    img.src=img.getAttribute('src').replace('./art/characters/peren/','./'+dir+'/characters/peren/');
}
const inventory=createInventoryScreen({document,bridge,catalogs});


// M1a isolated sandbox. Does not read or overwrite Peren's classic save.
const $=id=>document.getElementById(id);
const app=new Phaser.Game({type:Phaser.AUTO,parent:'phaser',backgroundColor:'#101b1b',
  scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH,width:390,height:844},
  render:{pixelArt:true,antialias:false},input:{gamepad:true},physics:{default:'arcade',arcade:{debug:false}},
  scene:[ExplorationScene,BattleScene]});
window.__perenLab=app;

/** Bug reports are opt-in, local-only and only exposed in the isolated M1h-F build. */
const diagnosticLog=createDiagnosticLog();
if(M1HF_PREVIEW){
 const note=(type,message)=>diagnosticLog.record(type,message);
 window.addEventListener('error',e=>note('javascript',e.message));
 window.addEventListener('unhandledrejection',e=>note('promise',e.reason?.message||String(e.reason)));
 app.events.on('peren-battle-error',message=>note('battle-error',message));
 app.events.on('peren-progress-error',message=>note('save-error',message));
 app.events.on('peren-battle-end',event=>note('battle-ended',event.result));
 app.events.on('peren-encounter',event=>note('encounter',event.type));
 const buildReport=()=>{
  let explorer,combat;
  try{explorer=app.scene.getScene('ExplorationScene')}catch{}
  try{combat=app.scene.getScene('BattleScene')}catch{}
  return buildDiagnosticReport({
   version:import.meta.env.VITE_PEREN_BUILD_SHA||'m1hf-dev',
   generatedAt:new Date().toISOString(),pathname:location.pathname,
   viewport:{width:innerWidth,height:innerHeight},online:navigator.onLine,
   save:bridge.read(),battle:app.registry.get('battleState'),
   scene:{
    explorationActive:!!explorer?.scene.isActive(),
    explorationPaused:!!explorer?.scene.isPaused(),
    battleActive:!!combat?.scene.isActive()
   },
   events:diagnosticLog.snapshot()
  });
 };
 window.__perenDiagnostics={report:buildReport};
 const say=(message)=>{
  for(const id of ['m1hfDiagStatus','m1hfDiagBattleStatus']){
   const el=document.getElementById(id);if(el)el.textContent=message;
  }
 };
 const copy=async()=>{
  try{
   await navigator.clipboard.writeText(JSON.stringify(buildReport(),null,2));
   say('Diagnóstico copiado. Cole na conversa ou no relato do bug.');
  }catch(error){
   note('diagnostic',error.message);
   say('Não foi possível copiar; use Baixar diagnóstico no menu da cidade.');
  }
 };
 const save=()=>{
  try{
   const payload=JSON.stringify(buildReport(),null,2);
   const url=URL.createObjectURL(new Blob([payload],{type:'application/json'}));
   const a=document.createElement('a');a.href=url;a.download='peren-m1hf-diagnostico.json';
   document.body.append(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1500);
   say('Relatório salvo no aparelho. Ele não foi enviado para nenhum servidor.');
  }catch(error){note('diagnostic',error.message);say('Erro ao salvar diagnóstico: '+error.message);}
 };
 for(const id of ['m1hfDiagCopy','m1hfDiagCopyBattle']){
  document.getElementById(id)?.addEventListener('click',copy);
 }
 document.getElementById('m1hfDiagSave')?.addEventListener('click',save);
}

const workshop=createWorkshopScreen({document,bridge,catalogs,onChange:()=>{
  app.registry.set('combatProfile',bridge.combatProfile());renderHub();
}});
const marketplace=createMarketplaceScreen({document,bridge,catalogs,onChange:()=>{
  app.registry.set('combatProfile',bridge.combatProfile());renderHub();
}});
const seed=String(new URLSearchParams(location.search).get('seed')||bridge.read().worlds.activeSeed||'murin-001').slice(0,60);
app.registry.set('seed',seed);
app.registry.set('progressBridge',bridge);
app.registry.set('combatProfile',bridge.combatProfile());
let last='';
function updateHud(){
  const bag=app.registry.get('collected')||{};
  const total=Object.values(bag).reduce((a,b)=>a+b,0);
  const msg=app.registry.get('status')||'Busque recursos na Floresta de Mürin.';
  const signature=total+msg;
  if(last!==signature){last=signature;$('inventory-count').textContent=total;$('feedback').textContent=msg;
    $('collected').textContent=HERBS.filter(h=>bag[h.id]).map(h=>`${h.name}: ${bag[h.id]}`).join(' · ')||'Nenhum ingrediente coletado';}
  const ui=expeditionViewModel(bridge.state,catalogs,{
    collected:bag,weather:app.registry.get('weather'),threat:app.registry.get('threat'),
    status:msg,atExit:app.registry.get('atExit')});
  const sig=[ui.hp,ui.maxHp,ui.mp,ui.maxMp,ui.gold,ui.level,ui.day].join(':');
  if($('status').dataset.profileSig!==sig){
    $('status').dataset.profileSig=sig;
    $('hudHp').textContent=ui.hp+' / '+ui.maxHp;
    $('hudMp').textContent=ui.mp+' / '+ui.maxMp;
    $('hudLevel').textContent='Nível '+ui.level;
    $('hudGold').textContent=ui.gold.toLocaleString('pt-BR');
    $('hudDay').textContent='Dia '+ui.day;
    fillGauge(document,'hudHpFill',ui.hp,ui.maxHp);
    fillGauge(document,'hudMpFill',ui.mp,ui.maxMp);
  }
  $('returnBtn').hidden=!ui.canReturn;
  $('weather').textContent='Tempo: '+(app.registry.get('weather')||'sereno');
  $('threat').textContent=app.registry.get('threat')||'Patrulhas distantes';
  if(!$('bagPanel').hidden)$('bagContents').textContent=inventoryText();
}
app.events.on('step',updateHud);
app.events.on('peren-progress-change',updateHud);
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
function hub(show){$('hub').hidden=!show;$('controls').hidden=show;if(show){app.scene.pause('ExplorationScene');$('hubStatus').textContent='Inventário e progresso salvos no M1d. Save clássico protegido contra alterações.';renderHub();}else app.scene.resume('ExplorationScene')}
$('returnBtn').addEventListener('click',()=>hub(true));
$('goForest').addEventListener('click',()=>hub(false));
$('resetForest').addEventListener('click',()=>{
  try{const name='murin-'+Date.now();bridge.execute({type:'selectSeed',seed:name});
    app.registry.set('seed',name);app.registry.set('atExit',false);
    app.scene.stop('ExplorationScene');app.scene.start('ExplorationScene');hub(false);
  }catch(err){notifyProgressError(err)}
});
// M1b encounter preview: no battle calculation and no mutation of classic saves.
const beastLore={
 'mob-galho-infectado':'Galhos profanados se movem quando a mata percebe intrusos. A cobertura densa reduz sua percepção.',
 'mob-fungo-violeta':'Esporos púrpuras denunciam sua presença. Prefere vagar em terrenos úmidos e entre raízes.',
 'mob-ettercap':'Caçador aracnídeo da mata. Enxerga mais longe que os outros e persegue corredores descuidados.'
};
let encounterFocus=null;
app.events.on('peren-encounter',info=>{
 encounterFocus=document.activeElement;
 $('encounterModal').hidden=false;
 $('controls').inert=true;
 $('beastName').textContent=info.name;
 const monsterArt=chosenArt==='m1hf'?'./art-m1hf/monsters/':chosenArt==='m1he'?'./art-m1he/monsters/':'./art/monsters/';
 $('beastPortrait').src=`${monsterArt}${info.type}/portrait.png`;
 $('beastPortrait').alt=`Retrato de ${info.name}`;
 $('beastDescription').textContent=beastLore[info.type]||'Uma ameaça se aproxima.';
 $('encounterHint').textContent='A floresta exige decisões. Enfrente a criatura no combate Phaser ou recue.';
 $('beastClassification').textContent=({'mob-galho-infectado':'Vegetação corrompida','mob-fungo-violeta':'Fungo da mata','mob-ettercap':'Predador aracnídeo'}[info.type]||'Criatura de Mürin');
 $('observeBeast').focus({preventScroll:true});
});
function retreatBeast(){const s=joyScene();if(s?.retreatEncounter()){
 $('encounterModal').hidden=true;$('controls').inert=false;
 (encounterFocus?.isConnected&&!encounterFocus.closest('[hidden]')?encounterFocus:$('gatherBtn')).focus?.({preventScroll:true});
}}
$('retreatBeast').addEventListener('click',retreatBeast);
$('encounterModal').addEventListener('keydown',event=>{
 if(event.key==='Escape'){event.preventDefault();event.stopPropagation();retreatBeast();return;}
 if(event.key!=='Tab')return;
 const buttons=[$('observeBeast'),$('retreatBeast')];
 const index=buttons.indexOf(document.activeElement);
 if(event.shiftKey&&index===0){event.preventDefault();buttons[1].focus();}
 else if(!event.shiftKey&&index===1){event.preventDefault();buttons[0].focus();}
});
$('observeBeast').addEventListener('click',()=>{
  const scene=joyScene();if(!scene?.fightEncounter())return;
  $('encounterModal').hidden=true;$('controls').hidden=true;$('battleUI').hidden=false;
  selectedBattleIndex=0;syncBattleButtons();
  battleOptions[0]?.focus({preventScroll:true});
});
// Standalone hub shown first. Real Peren HTML hub remains untouched in main.
$('hub').hidden=false;$('controls').hidden=true;
// Expedition pause is applied inside the scene after assets have loaded.


// A standard Xbox controller drives *both* paused HTML menus and the Phaser scene.
// Poll from the game clock: scene.update() stops when the city hub pauses exploration.
// Browsers generally reveal a new controller only after the user presses a button.
const xbox=new XboxPadTracker();
let lastPadLabel='', hubChoice=0, forestVisited=false;
const hubButtons=[$('goForest'),$('showCraft'),$('showShop'),$('openBagHub'),$('endDayBtn'),$('showInventory'),$('resetForest')];
function selectHubChoice(index){
  hubChoice=Math.max(0,Math.min(hubButtons.length-1,index));
  hubButtons.forEach((button,i)=>button.classList.toggle('pad-selected',i===hubChoice));
}
selectHubChoice(0);
function toggleBag(show){
  $('bagPanel').hidden=!show;
  if(show){$('bagContents').textContent=inventoryText();}
}
$('openBagHub').addEventListener('click',()=>inventory.open());
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
    if(key.a){if(!$('battleFinish').hidden)battleAction('finish');else activateBattleChoice();}
    else if(key.x)battleAction('potion');
    else if(key.y)battleAction('spell:mag-raio-de-fogo');
    else if(key.b||key.menu)battleAction($('battleFinish').hidden?'flee':'finish');
    return;
  }
  if(!$('encounterModal').hidden){if(key.a||key.x)$('observeBeast').click();else if(key.b||key.menu)retreatBeast();return;}
  if(marketplace.isOpen()){
    if(key.b||key.menu){marketplace.close();return;}
    if(key.x){marketplace.setMode(marketplace.mode==='buy'?'sell':'buy');return;}
    if(key.up)marketplace.move(-1);
    else if(key.down)marketplace.move(1);
    else if(key.left)marketplace.adjustQuantity(-1);
    else if(key.right)marketplace.adjustQuantity(1);
    else if(key.a)marketplace.transact();
    return;
  }
  if(workshop.isOpen()){
    if(key.b||key.menu){workshop.close();return;}
    if(key.x){workshop.cycleStation(1);return;}
    if(key.up)workshop.move(-1);
    else if(key.down)workshop.move(1);
    else if(key.a)workshop.make();
    return;
  }
  if(inventory.isOpen()){
    if(key.b||key.y||key.menu){inventory.close();return;}
    if(key.x){inventory.cycleTab(1);return;}
    if(key.up)inventory.move(0,-1);
    else if(key.down)inventory.move(0,1);
    else if(key.left)inventory.move(-1,0);
    else if(key.right)inventory.move(1,0);
    else if(key.a)inventory.move(0,0);
    return;
  }
  if(!$('bagPanel').hidden){
    if(key.b||key.y||key.view||key.menu)toggleBag(false);
    return;
  }
  if(!$('hub').hidden){
    if(key.y||key.view){inventory.open();return;}
    if(key.down)selectHubChoice(hubChoice+1);
    if(key.up)selectHubChoice(hubChoice-1);
    if(key.a)hubButtons[hubChoice].click();
    else if((key.b||key.menu)&&forestVisited)hub(false);
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
  if(marketplace.isOpen()){marketplace.close();return;}
  if(workshop.isOpen()){workshop.close();return;}
  if(inventory.isOpen()){inventory.close();return;}
  if(!$('bagPanel').hidden){toggleBag(false);return;}
  hub($('hub').hidden);
});
$('bagClose').addEventListener('click',()=>toggleBag(false));


// M1c: illustrated turn battle. Same catalog IDs and monster values as classic,
// but a completely isolated in-memory testing profile. Never reads Peren's save.
let selectedBattleIndex=0;
const battleOptions=[...document.querySelectorAll('[data-battle]')];
function selectBattleChoice(i){selectedBattleIndex=(i+battleOptions.length)%battleOptions.length;syncBattleButtons();}
function syncBattleButtons(){battleOptions.forEach((b,i)=>b.classList.toggle('pad-selected',i===selectedBattleIndex));
 const selected=battleOptions[selectedBattleIndex];
 if(selected)$('battleCommandHint').textContent=actionDetails(selected.dataset.battle);
}
function activateBattleChoice(){const b=battleOptions[selectedBattleIndex];if(b&&!b.disabled)battleAction(b.dataset.battle);}
function battleScene(){try{return app.scene.getScene('BattleScene')}catch{return null}}
async function battleAction(action){
  const scene=battleScene();if(!scene||scene.resolved)return;
  try{
    if(action==='finish'){
      const closed=scene.endBattle();
      if(closed){
        // The DOM must unlock even if a post-save subscriber has failed.
        $('battleUI').hidden=true;$('controls').hidden=false;$('controls').inert=false;
      }
      return;
    }
    await scene.takeTurn(action);
  }catch(err){
    console.error('Erro no controle do combate:',err);
    const message='Erro no combate: '+(err?.message||String(err));
    $('battleJournal').textContent=message;
    // An unexpected error must never disappear silently behind the battle UI.
    if(scene.resolved){
      $('battleUI').hidden=true;$('controls').hidden=false;$('controls').inert=false;
      $('feedback').textContent='O resultado foi registrado. Recarregue a prévia se a floresta não responder.';
    }
  }
}
for(const button of battleOptions){
 button.addEventListener('click',()=>battleAction(button.dataset.battle));
 button.addEventListener('focus',()=>{$('battleCommandHint').textContent=actionDetails(button.dataset.battle)});
 button.addEventListener('pointerenter',()=>{$('battleCommandHint').textContent=actionDetails(button.dataset.battle)});
}
for(const button of battleOptions.filter(button=>button.dataset.battle.startsWith('spell:'))){
 const spell=SPELLS.find(spell=>spell.id===button.dataset.battle.slice(6));
 if(spell){button.title=actionDetails(button.dataset.battle);button.setAttribute('aria-label',spell.name+', '+spell.mana+' pontos de mana');}
}
$('battleFinish').addEventListener('click',()=>battleAction('finish'));
function renderBattleState(state){
  if(!state)return;
  $('battleRound').textContent=state.status==='active'?`RODADA ${state.round}`:'DESFECHO';
  const ui=battleViewModel(state);
  $('battleMonster').textContent=ui.monster+' · '+ui.enemyHp+'/'+ui.enemyMaxHp+' PV';
  $('battleStats').textContent=ui.hp+'/'+ui.maxHp+' PV · '+ui.mp+'/'+ui.maxMp+' PM';
  $('battlePotionCount').textContent='Poções: '+ui.potions;
  $('battleJournal').textContent=ui.log;
  $('battleStatusLabel').textContent=ui.busy?'Ação em andamento…':ui.finished?'Combate encerrado':'Sua vez';
  fillGauge(document,'battleEnemyFill',ui.enemyHp,ui.enemyMaxHp);
  fillGauge(document,'battleHpFill',ui.hp,ui.maxHp);
  fillGauge(document,'battleMpFill',ui.mp,ui.maxMp);
  const finished=state.status!=='active';
  $('battleCommands').hidden=finished;
  $('battleFinish').hidden=!finished;
  $('battleFinish').textContent=state.status==='won'?'RECOLHER SAQUE E VOLTAR':state.status==='lost'?'ACEITAR RESGATE':'RETORNAR À FLORESTA';
  const outcome=battleOutcomeViewModel(state,catalogs);
  $('battleRewardPreview').hidden=!outcome;
  $('battleRewardTitle').textContent=outcome?.title||'';
  $('battleRewardDetails').textContent=outcome?.details||'';
  $('battleEndHint').textContent=state.status==='won'?'Confirme para salvar e recolher os materiais uma única vez.':state.status==='lost'?'A derrota não apaga o progresso salvo.':state.status==='fled'?'Nenhuma recompensa será concedida.':'';
  battleOptions.forEach(b=>{
    b.disabled=!!state.busy || (b.dataset.battle.startsWith('spell:')&&(!bridge.state.learned.includes(b.dataset.battle.slice(6))||state.mp<(SPELLS.find(s=>s.id===b.dataset.battle.slice(6))?.mana||0))) || (b.dataset.battle==='potion'&&state.potions<=0);
  });
}
app.events.on('peren-battle-change',renderBattleState);
app.events.on('peren-battle-error',msg=>{$('battleJournal').textContent=msg;});
app.events.on('peren-battle-end',({result,reward,profile})=>{
  // Close first. Never leave the game frozen if the reward panel fails to render.
  $('battleUI').hidden=true;$('controls').hidden=false;$('controls').inert=false;
  try{
    $('gatherBtn').focus({preventScroll:true});
    const itemLabel=reward?.items?Object.keys(reward.items).join(', '):'nenhum material';
    const outcomeMessage=result==='won'&&reward
      ?`Vitória! +${reward.xp} XP, +${reward.gold} moedas, ${itemLabel}.`
      :'Retorno à floresta sem recompensa.';
    app.registry.set('status',outcomeMessage);
    $('feedback').textContent=outcomeMessage;
    $('combatWallet').textContent=`Vitórias: ${profile?.kills??0} · Ouro: ${profile?.gold??0} · Nível: ${profile?.level??1}`;
    renderHub();updateHud();
  }catch(err){
    console.error('Falha recuperada na interface de pós-combate:',err);
    $('feedback').textContent='Combate registrado. A interface não atualizou completamente; recarregue a prévia.';
  }
});
window.addEventListener('keydown',event=>{
  if($('battleUI').hidden)return;
  if(event.code==='ArrowUp'){event.preventDefault();selectBattleChoice(selectedBattleIndex-1)}
  if(event.code==='ArrowDown'){event.preventDefault();selectBattleChoice(selectedBattleIndex+1)}
  if(event.code==='Enter'||event.code==='Space'){event.preventDefault();if(!$('battleFinish').hidden)battleAction('finish');else activateBattleChoice()}
  if(event.code==='Digit1')battleAction('attack');
  if(event.code==='Digit2')battleAction('defend');
  if(event.code==='Digit3')battleAction('spell:mag-raio-de-fogo');
  if(event.code==='Digit4')battleAction('spell:mag-raio-de-gelo');
  if(event.code==='Digit5')battleAction('spell:mag-misseis-magicos');
});
syncBattleButtons();

// M1d: mobile-friendly Portomonte economy, using *the same* item and recipe IDs as the classic game.
const htmlEscape=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function inventoryText(){const s=bridge.state;
  return Object.entries(s.bag).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]).slice(0,26).map(([id,n])=>`${n}× ${catalogs.itensById[id]?.nome||id}`).join(' · ')||'Bolsa vazia';
}
let hubTab='intro';
function notifyProgressError(err){const msg=err?.message||String(err);$('hubStatus').textContent=msg;
  $('feedback').textContent=msg;app.registry.set('status',msg);
}
function renderHub(){const s=bridge.state,city=catalogs.cidadesById[s.city];
 applyHubViewModel(document,hubViewModel(s,catalogs,bridge.source));
 $('combatWallet').textContent=`Nível ${s.level} · ${s.gold} moedas · ${s.exp} XP · ${inventoryTotal(s)} itens · ${s.actions} ações`;
 $('progressSource').textContent=bridge.source==='classic-import'?'Progresso importado do Peren clássico (cópia isolada)':'Progresso Phaser salvo (sem alterar o clássico)';
 $('cityMeta').textContent=`Origem: ${city.nome} · Dia ${s.day} · PV ${s.hp} · PM ${s.mp}`;
 const title=$('hubTitle'),panel=$('hubPanel');title.textContent='';panel.replaceChildren();
 const wrapper=document.createElement('div');wrapper.className='market-list';
 const addButton=(name,label,detail,action,id,disabled=false)=>{
  const row=document.createElement('div');row.className='market-line';
  const left=document.createElement('div');left.innerHTML=`<b>${htmlEscape(label)}</b><small>${htmlEscape(detail||'')}</small>`;
  const btn=document.createElement('button');btn.type='button';btn.textContent=name;btn.disabled=disabled;
  btn.addEventListener('click',()=>{try{bridge.execute({type:action,id});app.registry.set('combatProfile',bridge.combatProfile());renderHub();}
    catch(err){notifyProgressError(err)}});row.append(left,btn);wrapper.append(row);
 };
 if(hubTab==='craft'){
  title.textContent='Oficinas · receitas reais';
  panel.textContent='Alquimia e Criação agora têm uma oficina própria. Selecione a opção no menu de Portomonte para preparar receitas reais, conferir ingredientes e nível de ofício.';
 }else if(hubTab==='shop'){
  title.textContent='Comércio de Portomonte';
  panel.textContent='Na nova banca mercantil, negocie os suprimentos reais da cidade com cotação e quantidade, ou venda os itens da mochila.';
 }else if(hubTab==='bag'){
  title.textContent='Vender itens da mochila';
  panel.textContent='O comércio possui uma aba específica para vender. Seu inventário permanece separado das transações.';
 }else{title.textContent='Armazém de Portomonte';panel.textContent='Peren pode coletar ingredientes em Mürin, voltar para a cidade, fabricar itens, negociar e guardar o progresso nesta versão de desenvolvimento.';}
 if(hubTab!=='intro')panel.append(wrapper);
 if(inventory.isOpen())inventory.render();
 if(workshop.isOpen())workshop.render();
 if(marketplace.isOpen())marketplace.render();
}
$('showCraft').addEventListener('click',()=>{hubTab='craft';renderHub();workshop.open()});
$('showShop').addEventListener('click',()=>{hubTab='shop';renderHub();marketplace.open('buy')});
$('showInventory').addEventListener('click',()=>{hubTab='bag';renderHub();marketplace.open('sell')});
$('endDayBtn').addEventListener('click',()=>{try{bridge.execute({type:'endDay'});app.registry.set('combatProfile',bridge.combatProfile());renderHub();}catch(err){notifyProgressError(err)}});
$('exportProgress').addEventListener('click',()=>{
 const blob=new Blob([bridge.export()],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=`peren-phaser-m1d-dia-${bridge.state.day}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('importProgress').addEventListener('change',async e=>{
 const file=e.target.files?.[0];e.target.value='';if(!file)return;
 try{if(file.size>2_000_000)throw Error('Backup excede 2 MB.');bridge.restore(await file.text());
    app.registry.set('combatProfile',bridge.combatProfile());app.registry.set('seed',bridge.read().worlds.activeSeed||'murin-001');
    app.scene.stop('ExplorationScene');app.scene.start('ExplorationScene');renderHub();
 }catch(err){notifyProgressError(err)}
});
app.events.on('peren-progress-change',()=>{if(!$('hub').hidden)renderHub()});
app.events.on('peren-progress-error',message=>notifyProgressError({message}));
window.__perenProgress={get save(){return bridge.read()},get key(){return PHASER_KEY},get classicKey(){return CLASSIC_KEY}};
renderHub();

}
bootstrap().catch(error=>{console.error('Falha na inicialização Phaser M1d',error);const hub=document.getElementById('hubStatus');if(hub)hub.textContent='Falha ao iniciar: '+error.message+' — recarregue a página ou restaure seu backup.';});
