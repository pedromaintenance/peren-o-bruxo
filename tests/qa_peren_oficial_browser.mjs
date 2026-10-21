import assert from "node:assert/strict";
import {chromium} from "playwright";
const origin=process.env.PEREN_SITE_ORIGIN||"http://127.0.0.1:8765";
const base=origin+"/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const width of [360,390,1280]){
  const context=await browser.newContext({viewport:{width,height:850},serviceWorkers:"allow"});
  const page=await context.newPage();
  await page.goto(origin+"/",{waitUntil:"domcontentloaded"});
  await page.locator(".hero-peren-official").waitFor({state:"attached",timeout:40000});
  assert.equal(await page.locator("img.hero-peren-official").count(),1);
  const title=await page.locator(".hero h1").innerText();
  assert.match(title,/PEREN/i);
  await page.locator('[data-act="tab"][data-id="peren"]').click();
  await page.locator(".peren-profile-header img").waitFor({state:"attached"});
  assert.match(await page.locator(".peren-profile-header strong").innerText(),/Peren Kerrhylon/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4),false,"classic horizontal scrolling at "+width);
  const portrait=page.locator(".peren-profile-header img");
  await portrait.evaluate(async img=>{await img.decode();if(!img.naturalWidth)throw Error("portrait decode failed")});
  await context.close();
 }
 const ctx=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:"allow"});
 const page=await ctx.newPage();
 await page.goto(base+"/peren-arte.html",{waitUntil:"load"});
 await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("128 quadros"));
 assert.equal(await page.locator("canvas[data-dir]").count(),4);
 await page.waitForFunction(()=>{
   const c=document.querySelector("canvas[data-dir='0']");
   return c&&([...c.getContext("2d").getImageData(0,0,48,64).data]
     .filter((_,i)=>i%4===3).filter(a=>a>0).length>100);
 },null,{timeout:15000});
 await page.locator("#action").selectOption("walk");
 await page.waitForTimeout(300);
 assert.equal(await page.locator("#action").inputValue(),"walk");
 const img=await page.request.get(base+"/art/characters/peren/peren-atlas.png");
 assert.ok(img.ok());
 assert.match(img.headers()["content-type"]||"",/image\/png/);
 // Validate preview has no second-game links and the portrait is present in 3 views.
 await page.goto(base+"/",{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator('img[src="./art/characters/peren/official-v1/peren-portrait-official-256.png"]').count(),3);
 assert.equal(await page.locator("#selectPerenMode").count(),0);
 await page.evaluate(async()=>{
   await navigator.serviceWorker.ready;
   if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener("controllerchange",resolve,{once:true}));
   for(const p of ["./art/characters/peren/official-v1/peren-portrait-official-256.png","./art/characters/peren/official-v1/peren-atlas-official-48x64.png","./peren-arte.html"]){
     if(!(await caches.match(p))?.ok)throw new Error("Offline cache missing: "+p);
   }
 });
 await ctx.setOffline(true);
 await page.goto(base+"/peren-arte.html?offline=1",{waitUntil:"domcontentloaded"});
 await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("128 quadros"));
 await ctx.close();
 console.log("PEREN OFFICIAL ART QA PASS: classic 3 widths, sprite frames, preview and offline.");
} finally {await browser.close();}
