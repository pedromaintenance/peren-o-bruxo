/** M1h-F.18: real retreat, temporary contact immunity, and save isolation. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','F18-CLASSIC');
   localStorage.setItem('peren_phaser_save_m1d_v1','F18-STABLE');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   const initial=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    revision:window.__perenProgress.save.revision
   }));
   await page.evaluate(()=>{
    const s=window.__perenLab.scene.getScene('ExplorationScene');
    s.openEncounter(s.beasts.find(b=>b.type==='mob-galho-infectado'));
   });
   await page.locator('#retreatBeast').click();
   await page.locator('#encounterModal').waitFor({state:'hidden'});
   await page.waitForFunction(()=>window.__perenLab.registry.get('retreatGrace')>0,null,{timeout:3000});
   const state=await page.evaluate(()=>{
    const s=window.__perenLab.scene.getScene('ExplorationScene');
    const other=s.beasts.find(b=>b.type==='mob-fungo-violeta');
    // Position a DIFFERENT beast at player contact. AI must still detect,
    // but temporarily cannot launch a chain encounter after retreat.
    other.sprite.body.reset(s.player.x+5,s.player.y);
    other.x=other.sprite.x;other.y=other.sprite.y;
    other.cooldown=0;
    s.updateBeasts(16,1234);
    return {paused:s.scene.isPaused(),encounter:s.activeEncounter?.type||null,grace:s.retreatGraceMs,
      registry:s.registry.get('retreatGrace'),beasts:s.beasts.length,other:other.type};
   });
   assert.equal(state.paused,false);
   assert.equal(state.encounter,null,'another beast triggered chained encounter within grace');
   assert.ok(state.grace>0&&state.grace<=3000);
   await page.waitForFunction(()=>!document.querySelector('#retreatGraceNotice').hidden,null,{timeout:4000});
   assert.match(await page.locator('#retreatGraceNotice').textContent(),/RECUO SEGURO/);
   const b=await page.locator('#retreatGraceNotice').boundingBox();
   assert.ok(b&&b.x>=0&&b.x+b.width<=width+2,'notice outside '+width);
   // End grace deterministically, then the same nearby threat must once
   // again be able to trigger an encounter through the normal AI.
   const restored=await page.evaluate(()=>{
    const s=window.__perenLab.scene.getScene('ExplorationScene');
    s.retreatGraceMs=0;s.registry.set('retreatGrace',0);
    const other=s.beasts.find(b=>b.type==='mob-fungo-violeta');
    other.sprite.body.reset(s.player.x+5,s.player.y);other.x=other.sprite.x;other.y=other.sprite.y;
    s.updateBeasts(16,1235);
    return s.activeEncounter?.type||null;
   });
   assert.equal(restored,'mob-fungo-violeta','AI did not resume after grace');
   const after=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    revision:window.__perenProgress.save.revision
   }));
   assert.deepEqual(after,initial,'recuo protection altered saves');
   assert.deepEqual(errors,[]);
   console.log('M1h-F.18 PASS '+width+'x'+height+': all-hostile grace, auto-resume, no save mutation');
  }finally{await context.close()}
 }
}finally{await browser.close()}
