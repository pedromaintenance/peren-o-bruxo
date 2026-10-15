// Headless UI QA for the three art variants. Requires Vite build and Chromium.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {CLASSIC_KEY,newClassicState} from '../src/progress.js';
const port=4195,base='http://127.0.0.1:'+port+'/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],
 {cwd:new URL('..',import.meta.url),stdio:'inherit'});
let browser;
try{
 let online=false;
 for(let i=0;i<90;i++){
  try{if((await fetch(base)).ok){online=true;break}}catch{}
  if(server.exitCode!==null)break;
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 assert.ok(online,'Vite preview indisponível');
 await mkdir('screenshots',{recursive:true});
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  for(const art of ['m1e','m1h','m1hb','m1hc','m1hd','m1he']){
   const page=await browser.newPage({viewport:{width,height},hasTouch:width<500,isMobile:width<500});
   const errors=[],requests=[];page.on('pageerror',error=>errors.push(error.message));
   page.on('request',req=>{if(req.url().includes('peren-atlas.png'))requests.push(req.url());});
   const classic={...newClassicState(),gold:845,day:5};
   await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:CLASSIC_KEY,value:classic});
   await page.goto(base+(art==='m1e'?'':'?art='+art),{waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__perenProgress?.save&&window.__perenLab?.registry?.get('ready'));
   const folder=({'m1e':'art','m1h':'art-m1h','m1hb':'art-m1hb','m1hc':'art-m1hc','m1hd':'art-m1hd','m1he':'art-m1he'})[art];
   const src=await page.locator('img[src$="portrait.png"]').first().getAttribute('src');
   assert.ok(src?.includes(folder+'/characters/peren/'),art+' portrait is wrong '+src);
   assert.equal(await page.locator('img[src$="portrait.png"]').first().evaluate(img=>img.naturalWidth>0),true);
   await page.screenshot({path:'screenshots/m1h-e-cidade-'+art+'-'+width+'.png',fullPage:true});
   await page.locator('#goForest').click();
   await page.locator('#hub').waitFor({state:'hidden'});
   await page.waitForFunction(()=>window.__perenLab.scene.getScene('ExplorationScene').scene.isActive());
   assert.ok(requests.some(req=>req.includes('/'+folder+'/characters/peren/peren-atlas.png')),
     art+' atlas request missing '+JSON.stringify(requests));
   await page.screenshot({path:'screenshots/m1h-e-floresta-'+art+'-'+width+'.png',fullPage:true});
   await page.evaluate(()=>{
    const scene=window.__perenLab.scene.getScene('ExplorationScene');
    const beast=scene.beasts.find(b=>b.type==='mob-galho-infectado');
    scene.openEncounter(beast);
   });
   await page.locator('#encounterModal').waitFor({state:'visible'});
   await page.locator('#observeBeast').click();
   await page.locator('#battleUI').waitFor({state:'visible'});
   await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='active');
   await page.screenshot({path:'screenshots/m1h-e-batalha-'+art+'-'+width+'.png',fullPage:true});
   await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy);
   await page.locator('[data-battle="flee"]').click();
   await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='fled');
   await page.locator('#battleFinish').click();
   assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),CLASSIC_KEY),classic);
   assert.deepEqual(errors,[],errors.join('|'));
   await page.close();
  }
  const gallery=await browser.newPage({viewport:{width,height}});
  const errs=[];gallery.on('pageerror',e=>errs.push(e.message));
  await gallery.goto(base+'review.html?art=m1he',{waitUntil:'networkidle'});
  await gallery.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Atlas carregado'));
  assert.equal(await gallery.locator('#perenVariant').inputValue(),'m1he');
  for(const direction of ['down','left','right','up']){
   await gallery.locator('#direction').selectOption(direction);
   for(const action of ['idle','walk','run','interact','gather','hurt','cast','attack']){
    await gallery.locator('#action').selectOption(action);
    assert.equal(await gallery.locator('#frame').evaluate(c=>c.width),48);
   }
  }
  for(const portrait of ['neutral','cast','hurt']){
   await gallery.locator('#portraitMode').selectOption(portrait);
   const expected='portrait'+(portrait==='neutral'?'':'-'+portrait)+'.png';
   assert.match(await gallery.locator('#portrait').getAttribute('src'),new RegExp('art-m1he/.+'+expected.replace('.','\\.')+'$'));
  }
  await gallery.screenshot({path:'screenshots/m1h-e-atelie-'+width+'.png',fullPage:true});
  assert.deepEqual(errs,[]);
  await gallery.close();
  console.log('M1h-E '+width+'x'+height+' OK: 6 modos, floresta, batalha, 32 clips, retratos, save');
 }
}finally{await browser?.close();server.kill('SIGTERM');}
