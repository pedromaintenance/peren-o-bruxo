import assert from "node:assert/strict";
import {chromium} from "playwright";
const origin=process.env.PEREN_SITE_ORIGIN||"http://127.0.0.1:8765";
const base=origin+"/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
function pixels(){const c=document.querySelector('canvas[data-dir="0"]');return Array.from(c.getContext("2d").getImageData(0,0,48,64).data);}
try{
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:850},serviceWorkers:"allow"});
  const page=await ctx.newPage();
  await page.goto(base+"/peren-arte.html",{waitUntil:"load"});
  await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("128 quadros"));
  await page.waitForFunction(()=>typeof herbPicture!=="undefined"&&herbPicture.complete&&herbPicture.naturalWidth===192);
  await page.locator("#action").selectOption("gather");
  await page.locator("#replayGather").click();
  await page.waitForTimeout(100);
  const stage1=await page.evaluate(pixels);
  await page.waitForTimeout(420);
  const stage2=await page.evaluate(pixels);
  await page.waitForTimeout(320);
  const stage3=await page.evaluate(pixels);
  await page.waitForTimeout(600);
  const stage4=await page.evaluate(pixels);
  assert.equal(stage1.length,12288);
  for(const a of [stage2,stage3,stage4])assert.ok(a.some((v,i)=>v!==stage1[i]),"Herb stages must animate visibly");
  await page.locator("#replayGather").click();
  await page.waitForTimeout(80);
  const replay=await page.evaluate(pixels);
  assert.ok(replay.some((v,i)=>v!==stage4[i]),"Replay restarts rather than looping automatically");
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3),false,"horizontal scroll "+width);
  await ctx.close();
 }
 const ctx=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:"allow"});
 const page=await ctx.newPage();const errors=[];page.on("pageerror",e=>errors.push(String(e)));
 await page.goto(base+"/?art=m1hf",{waitUntil:"domcontentloaded"});
 await page.waitForFunction(()=>!!window.__perenProgress?.save,null,{timeout:30000});
 await page.locator("#goForest").click();
 await page.locator("#phaser canvas").waitFor({state:"attached",timeout:30000});
 await page.waitForTimeout(900);
 assert.deepEqual(errors.filter(x=>/peren|herb|gather|texture/i.test(x)),[],"Phaser runtime errors");
 await page.evaluate(async()=>{
  await navigator.serviceWorker.ready;
  if(!navigator.serviceWorker.controller)await new Promise(done=>navigator.serviceWorker.addEventListener("controllerchange",done,{once:true}));
  for(const f of ["./art/characters/peren/peren-herb-gather.png","./art/characters/peren/official-v5/peren-coleta-runtime-4x4-48x64.png"]){
   if(!(await caches.match(f))?.ok)throw Error("Herb missing offline cache: "+f);
  }
 });
 await ctx.setOffline(true);
 await page.goto(base+"/peren-arte.html?harvest=v5",{waitUntil:"domcontentloaded"});
 await page.locator("#action").selectOption("gather");
 await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("128 quadros"));
 await ctx.close();
 console.log("PEREN HERB v5 browser PASS — 3 widths, 4 poses, replay, Phaser forest, offline");
}finally{await browser.close();}
