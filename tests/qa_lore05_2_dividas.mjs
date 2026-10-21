import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {runInNewContext,Script} from "node:vm";
const base=resolve(dirname(fileURLToPath(import.meta.url)),"../phaser-demo-m1hf");
const read=x=>readFileSync(resolve(base,x),"utf8");
const script=read("campanha.js");
const info=JSON.parse(read("data/dividas-mortos.json"));
const KEY="peren_campanha_v1";
function session(){
 const seed={schema:"peren-campaign-save",schemaVersion:1,mode:"campanha",checkpoint:"acampamento_eldroth_pos_cripta",phase:"preparacao",chronicleRef:"1.0.0",createdAt:"2026-10-21T00:00:00Z",updatedAt:"2026-10-21T00:00:00Z",choices:[]};
 const data=new Map([[KEY,JSON.stringify(seed)],["peren_carcaca_save_v1","original"]]);
 const writes=[];const elements=new Map(["beginCampaign","exportCampaign","slotStatus","slotDescription"].map(k=>[k,{hidden:false,disabled:false,textContent:"",addEventListener(){}}]));
 const document={getElementById:id=>elements.get(id),createElement:()=>({click(){},remove(){}}),body:{append(){}}};
 const localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v);writes.push(k)}};
 const window={dispatchEvent(){}};
 runInNewContext(script,{document,localStorage,window,JSON,Date,Blob,URL:{createObjectURL(){return "blob:stub"},revokeObjectURL(){}},Event:class Event{},setTimeout(){}});
 return {api:window.PerenCampanhaSave,data,writes};
}
function setup(s){
 s.saveChoice({type:"dialogo",npc:"veyra",topic:"rotas"});
 s.saveChoice({type:"plano",route:"oficial"});
 for(const [npc,term] of Object.entries({veyra:"ritmo_compassado",dren:"contrato_claro",orel:"posicao_protegida",tavin:"moedas_reservadas"}))s.saveChoice({type:"acordo",npc,term});
 s.saveChoice({type:"partida",route:"oficial"});
 s.saveChoice({type:"observacao",method:"a_pe"});
 s.saveChoice({type:"chegada",route:"oficial"});
}
test("data, view and PWA resources",()=>{
 assert.equal(info.schema,"peren-debts-investigation-1");
 assert.equal(info.investigations.length,2);
 assert.equal(info.witnesses.length,2);
 assert.ok(info.note.includes("ficção nova"));
 assert.match(info.state.name,/PENDENTE/);
 for(const f of ["./dividas-mortos.js","./data/dividas-mortos.json"])assert.ok(read("demo-sw.js").includes(JSON.stringify(f)));
 for(const id of ["deadDebtsLeads","deadDebtsWitnesses","deadDebtsState"])assert.ok(read("campanha.html").includes('id="'+id+'"'));
 new Script(read("dividas-mortos.js"));new Script(script);
});
test("investigation requires river and records no ritual completion",()=>{
 const h=session();
 assert.throws(()=>h.api.saveChoice({type:"pista",subject:"vaso",method:"conferir_carga"}));
 setup(h.api);
 h.api.saveChoice({type:"pista",subject:"vaso",method:"conferir_carga"});
 h.api.saveChoice({type:"pista",subject:"nome",method:"depoimentos"});
 h.api.saveChoice({type:"convite",npc:"orel",approach:"convite_livre"});
 h.api.saveChoice({type:"convite",npc:"dren",approach:"impor_contrato"});
 assert.equal(h.api.read().choices.filter(c=>c.type==="pista").length,2);
 assert.equal(h.api.read().choices.filter(c=>c.type==="convite").length,2);
 assert.equal(h.api.read().choices.filter(c=>c.type==="moedas").length,0);
 assert.equal(h.api.read().choices.filter(c=>c.type==="pendencia").length,0);
 assert.equal(h.api.read().checkpoint,"margem_rio_ancestral");
 assert.equal(h.data.get("peren_carcaca_save_v1"),"original");
 assert.ok(h.writes.every(k=>k===KEY));
});
test("choice revision keeps only one approach per person and subject",()=>{
 const h=session();setup(h.api);
 h.api.saveChoice({type:"pista",subject:"vaso",method:"conferir_carga"});
 h.api.saveChoice({type:"pista",subject:"vaso",method:"avaliar_lampada"});
 h.api.saveChoice({type:"convite",npc:"orel",approach:"exigir_juramento"});
 h.api.saveChoice({type:"convite",npc:"orel",approach:"convite_livre"});
 assert.equal(h.api.read().choices.filter(c=>c.type==="pista"&&c.subject==="vaso").length,1);
 assert.equal(h.api.read().choices.filter(c=>c.type==="convite"&&c.npc==="orel").length,1);
 assert.throws(()=>h.api.saveChoice({type:"pista",subject:"nome",method:"nome_aleatorio"}));
 assert.throws(()=>h.api.saveChoice({type:"convite",npc:"orel",approach:"consentimento_final"}));
});
