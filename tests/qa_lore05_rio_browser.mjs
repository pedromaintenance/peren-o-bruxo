// Chromium smoke: River arrival, exact vow, once-only offering, 3 pending tasks and offline.
import assert from "node:assert/strict";
import {chromium} from "playwright";
const base=process.env.LORE05_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const PHRASE="Estes passaram sem registro, mas não sem peso.";
const protectedKeys=["peren_carcaca_save_v1","peren_phaser_save_m1d_v1","peren_phaser_save_m1hf_preview_v1"];
try{
 for(const [width,height] of [[360,800],[390,844],[1280,800]]){
  const ctx=await browser.newContext({viewport:{width,height},serviceWorkers:"allow",acceptDownloads:true});
  const page=await ctx.newPage();page.on("dialog",d=>d.accept());
  await page.goto(base+"/campanha.html",{waitUntil:"domcontentloaded"});
  await page.waitForSelector("#beginCampaign");
  assert.equal(await page.locator("#ancestralRiver").isVisible(),false);
  await page.evaluate(keys=>keys.forEach((k,i)=>localStorage.setItem(k,"protected-"+i)),protectedKeys);
  await page.locator("#beginCampaign").click();
  await page.waitForFunction(()=>Boolean(window.PerenCampanhaSave?.read()));
  await page.evaluate(()=>{
    const s=window.PerenCampanhaSave;
    s.saveChoice({type:"dialogo",npc:"veyra",topic:"rotas"});
    s.saveChoice({type:"plano",route:"clandestina"});
    for(const [npc,term] of Object.entries({veyra:"ritmo_compassado",dren:"contrato_claro",orel:"posicao_protegida",tavin:"moedas_reservadas"}))
      s.saveChoice({type:"acordo",npc,term});
    s.saveChoice({type:"partida",route:"clandestina"});
  });
  await page.waitForSelector("#ancestralRiver",{state:"visible"});
  assert.equal(await page.locator("#riverReach").isDisabled(),true);
  await page.evaluate(()=>window.PerenCampanhaSave.saveChoice({type:"observacao",method:"a_pe"}));
  assert.equal(await page.locator("#riverReach").isEnabled(),true);
  await page.locator("#riverReach").click();
  await page.waitForSelector("#riverAtBank",{state:"visible"});
  assert.match(await page.locator("#riverBankScene").innerText(),/balsa|barqueiro/i);
  assert.equal(await page.locator("#riverOfferCoins").count(),1);
  assert.equal(await page.locator(".river-requirement").count(),3);
  assert.ok((await page.locator("#riverCoins").innerText()).includes(PHRASE));
  await page.locator("#riverOfferCoins").click();
  await page.waitForFunction(()=>window.PerenCampanhaSave.read().choices.some(x=>x.type==="moedas"));
  assert.equal(await page.locator("#riverOfferCoins").count(),0);
  await page.locator(".river-note").first().click();
  let s=await page.evaluate(()=>window.PerenCampanhaSave.read());
  assert.equal(s.phase,"margem");assert.equal(s.checkpoint,"margem_rio_ancestral");
  assert.equal(s.choices.find(x=>x.type==="moedas").phrase,PHRASE);
  assert.equal(s.choices.filter(x=>x.type==="moedas").length,1);
  assert.equal(s.choices.filter(x=>x.type==="pendencia").length,1);
  assert.deepEqual(await page.evaluate(keys=>keys.map(k=>localStorage.getItem(k)),protectedKeys),["protected-0","protected-1","protected-2"]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,"horizontal overflow "+width);
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForSelector("#riverAtBank",{state:"visible"});
  assert.equal(await page.locator("#riverOfferCoins").count(),0);
  assert.equal(await page.locator(".river-requirement").count(),3);
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
  if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener("controllerchange",resolve,{once:true}));
  for(const p of ["./campanha.html","./campanha.js","./rio-ancestral.js","./data/rio-ancestral.json"]){
   const v=await caches.match(p);if(!v?.ok)throw new Error("Offline cache missing "+p);
  }
 });
 await ctx.setOffline(true);
 await page.goto(base+"/campanha.html?offline=1",{waitUntil:"domcontentloaded"});
 await page.waitForFunction(()=>!!window.PerenCampanhaSave);
 const present=await page.locator("#ancestralRiver").count();
 assert.equal(present,1);
 await ctx.close();
 console.log("LORE-05 River QA passed: 360/390/1280 px, offering, reload, save isolation, offline.");
}finally{await browser.close()}
