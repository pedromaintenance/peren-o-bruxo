/**
 * CI regression reproducing end-of-battle on deployed GitHub Pages.
 * Captures page errors, unhandled promise rejections, UI errors, reward state,
 * successful return to exploration, then reload and persistence.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const monsters=['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'];
const widths=process.env.PEREN_QA_QUICK?[[390,844]]:[[390,844],[1280,800]];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
await mkdir('screenshots',{recursive:true});
let failures=0;
try{
 for(const [width,height] of widths)for(const id of monsters){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push('PAGE '+e.stack));
  page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE '+m.text())});
  page.on('crash',()=>errors.push('PAGE CRASH'));
  await page.addInitScript(()=>{
   window.__qaErrors=[];
   window.addEventListener('unhandledrejection',e=>window.__qaErrors.push('UNHANDLED '+(e.reason?.stack||e.reason)));
   window.addEventListener('error',e=>window.__qaErrors.push('ERROR '+(e.error?.stack||e.message)));
  });
  let state='initial';
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,{timeout:30000});
   await page.locator('#goForest').click();
   await page.waitForFunction(()=>document.querySelector('#hub').hidden===true);
   state='encounter';
   const before=await page.evaluate((monster)=>{
    const game=window.__perenLab,exp=game.scene.getScene('ExplorationScene'),mob=exp.beasts.find(b=>b.type===monster);
    if(!mob)throw Error('Missing monster '+monster);
    exp.openEncounter(mob);
    const b=game.registry.get('progressBridge');
    return { gold:b.read().character.gold,kills:b.read().character.kills,ledger:Object.keys(b.read().ledger).length,
     revision:b.read().revision,key:b.read().worlds.activeSeed,instanceId:mob.instanceId};
   },id);
   await page.locator('#encounterModal').waitFor({state:'visible',timeout:7000});
   await page.locator('#observeBeast').click();
   await page.locator('#battleUI').waitFor({state:'visible',timeout:7000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('battleState')?.status==='active',{timeout:7000});
   state='fight';
   for(let i=0;i<18;i++){
    const b=await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state);
    if(b.status!=='active')break;
    await page.locator('[data-battle="attack"]').click();
    await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy,{timeout:9000});
   }
   const status=await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.status);
   assert.equal(status,'won','Expected normal player victory against '+id+', status '+status);
   if(process.env.PEREN_QA_REQUIRE_M1HF2==='1'){
    const rewardView=await page.locator('#battleRewardPreview').isVisible();
    assert.ok(rewardView,'No reward preview before confirmation');
    assert.match(await page.locator('#battleRewardDetails').textContent(),/XP/);
    assert.match(await page.locator('#battleRewardDetails').textContent(),/moedas/);
   }
   const finished=await page.locator('#battleFinish').isVisible();
   assert.equal(finished,true,'Finish battle button missing');
   await page.screenshot({path:'screenshots/m1hf-qa-before-finish-'+id+'-'+width+'.png',fullPage:true});
   state='finish';
   await page.locator('#battleFinish').click();
   await page.locator('#battleUI').waitFor({state:'hidden',timeout:8000});
   await page.waitForTimeout(250);
   const after=await page.evaluate(()=>{
    const g=window.__perenLab,exp=g.scene.getScene('ExplorationScene'),br=g.registry.get('progressBridge');
    const key=window.__perenProgress.key, save=JSON.parse(localStorage.getItem(key));
    return { controls:!document.querySelector('#controls').hidden,hub:!document.querySelector('#hub').hidden,
      paused:exp.scene.isPaused(),active:exp.scene.isActive(),beasts:exp.beasts.length,
      revision:br.read().revision, gold:br.state.gold, kills:br.state.kills,
      ledgerKeys:Object.keys(br.read().ledger),storedRevision:save?.revision,
      errorText:document.querySelector('#battleJournal')?.textContent,
      feedback:document.querySelector('#feedback')?.textContent,
      errors:window.__qaErrors||[]};
   });
   assert.equal(after.controls,true,'Controls did not return: '+JSON.stringify(after));
   if(process.env.PEREN_QA_REQUIRE_M1HF2==='1')assert.match(after.feedback,/Vitória! \+\d+ XP,/,'Victories must show the confirmed reward in the HUD');
   assert.equal(after.paused,false,'Forest did not resume: '+JSON.stringify(after));
   assert.equal(after.hub,false,'Hub appeared erroneously');
   assert.equal(after.kills,before.kills+1,'Victory not persisted '+JSON.stringify(after));
   assert.ok(after.gold>before.gold,'No victory gold persisted');
   assert.equal(after.storedRevision,after.revision,'Save revision mismatch');
   assert.equal(after.beasts,5,'Defeated mob not removed');
   assert.ok(after.ledgerKeys.length>before.ledger,'Victory ledger missing');
   assert.deepEqual(after.errors,[],'Browser errors: '+JSON.stringify(after.errors));
   assert.deepEqual(errors,[],'Console errors: '+errors.join(' | '));
   state='reload';
   await page.reload({waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,{timeout:30000});
   const reloaded=await page.evaluate(()=>{
    const g=window.__perenLab,br=g.registry.get('progressBridge'),s=g.scene.getScene('ExplorationScene');
    return {revision:br.read().revision,kills:br.state.kills,gold:br.state.gold,beasts:s.beasts.length,
      saveKey:window.__perenProgress.key,errors:window.__qaErrors};
   });
   assert.equal(reloaded.kills,before.kills+1,'Victory vanished on reload');
   assert.equal(reloaded.beasts,5,'Won encounter respawned on reload');
   assert.deepEqual(reloaded.errors,[],'Reload errors');
   assert.deepEqual(errors,[],'Post reload console errors');
   console.log('PASS',width,id,'win/finish/reload',JSON.stringify({before,after,reloaded}));
  }catch(e){
   failures++;
   const diagnostics=await page.evaluate(()=>({
     errors:window.__qaErrors||[],status:window.__perenLab?.registry?.get('battleState'),
     key:window.__perenProgress?.key,storedSave:localStorage.getItem(window.__perenProgress?.key||'peren_phaser_save_m1hf_preview_v1')?.slice(0,400),
     journal:document.querySelector('#battleJournal')?.textContent
   })).catch(err=>({evaluationError:String(err)}));
   console.error('FAIL',width,id,'phase='+state,e.stack,JSON.stringify({errors,diagnostics}));
   await page.screenshot({path:'screenshots/m1hf-qa-error-'+id+'-'+width+'.png',fullPage:true}).catch(()=>{});
  }finally{await context.close();}
 }
}finally{await browser.close();}
assert.equal(failures,0,failures+' M1h-F battle/regression failures');
