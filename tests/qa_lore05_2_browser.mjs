import assert from "node:assert/strict";
import {chromium} from "playwright";
const root=process.env.LORE052_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 for(const width of [360,390,1280]){
  const context=await browser.newContext({viewport:{width,height:840},serviceWorkers:"allow",acceptDownloads:true});
  const page=await context.newPage();
  page.on("dialog",dialog=>dialog.accept());
  await page.goto(root+"/campanha.html",{waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>!!window.PerenCampanhaSave);
  assert.equal(await page.locator("#deadDebts").isVisible(),false);
  await page.locator("#beginCampaign").click();
  await page.evaluate(()=>{
    const s=window.PerenCampanhaSave;
    s.saveChoice({type:"dialogo",npc:"veyra",topic:"rotas"});
    s.saveChoice({type:"plano",route:"oficial"});
    for(const [npc,term] of Object.entries({veyra:"ritmo_compassado",dren:"contrato_claro",orel:"posicao_protegida",tavin:"moedas_reservadas"}))s.saveChoice({type:"acordo",npc,term});
    s.saveChoice({type:"partida",route:"oficial"});
    s.saveChoice({type:"observacao",method:"a_pe"});
    s.saveChoice({type:"chegada",route:"oficial"});
  });
  await page.locator("#deadDebts").waitFor({state:"visible"});
  await page.locator(".debt-chapter").first().locator("summary").click();
  assert.equal(await page.locator("#deadDebtsLeads .debt-topic").count(),2);
  await page.locator("#deadDebtsLeads .debt-topic").first().locator("button").first().click();
  await page.waitForFunction(()=>window.PerenCampanhaSave.read().choices.some(c=>c.type==="pista"));
  await page.locator(".debt-chapter").nth(1).locator("summary").click();
  await page.locator("#deadDebtsWitnesses .debt-topic").first().locator("button").nth(1).click();
  await page.waitForFunction(()=>window.PerenCampanhaSave.read().choices.some(c=>c.type==="convite"));
  assert.match(await page.locator("#deadDebtsWitnesses").innerText(),/recusa|recua/i);
  await page.locator("#deadDebtsWitnesses .debt-topic").first().locator("button").first().click();
  const state=await page.evaluate(()=>window.PerenCampanhaSave.read());
  assert.equal(state.choices.filter(c=>c.type==="convite"&&c.npc==="orel").length,1);
  assert.equal(state.choices.find(c=>c.type==="convite").approach,"convite_livre");
  assert.equal(state.choices.filter(c=>c.type==="moedas").length,0);
  assert.match(await page.locator("#deadDebtsSummary").innerText(),/Nenhum vaso/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
  await page.reload();
  await page.locator("#deadDebts").waitFor({state:"visible"});
  assert.match(await page.locator("#deadDebtsSummary").innerText(),/2 linhas/);
  const dl=page.waitForEvent("download");
  await page.locator("#exportCampaign").click();
  assert.equal((await dl).suggestedFilename(),"peren-campanha-v1-backup.json");
  await context.close();
 }
 const ctx=await browser.newContext({serviceWorkers:"allow"});
 const page=await ctx.newPage();
 await page.goto(root+"/campanha.html",{waitUntil:"networkidle"});
 await page.evaluate(async()=>{
  await navigator.serviceWorker.ready;
  if(!navigator.serviceWorker.controller)await new Promise(r=>navigator.serviceWorker.addEventListener("controllerchange",r,{once:true}));
  for(const f of ["./dividas-mortos.js","./data/dividas-mortos.json"]){
    if(!(await caches.match(f))?.ok)throw Error("not cached "+f);
  }
 });
 await ctx.setOffline(true);
 await page.goto(root+"/campanha.html?offline=1",{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#deadDebts").count(),1);
 await ctx.close();
 console.log("LORE-05.2: dialogues, two widths mobile, desktop, save reload, offline PASS");
}finally{await browser.close()}
