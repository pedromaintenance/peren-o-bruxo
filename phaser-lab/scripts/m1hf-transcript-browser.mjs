/** Chromium M1h-F.14: visible history, bounded UI, no save mutation. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const ctx=await browser.newContext({viewport:{width,height}}),page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('peren_carcaca_save_v1','F14-CLASSIC');
   localStorage.setItem('peren_phaser_save_m1d_v1','F14-STABLE');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   await page.evaluate(()=>{
    const scene=window.__perenLab.scene.getScene('ExplorationScene');
    scene.openEncounter(scene.beasts.find(b=>b.type==='mob-galho-infectado'));
   });
   await page.locator('#observeBeast').click();
   await page.locator('#battleUI').waitFor({state:'visible'});
   await page.waitForFunction(()=>window.__perenLab.registry.get('battleState')?.status==='active');
   const before=await page.evaluate(()=>({
    a:localStorage.getItem('peren_carcaca_save_v1'),
    b:localStorage.getItem('peren_phaser_save_m1d_v1'),
    c:localStorage.getItem('peren_phaser_save_m1hf_preview_v1')
   }));
   const state=await page.evaluate(()=>window.__perenLab.registry.get('battleState'));
   assert.equal(await page.locator('#battleTranscript').isHidden(),false);
   await page.locator('#battleTranscript summary').click();
   assert.equal(await page.locator('#battleTranscript').getAttribute('open'),'');
   const bounds=await page.locator('#battleTranscript summary').boundingBox();
   assert.ok(bounds&&bounds.x>=0&&bounds.width>0&&bounds.x+bounds.width<=width+2,'fora da tela');
   const next={...state,round:2,log:['Criatura ataca: 3 PV.','Criatura recebe 11 de dano.','As sombras de Mürin se fecham.']};
   await page.evaluate(s=>window.__perenLab.events.emit('peren-battle-change',s),next);
   assert.equal(await page.locator('#battleTranscriptList li').count(),3);
   await page.evaluate(s=>window.__perenLab.events.emit('peren-battle-change',s),next);
   assert.equal(await page.locator('#battleTranscriptList li').count(),3);
   await page.evaluate(s=>window.__perenLab.events.emit('peren-battle-change',s),{...state,key:'new-encounter',log:['Segundo encontro!']});
   assert.equal(await page.locator('#battleTranscriptList li').count(),1);
   assert.match(await page.locator('#battleTranscriptList').textContent(),/Segundo encontro/);
   const after=await page.evaluate(()=>({
    a:localStorage.getItem('peren_carcaca_save_v1'),
    b:localStorage.getItem('peren_phaser_save_m1d_v1'),
    c:localStorage.getItem('peren_phaser_save_m1hf_preview_v1')
   }));
   assert.deepEqual(after,before);
   assert.equal(await page.locator('[data-battle="attack"]').isEnabled(),true);
   assert.deepEqual(errors,[]);
   console.log('M1h-F.14 PASS '+width+'x'+height);
  }finally{await ctx.close()}
 }
}finally{await browser.close()}
