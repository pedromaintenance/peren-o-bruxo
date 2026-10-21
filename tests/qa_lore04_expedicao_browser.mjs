// Browser acceptance: 4 volunteers, 3 approaches, immutable checkpoint, PWA offline.
import assert from "node:assert/strict";
import {chromium} from "playwright";
const base=process.env.LORE04_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const protectedKeys=["peren_carcaca_save_v1","peren_phaser_save_m1d_v1","peren_phaser_save_m1hf_preview_v1"];
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const ctx=await browser.newContext({viewport:{width,height},acceptDownloads:true,serviceWorkers:"allow"});
  const page=await ctx.newPage();
  page.on("dialog",d=>d.accept());
  await page.goto(base+"/campanha.html",{waitUntil:"domcontentloaded"});
  await page.waitForSelector(".expedition-ally",{state:"visible"});
  assert.equal(await page.locator(".expedition-ally").count(),4);
  assert.equal(await page.locator("#expeditionDepart").isDisabled(),true);
  await page.evaluate(keys=>keys.forEach((k,i)=>localStorage.setItem(k,"protected-"+i)),protectedKeys);
  assert.equal(await page.evaluate(()=>localStorage.getItem("peren_campanha_v1")),null);
  await page.locator("#beginCampaign").click();
  await page.waitForSelector("#councilTopics button",{state:"visible"});
  await page.locator("#councilTopics button").first().click(); // Veyra consultada
  await page.locator("#routeChoices input[value='oficial']").check();
  await page.locator("#planCouncilRoute").click();
  const allies=page.locator(".expedition-ally");
  await allies.nth(0).locator("button").nth(1).click(); // proposta recusada
  assert.match(await allies.nth(0).innerText(),/Proposta recusada/);
  assert.equal(await page.locator("#expeditionDepart").isDisabled(),true);
  for(let i=0;i<4;i++)await allies.nth(i).locator("button").first().click();
  assert.equal(await page.locator("#expeditionDepart").isEnabled(),true);
  await page.locator("#expeditionDepart").click();
  await page.waitForSelector("#expeditionApproach",{state:"visible"});
  let s=await page.evaluate(()=>JSON.parse(localStorage.getItem("peren_campanha_v1")));
  assert.equal(s.phase,"aproximacao");
  assert.equal(s.checkpoint,"trilha_eldroth_rumo_ao_rio");
  assert.equal(s.choices.filter(x=>x.type==="partida").length,1);
  assert.equal(await page.locator("#routeChoices input:not(:disabled)").count(),0);
  assert.equal(await page.locator("#expeditionObservations button").count(),3);
  await page.locator("#expeditionObservations button").first().click();
  s=await page.evaluate(()=>JSON.parse(localStorage.getItem("peren_campanha_v1")));
  assert.equal(s.choices.find(x=>x.type==="observacao").method,"anel");
  assert.match(await page.locator("#expeditionConsequence").innerText(),/rastreamento recíproco/i);
  assert.equal(await page.locator("#expeditionObservations button:not(:disabled)").count(),0);
  assert.deepEqual(await page.evaluate(keys=>keys.map(k=>localStorage.getItem(k)),protectedKeys),["protected-0","protected-1","protected-2"]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2),false,"horizontal overflow at "+width);
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForSelector("#expeditionApproach",{state:"visible"});
  assert.equal(await page.locator("#expeditionSetup").isVisible(),false);
  assert.equal(await page.locator("#expeditionObservations button:not(:disabled)").count(),0);
  const download=page.waitForEvent("download");
  await page.locator("#exportCampaign").click();
  assert.equal((await download).suggestedFilename(),"peren-campanha-v1-backup.json");
  await ctx.close();
 }
 const ctx=await browser.newContext({serviceWorkers:"allow"});
 const page=await ctx.newPage();
 await page.goto(base+"/campanha.html",{waitUntil:"networkidle"});
 await page.evaluate(async()=>{
  await navigator.serviceWorker.ready;
  if(!navigator.serviceWorker.controller)await new Promise(r=>navigator.serviceWorker.addEventListener("controllerchange",r,{once:true}));
  for(const p of ["./campanha.html","./campanha.js","./expedicao-eldroth.js","./data/expedicao-eldroth.json"]){
   const asset=await caches.match(p);if(!asset||!asset.ok)throw Error("Missing offline: "+p);
  }
 });
 await ctx.setOffline(true);
 await page.goto(base+"/campanha.html?offline=1",{waitUntil:"domcontentloaded"});
 await page.waitForSelector(".expedition-ally",{state:"attached"});
 assert.equal(await page.locator(".expedition-ally").count(),4);
 await ctx.close();
 console.log("LORE-04.2 expedition QA passed: consent, route, observation, 3 viewports and offline.");
}finally{await browser.close()}
