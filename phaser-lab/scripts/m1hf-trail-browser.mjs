/** M1h-F.10: verify trail signs in built preview on mobile/desktop. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','TRAIL-CLASSIC-DO-NOT-TOUCH');
   localStorage.setItem('peren_phaser_save_m1d_v1','TRAIL-STABLE-DO-NOT-TOUCH');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   const hint=page.locator('#trailOrientation');
   await hint.waitFor({state:'visible',timeout:6000});
   await page.evaluate(()=>window.__perenLab.scene.pause('ExplorationScene'));
   const before=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1')
   }));
   const at=async which=>page.evaluate(which=>{
    const game=window.__perenLab,scene=game.scene.getScene('ExplorationScene'),w=scene.world;
    const toPx=(x,y)=>({x:(x+.5)*32,y:(y+.5)*32});
    let pos=which==='start'?toPx(w.entry.x,w.entry.y):which==='bridge'?toPx(w.bridge.x,w.bridge.y):
      which==='exit'?toPx(w.exit.x,w.exit.y):toPx(w.bridge.x,w.bridge.y-8);
    scene.player.body.reset(pos.x,pos.y);
    scene.updateTrailCue();
    game.events.emit('step');
    return game.registry.get('trailCue');
   },which);
   assert.equal((await at('start')).phase,'west');
   assert.match(await hint.textContent(),/ponte/i);
   assert.equal((await at('bridge')).phase,'bridge');
   assert.match(await hint.textContent(),/rio/i);
   assert.equal((await at('lost')).phase,'lost');
   assert.match(await hint.textContent(),/orientação aproximada/);
   assert.equal((await at('exit')).phase,'exit');
   assert.match(await hint.textContent(),/PORTOMONTE/);
   const box=await hint.boundingBox();
   assert.ok(box&&box.x>=0&&box.x+box.width<=width+2,'Marcos fora da tela em '+width);
   const after=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1')
   }));
   assert.deepEqual(after,before,'Marcos de trilha alteraram saves');
   assert.deepEqual(errors,[],'Erros de navegador');
   console.log('M1h-F.10 '+width+'x'+height+' PASS: route/bridge/lost/exit, HUD bounds, independent saves');
  }finally{await ctx.close()}
 }
}finally{await browser.close()}
