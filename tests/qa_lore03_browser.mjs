// LORE-03 browser QA. Requires playwright + local server at repository root.
import assert from "node:assert/strict";
import { chromium } from "playwright";
const base = process.env.LORE03_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser = await chromium.launch({args:["--no-sandbox"]});
const protectedKeys=["peren_carcaca_save_v1","peren_phaser_save_m1d_v1","peren_phaser_save_m1hf_preview_v1"];
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
   const context=await browser.newContext({viewport:{width,height},acceptDownloads:true,serviceWorkers:"allow"});
   const page=await context.newPage();
   await page.goto(base+"/modos.html",{waitUntil:"domcontentloaded"});
   assert.equal(await page.locator(".mode").count(),2);
   assert.match(await page.getByText("Mercador da Carcaça").first().innerText(),/Mercador/);
   assert.match(await page.locator('a[href="./campanha.html"]').first().getAttribute("href"),/campanha/);
   await page.evaluate(keys=>keys.forEach((k,i)=>localStorage.setItem(k,"protected-"+i)),protectedKeys);
   await page.locator('a[href="./campanha.html"]').click();
   await page.waitForURL("**/campanha.html");
   assert.equal(await page.locator("#beginCampaign").isVisible(),true);
   const before=await page.evaluate(keys=>keys.map(k=>localStorage.getItem(k)),protectedKeys);
   assert.equal(await page.evaluate(()=>localStorage.getItem("peren_campanha_v1")),null,"opening the campaign must not create a save");
   await page.locator("#beginCampaign").click();
   assert.equal(await page.locator("#beginCampaign").isVisible(),false);
   assert.equal(await page.locator("#exportCampaign").isVisible(),true);
   const data=await page.evaluate(()=>JSON.parse(localStorage.getItem("peren_campanha_v1")));
   assert.equal(data.mode,"campanha");
   assert.equal(data.checkpoint,"acampamento_eldroth_pos_cripta");
   assert.deepEqual(data.choices,[]);
   const after=await page.evaluate(keys=>keys.map(k=>localStorage.getItem(k)),protectedKeys);
   assert.deepEqual(after,before);
   const downloadPromise=page.waitForEvent("download");
   await page.locator("#exportCampaign").click();
   const download=await downloadPromise;
   assert.equal(download.suggestedFilename(),"peren-campanha-v1-backup.json");
   await page.reload();
   assert.equal(await page.locator("#beginCampaign").isVisible(),false);
   assert.equal(await page.locator("#exportCampaign").isVisible(),true);
   const nowrap=await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2);
   assert.ok(nowrap,"no horizontal scroll at "+width);
   await context.close();
 }
 // Offline reload is a distinct smoke test of SW pre-cache.
 const ctx=await browser.newContext({serviceWorkers:"allow"});
 const page=await ctx.newPage();
 await page.goto(base+"/campanha.html",{waitUntil:"networkidle"});
 await page.evaluate(async()=>{
   await navigator.serviceWorker.ready;
   if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener("controllerchange",resolve,{once:true}));
   for(const file of ["./campanha.html","./campanha.js","./modos.html"]){
     if(!(await caches.match(file)))throw new Error("Missing precache: "+file);
   }
 });
 await ctx.setOffline(true);
 await page.goto(base+"/campanha.html?offline=1",{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#beginCampaign").count(),1);
 await ctx.close();
 console.log("LORE-03 Browser QA passed: 360, 390, 1280 and offline");
} finally {await browser.close()}
