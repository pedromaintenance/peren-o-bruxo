/** M1h-F.15: actual adapter exercised with synthetic browser Gamepad API. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','F15-CLASSIC');
   localStorage.setItem('peren_phaser_save_m1d_v1','F15-STABLE');
   localStorage.setItem('peren_phaser_save_m1hf_preview_v1','F15-PREVIEW');
   Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>window.__padTest||[]});
  });
  try{
   await page.goto(base+'teste.html',{waitUntil:'networkidle',timeout:30000});
   const before=await page.evaluate(()=>Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
   assert.match(await page.locator('#padStatus').textContent(),/não detectado/i);
   await page.evaluate(()=>{
    const buttons=Array.from({length:17},()=>({pressed:false,value:0}));
    buttons[0]={pressed:true,value:1}; // A
    buttons[7]={pressed:true,value:1}; // RT sprint
    window.__padTest=[{connected:true,mapping:'standard',id:'Xbox QA',index:0,axes:[0.8,-0.5,0,0],buttons}];
   });
   await page.locator('#padRefresh').click();
   assert.match(await page.locator('#padStatus').textContent(),/Controle detectado/);
   assert.match(await page.locator('#padIdentity').textContent(),/Xbox QA/);
   assert.match(await page.locator('#padMovement').textContent(),/horizontal/);
   assert.match(await page.locator('#padSprint').textContent(),/CORRENDO/);
   assert.equal(await page.locator('[data-pad-key="a"]').getAttribute('data-active'),'true');
   const bounds=await page.locator('#padLab').boundingBox();
   assert.ok(bounds&&bounds.x>=0&&bounds.width>0&&bounds.x+bounds.width<=width+2,'panel overflow '+width);
   await page.evaluate(()=>{window.__padTest=[]});
   await page.locator('#padRefresh').click();
   assert.match(await page.locator('#padStatus').textContent(),/não detectado/);
   assert.equal(await page.locator('[data-pad-key="a"]').getAttribute('data-active'),'false');
   const after=await page.evaluate(()=>Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));
   assert.deepEqual(after,before,'hardware laboratory modified a save');
   assert.deepEqual(errors,[],'unexpected browser errors');
   console.log('M1h-F.15 PASS '+width+'x'+height+': mapping, analog, sprint, disconnect, saves');
  }finally{await context.close()}
 }
}finally{await browser.close()}
