/** F.19: real forest stealth, inputs and pure movement speed in browser. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','F19-CLASSIC');
   localStorage.setItem('peren_phaser_save_m1d_v1','F19-STABLE');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   const before=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    revision:window.__perenProgress.save.revision
   }));
   const button=page.locator('#sneakBtn');
   assert.equal(await button.isHidden(),false);
   assert.equal(await button.getAttribute('aria-pressed'),'false');
   await button.click();
   await page.waitForFunction(()=>window.__perenLab.registry.get('sneakState')?.active===true,null,{timeout:5000});
   // Phaser applies the posture before the next DOM HUD refresh.
   // Wait for that refresh instead of asserting within the same frame.
   await page.waitForFunction(()=>document.querySelector('#sneakBtn')?.getAttribute('aria-pressed')==='true',null,{timeout:5000});
   assert.equal(await button.getAttribute('aria-pressed'),'true');
   const state=await page.evaluate(()=>{
    const s=window.__perenLab.scene.getScene('ExplorationScene');
    s.joy={x:1,y:0,active:true};
    s.player.setVelocity(0,0);s.update(600,1000);
    return {sneak:s.sneakingEffective,vel:s.player.body.velocity.x,notice:s.registry.get('sneakState')};
   });
   assert.equal(state.sneak,true);
   assert.ok(state.vel>60&&state.vel<90,'sneak speed '+state.vel);
   await page.waitForFunction(()=>!document.querySelector('#sneakNotice').hidden);
   const rect=await button.boundingBox();assert.ok(rect&&rect.x>=0&&rect.x+rect.width<=width+2);
   // Touch sprint wins over sneaking, and clears the toggled touch posture.
   await page.evaluate(()=>{
    const s=window.__perenLab.scene.getScene('ExplorationScene');
    s.command('sprint');s.player.setVelocity(0,0);s.update(700,1000);
   });
   const run=await page.evaluate(()=>{
    const s=window.__perenLab.scene.getScene('ExplorationScene');
    return {sneak:s.sneakingEffective,sprint:s.sprintTouch,vel:s.player.body.velocity.x,toggle:s.sneakToggle};
   });
   assert.equal(run.sneak,false);assert.equal(run.sprint,true);assert.equal(run.toggle,false);
   assert.ok(run.vel>170&&run.vel<220,'sprint speed '+run.vel);
   await page.evaluate(()=>{const s=window.__perenLab.scene.getScene('ExplorationScene');s.command('walk');s.joy={x:0,y:0,active:false}});
   await page.waitForFunction(()=>window.__perenLab.registry.get('sneakState')?.active===false);
   const after=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    revision:window.__perenProgress.save.revision
   }));
   assert.deepEqual(after,before,'stealth altered saved data');
   assert.deepEqual(errors,[]);
   console.log('F.19 PASS '+width+'x'+height+': movement and stealth, sprint, saves');
  }finally{await context.close()}
 }
}finally{await browser.close()}
