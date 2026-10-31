/** M1h-F.17 — physical-style mobile viewport checks; not a physical Android certification. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:320,height:700},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','F17-CLASSIC');
   localStorage.setItem('peren_phaser_save_m1d_v1','F17-M1D');
 });
 try{
  await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
  await page.locator('#goForest').click();
  await page.evaluate(()=>{
    const scene=window.__perenLab.scene.getScene('ExplorationScene');
    scene.openEncounter(scene.beasts.find(b=>b.type==='mob-galho-infectado'));
  });
  await page.locator('#observeBeast').click();
  await page.waitForFunction(()=>window.__perenLab?.registry?.get('battleState')?.status==='active',null,{timeout:30000});
  for(let i=0;i<10;i++){
   if(await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.status)!=='active')break;
   await page.locator('[data-battle="attack"]').click();
   await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy,null,{timeout:10000});
  }
  assert.equal(await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.status),'won');
  await page.locator('#battleFinish').click();
  await page.locator('#battleUI').waitFor({state:'hidden',timeout:7000});
  await page.evaluate(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true})));
  await page.locator('#hub').waitFor({state:'visible'});
  const receipt=page.locator('#hubBattleReceipt'),summary=page.locator('#hubBattleReceiptSummary');
  assert.equal(await receipt.isHidden(),false);
  assert.equal(await receipt.getAttribute('open'),null);
  assert.match(await summary.textContent(),/VITÓRIA/);
  const before=await page.evaluate(()=>({
   classic:localStorage.getItem('peren_carcaca_save_v1'),
   stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
   preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
   revision:window.__perenProgress.save.revision,
   ledger:Object.keys(window.__perenProgress.save.ledger).length
  }));
  assert.equal(before.classic,'F17-CLASSIC');assert.equal(before.stable,'F17-M1D');
  assert.equal(before.ledger,1);
  for(const [width,height] of [[320,700],[360,800],[390,844],[844,390]]){
   await page.setViewportSize({width,height});
   await summary.scrollIntoViewIfNeeded();
   const values=await summary.evaluate(node=>{
    const rect=node.getBoundingClientRect(),style=getComputedStyle(node);
    const parent=node.closest('#hubBattleReceipt').getBoundingClientRect();
    return {x:rect.x,right:rect.right,width:rect.width,height:rect.height,font:parseFloat(style.fontSize),parentRight:parent.right};
   });
   assert.ok(values.height>=44,'small touch target '+width+': '+JSON.stringify(values));
   assert.ok(values.font>=14,'small font '+width+': '+JSON.stringify(values));
   assert.ok(values.x>=-1&&values.right<=width+1&&values.parentRight<=width+1,'horizontal overflow '+width+': '+JSON.stringify(values));
   await summary.click();
   assert.equal(await receipt.getAttribute('open'),'');
   const list=page.locator('#hubBattleReceiptList');
   assert.match(await list.textContent(),/13 XP/);
   assert.match(await list.textContent(),/8 moedas/);
   assert.doesNotMatch(await list.textContent(),/ing-hanging-moss/);
   const listFont=await list.locator('li').first().evaluate(node=>parseFloat(getComputedStyle(node).fontSize));
   assert.ok(listFont>=14,'receipt item text too small '+width);
   await summary.click();assert.equal(await receipt.getAttribute('open'),null);
   console.log('F.17 MOBILE PASS '+width+'x'+height+' · tap, font, viewport, reward labels');
  }
  await summary.focus();await page.keyboard.press('Enter');
  assert.equal(await receipt.getAttribute('open'),'','keyboard disclosure');
  const after=await page.evaluate(()=>({
   classic:localStorage.getItem('peren_carcaca_save_v1'),
   stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
   preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
   revision:window.__perenProgress.save.revision,
   ledger:Object.keys(window.__perenProgress.save.ledger).length
  }));
  assert.deepEqual(after,before,'UI toggles must never change saves');
  assert.deepEqual(errors,[]);
 }finally{await context.close()}
}finally{await browser.close()}
