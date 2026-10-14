import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {CLASSIC_KEY,newClassicState} from '../src/progress.js';

const port='4179',base='http://127.0.0.1:'+port+'/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',port,'--strictPort'],
 {cwd:new URL('..',import.meta.url),stdio:'inherit'});
let browser;
try {
 let live=false;
 for(let i=0;i<80;i++){
  if(server.exitCode!==null)throw Error('Servidor de preview falhou');
  try{const response=await fetch(base);if(response.ok){live=true;break}}catch{}
  await new Promise(resolve=>setTimeout(resolve,200));
 }
 assert.ok(live,'Vite preview não iniciou');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await mkdir('screenshots',{recursive:true});
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,hasTouch:width<500,isMobile:width<500});
  const errors=[];
  const original={...newClassicState(),gold:917,day:4,level:2,exp:20};
  page.on('pageerror',err=>errors.push(err.message));
  await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:CLASSIC_KEY,value:original});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>!!window.__perenProgress?.save);
  const report=await page.evaluate(()=>{
    const a=id=>document.getElementById(id);
    const root=a('hub');
    const image=a('portrait-does-not-exist')||document.querySelector('.m1g-portrait-image');
    const scenic=document.querySelector('.m1g-scenery');
    return {
      title:document.title,level:a('hubLevel').textContent,gold:a('hubGold').textContent,
      day:a('hubDay').textContent,pv:a('hubHpValue').textContent,
      overflow:document.documentElement.scrollWidth-window.innerWidth,
      className:root.className,heroImage:image?.complete&&image.naturalWidth>0,
      scene:getComputedStyle(scenic).backgroundImage,nav:a('hubNav').querySelectorAll('button').length,
      disabled:a('tutorsUnavailable').disabled,
      styles:getComputedStyle(a('hub')).backgroundColor,
      classic:JSON.parse(localStorage.getItem('peren_carcaca_save_v1')),
    };
  });
  assert.equal(report.level,'Nível 2');assert.equal(report.gold,'917');assert.equal(report.day,'Dia 4');
  assert.equal(report.className,'m1g-shell');assert.equal(report.heroImage,true);
  assert.ok(report.scene.includes('visao-carcaca.webp'),'Cenário clássico não foi aplicado');
  const backdrop=await page.evaluate(async()=>{const img=new Image();img.src='./art/regions/portomonte/visao-carcaca.webp';await img.decode();return {w:img.naturalWidth,h:img.naturalHeight}});
  assert.ok(backdrop.w>500&&backdrop.h>250,'Arte do cenário não carregou: '+JSON.stringify(backdrop));
  const sceneImage=await page.locator('.m1g-scenery').evaluate(el=>getComputedStyle(el).backgroundImage);
  assert.match(sceneImage,/visao-carcaca\.webp/);
  assert.equal(report.nav,6);assert.equal(report.disabled,true);
  assert.ok(report.overflow<=2,'Layout M1g ultrapassa viewport: '+report.overflow);
  assert.deepEqual(report.classic,original);
  await page.locator('#showCraft').click();
  assert.match(await page.locator('#hubTitle').textContent(),/Oficinas/);
  assert.equal(await page.locator('#craftUI').isVisible(),true);
  await page.locator('#craftClose').click();
  await page.locator('#showShop').click();
  assert.match(await page.locator('#hubTitle').textContent(),/Comércio/);
  assert.equal(await page.locator('#tradeUI').isVisible(),true);
  await page.locator('#tradeClose').click();
  await page.locator('#openBagHub').click();
  assert.equal(await page.locator('#inventoryUI').isVisible(),true);
  assert.equal(await page.locator('#bagPanel').isVisible(),false);
  await page.locator('#invClose').click();
  assert.equal(await page.locator('#inventoryUI').isVisible(),false);
  await page.locator('#endDayBtn').click();
  assert.equal(await page.locator('#hubDay').textContent(),'Dia 5');
  assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),CLASSIC_KEY),original);
  await page.locator('#goForest').click();
  await page.locator('#hub').waitFor({state:'hidden'});
  await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready'));
  await page.evaluate(()=>{
    const game=window.__perenLab,scene=game.scene.getScene('ExplorationScene');
    const ex=scene.world.exit;
    scene.player.body.reset((ex.x+.5)*32,(ex.y+.5)*32);
  });
  await page.waitForFunction(()=>!document.getElementById('returnBtn').hidden);
  await page.locator('#returnBtn').click();
  await page.locator('#hub').waitFor({state:'visible'});
  await page.screenshot({path:'screenshots/portomonte-m1g-'+width+'.png',fullPage:true});
  assert.deepEqual(errors,[],errors.join(', '));
  await page.close();
  console.log('M1g-A QA '+width+'x'+height+' OK — hub, HUD, menus, save clássico intacto');
 }
} finally {
 await browser?.close();server.kill('SIGTERM');
}
