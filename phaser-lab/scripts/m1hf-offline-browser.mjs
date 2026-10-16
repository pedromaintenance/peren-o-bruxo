/**
 * M1h-F Pages PWA: read-only offline regression against a published bundle.
 * Run AFTER the corresponding static Pages bundle is merged into main.
 * No save data from the test is exported.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'https://pedromaintenance.github.io/peren-o-bruxo/phaser-demo-m1hf/';
const requireCompare=process.env.PEREN_QA_REQUIRE_COMPARISON==='1';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[390,844],[1280,800]]){
  const context=await browser.newContext({
   viewport:{width,height},serviceWorkers:'allow',
   permissions:[],ignoreHTTPSErrors:false
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.stack));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','QA-CLASSIC-UNTOUCHED');
   localStorage.setItem('peren_phaser_save_m1d_v1','QA-STABLE-UNTOUCHED');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:60000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,{timeout:30000});
   await page.waitForFunction(async()=>{
    if(!('serviceWorker' in navigator))return false;
    await navigator.serviceWorker.ready;
    return !!navigator.serviceWorker.controller;
   },null,{timeout:90000});
   const setup=await page.evaluate(()=>{
    const game=window.__perenLab,bridge=game.registry.get('progressBridge');
    bridge.execute({type:'selectSeed',seed:'qa-m1hf-offline'});
    return {
     seed:bridge.read().worlds.activeSeed,
     saves:[localStorage.getItem('peren_carcaca_save_v1'),localStorage.getItem('peren_phaser_save_m1d_v1')],
     keys:[],
     hasSW:Boolean(navigator.serviceWorker.controller)
    };
   });
   assert.equal(setup.seed,'qa-m1hf-offline');
   assert.deepEqual(setup.saves,['QA-CLASSIC-UNTOUCHED','QA-STABLE-UNTOUCHED']);
   assert.equal(setup.hasSW,true);
   const cachesBefore=await page.evaluate(()=>caches.keys());
   assert.ok(cachesBefore.some(x=>x.startsWith('peren-phaser-m1hf-preview-')),'Missing scoped M1h-F PWA cache');
   await context.setOffline(true);
   await page.reload({waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,{timeout:35000});
   const offline=await page.evaluate(()=>{
    const game=window.__perenLab,bridge=game.registry.get('progressBridge');
    return {
     online:navigator.onLine,
     seed:bridge.read().worlds.activeSeed,
     classic:localStorage.getItem('peren_carcaca_save_v1'),
     stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
     creatures:['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'].map(id=>game.textures.get(id).frameTotal)
    };
   });
   assert.equal(offline.online,false);
   assert.equal(offline.seed,'qa-m1hf-offline','Offline reload lost current preview state');
   assert.deepEqual([offline.classic,offline.stable],setup.saves);
   assert.ok(offline.creatures.every(count=>count>=28),'Offline monster atlas missing');
   if(requireCompare){
    await page.goto(base+'compare.html',{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>document.getElementById('loadStatus')?.textContent.includes('Dois atlas reais'),null,{timeout:25000});
    const readable=await page.evaluate(()=>{
     const c=document.querySelector('#rightFrame'),data=c.getContext('2d').getImageData(0,0,64,64).data;
     let pixels=0;for(let i=3;i<data.length;i+=4)if(data[i]>0)pixels++;
     return pixels;
    });
    assert.ok(readable>50,'Offline compare view is blank');
   }
   await context.setOffline(false);
   const cached=await page.evaluate(()=>caches.keys());
   assert.ok(cached.every(name=>!name.startsWith('peren-phaser-demo-')||cachesBefore.includes(name)),'Stable demo cache unexpectedly modified');
   assert.deepEqual(errors,[],'Offline console errors: '+errors.join(' | '));
   console.log('PASS M1h-F offline '+width+'×'+height+': cached game, three creatures, save preserved'+(requireCompare?', compare':''));
  }finally{
   await context.setOffline(false).catch(()=>{});
   await context.close();
  }
 }
}finally{await browser.close();}
