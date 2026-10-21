import assert from "node:assert/strict";
import {chromium} from "playwright";
const base=process.env.PEREN_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:844},serviceWorkers:"allow"});
  const page=await ctx.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  await page.goto(base+"/peren-arte.html",{waitUntil:"domcontentloaded"});
  await page.locator("#action").selectOption("gather-herb");
  await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("ervas apenas"));
  const pixel=()=>page.locator('canvas[data-dir="0"]').evaluate(c=>Array.from(c.getContext("2d").getImageData(0,0,48,64).data));
  const first=await pixel();
  await page.waitForTimeout(1050);
  const mid=await pixel();
  await page.waitForTimeout(1250);
  const last=await pixel();
  await page.waitForTimeout(900);
  assert.ok(first.some((x,i)=>x!==mid[i]),"herb gather has no visible movement at "+width);
  assert.ok(last.some((x,i)=>x!==first[i]),"herb gather final does not differ at "+width);
  assert.deepEqual(last,await pixel(),"one-shot herb gather should hold final pose");
  assert.equal(await page.locator("canvas[data-dir]").count(),4);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3),false);
  await page.locator("#action").selectOption("gather");
  await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("128 quadros"));
  assert.deepEqual(errors,[]);
  await ctx.close();
 }
 const ctx=await browser.newContext({serviceWorkers:"allow"});
 const page=await ctx.newPage();
 await page.goto(base+"/peren-arte.html",{waitUntil:"networkidle"});
 await page.evaluate(async()=>{
  await navigator.serviceWorker.ready;
  if(!navigator.serviceWorker.controller)await new Promise(r=>navigator.serviceWorker.addEventListener("controllerchange",r,{once:true}));
  for(const path of ["./art/characters/peren/peren-herb-atlas.png","./art/characters/peren/official-v5/peren-atlas-normal-walkfix-v5.png","./art/characters/peren/official-v5/peren-atlas-herb-v5.png"]){
   if(!(await caches.match(path))?.ok)throw new Error("Not cached "+path);
  }
 });
 await ctx.setOffline(true);
 await page.goto(base+"/peren-arte.html?mode=herb-v5",{waitUntil:"domcontentloaded"});
 await page.locator("#action").selectOption("gather-herb");
 await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("ervas apenas"));
 await ctx.close();
 console.log("PEREN HERB V5 browser QA passed: one-shot, 3 viewports, no errors and offline.");
}finally{await browser.close();}
