// Peren PWA v8.9: verify actual offline BattleScene with Service Worker enabled.
import assert from "node:assert/strict";
import {chromium} from "playwright";
const base=process.env.PEREN_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox","--enable-webgl","--use-gl=angle"]});
try{
 for(const [width,height] of [[390,844],[1280,800]]){
  const context=await browser.newContext({viewport:{width,height},serviceWorkers:"allow"});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",error=>errors.push(String(error)));
  try{
   await page.goto(base+"/?offline-v89=install",{waitUntil:"load",timeout:30000});
   await page.waitForFunction(async()=>{
     const ready=await navigator.serviceWorker?.ready;
     if(!ready?.active)return false;
     const entries=await caches.keys();
     const current=entries.find(x=>x.includes("fire-hellskull-v16-20261026"));
     if(!current)return false;
     const c=await caches.open(current);
     const files=["battle-asset-pack-v90.json","idle.png","infernal-v90.png","void.png","summon.png",
       "portrait_01.png","portrait_02.png","portrait_03.png","portrait_04.png"];
     const ok=await Promise.all(files.map(f=>c.match("./art/battle/runtime-v84/"+f)));
     return ok.every(x=>x?.ok);
   },null,{timeout:90000,polling:500});
   // ServiceWorker may finish installation after first navigation. A reload
   // guarantees that the page is controlled before switching off the network.
   await page.reload({waitUntil:"domcontentloaded",timeout:30000});
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller,null,{timeout:12000});
   await context.setOffline(true);
   await page.reload({waitUntil:"domcontentloaded",timeout:30000});
   await page.locator("#goForest").waitFor({state:"visible",timeout:30000});
   await page.waitForFunction(()=>window.__perenBattleArtV90?.enabled===true,null,{timeout:20000});
   await page.locator("#goForest").click();
   await page.locator("#phaser canvas").waitFor({state:"visible",timeout:30000});
   await page.evaluate(()=>{
     const game=window.__perenLab;
     const exploration=game.scene.getScene("ExplorationScene");
     const beast=exploration.beasts?.find(x=>x.sprite?.active);
     if(!beast)throw Error("No active beast in cached offline forest");
     exploration.openEncounter(beast);
   });
   await page.locator("#encounterModal").waitFor({state:"visible",timeout:12000});
   await page.locator("#observeBeast").click();
   await page.waitForFunction(()=>{
     const b=window.__perenLab?.scene?.getScene("BattleScene");
     return !!b?.__v84Idle?.sprite?.active && b.__v84Idle.sprite.visible &&
        b.peren.visible===false;
   },null,{timeout:16000});
   const verified=await page.evaluate(()=>({
     id:window.__perenLab.scene.getScene("BattleScene").__v84Idle.sprite.texture.key,
     battle:!document.getElementById("battleUI").hidden,
     active:window.__perenBattleArtV90.enabled
   }));
   assert.deepEqual(verified,{id:"peren-v84-idle",battle:true,active:true});
   assert.deepEqual(errors,[],errors.join("\n"));
   console.log(`PASS v8.9 OFFLINE ${width}x${height}: cached portraits and battlers render inside real BattleScene`);
  } finally{await context.close()}
 }
}finally{await browser.close()}
