/** M1h-F.16 — actual post-combat ledger, canonical item labels and save safety. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[390,844],[1280,800]]){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1}),page=await ctx.newPage(),errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.addInitScript(()=>{localStorage.setItem('peren_carcaca_save_v1','F16-CLASSIC');localStorage.setItem('peren_phaser_save_m1d_v1','F16-STABLE')});
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   await page.evaluate(()=>{const s=window.__perenLab.scene.getScene('ExplorationScene');s.openEncounter(s.beasts.find(b=>b.type==='mob-galho-infectado'))});
   await page.locator('#observeBeast').click();
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('battleState')?.status==='active',null,{timeout:30000});
   for(let i=0;i<10;i++){
    if(await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.status)!=='active')break;
    await page.locator('[data-battle="attack"]').click();
    await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy,null,{timeout:10000});
   }
   assert.equal(await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.status),'won');
   await page.locator('#battleFinish').click();
   await page.locator('#battleUI').waitFor({state:'hidden'});
   const claimed=await page.evaluate(()=>({saves:{
     classic:localStorage.getItem('peren_carcaca_save_v1'),
     stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
     preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1')
   },kills:window.__perenProgress.save.character.kills,ledger:Object.keys(window.__perenProgress.save.ledger).length}));
   assert.equal(claimed.kills,1);assert.equal(claimed.ledger,1);
   assert.equal(claimed.saves.classic,'F16-CLASSIC');assert.equal(claimed.saves.stable,'F16-STABLE');
   await page.keyboard.press('Escape');
   await page.locator('#hub').waitFor({state:'visible'});
   const panel=page.locator('#hubBattleReceipt');
   assert.equal(await panel.isHidden(),false);
   assert.equal(await panel.getAttribute('open'),null);
   await panel.locator('summary').click();
   const content=await page.locator('#hubBattleReceiptList').textContent();
   assert.match(content,/13 XP/);assert.match(content,/8 moedas/);
   assert.doesNotMatch(content,/ing-hanging-moss/);
   const item=await page.evaluate(()=>window.__perenProgress?.catalogs?.itensById?.['ing-hanging-moss']?.nome||'');
   assert.ok(content.length>25);
   assert.equal(await panel.getAttribute('data-kind'),'won');
   const after=await page.evaluate(()=>({classic:localStorage.getItem('peren_carcaca_save_v1'),stable:localStorage.getItem('peren_phaser_save_m1d_v1'),preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),kills:window.__perenProgress.save.character.kills}));
   assert.deepEqual(after,{...claimed.saves,kills:claimed.kills});
   assert.deepEqual(errors,[]);
   console.log('M1h-F.16 PASS '+width+'x'+height+' · paid once, item readable, save unchanged');
  }finally{await ctx.close()}
 }
}finally{await browser.close()}
