// M1g-D Chromium: merchant art, real batch trade, save safety, gamepad.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {CLASSIC_KEY,PHASER_KEY,newClassicState} from '../src/progress.js';

const port='4185',base='http://127.0.0.1:'+port+'/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',port,'--strictPort'],
 {cwd:new URL('..',import.meta.url),stdio:'inherit'});
let browser;
try{
 let live=false;
 for(let i=0;i<80;i++){
  if(server.exitCode!==null)throw Error('Vite preview encerrou');
  try{const response=await fetch(base);if(response.ok){live=true;break}}catch{}
  await new Promise(resolve=>setTimeout(resolve,200));
 }
 assert.ok(live,'Vite preview indisponível');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await mkdir('screenshots',{recursive:true});
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<500,isMobile:width<500,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const classic={...newClassicState(),gold:972,day:3,bag:{...newClassicState().bag,'eq-adaga-de-ferrugem':1}};
  await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:CLASSIC_KEY,value:classic});
  if(width===390)await page.addInitScript(()=>{
    window.__testXbox={id:'Xbox Wireless Controller (mock)',index:0,mapping:'standard',connected:true,axes:[0,0,0,0],
      buttons:Array.from({length:17},()=>({pressed:false,value:0}))};
    Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[window.__testXbox]});
  });
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.__perenProgress?.save&&window.__perenLab?.registry?.get('ready'));
  await page.locator('#showShop').click();
  const screen=page.locator('#tradeUI');await screen.waitFor({state:'visible'});
  assert.equal(await page.locator('[data-trade-mode="buy"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#tradeMerchantName').textContent(),'Sofia do Porto Seguro');
  assert.equal(await page.locator('#tradeMerchants button').count(),3);
  assert.match(await page.locator('#tradeStockNotice').textContent(),/não define estoques individuais/);
  assert.equal(await page.locator('#tradeItems button').count(),8);
  const visual=await page.evaluate(async()=>{
    const img=document.getElementById('tradePortrait');await img.decode();
    const x=await fetch('./scenes/portomonte-market.svg');
    const root=document.getElementById('tradeUI');
    return {portrait:img.naturalWidth,scene:x.ok,scroll:root.scrollWidth,viewport:innerWidth,docScroll:document.documentElement.scrollWidth};
  });
  assert.ok(visual.portrait>100&&visual.scene,'Artes do comercio nao carregaram: '+JSON.stringify(visual));
  assert.ok(visual.scroll<=width+2,'Overflow horizontal do comercio: '+JSON.stringify(visual));
  await page.screenshot({path:'screenshots/comercio-m1g-'+width+'.png',fullPage:true});
  await page.locator('[data-merchant-id="portomonte-jonathan-o-taberneiro"]').click();
  assert.equal(await page.locator('#tradeMerchantName').textContent(),'Jonathan, o Taberneiro');
  assert.equal(await page.locator('#tradeItems button').count(),8,'Selecionar NPC nao inventa estoque');
  await page.locator('[data-merchant-id="portomonte-alina-das-conchas"]').click();
  assert.equal(await page.locator('#tradeMerchantName').textContent(),'Alina das Conchas');

  await page.locator('[data-item-id="mat-agua-purificada"]').click();
  await page.locator('#tradeQuantity').fill('3');
  await page.locator('#tradeQuantity').dispatchEvent('change');
  const before=await page.evaluate(()=>window.__perenProgress.save);
  const quoted=await page.locator('#tradeTotal').textContent();
  assert.match(quoted,/Total: \d+/);
  assert.equal(await page.locator('#tradeConfirm').isDisabled(),false);
  // Identical clicks must not commit twice; model updates after first transaction.
  await page.evaluate(()=>{const b=document.getElementById('tradeConfirm');b.click();b.click()});
  const afterBuy=await page.evaluate(()=>window.__perenProgress.save);
  assert.equal(afterBuy.revision,before.revision+1);
  assert.equal(afterBuy.character.bag['mat-agua-purificada'],before.character.bag['mat-agua-purificada']+3);
  assert.ok(afterBuy.character.gold<before.character.gold);
  assert.match(await page.locator('#tradeFeedback').textContent(),/Comprado: 3/);

  // Switching to Sell immediately must not inherit Buy's double-tap guard.
  await page.locator('[data-trade-mode="sell"]').click();
  assert.equal(await page.locator('[data-trade-mode="sell"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-item-id="eq-adaga-de-ferrugem"]').click();
  assert.equal(await page.locator('#tradeConfirm').isDisabled(),true);
  assert.match(await page.locator('#tradeReason').textContent(),/equipado/);
  await page.locator('[data-item-id="mat-agua-purificada"]').click();
  await page.locator('#tradeQuantity').fill('3');
  await page.locator('#tradeQuantity').dispatchEvent('change');
  assert.equal(await page.locator('#tradeConfirm').isDisabled(),false);
  await page.locator('#tradeConfirm').click();
  const afterSell=await page.evaluate(()=>window.__perenProgress.save);
  if(afterSell.revision!==afterBuy.revision+1)console.log('SELL DIAGNOSTIC',await page.evaluate(()=>({
    revision:window.__perenProgress.save.revision,mode:document.querySelector('[data-trade-mode][aria-pressed="true"]')?.dataset.tradeMode,
    feedback:document.getElementById('tradeFeedback').textContent,
    reason:document.getElementById('tradeReason').textContent,
    quantity:document.getElementById('tradeQuantity').value,disabled:document.getElementById('tradeConfirm').disabled,
    active:document.querySelector('.trade-item.is-selected')?.dataset.itemId,
    attempt:document.getElementById('tradeUI').dataset.tradeAttempt
  })));
  assert.equal(afterSell.revision,afterBuy.revision+1);
  assert.equal(afterSell.character.bag['mat-agua-purificada'],before.character.bag['mat-agua-purificada']);
  assert.ok(afterSell.character.gold>afterBuy.character.gold);
  assert.match(await page.locator('#tradeFeedback').textContent(),/Vendido: 3/);
  assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),CLASSIC_KEY),classic);

  await page.locator('#tradeClose').click();await screen.waitFor({state:'hidden'});
  await page.locator('#showInventory').click();await screen.waitFor({state:'visible'});
  assert.equal(await page.locator('[data-trade-mode="sell"]').getAttribute('aria-pressed'),'true');
  await page.keyboard.press('Escape');await screen.waitFor({state:'hidden'});

  if(width===390){
   await page.waitForFunction(()=>document.getElementById('gamepad-status').textContent.includes('Xbox Wireless'));
   await page.evaluate(()=>{window.__testXbox.buttons[3]={pressed:true,value:1}});
   await page.locator('#inventoryUI').waitFor({state:'visible',timeout:6000});
   await page.evaluate(()=>{window.__testXbox.buttons[3]={pressed:false,value:0}});
   await page.waitForTimeout(170);
   await page.evaluate(()=>{window.__testXbox.buttons[1]={pressed:true,value:1}});
   await page.locator('#inventoryUI').waitFor({state:'hidden',timeout:6000});
   await page.evaluate(()=>{window.__testXbox.buttons[1]={pressed:false,value:0}});
   await page.waitForTimeout(170);
   await page.locator('#showShop').click();await screen.waitFor({state:'visible'});
   await page.evaluate(()=>{window.__testXbox.buttons[2]={pressed:true,value:1}});
   await page.waitForFunction(()=>document.querySelector('[data-trade-mode="sell"][aria-pressed="true"]'));
   await page.evaluate(()=>{window.__testXbox.buttons[2]={pressed:false,value:0}});
   await page.waitForTimeout(160);
   await page.evaluate(()=>{window.__testXbox.buttons[1]={pressed:true,value:1}});
   await screen.waitFor({state:'hidden',timeout:6000});
   await page.evaluate(()=>{window.__testXbox.buttons[1]={pressed:false,value:0}});
  }
  const phaserStored=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),PHASER_KEY);
  assert.equal(phaserStored.revision,afterSell.revision);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>!!window.__perenProgress?.save);
  assert.equal(await page.evaluate(()=>window.__perenProgress.save.revision),afterSell.revision);
  assert.equal(await page.evaluate(()=>window.__perenProgress.save.character.gold),afterSell.character.gold);
  assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),CLASSIC_KEY),classic);
  assert.deepEqual(errors,[],errors.join(' | '));
  console.log('M1g-D '+width+'x'+height+' OK: mercadores, lote, venda, Xbox, saves protegidos');
  await page.close();
 }
}finally{await browser?.close();server.kill('SIGTERM');}
