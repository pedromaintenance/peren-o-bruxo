/** End-to-end Phaser battle presentation across the ten generated regions. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const url=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const all=['murin','costa-sul','caatinga','thargrid','ironwood','garganta','drakport','eldroth','vandar','boca-abismo'];
await mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
try{
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,{timeout:30000});
 for(const [index,id] of all.entries()){
  if(id==='murin'&&index===0)await page.locator('#goForest').click();
  else{
   await page.locator('#regionSelect').selectOption(id);
   await page.locator('#travelRegion').click();
  }
  await page.waitForFunction(regionId=>{
    const s=window.__perenLab?.scene?.getScene('ExplorationScene');
    return s?.scene?.isActive()===true&&s?.world?.regionId===regionId;
  },id,{timeout:20000});
  await page.evaluate(()=>{
   const s=window.__perenLab.scene.getScene('ExplorationScene');
   s.openEncounter(s.beasts[0]);
  });
  await page.locator('#observeBeast').click();
  await page.waitForFunction(()=>!!window.__perenLab?.scene?.getScene('BattleScene')?.peren?.active,{timeout:10000});
  const visual=await page.evaluate(()=>{
   const b=window.__perenLab.scene.getScene('BattleScene');
   return {region:b.region?.id,backdropType:b.backdrop?.type,
    playerTexture:b.peren?.texture?.key,frames:b.anims.get('peren-battler-idle-loop')?.frames?.length,
    playerAnimation:b.peren?.anims?.currentAnim?.key,opponent:b.foe?.texture?.key,
    foeVisible:b.foe?.visible,playerVisible:b.peren?.visible,
    casterFireLoaded:b.textures.exists('peren-battler-fire'),casterIceLoaded:b.textures.exists('peren-battler-ice')};
  });
  assert.equal(visual.region,id,id+' incorrect battle region');
  assert.equal(visual.backdropType,id==='murin'?'Image':'Graphics',id+' still using Mürin photo');
  assert.equal(visual.playerTexture,'peren-battler-idle');
  assert.equal(visual.frames,4,'approved full-sized 4-frame battler not loaded');
  assert.equal(visual.playerAnimation,'peren-battler-idle-loop');
  assert.equal(visual.playerVisible,true);
  assert.equal(visual.foeVisible,true);
  assert.ok(visual.opponent.startsWith('mob-'),'enemy battler absent');
  assert.equal(visual.casterFireLoaded,true);
  assert.equal(visual.casterIceLoaded,true);
  if(['murin','costa-sul','thargrid','eldroth'].includes(id))
   await page.screenshot({path:'screenshots/combat-'+id+'.png'});
  if(id==='costa-sul'||id==='thargrid'){
   const spell=id==='costa-sul'?'spell:mag-raio-de-fogo':'spell:mag-raio-de-gelo';
   const expected=id==='costa-sul'?'peren-battler-fire':'peren-battler-ice';
   const cast=await page.evaluate(async action=>{
    const b=window.__perenLab.scene.getScene('BattleScene');
    const turn=b.takeTurn(action);
    await new Promise(resolve=>setTimeout(resolve,140));
    const info={caster:b.activeCaster?.texture?.key,hidden:!b.peren.visible,alive:b.activeCaster?.active};
    await turn;
    info.returned=b.peren?.visible&&b.peren?.texture?.key==='peren-battler-idle'&&!b.activeCaster;
    return info;
   },spell);
   assert.equal(cast.caster,expected,id+' wrong spell battler');
   assert.equal(cast.hidden,true);
   assert.equal(cast.returned,true,'Idle battler not restored after casting');
  }
  // The same real battle UI must still let the player retreat and return to map.
  if(await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.status==='active'))
   await page.locator('[data-battle="flee"]').click();
  await page.waitForFunction(()=>!document.getElementById('battleFinish').hidden,{timeout:9000});
  await page.locator('#battleFinish').click();
  await page.waitForSelector('#controls:not([hidden])',{timeout:10000});
  await page.keyboard.press('Escape');
  await page.waitForSelector('#hub:not([hidden])',{timeout:10000});
  console.log('Arena '+id+': battler + backdrop + retreat PASS');
 }
 assert.deepEqual(errors,[],'Uncaught browser errors');
}finally{await browser.close();}
