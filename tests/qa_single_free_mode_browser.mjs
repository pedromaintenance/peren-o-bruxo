import assert from "node:assert/strict";
import {chromium} from "playwright";
const base=process.env.PEREN_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try {
  for(const width of [360,390,1280]){
    const context=await browser.newContext({viewport:{width,height:800},serviceWorkers:"allow"});
    const page=await context.newPage();
    await page.goto(base+"/",{waitUntil:"domcontentloaded"});
    assert.equal(await page.locator("#selectPerenMode").count(),0);
    assert.equal(await page.locator("#readCampChronicle").count(),0);
    assert.equal(await page.locator('a[href="./campanha.html"]').count(),0);
    assert.equal(await page.locator('img[src="./art/characters/peren/official-v1/portrait-runtime.svg"]').count(),1);
    assert.equal(await page.locator("#phaser").count(),1);
    const img=page.locator('img[src="./art/characters/peren/official-v1/portrait-runtime.svg"]');
    await img.evaluate(async im=>{await im.decode()});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3),false);
    await context.close();
  }
  const context=await browser.newContext({serviceWorkers:"allow"});
  const page=await context.newPage();
  await page.goto(base+"/",{waitUntil:"networkidle"});
  await page.evaluate(async()=>{
    await navigator.serviceWorker.ready;
    if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener("controllerchange",resolve,{once:true}));
    const keys=await caches.keys();
    const active=keys.filter(x=>x.startsWith("peren-phaser-m1hf-preview-"));
    if(active.length!==1||!active[0].includes("single-free"))throw Error("Unexpected cache version: "+keys);
    for(const f of ["./modos.html","./campanha.html","./cronica.html"]){
      if(await caches.match(f))throw Error("Retired page persisted in cache: "+f);
    }
    const portrait=await caches.match("./art/characters/peren/official-v1/portrait-runtime.svg");
    if(!portrait?.ok)throw Error("Missing official portrait offline");
  });
  await context.setOffline(true);
  await page.reload({waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("#phaser").count(),1);
  await context.close();
  console.log("Peren single free mode QA: 360 / 390 / 1280 px and offline passed");
} finally {await browser.close()}
