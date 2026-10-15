import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {CLASSIC_KEY,newClassicState} from '../src/progress.js';
const port=4197,base='http://127.0.0.1:'+port+'/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{
 cwd:new URL('..',import.meta.url),stdio:'inherit'});
let browser;
try{
 let online=false;
 for(let i=0;i<100;i++){
  if(server.exitCode!==null)throw Error('Vite preview encerrou');
  try{if((await fetch(base)).ok){online=true;break}}catch{}
  await new Promise(ok=>setTimeout(ok,140));
 }
 assert.ok(online,'Preview indisponível');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await mkdir('screenshots',{recursive:true});
 for(const [w,h] of [[360,800],[390,844],[1280,800]]){
  for(const mode of ['m1e','m1i']){
   const page=await browser.newPage({viewport:{width:w,height:h},hasTouch:w<500,isMobile:w<500});
   const errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',request=>{if(request.url().includes('mob-galho-infectado/atlas.png'))requests.push(request.url());});
   const classic={...newClassicState(),gold:477,day:9};
   await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:CLASSIC_KEY,value:classic});
   await page.goto(base+(mode==='m1i'?'?monsters=m1i':''),{waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__perenProgress?.save&&window.__perenLab?.registry?.get('ready'));
   await page.locator('#goForest').click();
   await page.locator('#hub').waitFor({state:'hidden'});
   await page.waitForFunction(()=>window.__perenLab.scene.getScene('ExplorationScene').scene.isActive());
   const folder=mode==='m1i'?'/art-m1i/':'/art/';
   assert.ok(requests.some(url=>url.includes(folder+'monsters/mob-galho-infectado/atlas.png')),
    'Atlas errado: '+JSON.stringify(requests));
   await page.screenshot({path:'screenshots/m1i-a-floresta-'+mode+'-'+w+'.png',fullPage:true});
   await page.evaluate(()=>{
    const scene=window.__perenLab.scene.getScene('ExplorationScene');
    scene.openEncounter(scene.beasts.find(b=>b.type==='mob-galho-infectado'));
   });
   await page.locator('#encounterModal').waitFor({state:'visible'});
   const portrait=await page.locator('#beastPortrait').getAttribute('src');
   assert.ok(portrait.includes(folder+'monsters/mob-galho-infectado/portrait.png'),mode+': '+portrait);
   assert.equal(await page.locator('#beastPortrait').evaluate(i=>i.naturalWidth),160);
   await page.screenshot({path:'screenshots/m1i-a-encontro-'+mode+'-'+w+'.png',fullPage:true});
   await page.locator('#observeBeast').click();
   await page.locator('#battleUI').waitFor({state:'visible'});
   await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='active');
   assert.match(await page.locator('#battleMonster').textContent(),/Galho Infectado/);
   await page.screenshot({path:'screenshots/m1i-a-combate-'+mode+'-'+w+'.png',fullPage:true});
   const before=await page.evaluate(()=>window.__perenProgress.save.character);
   await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy);
   await page.locator('[data-battle="flee"]').click();
   await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='fled');
   await page.locator('#battleFinish').click();
   await page.locator('#battleUI').waitFor({state:'hidden'});
   const after=await page.evaluate(()=>window.__perenProgress.save.character);
   assert.equal(before.exp,after.exp);assert.equal(before.gold,after.gold);assert.equal(before.kills,after.kills);
   assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),CLASSIC_KEY),classic);
   assert.deepEqual(errors,[],errors.join('\n'));
   await page.close();
  }
  const review=await browser.newPage({viewport:{width:w,height:h}});
  const errors=[];review.on('pageerror',e=>errors.push(e.message));
  await review.goto(base+'review.html?monsters=m1i',{waitUntil:'networkidle'});
  await review.locator('#entity').selectOption('mob-galho-infectado');
  await review.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Atlas carregado'));
  assert.equal(await review.locator('#monsterVariant').inputValue(),'m1i');
  assert.match(await review.locator('#portrait').getAttribute('src'),/art-m1i\/monsters\/mob-galho-infectado\/portrait\.png/);
  for(const act of ['idle','walk','alert','attack','hurt','retreat','death']){
   await review.locator('#action').selectOption(act);
   assert.equal(await review.locator('#frame').evaluate(c=>c.width),64);
  }
  await review.screenshot({path:'screenshots/m1i-a-atelie-'+w+'.png',fullPage:true});
  await review.locator('#monsterVariant').selectOption('m1e');
  await review.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Atlas carregado'));
  assert.match(await review.locator('#portrait').getAttribute('src'),/\/art\/monsters\/mob-galho-infectado\/portrait\.png/);
  assert.deepEqual(errors,[]);
  await review.close();
  console.log('M1i-A '+w+'×'+h+': original/candidato, encontro, batalha, 7 anims, saves OK');
 }
}finally{await browser?.close();server.kill('SIGTERM');}
