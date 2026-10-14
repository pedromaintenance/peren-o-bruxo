// M1g-F — consolidated Chromium UI and accessibility checks, not an art approval.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {newClassicState,CLASSIC_KEY,PHASER_KEY} from '../src/progress.js';

const PORT='4191',base='http://127.0.0.1:'+PORT+'/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',PORT,'--strictPort'],{
 cwd:new URL('..',import.meta.url),stdio:'inherit'});
const devices=[[360,800],[390,844],[768,1024],[1280,800],[844,390]];
const metrics=[];
let browser;
try{
 let running=false;
 for(let i=0;i<90;i++){
  if(server.exitCode!==null)throw Error('Preview encerrou antes do QA');
  try{if((await fetch(base)).ok){running=true;break}}catch{}
  await new Promise(r=>setTimeout(r,160));
 }
 assert.ok(running,'Preview Vite não iniciou');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await mkdir('screenshots',{recursive:true});
 for(const [width,height] of devices){
  const mobile=width<=390||height===390;
  const page=await browser.newPage({viewport:{width,height},hasTouch:mobile,isMobile:mobile,deviceScaleFactor:1});
  const errors=[],warning=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push('console: '+msg.text());});
  const original={...newClassicState(),gold:732,day:3};
  await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:CLASSIC_KEY,value:original});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>!!window.__perenProgress?.save&&window.__perenLab?.registry?.get('ready'));
  async function inspect(root,scene,{primaryButtons=[]}={}){
   const audit=await page.evaluate(({rootId,buttons})=>{
    const el=document.getElementById(rootId),rect=el.getBoundingClientRect();
    const style=getComputedStyle(el);
    const w=innerWidth;
    const controls=buttons.map(id=>{
     const e=document.getElementById(id),r=e?.getBoundingClientRect();
     return {id,visible:!!e&&getComputedStyle(e).display!=='none'&&!e.hidden&&!!r?.width,
      width:r?.width||0,height:r?.height||0,left:r?.left||0,right:r?.right||0};
    });
    return {w,scene:rootId,rootWidth:rect.width,scrollWidth:el.scrollWidth,viewportOverflow:document.documentElement.scrollWidth-w,
      contrastTokens:{gold:getComputedStyle(document.documentElement).getPropertyValue('--ui-gold-bright').trim(),
       ivory:getComputedStyle(document.documentElement).getPropertyValue('--ui-ivory').trim()},
      controls,scrollMode:style.overflowY};
   },{rootId:root,buttons:primaryButtons});
   assert.ok(audit.viewportOverflow<=2,scene+': overflow body '+JSON.stringify(audit));
   assert.ok(audit.scrollWidth<=width+3,scene+': overflow panel '+JSON.stringify(audit));
   for(const c of audit.controls){
    if(!c.visible)continue;
    assert.ok(c.height>=44-0.5,scene+': alvo pequeno '+JSON.stringify(c));
    assert.ok(c.width>=44-0.5,scene+': alvo estreito '+JSON.stringify(c));
    assert.ok(c.left>=-3&&c.right<=width+3,scene+': controle saiu do viewport '+JSON.stringify(c));
   }
   metrics.push({viewport:width+'x'+height,scene,...audit});
   await page.screenshot({path:'screenshots/m1g-f-'+scene+'-'+width+'x'+height+'.png',fullPage:true});
  }
  // Portomonte: actual landing scene.
  await inspect('hub','portomonte',{primaryButtons:['goForest','showCraft','showShop','openBagHub','endDayBtn']});
  await page.locator('#openBagHub').click();
  await page.locator('#inventoryUI').waitFor({state:'visible'});
  assert.equal(await page.locator('#invClose').evaluate(el=>document.activeElement===el),true);
  await inspect('inventoryUI','inventario',{primaryButtons:['invClose']});
  await page.keyboard.press('Escape');
  await page.locator('#inventoryUI').waitFor({state:'hidden'});
  await page.locator('#showCraft').click();
  await page.locator('#craftUI').waitFor({state:'visible'});
  await inspect('craftUI','alquimia',{primaryButtons:['craftClose','craftMake']});
  await page.locator('#craftClose').click();
  await page.locator('#showShop').click();
  await page.locator('#tradeUI').waitFor({state:'visible'});
  await inspect('tradeUI','comercio',{primaryButtons:['tradeClose']});
  const gold=await page.locator('#tradeGold').textContent();
  assert.equal(gold,'732');
  await page.locator('#tradeClose').click();
  await page.locator('#goForest').click();
  await page.locator('#hub').waitFor({state:'hidden'});
  await page.waitForTimeout(280);
  await inspect('controls','exploracao',{primaryButtons:['gatherBtn','sprintBtn']});
  // Deterministic contact: use the real scene decision, not a fake dialog.
  await page.evaluate(()=>{
   const scene=window.__perenLab.scene.getScene('ExplorationScene');
   scene.openEncounter(scene.beasts.find(b=>b.type==='mob-galho-infectado'));
  });
  await page.locator('#encounterModal').waitFor({state:'visible'});
  assert.equal(await page.locator('#observeBeast').evaluate(el=>document.activeElement===el),true,'Foco inicial do encontro incorreto');
  // A modal cannot leak keyboard focus into the map.
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.locator('#retreatBeast').evaluate(el=>document.activeElement===el),true);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('#observeBeast').evaluate(el=>document.activeElement===el),true);
  await inspect('encounterModal','encontro',{primaryButtons:['observeBeast','retreatBeast']});
  await page.locator('#observeBeast').click();
  await page.locator('#battleUI').waitFor({state:'visible'});
  await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='active');
  await page.waitForTimeout(300);
  await inspect('battleUI','combate',{primaryButtons:[]});
  const commandSizes=await page.locator('#battleCommands [data-battle]').evaluateAll(nodes=>
    nodes.map(node=>({action:node.dataset.battle,height:node.getBoundingClientRect().height,width:node.getBoundingClientRect().width})));
  for(const c of commandSizes)assert.ok(c.height>=44-0.5&&c.width>=44-0.5,'Comando JRPG abaixo de 44px: '+JSON.stringify(c));
  const heroHp=await page.locator('#battleHpFill').getAttribute('aria-valuenow');
  assert.equal(Number(heroHp),original.hp);
  // Retreat must not generate rewards. New visuals may not interfere with engine.
  const before=await page.evaluate(()=>window.__perenProgress.save.character);
  await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy);
  await page.locator('[data-battle="flee"]').click();
  await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='fled');
  await page.locator('#battleFinish').click();
  await page.locator('#battleUI').waitFor({state:'hidden'});
  await page.waitForTimeout(130);
  assert.equal(await page.locator('#gatherBtn').evaluate(el=>document.activeElement===el),true,'Foco não restaurado após batalha');
  const after=await page.evaluate(()=>window.__perenProgress.save.character);
  assert.equal(after.gold,before.gold);assert.equal(after.exp,before.exp);assert.equal(after.kills,before.kills);
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),CLASSIC_KEY),original);
  const stored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PHASER_KEY);
  assert.equal(stored.character.gold,after.gold);
  assert.deepEqual(errors,[],errors.join('\n'));
  await page.close();
  console.log('M1g-F '+width+'x'+height+' OK: seis telas, foco, alvos, save');
 }
 await writeFile('screenshots/m1g-f-metrics.json',JSON.stringify(metrics,null,2)+'\n');
 console.log('M1g-F: '+metrics.length+' medições de painéis, capturas e UI (arte continua aguardando aprovação)');
}finally{await browser?.close();server.kill('SIGTERM');}
