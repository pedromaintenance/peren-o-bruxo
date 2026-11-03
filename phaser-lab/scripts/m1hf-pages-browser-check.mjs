/**
 * Browser regression for the isolated GitHub Pages M1h-F build.
 * Runs against dist/ after PEREN_M1HF_PAGES_PREVIEW=1 prepare-demo.mjs.
 * Intentionally preloads invalid classic/stable saves: preview may neither parse nor modify them.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[390,844],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','DO-NOT-READ-OR-OVERWRITE-CLASSIC');
   localStorage.setItem('peren_phaser_save_m1d_v1','DO-NOT-READ-OR-OVERWRITE-STABLE-DEMO');
  });
  await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,{timeout:30000});
  assert.equal(await page.locator('#m1hfPreviewNote').count(),1,'Missing explicit Pages preview marker');
  assert.match(await page.locator('#hubStatus').textContent(),/M1h-F/);
  assert.equal(await page.locator('#m1hfDiagCopy').count(),1);
  assert.equal(await page.locator('#m1hfDiagSave').count(),1);
  const metadata=await page.evaluate(()=>window.__perenDiagnostics?.report());
  assert.equal(metadata.format,'peren-m1hf-diagnostic-v1');
  assert.equal(metadata.progress.origin,'m1hf-preview');
  assert.ok(!JSON.stringify(metadata).includes('DO-NOT-READ-OR-OVERWRITE-CLASSIC'));
  const downloadEvent=page.waitForEvent('download');
  await page.locator('#m1hfDiagSave').click();
  const diagnosticDownload=await downloadEvent;
  assert.equal(diagnosticDownload.suggestedFilename(),'peren-m1hf-diagnostico.json');
  const stage=await page.evaluate(()=>{
   const game=window.__perenLab;
   const bridge=game.registry.get('progressBridge');
   const before={origin:bridge.read().origin,gold:bridge.read().character.gold};
   bridge.execute({type:'selectSeed',seed:'qa-m1hf-pages'});
   return {
    ...before,classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    sandbox:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    monsters:['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'].map(id=>
      ({id,frames:game.textures.get(id).frameTotal}))
   };
  });
  assert.equal(stage.origin,'m1hf-preview','Preview must not import the classic save');
  assert.equal(stage.classic,'DO-NOT-READ-OR-OVERWRITE-CLASSIC');
  assert.equal(stage.stable,'DO-NOT-READ-OR-OVERWRITE-STABLE-DEMO');
  assert.ok(stage.sandbox,'No separate test save was produced');
  assert.equal(JSON.parse(stage.sandbox).worlds.activeSeed,'qa-m1hf-pages');
  assert.ok(stage.monsters.every(x=>x.frames>=28),'Three 28-frame monster atlases required');
  // M1h-F.7: real in-game manual is a read-only preview screen.
  assert.equal(await page.locator('#showGuide').isVisible(),true);
  const saveBeforeGuide=await page.evaluate(()=>localStorage.getItem('peren_phaser_save_m1hf_preview_v1'));
  await page.locator('#showGuide').click();
  assert.equal(await page.locator('#guideUI').isVisible(),true);
  assert.equal(await page.locator('#hub').getAttribute('inert'),'');
  assert.equal(await page.locator('#guideTabs button').count(),4);
  await page.locator('#guideTabs [data-guide-section="seguranca"]').click();
  assert.match(await page.locator('#guideContent').textContent(),/Backup/);
  assert.equal(await page.locator('#guideContent a[href="./teste.html"]').count(),1);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#guideUI').isVisible(),false);
  assert.equal(await page.locator('#hub').getAttribute('inert'),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('peren_phaser_save_m1hf_preview_v1')),saveBeforeGuide,'Manual alterou progresso');
  const link=await page.locator('#m1hfPreviewNote').getAttribute('href');
  assert.equal(link,'./review.html?art=m1hf');
  await page.locator('#goForest').click();
  await page.keyboard.press('Escape');
  await page.locator('#hub').waitFor({state:'visible',timeout:7000});
  assert.match(await page.locator('#hubStatus').textContent(),/PRÉVIA M1h-F/);
  await page.goto(base+'review.html?art=m1hf',{waitUntil:'networkidle',timeout:30000});
  await page.locator('#entity').selectOption('mob-fungo-violeta');
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.startsWith('Atlas carregado'),{timeout:10000});
  assert.deepEqual(errors,[],'Runtime errors: '+errors.join('; '));
  await context.close();
  console.log('M1h-F Pages '+width+'×'+height+' OK: 3 atlases, isolated preview save, review page.');
 }
}finally{await browser.close();}
