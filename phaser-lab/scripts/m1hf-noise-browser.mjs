/** M1h-F.20: actual scene noise investigation without magical sight or save changes. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const ctx=await browser.newContext({viewport:{width,height}}),page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','F20-CLASSIC');
   localStorage.setItem('peren_phaser_save_m1d_v1','F20-M1D');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   const before=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    m1d:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    rev:window.__perenProgress.save.revision
   }));
   const proof=await page.evaluate(()=>{
    const game=window.__perenLab,s=game.scene.getScene('ExplorationScene');
    game.scene.pause('ExplorationScene');
    const beast=s.beasts[0];
    const y=(s.world.entry.y+.5)*32,px=(s.world.entry.x+.5)*32;
    const wallX=Math.floor((px+48)/32),wallY=Math.floor(y/32);
    s.world.blocked.add(wallX+','+wallY);
    s.player.body.reset(px,y);
    beast.sprite.body.reset(px+96,y);
    Object.assign(beast,{x:px+96,y,state:'patrulha',cooldown:0,lastSeen:null,target:null});
    // Keep other creatures beyond six cells from the entry so only one hears.
    s.sprintTouch=true;
    s.player.setVelocity(205,0);
    s.updateBeasts(16,500);
    const noisy={state:beast.state,heard:game.registry.get('fieldSignals')?.heard,
      detected:game.registry.get('fieldSignals')?.detected,
      encounter:s.activeEncounter?.type||null,target:beast.target,
      pos:{x:px,y},obscuredWall:s.world.blocked.has(wallX+','+wallY)};
    // Moving quietly suppresses hearing, but the monster keeps its existing target.
    s.sprintTouch=false;s.player.setVelocity(82,0);
    s.updateBeasts(16,520);
    const after={state:beast.state,heard:game.registry.get('fieldSignals')?.heard,
      investigating:game.registry.get('fieldSignals')?.investigating};
    return {noisy,after};
   });
   assert.equal(proof.noisy.state,'investigacao');
   assert.equal(proof.noisy.heard,1);
   assert.equal(proof.noisy.detected,0);
   assert.equal(proof.noisy.encounter,null);
   assert.deepEqual(proof.noisy.target,proof.noisy.pos);
   assert.equal(proof.after.heard,0);
   assert.equal(proof.after.state,'investigacao');
   await page.evaluate(()=>window.__perenLab.events.emit('step'));
   await page.waitForFunction(()=>document.querySelector('#fieldAwarenessTitle')?.textContent==='RASTROS RECENTES');
   const readout=await page.locator('#fieldAwareness').boundingBox();
   assert.ok(readout&&readout.x>=0&&readout.x+readout.width<=width+2,'HUD cropped '+width);
   const after=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    m1d:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    rev:window.__perenProgress.save.revision
   }));
   assert.deepEqual(after,before,'noise investigation mutated saves');
   assert.deepEqual(errors,[],'browser errors');
   console.log('F.20 PASS '+width+'x'+height+': wall-blocked visual, audible investigation, quiet aftermath, untouched saves');
  }finally{await ctx.close()}
 }
}finally{await browser.close()}
