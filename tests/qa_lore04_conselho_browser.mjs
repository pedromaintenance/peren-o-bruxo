// LORE-04 Council QA, layered on top of existing official portrait QA.
import assert from "node:assert/strict";
import { chromium } from "playwright";
const base=process.env.LORE04_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const ctx=await browser.newContext({viewport:{width,height},serviceWorkers:"allow",acceptDownloads:true});
  const page=await ctx.newPage();
  await page.goto(base+"/campanha.html",{waitUntil:"domcontentloaded"});
  await page.waitForSelector("#councilPeople button",{state:"visible"});
  assert.equal(await page.locator("#councilPeople button").count(),5);
  assert.equal(await page.locator("#routeChoices input").count(),3);
  assert.equal(await page.locator("#councilTopics button:disabled").count(),2);
  await page.evaluate(()=>{localStorage.setItem("peren_carcaca_save_v1","locked");localStorage.setItem("peren_phaser_save_m1hf_preview_v1","locked2")});
  assert.equal(await page.evaluate(()=>localStorage.getItem("peren_campanha_v1")),null);
  await page.locator("#beginCampaign").click();
  await page.locator("#councilTopics button").first().click(); // Veyra - routes
  await page.waitForFunction(()=>{const raw=localStorage.getItem("peren_campanha_v1");return raw&&JSON.parse(raw).choices.length===1});
  assert.equal(await page.locator("#planCouncilRoute").isEnabled(),true);
  assert.ok((await page.locator("#councilPeople button").first().innerText()).includes("1/2"));
  await page.locator("#councilPeople button").nth(1).click(); // Dren
  await page.locator("#councilTopics button").first().click();
  await page.locator("#routeChoices input[value='clandestina']").check();
  page.once("dialog",dialog=>dialog.accept());
  await page.locator("#planCouncilRoute").click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem("peren_campanha_v1")).choices.some(x=>x.type==="plano"));
  let s=await page.evaluate(()=>JSON.parse(localStorage.getItem("peren_campanha_v1")));
  assert.equal(s.choices.length,3);
  assert.equal(s.choices.find(x=>x.type==="plano").route,"clandestina");
  assert.equal(s.checkpoint,"acampamento_eldroth_pos_cripta");
  assert.equal(s.phase,"preparacao");
  assert.deepEqual(await page.evaluate(()=>[localStorage.getItem("peren_carcaca_save_v1"),localStorage.getItem("peren_phaser_save_m1hf_preview_v1")]),["locked","locked2"]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,"horizontal scroll "+width);
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForSelector("#routeChoices input",{state:"attached"});
  assert.equal(await page.locator("#routeChoices input[value='clandestina']").isChecked(),true);
  assert.match(await page.locator("#routeStatus").innerText(),/Nenhuma travessia realizada/);
  const dl=page.waitForEvent("download");
  await page.locator("#exportCampaign").click();
  assert.equal((await dl).suggestedFilename(),"peren-campanha-v1-backup.json");
  await ctx.close();
 }
 const ctx=await browser.newContext({serviceWorkers:"allow"});
 const page=await ctx.newPage();
 await page.goto(base+"/campanha.html",{waitUntil:"networkidle"});
 await page.evaluate(async()=>{
  await navigator.serviceWorker.ready;
  if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener("controllerchange",resolve,{once:true}));
  for(const p of ["./campanha.html","./campanha.js","./conselho-eldroth.js","./data/conselho-eldroth.json"]){
   if(!(await caches.match(p)))throw Error("cache missing "+p);
  }
 });
 await ctx.setOffline(true);
 await page.goto(base+"/campanha.html?offline=1",{waitUntil:"domcontentloaded"});
 await page.waitForSelector("#councilPeople button",{state:"visible"});
 assert.equal(await page.locator("#councilPeople button").count(),5);
 await ctx.close();
 console.log("LORE-04 Council QA passed (360/390/1280 px, backup, offline)");
}finally{await browser.close()}
