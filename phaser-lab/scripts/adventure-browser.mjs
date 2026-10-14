// M1g-E visual/browser regression for expedition, encounter, battle and save isolation.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {newClassicState,CLASSIC_KEY,PHASER_KEY} from '../src/progress.js';
const port='4187',url='http://127.0.0.1:'+port+'/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',port,'--strictPort'],
 {cwd:new URL('..',import.meta.url),stdio:'inherit'});
let browser;
try{
 let started=false;
 for(let n=0;n<100;n++){
  if(server.exitCode!==null)throw Error('Vite preview encerrou');
  try{if((await fetch(url)).ok){started=true;break}}catch{}
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 assert.ok(started,'Vite preview indisponível');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await mkdir('screenshots',{recursive:true});
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<500,isMobile:width<500,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const classic={...newClassicState(),gold:731,day:6};
  await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:CLASSIC_KEY,value:classic});
  await page.goto(url,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.__perenProgress?.save&&window.__perenLab?.registry?.get('ready'));
  await page.locator('#goForest').click();
  await page.locator('#hub').waitFor({state:'hidden'});
  await page.waitForFunction(()=>window.__perenLab.scene.getScene('ExplorationScene').scene.isActive());
  await page.waitForTimeout(300);
  assert.match(await page.locator('#hudHp').textContent(),/\d+ \/ \d+/);
  assert.match(await page.locator('#hudMp').textContent(),/\d+ \/ \d+/);
  assert.equal(await page.locator('#hudGold').textContent(),'731');
  assert.equal(await page.locator('#hudDay').textContent(),'Dia 6');
  assert.equal(await page.locator('#inventory-count').textContent(),'0');
  const valid=await page.evaluate(()=>{
   const val=id=>{const el=document.getElementById(id);return {
     now:el.getAttribute('aria-valuenow'),max:el.getAttribute('aria-valuemax'),
     width:parseFloat(el.style.width||'0')}};
   const status=document.getElementById('status');
   return {hp:val('hudHpFill'),mp:val('hudMpFill'),bounds:status.getBoundingClientRect().toJSON(),
     overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert.ok(valid.hp.width>=0&&valid.hp.width<=100);assert.ok(valid.mp.width>=0&&valid.mp.width<=100);
  assert.ok(valid.overflow<=2,'Overflow na exploração: '+JSON.stringify(valid));
  await page.screenshot({path:'screenshots/m1g-e-exploracao-'+width+'.png',fullPage:true});
  await page.evaluate(()=>{
   const s=window.__perenLab.scene.getScene('ExplorationScene');
   const beast=s.beasts.find(item=>item.type==='mob-galho-infectado');
   s.openEncounter(beast);
  });
  await page.locator('#encounterModal').waitFor({state:'visible'});
  assert.match(await page.locator('#beastName').textContent(),/Galho/i);
  assert.match(await page.locator('#beastClassification').textContent(),/Vegetação/);
  assert.equal(await page.locator('#beastPortrait').evaluate(img=>img.naturalWidth>0),true);
  assert.equal(await page.locator('#observeBeast').isVisible(),true);
  assert.equal(await page.locator('#retreatBeast').isVisible(),true);
  await page.screenshot({path:'screenshots/m1g-e-encontro-'+width+'.png',fullPage:true});
  await page.locator('#observeBeast').click();
  await page.locator('#battleUI').waitFor({state:'visible'});
  await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='active');
  await page.waitForTimeout(250);
  assert.equal(await page.locator('#battleUI [data-battle]').count(),7);
  const bars=await page.evaluate(()=>{
   const v=id=>{const e=document.getElementById(id);return {value:Number(e.getAttribute('aria-valuenow')),
     max:Number(e.getAttribute('aria-valuemax')),w:parseFloat(e.style.width)}};
   return {enemy:v('battleEnemyFill'),hp:v('battleHpFill'),mp:v('battleMpFill'),overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert.ok(bars.enemy.max>0&&bars.hp.max>0&&bars.mp.max>0);
  assert.ok(bars.enemy.w>=0&&bars.enemy.w<=100);
  assert.ok(bars.overflow<=2,'Overflow batalha: '+JSON.stringify(bars));
  const name=await page.locator('#battleMonster').textContent();assert.match(name,/Galho/);
  await page.locator('[data-battle="spell:mag-raio-de-fogo"]').focus();
  assert.match(await page.locator('#battleCommandHint').textContent(),/Raio de Fogo/);
  await page.screenshot({path:'screenshots/m1g-e-combate-'+width+'.png',fullPage:true});
  // Retreat/flee must not create loot, XP or unrelated gold.
  const before=await page.evaluate(()=>window.__perenProgress.save.character);
  await page.locator('[data-battle="flee"]').click();
  await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='fled',{timeout:9000});
  await page.locator('#battleFinish').click();
  await page.locator('#battleUI').waitFor({state:'hidden'});
  const after=await page.evaluate(()=>window.__perenProgress.save.character);
  assert.equal(after.gold,before.gold);assert.equal(after.exp,before.exp);assert.equal(after.kills,before.kills);
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),CLASSIC_KEY),classic);
  const stored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PHASER_KEY);
  assert.equal(stored.character.gold,after.gold);
  assert.deepEqual(errors,[],errors.join(' | '));
  await page.close();
  console.log('M1g-E '+width+'x'+height+' OK: HUD, encontro, combate, fuga, integridade de save');
 }
}finally{await browser?.close();server.kill('SIGTERM');}
