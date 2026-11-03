// M1g-B: real Chromium screenshots and keyboard/Xbox save-safety smoke.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {CLASSIC_KEY,PHASER_KEY,newClassicState} from '../src/progress.js';
const port='4181',base='http://127.0.0.1:'+port+'/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',port,'--strictPort'],
 {cwd:new URL('..',import.meta.url),stdio:'inherit'});
let browser;
try{
 let ok=false;
 for(let i=0;i<90;i++){
  if(server.exitCode!==null)throw Error('Vite preview encerrou');
  try{const res=await fetch(base);if(res.ok){ok=true;break}}catch{}
  await new Promise(resolve=>setTimeout(resolve,200));
 }
 assert.ok(ok,'Vite preview não iniciou');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await mkdir('screenshots',{recursive:true});
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<500,isMobile:width<500,deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const classic={...newClassicState(),gold:641,day:5};
  await page.addInitScript(({key,data})=>localStorage.setItem(key,JSON.stringify(data)),{key:CLASSIC_KEY,data:classic});
  if(width===390)await page.addInitScript(()=>{
    window.__testXbox={id:'Xbox Wireless Controller (mock)',index:0,connected:true,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};
    Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[window.__testXbox]});
  });
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>!!window.__perenProgress?.save&&window.__perenLab?.registry?.get('ready'));
  await page.locator('#openBagHub').click();
  const screen=page.locator('#inventoryUI');
  await screen.waitFor({state:'visible'});
  assert.equal(await page.locator('#bagPanel').isVisible(),false);
  assert.equal(await page.locator('#invGold').textContent(),'641');
  assert.match(await page.locator('#invLevel').textContent(),/Nível 1/);
  assert.match(await page.locator('#invEquipment').textContent(),/Arma/);
  assert.match(await page.locator('#invEquipment').textContent(),/Armadura/);
  assert.match(await page.locator('#invEquipment').textContent(),/Relíquia/);
  const totals=await page.evaluate(()=>{
    const inv=document.getElementById('inventoryUI');
    return {scroll:inv.scrollWidth,viewport:window.innerWidth,real:document.getElementById('invGrid').querySelectorAll('button').length};
  });
  assert.ok(totals.scroll<=width+2,'Overflow horizontal no inventário: '+JSON.stringify(totals));
  assert.ok(totals.real>=10,'Itens reais não foram carregados: '+totals.real);
  await page.screenshot({path:'screenshots/inventario-m1g-'+width+'.png',fullPage:true});
  await page.locator('[data-category="ingredient"]').click();
  assert.ok(await page.locator('#invGrid button').count()>=3);
  await page.locator('#invSearch').fill('montanha');
  assert.ok(await page.locator('#invGrid button').count()>=1,'Busca não encontrou itens reais');
  await page.locator('#invGrid button').first().click();
  assert.ok((await page.locator('#invSelectedName').textContent()).length>2);
  await page.locator('#invSearch').fill('');
  await page.keyboard.press('Escape');
  await screen.waitFor({state:'hidden'});
  if(width===390){
    await page.waitForFunction(()=>document.querySelector('#gamepad-status').textContent.includes('Xbox Wireless'));
    await page.evaluate(()=>{window.__testXbox.buttons[3]={pressed:true,value:1}});
    await screen.waitFor({state:'visible',timeout:6000});
    await page.evaluate(()=>{window.__testXbox.buttons[3]={pressed:false,value:0}});
    await page.waitForTimeout(130);
    await page.evaluate(()=>{window.__testXbox.buttons[2]={pressed:true,value:1}});
    await page.waitForFunction(()=>!!document.querySelector('[data-category="equipment"].is-active'),{timeout:6000});
    await page.evaluate(()=>{window.__testXbox.buttons[2]={pressed:false,value:0}});
    await page.waitForTimeout(130);
    await page.evaluate(()=>{window.__testXbox.buttons[1]={pressed:true,value:1}});
    await screen.waitFor({state:'hidden',timeout:6000});
    await page.evaluate(()=>{window.__testXbox.buttons[1]={pressed:false,value:0}});
  }
  const state=await page.evaluate(({c,p})=>({
    classic:JSON.parse(localStorage.getItem(c)),
    phaser:localStorage.getItem(p),
    memory:window.__perenProgress.save.character
  }),{c:CLASSIC_KEY,p:PHASER_KEY});
  assert.deepEqual(state.classic,classic,'Inventário alterou save clássico');
  assert.equal(state.phaser,null,'Inventário somente consulta não pode gravar no Phaser');
  assert.equal(state.memory.gold,classic.gold);
  assert.deepEqual(errors,[],errors.join(' | '));
  await page.close();
  console.log('M1g-B QA '+width+'x'+height+' OK — inventário, filtros, retrato, controles e saves preservados');
 }
}finally{await browser?.close();server.kill('SIGTERM');}
