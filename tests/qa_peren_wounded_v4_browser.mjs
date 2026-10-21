import assert from "node:assert/strict";
import {chromium} from "playwright";
const base=process.env.PEREN_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:844},serviceWorkers:"allow"});
  const page=await ctx.newPage();
  await page.goto(base+"/peren-arte.html",{waitUntil:"load"});
  await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("128 quadros"));
  await page.locator("#action").selectOption("walk");
  await page.waitForTimeout(280);
  const healthy=await page.locator('canvas[data-dir="1"]').evaluate(c=>[...c.getContext("2d").getImageData(0,0,48,64).data]);
  await page.locator("#condition").selectOption("wounded");
  await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("128 quadros")&&document.querySelector("#condition").value==="wounded");
  await page.waitForTimeout(480);
  const injured=await page.locator('canvas[data-dir="1"]').evaluate(c=>[...c.getContext("2d").getImageData(0,0,48,64).data]);
  assert.equal(injured.length,healthy.length);
  assert.ok(injured.some((x,i)=>x!==healthy[i]),"wounded art must differ from healthy gait");
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3),false);
  await ctx.close();
 }
 const ctx=await browser.newContext({serviceWorkers:"allow",viewport:{width:390,height:844}});
 const page=await ctx.newPage();
 const errors=[];page.on("pageerror",e=>errors.push(String(e)));
 await page.goto(base+"/?art=m1hf",{waitUntil:"domcontentloaded"});
 await page.waitForFunction(()=>Boolean(window.__perenProgress?.save),null,{timeout:30000});
 await page.evaluate(()=>{
  const p=window.__perenProgress,key=p.key,s=p.save;
  if(!s.character||!Number.isFinite(s.character.hp))throw new Error("Missing character hit points");
  s.character.hp=35; // < 50% of 114; only this isolated test browser is modified
  localStorage.setItem(key,JSON.stringify(s));
 });
 await page.reload({waitUntil:"domcontentloaded"});
 await page.waitForFunction(()=>window.__perenProgress?.save?.character?.hp===35);
 await page.locator("#goForest").click();
 await page.locator("#phaser canvas").waitFor({state:"attached",timeout:30000});
 await page.waitForTimeout(700);
 assert.deepEqual(errors.filter(x=>/peren|texture|spritesheet|wounded/i.test(x)),[]);
 await page.evaluate(async()=>{
  await navigator.serviceWorker.ready;
  if(!navigator.serviceWorker.controller)await new Promise(r=>navigator.serviceWorker.addEventListener("controllerchange",r,{once:true}));
  for(const f of ["./art/characters/peren/peren-wounded-atlas.png","./art/characters/peren/official-v4/peren-wounded-atlas.png"]){
   if(!(await caches.match(f))?.ok)throw Error("Not precached: "+f);
  }
 });
 await ctx.setOffline(true);
 await page.goto(base+"/peren-arte.html?wounded=1",{waitUntil:"domcontentloaded"});
 await page.locator("#condition").selectOption("wounded");
 await page.waitForFunction(()=>document.querySelector("#status")?.textContent?.includes("128 quadros"));
 await ctx.close();
 console.log("Wounded gait QA PASS: 360/390/1280, 3x4 preview, injured HP save, Phaser canvas, offline.");
}finally{await browser.close()}
