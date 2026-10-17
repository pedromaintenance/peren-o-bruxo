import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
await mkdir('screenshots',{recursive:true});
const ids=['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'];
const actions=['idle','walk','alert','attack','hurt','retreat','death'];
try{
 for(const [width,height] of [[390,844],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,acceptDownloads:true});
  const page=await context.newPage();
  const errors=[],badFiles=[];
  page.on('pageerror',e=>errors.push(e.stack));
  page.on('response',r=>{
   if(r.status()>=400&&/art-m1h(e|f)\/monsters\/|compare\.html/.test(r.url()))
    badFiles.push(r.status()+' '+r.url());
  });
  await page.addInitScript(()=>localStorage.setItem('peren_phaser_save_m1hf_preview_v1','QA-SAVE-MUST-STAY'));
  await page.goto(base+'compare.html',{waitUntil:'networkidle',timeout:30000});
  for(const monster of ids){
   await page.locator('#monster').selectOption(monster);
   await page.waitForFunction(()=>document.getElementById('loadStatus')?.textContent.includes('Dois atlas reais'),{timeout:15000});
   await page.locator('#toggle').evaluate(el=>{if(el.getAttribute('aria-pressed')==='true')el.click()});
   for(const action of actions){
    await page.locator('#action').selectOption(action);
    const state=await page.evaluate(()=>{
     const names=['left','right'];
     return names.map(name=>{
      const c=document.getElementById(name+'Frame'),a=c.getContext('2d').getImageData(0,0,64,64).data;
      let visible=0;for(let i=3;i<a.length;i+=4)if(a[i]>0)visible++;
      return {pixels:visible,text:document.getElementById(name+'Stat').textContent,frames:document.getElementById(name+'Strip').children.length};
     });
    });
    for(const item of state){
     assert.ok(item.pixels>50,monster+' '+action+' blank frame '+JSON.stringify(state));
     assert.match(item.text,/4 quadros distintos/);
     assert.equal(item.frames,4);
    }
   }
   await page.locator('#action').selectOption('attack');
   await page.locator('#next').click();
   assert.match(await page.locator('#frameInfo').textContent(),/Quadro 2 de 4/);
   await page.locator('#previous').click();
   assert.match(await page.locator('#frameInfo').textContent(),/Quadro 1 de 4/);
   assert.equal(await page.locator('#toggle').getAttribute('aria-pressed'),'false');
   await page.screenshot({path:'screenshots/m1hf-compare-'+monster+'-'+width+'.png',fullPage:true});
  }
  await page.locator('#monster').selectOption('mob-ettercap');
  await page.locator('#action').selectOption('hurt');
  await page.locator('#verdict').selectOption('M1h-F');
  await page.locator('[data-criterion]').first().check();
  await page.locator('#reviewNotes').fill('Precisa de mais contraste nas mandíbulas.');
  const dl=page.waitForEvent('download');
  await page.locator('#downloadFeedback').click();
  const item=await dl;
  assert.equal(item.suggestedFilename(),'peren-revisao-mob-ettercap.md');
  const report=await page.evaluate(()=>{
   const saved=localStorage.getItem('peren_phaser_save_m1hf_preview_v1');
   const text=document.getElementById('reviewNotes').value;
   return {saved,review:text,frame:document.getElementById('frameInfo').textContent};
  });
  assert.equal(report.saved,'QA-SAVE-MUST-STAY','compare tool mutated test save');
  assert.match(report.review,/contraste nas mandíbulas/);
  assert.deepEqual(errors,[],'Page errors '+errors.join('|'));
  assert.deepEqual(badFiles,[],'Failed assets '+badFiles.join('|'));
  console.log('PASS M1h-F.3 comparison',width,height,'21 actions, 2 atlases, synced frame, export, save unchanged');
  await context.close();
 }
}finally{await browser.close();}
