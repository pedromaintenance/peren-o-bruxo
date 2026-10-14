// Browser QA: check real PNG atlas pixels, responsive layout and read-only save behavior.
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const child=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4178','--strictPort'],{stdio:'inherit',cwd:new URL('..',import.meta.url)});
let browser;
try {
  let alive=false;
  for(let i=0;i<75;i++){
    if(child.exitCode!==null)throw new Error('Vite encerrou antes de abrir');
    try{const response=await fetch('http://127.0.0.1:4178/review.html');if(response.ok){alive=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  assert.ok(alive,'Galeria nao respondeu em 4178');
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  await mkdir('screenshots',{recursive:true});
  for(const [width,height] of [[390,844],[1280,800]]){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4178/review.html',{waitUntil:'networkidle'});
    await page.waitForFunction(()=>document.getElementById('status').textContent.includes('Atlas carregado'));
    const pix=await page.evaluate(()=>{
      const c=document.getElementById('frame'),ctx=c.getContext('2d');
      let nonzero=0;for(const a of ctx.getImageData(0,0,c.width,c.height).data.filter((_,i)=>i%4===3))if(a>0)nonzero++;
      return {width:c.width,height:c.height,pixels:nonzero,store:localStorage.length};
    });
    assert.equal(pix.width,48);assert.equal(pix.height,64);assert.ok(pix.pixels>50);assert.equal(pix.store,0);
    await page.selectOption('#action','cast');
    await page.selectOption('#direction','up');
    await page.selectOption('#portraitMode','cast');
    assert.match(await page.locator('#portrait').getAttribute('src'),/portrait-cast.png/);
    await page.screenshot({path:'screenshots/peren-ateliê-'+width+'.png',fullPage:true});
    await page.selectOption('#entity','mob-fungo-violeta');
    await page.waitForFunction(()=>document.getElementById('status').textContent.includes('Atlas carregado'));
    await page.selectOption('#action','alert');
    const mob=await page.evaluate(()=>({w:document.getElementById('frame').width,h:document.getElementById('frame').height,save:localStorage.length}));
    assert.deepEqual(mob,{w:64,h:64,save:0});
    await page.screenshot({path:'screenshots/fungo-ateliê-'+width+'.png',fullPage:true});
    assert.deepEqual(errors,[]);
    await page.close();
    console.log('GALERIA QA '+width+'x'+height+' OK: pixels reais, retratos, quatro frames, sem save');
  }
} finally {
  await browser?.close(); child.kill('SIGTERM');
}
