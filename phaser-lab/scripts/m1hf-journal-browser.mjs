import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[390,844],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height},acceptDownloads:true,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.stack));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','UNTOUCHED-CLASSIC');
   localStorage.setItem('peren_phaser_save_m1d_v1','UNTOUCHED-STABLE');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   assert.equal(await page.locator('#showJournal').isVisible(),true);
   await page.locator('#showJournal').click();
   await page.locator('#journalUI').waitFor({state:'visible'});
   assert.equal(await page.locator('#hub').getAttribute('inert'),'');
   assert.match(await page.locator('#journalCount').textContent(),/0 transações recentes/);
   assert.match(await page.locator('#journalEntries').textContent(),/Ainda não há registros/);
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#journalUI').isVisible(),false);
   assert.equal(await page.locator('#hub').getAttribute('inert'),null);
   const t=await page.evaluate(()=>{
    const b=window.__perenLab.registry.get('progressBridge');
    b.execute({type:'endDay'});
    b.execute({type:'buy',id:'mat-agua-purificada'});
    b.execute({type:'selectSeed',seed:'murin-qa-journal'});
    return {after:JSON.stringify(b.read()),stored:localStorage.getItem(window.__perenProgress.key)};
   });
   assert.equal(t.after,t.stored);
   await page.locator('#showJournal').click();
   assert.match(await page.locator('#journalCount').textContent(),/3 transações recentes/);
   const events=page.locator('#journalEntries .journal-entry');
   assert.equal(await events.count(),3);
   assert.match(await events.first().textContent(),/Nova rota/);
   await page.locator('#journalTabs [data-category="trade"]').click();
   assert.equal(await page.locator('#journalEntries .journal-entry').count(),1);
   assert.match(await page.locator('#journalEntries').textContent(),/Compra/);
   await page.locator('#journalSearch').fill('purificada');
   assert.equal(await page.locator('#journalEntries .journal-entry').count(),1);
   await page.locator('#journalSearch').fill('não existe');
   assert.match(await page.locator('#journalEntries').textContent(),/Nenhum registro corresponde/);
   await page.locator('#journalTabs [data-category="chronicle"]').click();
   await page.locator('#journalSearch').fill('');
   assert.ok(await page.locator('#journalEntries .journal-entry').count()>=2);
   assert.match(await page.locator('#journalEntries').textContent(),/novo dia amanhece/i);
   const download=page.waitForEvent('download');
   await page.locator('#journalExport').click();
   const dl=await download;
   assert.equal(dl.suggestedFilename(),'peren-m1hf-diario-dia-2.md');
   const raw=await readFile(await dl.path(),'utf8');
   assert.match(raw,/Registro 2 · Compra/);
   assert.match(raw,/murin-qa-journal/);
   const after=await page.evaluate(()=>({
    stored:localStorage.getItem(window.__perenProgress.key),
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1')
   }));
   assert.equal(after.stored,t.stored,'Journal read or export changed stored save');
   assert.equal(after.classic,'UNTOUCHED-CLASSIC');
   assert.equal(after.stable,'UNTOUCHED-STABLE');
   await page.locator('#journalClose').click();
   assert.equal(await page.locator('#journalUI').isVisible(),false);
   assert.deepEqual(errors,[]);
   console.log('PASS M1h-F.5 journal '+width+'×'+height+' read-only, categories, search, export and keyboard');
  }finally{await context.close()}
 }
}finally{await browser.close()}
