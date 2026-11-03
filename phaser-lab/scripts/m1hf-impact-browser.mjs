/** Chromium acceptance for HUD impact cues based on real battle state differences. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','HIT-QA-CLASSIC-UNTOUCHED');
   localStorage.setItem('peren_phaser_save_m1d_v1','HIT-QA-STABLE-UNTOUCHED');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   await page.evaluate(()=>{
    const exp=window.__perenLab.scene.getScene('ExplorationScene');
    exp.openEncounter(exp.beasts.find(b=>b.type==='mob-galho-infectado'));
   });
   await page.locator('#encounterModal').waitFor({state:'visible'});
   await page.locator('#observeBeast').click();
   await page.locator('#battleUI').waitFor({state:'visible'});
   await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='active');
   const before=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1')
   }));
   const initial=await page.evaluate(()=>window.__perenLab.registry.get('battleState'));
   // Read bounds synchronously in the SAME browser evaluation that emits the
   // change. These ephemeral labels intentionally disappear after 1000 ms:
   // an awaited Playwright boundingBox() can race that timer on slow runners.
   const hitBoxes=await page.evaluate(state=>{
    window.__perenLab.events.emit('peren-battle-change',state);
    return ['battleEnemyImpact','battleHeroImpact'].map(id=>{
     const el=document.getElementById(id),r=el.getBoundingClientRect();
     return {visible:!el.hidden,x:r.x,width:r.width};
    });
   },{...initial,enemyHp:initial.enemyHp-7,hp:initial.hp-9});
   for(const box of hitBoxes)
    assert.ok(box.visible&&box.width>0&&box.x>=0&&box.x+box.width<=width+2,'HUD sai da tela '+width);
   await page.waitForFunction(()=>document.querySelector('#battleEnemyImpact').textContent.includes('7 PV'));
   assert.match(await page.locator('#battleEnemyImpact').textContent(),/7 PV/);
   assert.match(await page.locator('#battleHeroImpact').textContent(),/9 PV/);
   assert.equal(await page.locator('#battleEnemyImpact').getAttribute('data-kind'),'damage');
   assert.equal(await page.locator('#battleHeroImpact').getAttribute('data-kind'),'damage');
   await page.evaluate(state=>window.__perenLab.events.emit('peren-battle-change',state),{...initial,enemyHp:initial.enemyHp-7,hp:initial.hp-2});
   await page.waitForFunction(()=>document.querySelector('#battleHeroImpact').textContent.includes('+7 PV'));
   assert.equal(await page.locator('#battleHeroImpact').getAttribute('data-kind'),'heal');
   const after=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1')
   }));
   assert.deepEqual(after,before,'HUD impact mutated saves');
   assert.equal(await page.locator('#battleCommands button[data-battle="attack"]').isEnabled(),true);
   assert.deepEqual(errors,[],'Page errors');
   console.log('M1h-F.12 PASS '+width+'x'+height+': damage/heal from state, no save mutation');
  }finally{await context.close()}
 }
}finally{await browser.close()}
