import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newClassicState,CLASSIC_KEY,PHASER_KEY} from '../src/progress.js';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const errors=[];
await mkdir('../phaser-lab/screenshots',{recursive:true});
for(const [w,h] of [[390,844],[360,800]]){
 const page=await browser.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
 // 390px scenario uses an Xbox Standard Gamepad emulator, exercised via browser API.
 // It never introduces synthetic mouse clicks for the gamepad steps.
 if(w===390)await page.addInitScript(()=>{
   window.__mockXbox={id:'Xbox Wireless Controller (mock)',index:0,connected:true,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};
   Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[window.__mockXbox]});
 });
 const classic={...newClassicState(),gold:751,day:6};
 await page.addInitScript(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:CLASSIC_KEY,value:classic});
 await page.goto(base,{waitUntil:'networkidle',timeout:30000});
 await page.waitForFunction(()=>!!window.__perenProgress?.save,{timeout:30000});
 const importState=await page.evaluate(({classicKey})=>({phaser:window.__perenProgress.save,
   untouched:JSON.parse(localStorage.getItem(classicKey))}),{classicKey:CLASSIC_KEY});
 assert.equal(importState.phaser.character.gold,classic.gold);
 assert.equal(importState.phaser.character.day,6);
 assert.deepEqual(importState.untouched,classic);

 if(w===390){
   await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready'),{timeout:30000});
   await page.waitForFunction(()=>document.querySelector('#gamepad-status').textContent.includes('Xbox Wireless'));
   await page.evaluate(()=>{window.__mockXbox.buttons[0].pressed=true;window.__mockXbox.buttons[0].value=1});
   await page.waitForFunction(()=>document.querySelector('#hub').hidden,{timeout:5000});
   await page.evaluate(()=>{window.__mockXbox.buttons[0].pressed=false;window.__mockXbox.buttons[0].value=0});
   await page.waitForTimeout(110);
 }else await page.locator('#goForest').click();
 await page.waitForFunction(()=>!!window.__perenLab?.registry?.get('ready'),{timeout:30000});
 await page.waitForTimeout(350);
 const stats=await page.evaluate(()=>{const game=window.__perenLab,s=game.scene.getScene('ExplorationScene');return {valid:game.registry.get('worldValid'),texture:game.textures.exists('peren'),frames:game.textures.get('peren').frameTotal,anims:game.anims.anims.size,startX:s.player.x,startY:s.player.y}});
 assert.equal(stats.valid,true);
 const creatures=await page.evaluate(()=>{const s=window.__perenLab.scene.getScene('ExplorationScene'),g=window.__perenLab;return {n:s.beasts.length,types:s.beasts.map(b=>b.type),atlas:s.beasts.map(b=>g.textures.get(b.type).frameTotal)};});
 assert.equal(creatures.n,6);assert.equal(new Set(creatures.types).size,3);assert.ok(creatures.atlas.every(n=>n>=28));assert.equal(stats.texture,true);assert.ok(stats.frames>=128,JSON.stringify(stats));assert.ok(stats.anims>=32,JSON.stringify(stats));
 // Regression: foliage is visual only; only the tree's narrow trunk is solid.
 const trunkStatus=await page.evaluate(()=>{
   const s=window.__perenLab.scene.getScene('ExplorationScene');
   const trees=s.world.obstacles.filter(o=>o.kind==='tree');
   const t=s.treeTrunks?.[0],body=t?.collider.body;
   if(!t||!body)throw Error('Missing separated tree trunk collider');
   return {n:s.treeTrunks.length,expected:trees.length,x:t.x,y:t.y,
     width:body.width,height:body.height,cx:body.center.x,cy:body.center.y};
 });
 assert.equal(trunkStatus.n,trunkStatus.expected);
 assert.ok(trunkStatus.n>=80,'Too few tree colliders: '+trunkStatus.n);
 assert.ok(trunkStatus.width<=16&&trunkStatus.height<=16,
   'Tree canopy has a giant physical body: '+JSON.stringify(trunkStatus));
 assert.ok(Math.abs(trunkStatus.cx-trunkStatus.x)<=2&&Math.abs(trunkStatus.cy-trunkStatus.y)<=6,
   'Tree trunk physical body is misplaced: '+JSON.stringify(trunkStatus));
 const startUnderCanopy=await page.evaluate(()=>{
   const s=window.__perenLab.scene.getScene('ExplorationScene'),world=s.world;
   const free=(x,y)=>!world.blocked.has(x+','+y);
   for(const tree of s.treeTrunks){
     const x=Math.floor(tree.x/32),y=Math.floor(tree.y/32);
     if(x<4||x>world.width-5||y<5||y>world.height-5)continue;
     if(!free(x,y-1)||!free(x,y-2)||!free(x,y-3))continue;
     s.player.body.reset(tree.x,tree.y-78);s.player.setVelocity(0,0);
     return s.player.y;
   }
   throw Error('Unable to find a canopy test position');
 });
 await page.keyboard.down('ArrowDown');
 try{await page.waitForFunction(start=>window.__perenLab.scene.getScene('ExplorationScene').player.y>start+12,startUnderCanopy,{timeout:2200,polling:50});}
 finally{await page.keyboard.up('ArrowDown');}
 const afterUnderCanopy=await page.evaluate(()=>window.__perenLab.scene.getScene('ExplorationScene').player.y);
 assert.ok(afterUnderCanopy>startUnderCanopy+12,
   'Green canopy blocked walking: '+afterUnderCanopy+' <= '+startUnderCanopy);
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(700);await page.keyboard.up('ArrowRight');
 const moved=await page.evaluate(()=>window.__perenLab.scene.getScene('ExplorationScene').player.x);
 assert.ok(moved>stats.startX+12,`player did not move: ${moved} <= ${stats.startX}`);
 if(w===390){
   // Choose a wide, obstacle-free part of the trail. Otherwise a correct
   // Arcade collision can make this movement test fail at a tree/water edge.
   const before=await page.evaluate(()=>{
     const s=window.__perenLab.scene.getScene('ExplorationScene'),w=s.world;
     for(let y=3;y<w.height-3;y++)for(let x=3;x<w.width-8;x++){
       const clear=Array.from({length:7},(_,dx)=>x+dx).every(xx=>
         [y-1,y,y+1].every(yy=>!w.blocked.has(`${xx},${yy}`)));
       if(!clear)continue;
       s.player.body.reset((x+.5)*32,(y+.5)*32);
       return s.player.x;
     }
     throw Error('No suitable clear corridor found for Xbox input QA');
   });
   await page.evaluate(()=>{window.__mockXbox.axes[0]=1;window.__mockXbox.buttons[7]={pressed:true,value:1}});
   await page.waitForTimeout(430);
   const xbox=await page.evaluate(()=>{const s=window.__perenLab.scene.getScene('ExplorationScene');return {x:s.player.x,sprint:s.gamepadInput.sprint,anim:s.player.anims.currentAnim?.key}});
   assert.ok(xbox.x>before+15,`Xbox analog movement failed: ${JSON.stringify(xbox)}`);
   assert.equal(xbox.sprint,true);
   assert.ok(xbox.anim.endsWith('-run'),`Xbox sprint animation not active: ${xbox.anim}`);
   await page.evaluate(()=>{window.__mockXbox.axes[0]=0;window.__mockXbox.buttons[7]={pressed:false,value:0}});
   await page.waitForTimeout(100);
 }
 // Single nearby plant is placed under Peren to check a real animation and pickup.
 await page.evaluate(()=>{const scene=window.__perenLab.scene.getScene('ExplorationScene'),n=scene.world.nodes[0];scene.player.setPosition((n.x+.5)*32,(n.y+.5)*32);scene.player.body.reset(scene.player.x,scene.player.y)});
 // A fixed HTML joystick must remain fully visible at mobile sizes.
 const joy=page.locator('#joystick');const joyBox=await joy.boundingBox();
 assert.ok(joyBox.x>=0&&joyBox.x+joyBox.width<=w,'joystick clipped horizontally');
 assert.ok(joyBox.y>=0&&joyBox.y+joyBox.height<=h,'joystick clipped vertically');
 await page.mouse.move(joyBox.x+55,joyBox.y+55);await page.mouse.down();
 await page.mouse.move(joyBox.x+88,joyBox.y+55,{steps:5});
 await page.waitForTimeout(130);
 const joyVector=await page.evaluate(()=>window.__perenLab.scene.getScene('ExplorationScene').joy.x);
 assert.ok(joyVector>0.3,'touch drag not passed to Phaser');
 await page.mouse.up();
 if(w===390){
   await page.evaluate(()=>{window.__mockXbox.buttons[0]={pressed:true,value:1}});
   await page.waitForTimeout(150);
   await page.evaluate(()=>{window.__mockXbox.buttons[0]={pressed:false,value:0}});
 }else await page.locator('#gatherBtn').click();
 await page.waitForFunction(()=>{const x=window.__perenLab.registry.get('collected');return x&&Object.values(x).some(n=>n>0)},{timeout:8000});
 const afterGather=await page.evaluate(key=>({save:JSON.parse(localStorage.getItem(key)),id:window.__perenLab.scene.getScene('ExplorationScene').world.nodes[0].itemId}),PHASER_KEY);
 assert.ok(afterGather.save.ledger&&Object.keys(afterGather.save.ledger).some(k=>k.startsWith('collect:')));
 assert.ok(afterGather.save.character.bag[afterGather.id]>=(classic.bag[afterGather.id]||0)+1);

 if(w===390){
   await page.evaluate(()=>{window.__mockXbox.buttons[3]={pressed:true,value:1}}); // Y opens bag
   await page.locator('#bagPanel').waitFor({state:'visible'});
   await page.evaluate(()=>{window.__mockXbox.buttons[3]={pressed:false,value:0}});
   await page.waitForTimeout(100);
   await page.evaluate(()=>{window.__mockXbox.buttons[1]={pressed:true,value:1}}); // B closes bag
   await page.locator('#bagPanel').waitFor({state:'hidden'});
   await page.evaluate(()=>{window.__mockXbox.buttons[1]={pressed:false,value:0}});
   await page.waitForTimeout(100);
   await page.evaluate(()=>{window.__mockXbox.buttons[9]={pressed:true,value:1}}); // Menu pauses to hub
   await page.locator('#hub').waitFor({state:'visible'});
   await page.evaluate(()=>{window.__mockXbox.buttons[9]={pressed:false,value:0}});
   await page.waitForTimeout(100);
   await page.evaluate(()=>{window.__mockXbox.buttons[1]={pressed:true,value:1}}); // B resumes
   await page.locator('#hub').waitFor({state:'hidden'});
   await page.evaluate(()=>{window.__mockXbox.buttons[1]={pressed:false,value:0}});
   await page.waitForTimeout(100);
 }
 await page.screenshot({path:`screenshots/murin-forest-${w}.png`,fullPage:true});
 // Real Phaser encounter preview and retreat: no XP, no loot, no stuck dialog.
 await page.evaluate(()=>{const s=window.__perenLab.scene.getScene('ExplorationScene'),b=s.beasts[0];s.player.body.reset(b.sprite.x,b.sprite.y);});
 await page.locator('#encounterModal').waitFor({state:'visible',timeout:8000});
 assert.equal(await page.locator('#beastName').textContent(),'Galho Infectado');
 await page.screenshot({path:`screenshots/murin-encontro-${w}.png`,fullPage:true});
 const bagBefore=await page.evaluate(()=>JSON.stringify(window.__perenLab.registry.get('collected')));
 if(w===390){
   await page.evaluate(()=>{window.__mockXbox.buttons[1]={pressed:true,value:1}});
   await page.locator('#encounterModal').waitFor({state:'hidden',timeout:8000});
   await page.evaluate(()=>{window.__mockXbox.buttons[1]={pressed:false,value:0}});
 }else{await page.locator('#retreatBeast').click();await page.locator('#encounterModal').waitFor({state:'hidden'});}
 assert.equal(await page.evaluate(()=>window.__perenLab.registry.get('encounter')),null);
 assert.equal(await page.evaluate(()=>JSON.stringify(window.__perenLab.registry.get('collected'))),bagBefore);
 await page.waitForTimeout(500);
 assert.equal(await page.locator('#encounterModal').isVisible(),false,'repeated instant encounter softlock');
 // M1c: battle scene, spell animation, one-time XP/loot and safe return.
 await page.evaluate(()=>{
   const s=window.__perenLab.scene.getScene('ExplorationScene');
   const b=s.beasts.find(x=>x.type==='mob-galho-infectado');
   b.cooldown=0;s.openEncounter(b);
 });
 await page.locator('#encounterModal').waitFor({state:'visible',timeout:8000});
 await page.locator('#observeBeast').click();
 await page.locator('#battleUI').waitFor({state:'visible',timeout:10000});
 await page.waitForFunction(()=>window.__perenLab?.registry?.get('battleState')?.status==='active',{timeout:10000});
 const battleAtStart=await page.evaluate(()=>{
   const a=window.__perenLab,s=a.scene.getScene('BattleScene');return {type:s.config.beast.type,hp:s.state.hp,
     animations:a.anims.anims.size,fx:['vfx-fire','vfx-ice','vfx-arcane'].every(k=>a.textures.exists(k)),
     profile:a.registry.get('combatProfile')};
 });
 assert.equal(battleAtStart.type,'mob-galho-infectado');assert.equal(battleAtStart.fx,true);
 assert.equal(battleAtStart.profile.kills,0);
 // Three visually distinct skills are wired to their actual spell IDs and mana.
 await page.locator('[data-battle="spell:mag-raio-de-fogo"]').click();
 await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy,{timeout:12000});
 const mpAfter=await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.playerMp);
 assert.equal(mpAfter,battleAtStart.profile.mp-3);
 await page.screenshot({path:`screenshots/murin-combat-${w}.png`,fullPage:true});
 for(let j=0;j<15;j++){
   const state=await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state?.status);
   if(state!=='active')break;
   await page.locator('[data-battle="attack"]').click();
   await page.waitForFunction(()=>!window.__perenLab.scene.getScene('BattleScene').busy,{timeout:12000});
 }
 const status=await page.evaluate(()=>window.__perenLab.scene.getScene('BattleScene').state.status);
 assert.equal(status,'won',`expected battle victory, got ${status}`);
 assert.equal(await page.locator('#battleFinish').isVisible(),true);
 await page.locator('#battleFinish').click();
 await page.locator('#battleUI').waitFor({state:'hidden',timeout:8000});
 const win=await page.evaluate(()=>{
   const a=window.__perenLab,p=a.registry.get('combatProfile'),s=a.scene.getScene('ExplorationScene');
   return {gold:p.gold,xp:p.xp,kills:p.kills,moss:p.bag['ing-hanging-moss'],remaining:s.beasts.length,paused:s.scene.isPaused()};
 });
 assert.equal(win.gold,classic.gold+8);assert.equal(win.xp,13);assert.equal(win.kills,1);
 assert.equal(win.moss,(classic.bag['ing-hanging-moss']||0)+1);
 assert.equal(win.remaining,5);assert.equal(win.paused,false);
 const storedVictory=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PHASER_KEY);
 assert.equal(storedVictory.character.gold,win.gold);
 assert.ok(Object.keys(storedVictory.ledger).some(k=>k.startsWith('battle:')));

 await page.waitForTimeout(200);
 assert.equal(await page.locator('#encounterModal').isVisible(),false);
 // A second encounter can be fled; this must not add loot, experience or gold.
 await page.evaluate(()=>{
   const s=window.__perenLab.scene.getScene('ExplorationScene');
   s.openEncounter(s.beasts.find(x=>x.type==='mob-fungo-violeta'));
 });
 await page.locator('#encounterModal').waitFor({state:'visible',timeout:8000});
 await page.locator('#observeBeast').click();
 await page.locator('#battleUI').waitFor({state:'visible',timeout:8000});
 if(w===390){
   await page.evaluate(()=>{window.__mockXbox.buttons[1]={pressed:true,value:1}});
   await page.waitForFunction(()=>window.__perenLab.scene.getScene('BattleScene').state.status==='fled',{timeout:6000});
   await page.evaluate(()=>{window.__mockXbox.buttons[1]={pressed:false,value:0}});
   await page.waitForTimeout(180);
   await page.evaluate(()=>{window.__mockXbox.buttons[0]={pressed:true,value:1}});
   await page.locator('#battleUI').waitFor({state:'hidden',timeout:8000});
   await page.evaluate(()=>{window.__mockXbox.buttons[0]={pressed:false,value:0}});
 }else{
   await page.locator('[data-battle="flee"]').click();
   await page.waitForFunction(()=>window.__perenLab.scene.getScene('BattleScene').state.status==='fled',{timeout:8000});
   await page.locator('#battleFinish').click();
   await page.locator('#battleUI').waitFor({state:'hidden',timeout:8000});
 }
 const afterFlee=await page.evaluate(()=>{const p=window.__perenLab.registry.get('combatProfile');return {gold:p.gold,xp:p.xp,kills:p.kills,moss:p.bag['ing-hanging-moss']}});
 assert.deepEqual(afterFlee,{gold:win.gold,xp:win.xp,kills:win.kills,moss:win.moss});
 const afterFleePersist=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PHASER_KEY);
 assert.equal(afterFleePersist.character.gold,win.gold);
 assert.equal(afterFleePersist.character.kills,1);

 // Return to hub from exit marker.
 await page.evaluate(()=>{const s=window.__perenLab.scene.getScene('ExplorationScene'),n=s.world.exit;s.player.setPosition((n.x+.5)*32,(n.y+.5)*32);s.player.body.reset(s.player.x,s.player.y)});
 await page.waitForTimeout(250);
 await page.locator('#returnBtn').click();await page.locator('#hub').waitFor({state:'visible'});
 await page.screenshot({path:`screenshots/murin-${w}.png`,fullPage:true});
 // Real workshop action (original recipe ID) and commercial transaction.
 await page.locator('#showCraft').click();
 await page.locator('#craftUI').waitFor({state:'visible'});
 const craftsBefore=await page.evaluate(()=>window.__perenProgress.save.character.crafted);
 await page.locator('#craftMake').click();
 const craftsAfter=await page.evaluate(()=>window.__perenProgress.save.character.crafted);
 assert.equal(craftsAfter,craftsBefore+1);
 await page.locator('#craftClose').click();
 await page.locator('#showShop').click();
 const tradeBefore=await page.evaluate(()=>window.__perenProgress.save.character.gold);
 await page.locator('.market-line button').first().click();
 assert.ok(await page.evaluate(()=>window.__perenProgress.save.character.gold)<tradeBefore);
 const ledgerBefore=await page.evaluate(()=>Object.keys(window.__perenProgress.save.ledger).length);
 const classicPersist=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),CLASSIC_KEY);
 assert.deepEqual(classicPersist,classic,'Original save must never change');
 // Reload on a fresh session: map collectibles and combat loot must persist.
 await page.reload({waitUntil:'networkidle'});
 await page.waitForFunction(()=>!!window.__perenProgress?.save&&window.__perenLab?.registry?.get('ready'));
 assert.equal(await page.evaluate(()=>window.__perenProgress.save.character.kills),1);
 assert.equal(await page.evaluate(()=>Object.keys(window.__perenProgress.save.ledger).length),ledgerBefore);
 assert.equal(await page.evaluate(()=>window.__perenLab.scene.getScene('ExplorationScene').collected.size),1);
 assert.equal(await page.evaluate(()=>window.__perenLab.scene.getScene('ExplorationScene').beasts.length),5);
 await page.close();
 console.log(`BROWSER OK ${w}x${h}: animated character, Xbox/keyboard/touch movement, gather, hub, 32 clips`);
}
await browser.close();
assert.deepEqual(errors,[],errors.join('\n'));
