/**
 * Browser E2E: new save -> select different biomes -> walk/collect ->
 * inventory pause -> change town and return to market/crafting.
 * Run with Vite preview at http://127.0.0.1:4173.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto(process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>!!window.__perenProgress?.save&&!!window.__perenLab?.scene,{timeout:30000});
 assert.equal(await page.locator('#regionSelect option').count(),10);
 const destinations=[
  ['costa-sul','portomonte'],['caatinga','alem-sul'],
  ['thargrid','thargrid'],['ironwood','ironwood'],
  ['garganta','garganta'],['drakport','drakport'],
  ['eldroth','eldroth'],['vandar','eldroth'],
  ['boca-abismo','boca-abismo'],['murin','portomonte']
 ];
 for(const [region,city] of destinations){
  await page.locator('#regionSelect').selectOption(region);
  await page.locator('#travelRegion').click();
  try{
   await page.waitForFunction(id=>{
     const game=window.__perenLab,scene=game?.scene?.getScene('ExplorationScene');
     return scene?.world?.regionId===id&&game.scene.isActive('ExplorationScene');
   },region,{timeout:12000});
  }catch(error){
   const snapshot=await page.evaluate(()=>{
     const game=window.__perenLab,scene=game?.scene?.getScene('ExplorationScene');
     return {seed:game?.registry?.get('seed'),world:scene?.world?.regionId,
       sceneStatus:scene?.sys?.settings?.status,active:game?.scene?.isActive('ExplorationScene'),
       paused:game?.scene?.isPaused('ExplorationScene'),
       hubHidden:document.getElementById('hub').hidden,
       controlsHidden:document.getElementById('controls').hidden,
       hubStatus:document.getElementById('hubStatus').textContent};
   });
   console.error('Region '+region+' failed to enter',JSON.stringify({snapshot,errors}));
   throw error;
  }
  assert.equal(await page.locator('#controls').isVisible(),true);
  const snapshot=await page.evaluate(()=>({
   city:window.__perenProgress.save.character.city,
   seed:window.__perenProgress.save.worlds.activeSeed,
   region:window.__perenLab.scene.getScene('ExplorationScene').world.regionId,
   nodes:window.__perenLab.scene.getScene('ExplorationScene').world.nodes.length
  }));
  assert.equal(snapshot.city,city);
  assert.equal(snapshot.region,region);
  assert.ok(snapshot.seed.startsWith(region+'-'));
  assert.ok(snapshot.nodes>=12);
  if(region==='thargrid'){
   const scene=await page.evaluate(()=>{
    const game=window.__perenLab,scene=game.scene.getScene('ExplorationScene');
    const node=scene.world.nodes.find(x=>!scene.collected.has(x.id));
    scene.player.body.reset((node.x+.5)*32,(node.y+.5)*32);
    return {id:node.id,itemId:node.itemId};
   });
   await page.locator('#gatherBtn').click();
   await page.waitForFunction(id=>window.__perenLab.scene.getScene('ExplorationScene').collected.has(id),scene.id,{timeout:10000});
   const stored=await page.evaluate(id=>{
    const save=window.__perenProgress.save;
    return {count:save.character.bag[id]||0,revision:save.revision};
   },scene.itemId);
   assert.ok(stored.count>=1,'Real harvest must commit to item bag');
   await page.locator('#fieldInventoryBtn').click();
   await page.waitForSelector('#inventoryUI:not([hidden])');
   assert.equal(await page.evaluate(()=>window.__perenLab.scene.isPaused('ExplorationScene')),true);
   await page.locator('#invClose').click();
   assert.equal(await page.evaluate(()=>window.__perenLab.scene.isActive('ExplorationScene')),true);
  }
  await page.keyboard.press('Escape');
  await page.waitForSelector('#hub:not([hidden])');
  assert.ok((await page.locator('#hubCityName').textContent()).trim().length>2);
  assert.equal(await page.evaluate(()=>window.__perenProgress.save.character.city),city);
 }
 await page.locator('#resetForest').click();
 await page.waitForSelector('#controls:not([hidden])');
 assert.equal(await page.evaluate(()=>window.__perenLab.scene.getScene('ExplorationScene').world.regionId),'murin');
 assert.deepEqual(errors,[],'No browser-side script errors');
 console.log('World travel E2E passed: 10 biomes, city persistence, harvest, field bag, regenerated map');
} finally {await browser.close();}
