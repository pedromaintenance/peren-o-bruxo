// LORE-05: Rio Ancestral, offering and return-promise state invariants.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {runInNewContext,Script} from "node:vm";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const folder=resolve(root,"phaser-demo-m1hf");
const read=p=>readFileSync(resolve(folder,p),"utf8");
const code=read("campanha.js"),river=read("rio-ancestral.js");
const html=read("campanha.html"),sw=read("demo-sw.js"),data=JSON.parse(read("data/rio-ancestral.json"));
const canon=JSON.parse(readFileSync(resolve(root,"lore/peren/Dossie_Peren_Kerrhylon_RPG_Carcaca.json"),"utf8"));
const KEY="peren_campanha_v1",PHRASE="Estes passaram sem registro, mas não sem peso.";
const empty=()=>({schema:"peren-campaign-save",schemaVersion:1,mode:"campanha",checkpoint:"acampamento_eldroth_pos_cripta",phase:"preparacao",chronicleRef:"1.0.0",createdAt:"2026-10-21T10:00:00Z",updatedAt:"2026-10-21T10:00:00Z",choices:[]});
function harness(initial={}){
 const db=new Map(Object.entries({[KEY]:JSON.stringify(empty()),...initial})),writes=[];
 const ids=new Map(["beginCampaign","exportCampaign","slotStatus","slotDescription"].map(id=>[id,{hidden:false,disabled:false,textContent:"",events:{},addEventListener(n,fn){this.events[n]=fn}}]));
 const window={dispatchEvent(){}};
 const localStorage={getItem:k=>db.has(k)?db.get(k):null,setItem:(k,v)=>{writes.push(k);db.set(k,String(v))}};
 const document={getElementById:id=>ids.get(id),createElement:()=>({click(){},remove(){}}),body:{append(){}}};
 runInNewContext(code,{window,document,localStorage,Date,JSON,Blob,URL:{createObjectURL(){return "blob:fake"},revokeObjectURL(){}},setTimeout(){},Event:class Event{}});
 return {db,writes,api:window.PerenCampanhaSave,ids};
}
function prepare(api,route="oficial",method="a_pe"){
 api.saveChoice({type:"dialogo",npc:"veyra",topic:"rotas"});
 api.saveChoice({type:"plano",route});
 for(const [npc,term] of Object.entries({veyra:"ritmo_compassado",dren:"contrato_claro",orel:"posicao_protegida",tavin:"moedas_reservadas"}))
   api.saveChoice({type:"acordo",npc,term});
 api.saveChoice({type:"partida",route});
 api.saveChoice({type:"observacao",method});
}
test("canon for three coins and second ritual is verbatim, not auto-completed",()=>{
 assert.equal(data.schema,"peren-rio-ancestral-1");
 assert.equal(data.coins.reserved,3);
 assert.equal(data.coins.phrase,PHRASE);
 assert.equal(data.coins.phrase,canon.rituais_e_frases.tres_moedas);
 assert.equal(data.coins.optional,canon.rituais_e_frases.convite_opcional_aos_mortos);
 assert.deepEqual(data.returnRite.requirements.map(r=>r.task),["vaso_fechado","nome_verdadeiro","testemunhas_voluntarias"]);
 assert.match(data.returnRite.mask,/permanece na cripta/);
 assert.match(data.factuality,/ficção NOVA/);
 for(const p of ["./rio-ancestral.js","./data/rio-ancestral.json"])assert.ok(sw.includes(JSON.stringify(p)),p);
 for(const id of ["ancestralRiver","riverReach","riverCoins","riverRiteRequirements"])assert.ok(html.includes(id),id);
 new Script(code);new Script(river);
});
test("three routes reach bank only after reconnaissance, and crossings remain unresolved",()=>{
 for(const route of ["oficial","clandestina","autonoma"]){
  const h=harness({"peren_carcaca_save_v1":"untouched-classic","peren_phaser_save_m1hf_preview_v1":"untouched-preview"});
  const api=h.api;
  assert.throws(()=>api.saveChoice({type:"chegada",route}),/Ação indisponível/);
  prepare(api,route);
  assert.equal(api.read().phase,"aproximacao");
  assert.equal(api.read().checkpoint,"trilha_eldroth_rumo_ao_rio");
  assert.throws(()=>api.saveChoice({type:"chegada",route:route==="oficial"?"clandestina":"oficial"}),/rota não pode mudar/);
  api.saveChoice({type:"chegada",route});
  assert.equal(api.read().phase,"margem");
  assert.equal(api.read().checkpoint,"margem_rio_ancestral");
  assert.equal(api.read().choices.filter(c=>c.type==="chegada").length,1);
  assert.throws(()=>api.saveChoice({type:"chegada",route}),/Ação indisponível/);
  assert.throws(()=>api.saveChoice({type:"observacao",method:"anel"}),/Ação indisponível/);
  assert.equal(h.db.get("peren_carcaca_save_v1"),"untouched-classic");
  assert.equal(h.db.get("peren_phaser_save_m1hf_preview_v1"),"untouched-preview");
  assert.ok(h.writes.every(k=>k===KEY));
 }
});
test("irreversible coins action consumes only reserved offering and protects other obligations",()=>{
 const h=harness();const api=h.api;
 assert.throws(()=>api.saveChoice({type:"moedas",phrase:PHRASE}),/Ação indisponível/);
 prepare(api,"clandestina","presas");
 api.saveChoice({type:"chegada",route:"clandestina"});
 assert.throws(()=>api.saveChoice({type:"moedas",phrase:"Outra frase"}),/Registro não compatível|Ação incompatível|Escolha incompatível/);
 api.saveChoice({type:"moedas",phrase:PHRASE});
 const s=api.read();
 assert.equal(s.choices.filter(x=>x.type==="moedas").length,1);
 assert.equal(s.choices.find(x=>x.type==="moedas").phrase,PHRASE);
 assert.throws(()=>api.saveChoice({type:"moedas",phrase:PHRASE}),/já foram entregues/);
 assert.equal(api.read().phase,"margem");
 assert.equal(api.read().choices.filter(x=>x.type==="pendencia").length,0);
});
test("return-to-crypt requirements are only recorded as pending; idempotent and save compatible",()=>{
 const h=harness();const s=h.api;prepare(s,"autonoma","anel");
 s.saveChoice({type:"chegada",route:"autonoma"});
 for(const task of ["vaso_fechado","nome_verdadeiro","testemunhas_voluntarias"])s.saveChoice({type:"pendencia",task});
 const before=h.writes.length;
 s.saveChoice({type:"pendencia",task:"vaso_fechado"});
 assert.equal(h.writes.length,before);
 assert.equal(s.read().choices.filter(c=>c.type==="pendencia").length,3);
 const reload=harness({[KEY]:h.db.get(KEY)});
 assert.equal(reload.api.read().checkpoint,"margem_rio_ancestral");
 assert.equal(reload.writes.length,0);
 assert.equal(reload.api.read().choices.filter(x=>x.type==="moedas").length,0);
});
test("tampered coins before bank or false bank checkpoint cannot overwrite saves",()=>{
 const bad=empty();
 bad.phase="margem";bad.checkpoint="margem_rio_ancestral";
 bad.choices=[{type:"moedas",phrase:PHRASE,at:"2026-10-21T13:00:00Z"}];
 const h=harness({[KEY]:JSON.stringify(bad)});
 assert.throws(()=>h.api.read(),/incompatível/);
 assert.equal(h.writes.length,0);
 assert.equal(h.ids.get("beginCampaign").disabled,true);
 const prior=harness();
 assert.equal(prior.api.read().choices.length,0);
 assert.equal(prior.writes.length,0);
});
