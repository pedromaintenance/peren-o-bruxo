// Browser QA: recipe/craft workflow, responsive UI, xbox button edges, save isolation.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {CLASSIC_KEY,PHASER_KEY,newClassicState} from '../src/progress.js';
const port='4183',base='http://127.0.0.1:'+port+'/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',port,'--strictPort'],{cwd:new URL('..',import.meta.url),stdio:'inherit'});
let browser;
try{
 let live=false;
 for(let n=0;n<90;n++){
   if(server.exitCode!==null)throw Error('Vite preview encerrou');
   try{const response=await fetch(base);if(response.ok){live=true;break}}catch{}
   await new Promise(resolve=>setTimeout(resolve,200));
 }
 assert.ok(live,'Servidor Vite indisponível');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await mkdir('screenshots',{recursive:true});
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,hasTouch:width<500,isMobile:width<500});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const classic={...newClassicState(),gold:812,day:3};
  await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:CLASSIC_KEY,value:classic});
  if(width===390)await page.addInitScript(()=>{
    window.__testXbox={id:'Xbox Wireless Controller (mock)',index:0,mapping:'standard',connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};
    Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[window.__testXbox]});
  });
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.__perenProgress?.save&&window.__perenLab?.registry?.get('ready'));
  await page.locator('#showCraft').click();
  await page.locator('#craftUI').waitFor({state:'visible'});
  const screen=page.locator('#craftUI');
  assert.ok((await page.locator('#craftList .craft-recipe').count())>0);
  assert.equal(await page.locator('#craftActions').textContent(),'3 ações');
  const overflow=await page.evaluate(()=>({screen:document.getElementById('craftUI').scrollWidth,viewport:innerWidth,document:document.documentElement.scrollWidth}));
  assert.ok(overflow.screen<=width+2,'Overflow na oficina: '+JSON.stringify(overflow));
  const scene=await page.evaluate(async()=>{const i=new Image();i.src='./scenes/portomonte-workshop.svg';await i.decode();return {w:i.naturalWidth,h:i.naturalHeight}});
  assert.ok(scene.w>=800&&scene.h>=500,'Arte de oficina não carregou: '+JSON.stringify(scene));
  await page.screenshot({path:'screenshots/alquimia-m1g-'+width+'.png',fullPage:true});
  const first=await page.locator('#craftSelectedName').textContent();
  const initial=await page.evaluate(()=>window.__perenProgress.save.character);
  const materials=await page.locator('.craft-ingredient').allTextContents();
  assert.ok(first.length>2&&materials.length>0,'Detalhes da receita ausentes');
  await page.locator('#craftMake').click();
  const after=await page.evaluate(()=>window.__perenProgress.save.character);
  assert.equal(after.crafted,initial.crafted+1,'Criação não registrada uma única vez');
  assert.equal(after.actions,initial.actions-1,'Uma ação não foi consumida');
  assert.match(await page.locator('#craftFeedback').textContent(),/Criado:/);
  assert.equal(await page.locator('#craftActions').textContent(),'2 ações');
  const persist=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),PHASER_KEY);
  assert.equal(persist.character.crafted,after.crafted);
  // Search is presentation only: no save mutation.
  await page.locator('#craftSearch').fill('termo-inexistente-xyz');
  assert.equal(await page.locator('#craftList .craft-recipe').count(),0);
  assert.equal(await page.locator('#craftMake').isDisabled(),true);
  await page.locator('#craftSearch').fill('');
  const firstStation=await page.locator('[data-station]:not([data-station="all"])').first().getAttribute('data-station');
  await page.locator('[data-station="'+firstStation+'"]').click();
  assert.equal(await page.locator('[data-station="'+firstStation+'"]').getAttribute('aria-pressed'),'true');
  await page.keyboard.press('Escape');await screen.waitFor({state:'hidden'});
  if(width===390){
   await page.waitForFunction(()=>document.querySelector('#gamepad-status').textContent.includes('Xbox Wireless'));
   // Hub focus index zero=Forest, index 1=Craft; use standard D-pad + A
   await page.evaluate(()=>{window.__testXbox.buttons[13]={pressed:true,value:1}});
   await page.waitForTimeout(140);
   await page.evaluate(()=>{window.__testXbox.buttons[13]={pressed:false,value:0}});
   await page.waitForTimeout(130);
   await page.evaluate(()=>{window.__testXbox.buttons[0]={pressed:true,value:1}});
   await screen.waitFor({state:'visible',timeout:8000});
   await page.evaluate(()=>{window.__testXbox.buttons[0]={pressed:false,value:0}});
   await page.waitForTimeout(130);
   await page.evaluate(()=>{window.__testXbox.buttons[2]={pressed:true,value:1}});
   await page.waitForFunction(()=>document.querySelector('[data-station]:not([data-station="all"])[aria-pressed="true"]'),{timeout:8000});
   await page.evaluate(()=>{window.__testXbox.buttons[2]={pressed:false,value:0}});
   await page.waitForTimeout(130);
   await page.evaluate(()=>{window.__testXbox.buttons[1]={pressed:true,value:1}});
   await screen.waitFor({state:'hidden',timeout:8000});
   await page.evaluate(()=>{window.__testXbox.buttons[1]={pressed:false,value:0}});
  }
  assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),CLASSIC_KEY),classic,'Save clássico modificado');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>!!window.__perenProgress?.save);
  assert.equal(await page.evaluate(()=>window.__perenProgress.save.character.crafted),after.crafted,'Craft não persistiu em reload');
  assert.equal(await page.evaluate(()=>window.__perenProgress.save.character.actions),after.actions);
  assert.deepEqual(errors,[],errors.join(' | '));
  await page.close();
  console.log('M1g-C '+width+'x'+height+' OK: receita/ingredientes reais, uma transação, cena SVG, Xbox e saves');
 }
}finally{await browser?.close();server.kill('SIGTERM');}
