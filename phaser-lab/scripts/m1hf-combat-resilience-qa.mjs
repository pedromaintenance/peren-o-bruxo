/** Browser guards against crashes in post-combat teardown and non-victory endings. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const cases=['ui-exception','scene-exception','defeat','flee','double-finish'];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const scenario of cases){
  const ctx=await browser.newContext({viewport:{width:390,height:844}});
  const page=await ctx.newPage();
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,{timeout:30000});
   await page.locator('#goForest').click();
   await page.evaluate(()=>{
     const s=window.__perenLab.scene.getScene('ExplorationScene');
     s.openEncounter(s.beasts.find(b=>b.type==='mob-galho-infectado'));
   });
   await page.locator('#encounterModal').waitFor({state:'visible'});
   await page.locator('#observeBeast').click();
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('battleState')?.status==='active');
   const initial=await page.evaluate(()=>({save:window.__perenProgress.save,kills:window.__perenProgress.save.character.kills}));
   if(scenario==='flee'){
    await page.locator('[data-battle="flee"]').click();
   }else if(scenario==='defeat'){
    await page.evaluate(()=>{window.__perenLab.scene.getScene('BattleScene').state.playerHp=1;});
    await page.locator('[data-battle="defend"]').click();
    await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy,{timeout:10000});
   }else{
    for(let i=0;i<9;i++){
     if(await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.status)!=='active')break;
     await page.locator('[data-battle="attack"]').click();
     await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy,{timeout:9000});
    }
   }
   const expected=scenario==='flee'?'fled':scenario==='defeat'?'lost':'won';
   const current=await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.status);
   assert.equal(current,expected,scenario+' unexpected outcome '+current);
   await page.waitForFunction(()=>!document.querySelector('#battleFinish').hidden,{timeout:7000});
   if(scenario==='ui-exception'){
    // Bad subscriber must not stop scene teardown after the save is committed.
    await page.evaluate(()=>window.__perenLab.events.once('peren-battle-end',()=>{throw Error('QA synthetic UI subscriber failure')}));
   }
   if(scenario==='scene-exception'){
    await page.evaluate(()=>{const s=window.__perenLab.scene.getScene('ExplorationScene');s.finishCombat=()=>{throw Error('QA synthetic exploration transition failure')};});
   }
   await page.locator('#battleFinish').click();
   await page.locator('#battleUI').waitFor({state:'hidden',timeout:7000});
   const data=await page.evaluate(()=>{
    const g=window.__perenLab,s=g.scene.getScene('ExplorationScene'),b=g.scene.getScene('BattleScene'),bridge=g.registry.get('progressBridge'),save=window.__perenProgress.save;
    return {isBattleActive:b.scene.isActive(),resolved:b.resolved,paused:s.scene.isPaused(),active:s.scene.isActive(),
      uiHidden:document.querySelector('#battleUI').hidden,controlsVisible:!document.querySelector('#controls').hidden,
      revision:save.revision,ledger:Object.keys(save.ledger),kills:save.character.kills,
      hp:save.character.hp,orig:save.origin,beasts:s.beasts.length,
      feedback:document.querySelector('#feedback').textContent,
      battleJournal:document.querySelector('#battleJournal').textContent};
   });
   assert.equal(data.isBattleActive,false,'BattleScene did not stop: '+JSON.stringify(data));
   assert.equal(data.paused,false,'Exploration remained paused: '+JSON.stringify(data));
   assert.equal(data.uiHidden,true);
   assert.equal(data.controlsVisible,true);
   assert.equal(data.resolved,true);
   assert.equal(data.revision,1,'No saved transaction');
   assert.equal(data.kills,expected==='won'?initial.kills+1:initial.kills);
   assert.equal(data.ledger.length,expected==='won'?1:0);
   if(scenario==='double-finish'){
    const second=await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').endBattle());
    assert.equal(second,false,'Double completion unexpectedly succeeded');
    assert.equal(await page.evaluate(()=>window.__perenProgress.save.revision),1);
   }
   assert.deepEqual(pageErrors,[],'uncaught error: '+pageErrors.join('|'));
   await page.reload({waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true);
   const reload=await page.evaluate(()=>({kills:window.__perenProgress.save.character.kills,ledger:Object.keys(window.__perenProgress.save.ledger).length}));
   assert.equal(reload.kills,data.kills,'Lost reward or fake victory on reload');
   assert.equal(reload.ledger,data.ledger.length,'Lost ledger or duplicated victory on reload');
   console.log('PASS endbattle resilience',scenario,JSON.stringify(data));
  }finally{await ctx.close();}
 }
}finally{await browser.close();}
