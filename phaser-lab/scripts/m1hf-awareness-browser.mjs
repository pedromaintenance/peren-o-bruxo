/**
 * M1h-F.8 Pages/Chromium acceptance: optional field awareness uses only
 * runtime signals; the classic/stable/preview save must remain unchanged.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height},acceptDownloads:true,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','FIELD-QA-CLASSIC-UNTOUCHED');
   localStorage.setItem('peren_phaser_save_m1d_v1','FIELD-QA-M1D-UNTOUCHED');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   const cue=page.locator('#fieldAwareness');
   await cue.waitFor({state:'visible',timeout:7000});
   // Freeze AI only inside this synthetic HUD test to avoid frame races.
   await page.evaluate(()=>window.__perenLab.scene.pause('ExplorationScene'));
   const original=await page.evaluate(()=>({
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1')
   }));
   const simulate=async flags=>{
    await page.evaluate(flags=>{
     const game=window.__perenLab;
     game.registry.set('fieldSignals',flags);
     game.events.emit('step');
    },flags);
   };
   await simulate({cover:true,wet:true,weather:'neblina',sprint:false,detected:0,investigating:0});
   assert.equal(await cue.getAttribute('data-state'),'quiet');
   assert.match(await page.locator('#fieldAwarenessTitle').textContent(),/SOB COBERTURA/);
   assert.match(await page.locator('#fieldAwarenessDetail').textContent(),/Névoa/);
   await simulate({cover:true,sprint:true,weather:'neblina',detected:0,investigating:0});
   assert.equal(await cue.getAttribute('data-state'),'warning');
   assert.match(await page.locator('#fieldAwarenessDetail').textContent(),/Corrida/);
   await simulate({cover:true,sprint:false,weather:'sereno',detected:1,investigating:0});
   assert.equal(await cue.getAttribute('data-state'),'danger');
   assert.match(await page.locator('#fieldAwarenessTitle').textContent(),/CAÇADO/);
   await simulate({cover:false,sprint:false,weather:'sereno',detected:0,investigating:1});
   assert.match(await page.locator('#fieldAwarenessTitle').textContent(),/RASTROS RECENTES/);
   const bounds=await cue.boundingBox();
   assert.ok(bounds&&bounds.width>80&&bounds.x>=0&&bounds.x+bounds.width<=width+2,'Indicador cortado no viewport '+width);
   const after=await page.evaluate(()=>({
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1')
   }));
   assert.deepEqual(after,original,'Indicador gravou ou alterou um save');
   assert.deepEqual(errors,[],'Erros de navegador');
   console.log('M1h-F.8 '+width+'×'+height+' OK: cover, sprint, chase, investigate, viewport e saves');
  }finally{await context.close()}
 }
}finally{await browser.close()}
