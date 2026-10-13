import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const errors=[];
await mkdir('../phaser-lab/screenshots',{recursive:true});
for(const [w,h] of [[390,844],[360,800]]){
 const page=await browser.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push('console '+m.text())});
 await page.goto(base,{waitUntil:'networkidle',timeout:30000});
 await page.locator('#goForest').click();
 await page.waitForFunction(()=>!!window.__perenLab?.registry?.get('ready'),{timeout:30000});
 await page.waitForTimeout(350);
 const stats=await page.evaluate(()=>{const game=window.__perenLab,s=game.scene.getScene('ExplorationScene');return {valid:game.registry.get('worldValid'),texture:game.textures.exists('peren'),frames:game.textures.get('peren').frameTotal,anims:game.anims.anims.size,startX:s.player.x,startY:s.player.y}});
 assert.equal(stats.valid,true);assert.equal(stats.texture,true);assert.ok(stats.frames>=128,JSON.stringify(stats));assert.ok(stats.anims>=32,JSON.stringify(stats));
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(700);await page.keyboard.up('ArrowRight');
 const moved=await page.evaluate(()=>window.__perenLab.scene.getScene('ExplorationScene').player.x);
 assert.ok(moved>stats.startX+12,`player did not move: ${moved} <= ${stats.startX}`);
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
 await page.locator('#gatherBtn').click();
 await page.waitForFunction(()=>{const x=window.__perenLab.registry.get('collected');return x&&Object.values(x).some(n=>n>0)},{timeout:8000});
 await page.screenshot({path:`screenshots/murin-forest-${w}.png`,fullPage:true});
 // Return to hub from exit marker.
 await page.evaluate(()=>{const s=window.__perenLab.scene.getScene('ExplorationScene'),n=s.world.exit;s.player.setPosition((n.x+.5)*32,(n.y+.5)*32);s.player.body.reset(s.player.x,s.player.y)});
 await page.waitForTimeout(250);
 await page.locator('#returnBtn').click();await page.locator('#hub').waitFor({state:'visible'});
 await page.screenshot({path:`screenshots/murin-${w}.png`,fullPage:true});
 await page.close();
 console.log(`BROWSER OK ${w}x${h}: animated character, movement, gather, hub, seed, 32 clips`);
}
await browser.close();
assert.deepEqual(errors,[],errors.join('\n'));
