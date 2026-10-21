// LORE-04 visual acceptance in Chromium: actual image decode + no write during conversations.
import assert from "node:assert/strict";
import { chromium } from "playwright";
const base=process.env.LORE04_BASE_URL || "http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const keys=["peren_carcaca_save_v1","peren_phaser_save_m1d_v1","peren_phaser_save_m1hf_preview_v1"];
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const ctx=await browser.newContext({viewport:{width,height},serviceWorkers:"allow"});
  const page=await ctx.newPage();
  await page.goto(base+"/modos.html",{waitUntil:"networkidle"});
  const img=page.locator(".mode.campaign img.official-portrait");
  await img.evaluate(el=>el.decode());
  assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth===64&&el.naturalHeight===75),"mode portrait decoded");
  await page.evaluate(ks=>ks.forEach((key,i)=>localStorage.setItem(key,"safe-"+i)),keys);
  await page.goto(base+"/campanha.html",{waitUntil:"networkidle"});
  await page.locator(".portrait-stage img").evaluate(el=>el.decode());
  assert.equal(await page.locator(".portrait-stage img").evaluate(el=>el.naturalWidth),64);
  assert.equal(await page.locator(".companion").count(),5);
  const current=await page.evaluate(ks=>ks.map(k=>localStorage.getItem(k)),keys);
  for(let i=0;i<5;i++){
   const item=page.locator(".companion").nth(i);
   await item.locator("summary").click();
   assert.ok((await item.innerText()).length>55);
  }
  const after=await page.evaluate(ks=>ks.map(k=>localStorage.getItem(k)),keys);
  assert.deepEqual(after,current,"reading camp profiles must preserve saves");
  assert.equal(await page.evaluate(()=>localStorage.getItem("peren_campanha_v1")),null,"visual entry doesn't start a save");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  assert.equal(overflow,false,"no sideways scrolling at width "+width);
  await ctx.close();
 }
 const ctx=await browser.newContext({serviceWorkers:"allow"});
 const page=await ctx.newPage();
 await page.goto(base+"/campanha.html",{waitUntil:"networkidle"});
 await page.evaluate(async()=>{
   await navigator.serviceWorker.ready;
   if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener("controllerchange",resolve,{once:true}));
   const path="./art/characters/peren/official-v1/portrait-runtime.svg";
   const resp=await caches.match(path);
   if(!resp||!resp.ok)throw new Error("official portrait absent from offline cache");
 });
 await ctx.setOffline(true);
 await page.goto(base+"/campanha.html?offline=1",{waitUntil:"domcontentloaded"});
 await page.locator(".portrait-stage img").evaluate(el=>el.decode());
 assert.equal(await page.locator(".portrait-stage img").evaluate(el=>el.naturalWidth),64);
 await ctx.close();
 console.log("LORE-04 passed: official portrait decoded, companion cards readable, all saves isolated, offline verified");
}finally{await browser.close()}
