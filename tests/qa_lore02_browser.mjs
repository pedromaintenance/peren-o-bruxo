// Browser smoke for LORE-02. Run with local HTTP server on :8765 and npm i --no-save playwright.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.LORE02_BASE_URL || "http://127.0.0.1:8765";
const keys = ["peren_carcaca_save_v1", "peren_phaser_save_m1d_v1", "peren_phaser_save_m1hf_preview_v1"];
const browser = await chromium.launch({headless:true, args:["--no-sandbox"]});
let passes=0;
try {
  for (const [width,height] of [[360,800],[390,844],[1280,800]]) {
    const context = await browser.newContext({viewport:{width,height}, serviceWorkers:"allow"});
    const page = await context.newPage();
    await page.goto(base+"/cronica.html", {waitUntil:"domcontentloaded"});
    await page.waitForSelector(".card");
    assert.equal(await page.locator(".card").count(),7);
    const chapters = page.locator(".timeline-entry");
    assert.equal(await chapters.count(),21);
    assert.equal(await page.locator(".card[open]").count(),0, "spoilers stay closed by default");

    // A read-only document may be inspected while existing save values remain byte-identical.
    await page.evaluate((arr)=>arr.forEach((k,i)=>localStorage.setItem(k,"protected-"+i)),keys);
    const original = await page.evaluate(arr=>arr.map(k=>localStorage.getItem(k)),keys);
    await page.getByText("Acontecimentos anteriores").first().click();
    await page.locator(".timeline-entry").first().locator("summary").click();
    assert.ok((await chapters.first().innerText()).length>80);
    await page.locator("#chronicleSearch").fill("Maelor");
    const visible = await chapters.evaluateAll(list=>list.filter(e=>!e.hidden).length);
    assert.ok(visible>=1 && visible<21,"search filters canonical events");
    await page.locator("#chronicleSearch").fill("");
    assert.equal(await chapters.evaluateAll(list=>list.filter(e=>!e.hidden).length),21);
    const current = await page.evaluate(arr=>arr.map(k=>localStorage.getItem(k)),keys);
    assert.deepEqual(current,original);
    const sideways = await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
    assert.equal(sideways,false,"mobile must not scroll sideways");
    assert.match(await page.locator("a.return").getAttribute("href"),/index\.html/);
    await context.close();
    passes++;
  }

  // Static SW cache includes the chronicle; confirm it actually works with the network disabled.
  const ctx = await browser.newContext({serviceWorkers:"allow"});
  const page = await ctx.newPage();
  await page.goto(base+"/cronica.html",{waitUntil:"networkidle"});
  await page.evaluate(async ()=>{
    const reg = await navigator.serviceWorker.ready;
    await navigator.serviceWorker.controller || await new Promise(resolve=>navigator.serviceWorker.addEventListener("controllerchange",resolve,{once:true}));
    const names = await caches.keys();
    const match = names.find(n=>n.includes("peren-phaser-m1hf-preview-"));
    if(!match)throw Error("precached version missing");
    for(const p of ["./cronica.html","./cronica.js","./data/cronica-canonica.json"]){
      if(!(await caches.match(p)))throw Error("not precached: "+p);
    }
  });
  await ctx.setOffline(true);
  await page.goto(base+"/cronica.html?offline=1",{waitUntil:"domcontentloaded"});
  await page.waitForSelector(".timeline-entry");
  assert.equal(await page.locator(".timeline-entry").count(),21);
  await ctx.close();
  passes++;
  console.log("LORE-02 browser QA OK ("+passes+" scenarios: three viewports + offline)");
} finally {
  await browser.close();
}
