/**
 * M1h-F.11 — Encounter intelligence checks in Chromium (preview only).
 * Grounded in three actual species, no attack/save side effects.
 */
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
   localStorage.setItem('peren_carcaca_save_v1','ENCOUNTER-CLASSIC-UNTOUCHED');
   localStorage.setItem('peren_phaser_save_m1d_v1','ENCOUNTER-STABLE-UNTOUCHED');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   const initial=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1')
   }));
   const patterns=['Sentinela','Errante de esporos','Caçador'];
   for(const [i,type] of ['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'].entries()){
    await page.evaluate(type=>{
     const scene=window.__perenLab.scene.getScene('ExplorationScene');
     const beast=scene.beasts.find(x=>x.type===type);
     if(!beast)throw Error('Criatura não disponível: '+type);
     scene.openEncounter(beast);
    },type);
    await page.locator('#encounterModal').waitFor({state:'visible'});
    const panel=page.locator('#encounterAssessment');
    await panel.waitFor({state:'visible'});
    assert.match(await page.locator('#encounterBehavior').textContent(),new RegExp(patterns[i]));
    assert.match(await page.locator('#encounterTactic').textContent(),/Cobertura/);
    assert.match(await page.locator('#encounterSupplies').textContent(),/PV \d+\/\d+.*PM \d+\/\d+.*Poções \d+/);
    assert.match(await page.locator('#encounterReadiness').textContent(),/CONDIÇÕES|FERIDO/);
    const rect=await panel.boundingBox();
    assert.ok(rect&&rect.x>=0&&rect.x+rect.width<=width+2,'Painel fora da tela '+width);
    assert.equal(await page.locator('#observeBeast').isVisible(),true);
    assert.equal(await page.locator('#retreatBeast').isVisible(),true);
    await page.locator('#retreatBeast').click();
    await page.locator('#encounterModal').waitFor({state:'hidden'});
   }
   const after=await page.evaluate(()=>({
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1'),
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1')
   }));
   assert.deepEqual(after,initial,'Leitura/recuo alterou saves');
   assert.deepEqual(errors,[],'Erros de navegador');
   console.log('M1h-F.11 '+width+'x'+height+' OK: 3 perfis, modais, recuo, viewport e saves');
  }finally{await ctx.close()}
 }
}finally{await browser.close()}
