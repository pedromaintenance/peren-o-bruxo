// M1h-A: visual and runtime candidate comparison; no art approval inferred.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {CLASSIC_KEY,newClassicState} from '../src/progress.js';

const port=4193,base='http://127.0.0.1:'+port+'/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],
 {cwd:new URL('..',import.meta.url),stdio:'inherit'});
let browser;
try{
 let online=false;
 for(let i=0;i<85;i++){
  if(server.exitCode!==null)throw Error('Preview encerrou');
  try{if((await fetch(base)).ok){online=true;break}}catch{}
  await new Promise(resolve=>setTimeout(resolve,160));
 }
 assert.ok(online,'Vite preview indisponível');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await mkdir('screenshots',{recursive:true});
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  for(const variant of ['m1e','m1h']){
   const page=await browser.newPage({viewport:{width,height},hasTouch:width<500,isMobile:width<500});
   const errors=[],loadedAssets=[];page.on('pageerror',e=>errors.push(e.message));
   page.on('request',request=>{if(request.url().includes('peren-atlas.png'))loadedAssets.push(request.url());});
   const classic={...newClassicState(),gold:412};
   await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:CLASSIC_KEY,value:classic});
   await page.goto(base+(variant==='m1h'?'?art=m1h':''),{waitUntil:'networkidle'});
   await page.waitForFunction(()=>!!window.__perenProgress?.save&&window.__perenLab?.registry?.get('ready'));
   const original=variant==='m1e';
   const imageRoot=original?'art/characters/peren/':'art-m1h/characters/peren/';
   await page.waitForFunction(root=>document.querySelector('img[src$="portrait.png"]')?.complete&&document.querySelector('img[src$="portrait.png"]')?.naturalWidth>0,imageRoot);
   const portraits=await page.locator('img[src$="portrait.png"]').evaluateAll(images=>images.map(img=>img.src));
   assert.ok(portraits.length>0);
   assert.ok(portraits.every(url=>url.includes(imageRoot)),variant+': wrong portrait source '+portraits);
   await page.screenshot({path:'screenshots/m1h-a-portomonte-'+variant+'-'+width+'.png',fullPage:true});
   await page.locator('#goForest').click();
   await page.locator('#hub').waitFor({state:'hidden'});
   await page.waitForFunction(()=>window.__perenLab.scene.getScene('ExplorationScene').scene.isActive());
   assert.ok(loadedAssets.some(url=>url.includes('/'+imageRoot+'peren-atlas.png')),
     'Texture must fetch '+imageRoot+'peren-atlas.png. Actual requests: '+loadedAssets.join(', '));
   await page.screenshot({path:'screenshots/m1h-a-floresta-'+variant+'-'+width+'.png',fullPage:true});
   assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),CLASSIC_KEY),classic);
   assert.deepEqual(errors,[]);
   await page.close();
  }
  const review=await browser.newPage({viewport:{width,height}});
  const errors=[];review.on('pageerror',e=>errors.push(e.message));
  await review.goto(base+'review.html?art=m1h',{waitUntil:'networkidle'});
  await review.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Atlas carregado'));
  assert.equal(await review.locator('#perenVariant').inputValue(),'m1h');
  await review.locator('#portraitMode').selectOption('cast');
  assert.match(await review.locator('#portrait').getAttribute('src'),/art-m1h\/characters\/peren\/portrait-cast\.png/);
  await review.screenshot({path:'screenshots/m1h-a-atelie-prateado-'+width+'.png',fullPage:true});
  await review.locator('#perenVariant').selectOption('m1e');
  await review.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Atlas carregado'));
  assert.match(await review.locator('#portrait').getAttribute('src'),/\/art\/characters\/peren\/portrait-cast\.png/);
  assert.deepEqual(errors,[]);
  await review.close();
  console.log('M1h-A '+width+'x'+height+' OK: atlases/retratos separados, gallery e jogo funcionais');
 }
}finally{await browser?.close();server.kill('SIGTERM');}
