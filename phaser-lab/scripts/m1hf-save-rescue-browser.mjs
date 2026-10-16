/**
 * Regression for unreadable M1h-F preview saves. Runs only against a built
 * experimental preview. Does NOT load or alter any user's real save.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[390,844],[1280,800]]){
  for(const scenario of ['invalid','reset','restore','cancel','concurrent']){
   const context=await browser.newContext({viewport:{width,height},acceptDownloads:true,deviceScaleFactor:1});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.stack));
   const bad='DAMAGED_SAVE_NOT_JSON_'+scenario;
   await page.addInitScript(value=>{
    localStorage.setItem('peren_phaser_save_m1hf_preview_v1',value);
    localStorage.setItem('peren_carcaca_save_v1','CLASSIC_MUST_NOT_CHANGE');
    localStorage.setItem('peren_phaser_save_m1d_v1','STABLE_MUST_NOT_CHANGE');
   },bad);
   try{
    await page.goto(base+'?art=m1hf',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#m1hfRecovery').waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('#m1hfRecoveryReset').isDisabled(),true);
    assert.equal(await page.locator('#m1hfRecoveryImport').isDisabled(),true);
    const before=await page.evaluate(()=>({
     damaged:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
     classic:localStorage.getItem('peren_carcaca_save_v1'),
     stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
     hasGame:Boolean(window.__perenLab)
    }));
    assert.equal(before.damaged,bad);assert.equal(before.classic,'CLASSIC_MUST_NOT_CHANGE');
    assert.equal(before.stable,'STABLE_MUST_NOT_CHANGE');assert.equal(before.hasGame,false);
    if(scenario==='invalid'){
     assert.match(await page.locator('#m1hfRecoveryStatus').textContent(),/Baixe primeiro/);
     continue;
    }
    const downloadPromise=page.waitForEvent('download');
    await page.locator('#m1hfRecoveryDownload').click();
    const download=await downloadPromise;
    assert.equal(download.suggestedFilename(),'peren-m1hf-save-danificado.txt');
    const downloadedBody=await (await import('node:fs/promises')).readFile(await download.path(),'utf8');
    assert.equal(downloadedBody,bad);
    assert.equal(await page.locator('#m1hfRecoveryReset').isEnabled(),true);
    if(scenario==='concurrent'){
     await page.evaluate(()=>localStorage.setItem('peren_phaser_save_m1hf_preview_v1','MODIFIED_OTHER_TAB'));
    }
    if(scenario==='restore'){
     const backup=await page.evaluate(async()=>{
      // A valid v2 envelope taken from normal initialization would be accepted by the same validator.
      // We use a read-only fixture generated on this page via the module build's independent run.
      return null;
     });
     // A purpose-built source fixture is fetched from a fresh isolated browser context, not the damaged localStorage.
     const ctx=await browser.newContext();
     const seed=await ctx.newPage();
     await seed.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
     await seed.waitForFunction(()=>window.__perenProgress?.save?.schema===2,{timeout:30000});
     const valid=await seed.evaluate(()=>JSON.stringify(window.__perenProgress.save));
     await ctx.close();
     page.once('dialog',dialog=>dialog.accept());
     await page.locator('#m1hfRecoveryImport').setInputFiles({name:'valid-phaser-v2.json',mimeType:'application/json',buffer:Buffer.from(valid)});
    }else{
     page.once('dialog',dialog=>scenario==='cancel'?dialog.dismiss():dialog.accept());
     await page.locator('#m1hfRecoveryReset').click();
    }
    if(['restore','reset'].includes(scenario)){
     await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,{timeout:30000});
     assert.equal(await page.locator('#m1hfRecovery').count(),0);
     const result=await page.evaluate(()=>({
      key:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
      classic:localStorage.getItem('peren_carcaca_save_v1'),
      stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
      schema:window.__perenProgress.save.schema
     }));
     assert.equal(result.classic,'CLASSIC_MUST_NOT_CHANGE');
     assert.equal(result.stable,'STABLE_MUST_NOT_CHANGE');
     assert.equal(result.schema,2);
     if(scenario==='restore')assert.equal(JSON.parse(result.key).revision,1);
     if(scenario==='reset')assert.equal(result.key,null);
    }else{
     const result=await page.evaluate(()=>({
      key:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
      classic:localStorage.getItem('peren_carcaca_save_v1'),
      stable:localStorage.getItem('peren_phaser_save_m1d_v1')
     }));
     assert.equal(result.key,scenario==='concurrent'?'MODIFIED_OTHER_TAB':bad);
     assert.match(await page.locator('#m1hfRecoveryStatus').textContent(),scenario==='cancel'?/cancelad/i:/outra aba/i);
    }
    assert.deepEqual(errors,[],'Page exceptions: '+errors.join(' | '));
    console.log('PASS M1h-F.4 rescue '+width+'×'+height+' '+scenario);
   }finally{await context.close()}
  }
 }
}finally{await browser.close()}
