/** M1h-F.13 — command consequences do not alter action, save or controller buttons. */
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
   localStorage.setItem('peren_carcaca_save_v1','COMMAND-CLASSIC-KEEP');
   localStorage.setItem('peren_phaser_save_m1d_v1','COMMAND-M1D-KEEP');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   await page.evaluate(()=>{
    const s=window.__perenLab.scene.getScene('ExplorationScene');
    s.openEncounter(s.beasts.find(b=>b.type==='mob-galho-infectado'));
   });
   await page.locator('#encounterModal').waitFor({state:'visible'});
   await page.locator('#observeBeast').click();
   await page.locator('#battleUI').waitFor({state:'visible'});
   const before=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    state:JSON.stringify(window.__perenLab.registry.get('battleState'))
   }));
   const assertions=[
    ['defend',/4 PM.*52%/],
    ['potion',/até 36 PV/],
    ['flee',/imediatamente.*sem XP ou saque/],
    ['spell:mag-raio-de-gelo',/3 PM.*impede a reação/],
    ['spell:mag-raio-de-fogo',/queimadura/],
    ['spell:mag-misseis-magicos',/7 PM.*arcano/]
   ];
   for(const [action,pattern] of assertions){
    const button=page.locator('[data-battle="'+action+'"]');
    await button.focus();
    assert.match(await page.locator('#battleCommandHint').textContent(),pattern,action+' consequence');
    assert.equal(await button.isVisible(),true);
   }
   // The actual action buttons become disabled when resources run out.
   // Focus while enabled, then emit a synthetic public state update, so the
   // test does not try to focus a natively disabled button.
   await page.locator('[data-battle="potion"]').focus();
   await page.evaluate(state=>window.__perenLab.events.emit('peren-battle-change',{...state,mp:1,potions:0}),initial);
   assert.match(await page.locator('#battleCommandHint').textContent(),/INDISPONÍVEL.*Sem poções/);
   await page.evaluate(state=>window.__perenLab.events.emit('peren-battle-change',state),initial);
   await page.locator('[data-battle="spell:mag-raio-de-gelo"]').focus();
   await page.evaluate(state=>window.__perenLab.events.emit('peren-battle-change',{...state,mp:1,potions:0}),initial);
   assert.match(await page.locator('#battleCommandHint').textContent(),/INDISPONÍVEL.*Mana insuficiente/);
   await page.evaluate(state=>window.__perenLab.events.emit('peren-battle-change',state),initial);
   const after=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    state:JSON.stringify(window.__perenLab.registry.get('battleState'))
   }));
   assert.deepEqual(after,before,'Viewing the command hints must not mutate saves or registered battle state');
   assert.deepEqual(errors,[]);
   console.log('M1h-F.13 PASS '+width+'x'+height+': command explanations, unavailable, isolation');
  }finally{await context.close()}
 }
}finally{await browser.close()}
