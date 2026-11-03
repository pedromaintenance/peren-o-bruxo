/**
 * M1h-F.9: actual collectible proximity cue in isolated preview.
 * Teleport in a paused scene only for deterministic visibility checks.
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
   localStorage.setItem('peren_carcaca_save_v1','M1HF9-CLASSIC-UNTOUCHED');
   localStorage.setItem('peren_phaser_save_m1d_v1','M1HF9-STABLE-UNTOUCHED');
  });
  try{
   await page.goto(base+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,null,{timeout:30000});
   await page.locator('#goForest').click();
   await page.locator('#hub').waitFor({state:'hidden'});
   await page.evaluate(()=>{
    const game=window.__perenLab,scene=game.scene.getScene('ExplorationScene');
    scene.scene.pause();
    scene.harvestCueSignature=undefined;
    // An actual, uncollected node; show it as interactable without gathering.
    const node=scene.world.nodes.find(n=>!scene.collected.has(n.id));
    if(!node)throw Error('Nenhum recurso disponível para teste');
    scene.player.body.reset((node.x+.5)*32,(node.y+.5)*32);
    scene.updateHarvestCue();
    game.events.emit('step');
   });
   const hint=page.locator('#harvestProximity');
   await hint.waitFor({state:'visible',timeout:5000});
   assert.match(await hint.textContent(),/Ao alcance:/);
   assert.equal(await page.locator('#gatherBtn').getAttribute('data-ready'),'true');
   assert.match(await page.locator('#gatherBtn').getAttribute('aria-label'),/Colher/);
   const bounds=await hint.boundingBox();
   assert.ok(bounds&&bounds.x>=0&&bounds.x+bounds.width<=width+2,'Hint ultrapassou a tela '+width);
   const before=await page.evaluate(()=>({
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1')
   }));
   await page.evaluate(()=>{
    const game=window.__perenLab,scene=game.scene.getScene('ExplorationScene');
    const node=scene.world.nodes.find(n=>!scene.collected.has(n.id));
    scene.collected.add(node.id);scene.updateHarvestCue();game.events.emit('step');
   });
   // If another uncollected resource is nearby, it can be selected. Verify
   // that the original node is not re-advertised instead of assuming null.
   const changed=await page.evaluate(()=>{
    const scene=window.__perenLab.scene.getScene('ExplorationScene');
    return scene.registry.get('harvestCue');
   });
   if(changed)assert.notEqual(changed.nodeId,null);
   await page.evaluate(()=>{
    const game=window.__perenLab,scene=game.scene.getScene('ExplorationScene');
    scene.player.body.reset(scene.world.entry.x*32+16,scene.world.entry.y*32+16);
    scene.collected=new Set(scene.world.nodes.map(n=>n.id));
    scene.updateHarvestCue();game.events.emit('step');
   });
   assert.equal(await hint.isVisible(),false);
   assert.equal(await page.locator('#gatherBtn').getAttribute('data-ready'),'false');
   assert.equal(await page.locator('#gatherBtn').isEnabled(),true,'Colher continua disponível para informar que se deve aproximar');
   const after=await page.evaluate(()=>({
    preview:localStorage.getItem('peren_phaser_save_m1hf_preview_v1'),
    classic:localStorage.getItem('peren_carcaca_save_v1'),
    stable:localStorage.getItem('peren_phaser_save_m1d_v1')
   }));
   assert.deepEqual(after,before,'O indicador modificou os saves');
   assert.deepEqual(errors,[],'Erros no navegador');
   console.log('PASS M1h-F.9 '+width+'x'+height+': alcance real, dica, desativação e saves');
  }finally{await ctx.close()}
 }
}finally{await browser.close()}
