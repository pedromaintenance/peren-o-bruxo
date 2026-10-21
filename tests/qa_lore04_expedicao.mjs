// LORE-04.2 contract: expedição parcial, consentimento, riscos e saves retrocompatíveis.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
import {runInNewContext,Script} from "node:vm";
const base=resolve(dirname(fileURLToPath(import.meta.url)),"../phaser-demo-m1hf");
const read=p=>readFileSync(resolve(base,p),"utf8");
const code=read("campanha.js"), travel=read("expedicao-eldroth.js"), page=read("campanha.html"), sw=read("demo-sw.js");
const data=JSON.parse(read("data/expedicao-eldroth.json"));
const KEY="peren_campanha_v1";
const seed=JSON.stringify({schema:"peren-campaign-save",schemaVersion:1,mode:"campanha",checkpoint:"acampamento_eldroth_pos_cripta",phase:"preparacao",chronicleRef:"1.0.0",createdAt:"2026-10-21T00:00:00Z",updatedAt:"2026-10-21T00:00:00Z",choices:[]});
function sandbox(raw){
 const db=new Map(Object.entries(raw??{[KEY]:seed})),writes=[],ids=new Map(["beginCampaign","exportCampaign","slotStatus","slotDescription"].map(id=>[id,{hidden:false,disabled:false,textContent:"",events:{},addEventListener(n,fn){this.events[n]=fn}}]));
 const localStorage={getItem:k=>db.has(k)?db.get(k):null,setItem:(k,v)=>{writes.push(k);db.set(k,String(v))}};
 const window={dispatchEvent(){}},document={getElementById:id=>ids.get(id),createElement:()=>({click(){},remove(){}}),body:{append(){}}};
 runInNewContext(code,{window,document,localStorage,Date,JSON,Blob,URL:{createObjectURL(){return "blob:stub"},revokeObjectURL(){}},setTimeout(){},Event:class Event{}});
 return {store:window.PerenCampanhaSave,db,writes,ids};
}
const plan=(s,route="oficial")=>{s.saveChoice({type:"dialogo",npc:"veyra",topic:"rotas"});s.saveChoice({type:"plano",route})};
const agree=(s,options={})=>{
 for(const [npc,term] of Object.entries({veyra:"ritmo_compassado",dren:"contrato_claro",orel:"posicao_protegida",tavin:"moedas_reservadas",...options}))s.saveChoice({type:"acordo",npc,term});
};
test("seeds, source limits and UI are present",()=>{
 assert.equal(data.schema,"peren-eldroth-approach-1");
 assert.equal(data.agreements.length,4);
 assert.equal(data.observations.length,3);
 assert.deepEqual(data.routes.map(r=>r.id),["oficial","clandestina","autonoma"]);
 for(const v of ["eldrothExpedition","expeditionAgreements","expeditionDepart","expeditionObservations","expeditionCosts","expedicao-eldroth.js"])assert.ok(page.includes(v),v);
 for(const v of ["./expedicao-eldroth.js","./data/expedicao-eldroth.json"])assert.ok(sw.includes(JSON.stringify(v)),v);
 assert.ok(data.materialLedger.some(x=>x.key==="moedas"&&/não gastas/.test(x.value)));
 assert.ok(data.materialLedger.some(x=>x.key==="pedagio"&&/Sem valor conhecido/.test(x.value)));
 assert.match(data.disclaimer,/não transcrição/);
 new Script(code);new Script(travel);
});
test("recusa impede partida; renegociação e plano são necessários",()=>{
 const h=sandbox({[KEY]:seed,"peren_carcaca_save_v1":"immutable-classic","peren_phaser_save_m1hf_preview_v1":"immutable-phaser"});
 const s=h.store;plan(s,"clandestina");
 s.saveChoice({type:"acordo",npc:"veyra",term:"marcha_forcada"});
 agree(s,{veyra:"marcha_forcada"});
 assert.throws(()=>s.saveChoice({type:"partida",route:"clandestina"}),/ainda não aceitou/);
 assert.equal(s.read().phase,"preparacao");
 s.saveChoice({type:"acordo",npc:"veyra",term:"ritmo_compassado"});
 assert.equal(s.read().choices.filter(c=>c.type==="acordo"&&c.npc==="veyra").length,1);
 assert.throws(()=>s.saveChoice({type:"partida",route:"oficial"}),/plano/);
 s.saveChoice({type:"partida",route:"clandestina"});
 assert.equal(s.read().phase,"aproximacao");
 assert.equal(s.read().checkpoint,"trilha_eldroth_rumo_ao_rio");
 assert.equal(s.read().choices.filter(c=>c.type==="partida").length,1);
 assert.throws(()=>s.saveChoice({type:"plano",route:"autonoma"}),/Ação indisponível/);
 assert.throws(()=>s.saveChoice({type:"dialogo",npc:"dren",topic:"vigia"}),/marcha já começou/);
 s.saveChoice({type:"observacao",method:"anel"});
 assert.equal(s.read().choices.at(-1).method,"anel");
 assert.throws(()=>s.saveChoice({type:"observacao",method:"presas"}),/já foi realizada/);
 assert.deepEqual(h.writes.filter(k=>k!==KEY),[]);
 assert.equal(h.db.get("peren_carcaca_save_v1"),"immutable-classic");
 assert.equal(h.db.get("peren_phaser_save_m1hf_preview_v1"),"immutable-phaser");
});
test("saves LORE-03 e LORE-04 existentes não são alterados na leitura",()=>{
 const old=sandbox();assert.equal(old.store.read().phase,"preparacao");assert.equal(old.writes.length,0);
 const council=sandbox();plan(council.store,"autonoma");
 const contents=council.db.get(KEY);
 const saved=sandbox({[KEY]:contents});
 assert.equal(saved.store.read().choices.length,2);
 assert.equal(saved.writes.length,0);
});
test("saves adulterados, versões futuras e partidas incoerentes são bloqueados",()=>{
 const x=JSON.parse(seed);x.schemaVersion=99;
 const future=sandbox({[KEY]:JSON.stringify(x)});
 assert.throws(()=>future.store.read());assert.equal(future.writes.length,0);
 const forged=JSON.parse(seed);forged.phase="aproximacao";forged.checkpoint="trilha_eldroth_rumo_ao_rio";
 forged.choices.push({type:"partida",route:"oficial",at:"2026-10-21T10:00:00Z"});
 const tamper=sandbox({[KEY]:JSON.stringify(forged)});
 assert.throws(()=>tamper.store.read());assert.equal(tamper.writes.length,0);
});
