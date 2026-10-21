// LORE-04 Council deterministic save contract.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve,dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext, Script } from "node:vm";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const folder=resolve(root,"phaser-demo-m1hf");
const code=readFileSync(resolve(folder,"campanha.js"),"utf8");
const scene=readFileSync(resolve(folder,"conselho-eldroth.js"),"utf8");
const data=JSON.parse(readFileSync(resolve(folder,"data/conselho-eldroth.json"),"utf8"));
const html=readFileSync(resolve(folder,"campanha.html"),"utf8");
const sw=readFileSync(resolve(folder,"demo-sw.js"),"utf8");
const doc=JSON.parse(readFileSync(resolve(root,"lore/peren/Dossie_Peren_Kerrhylon_RPG_Carcaca.json"),"utf8"));
const K="peren_campanha_v1";
function harness(initial={}){
 const data=new Map(Object.entries(initial)),writes=[];
 const dom=new Map(["beginCampaign","exportCampaign","slotStatus","slotDescription"].map(id=>[id,{hidden:false,disabled:false,textContent:"",events:{},addEventListener(k,fn){this.events[k]=fn}}]));
 const localStorage={getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>{writes.push(k);data.set(k,String(v))}};
 const window={dispatchEvent(){}};
 const document={getElementById:id=>dom.get(id),createElement:()=>({click(){},remove(){}}),body:{append(){}}};
 runInNewContext(code,{window,document,localStorage,Date,JSON,Event:class Event{},Blob,URL:{createObjectURL(){return "blob:mock"},revokeObjectURL(){}},setTimeout(){}});
 return {data,writes,start:()=>dom.get("beginCampaign").events.click(),store:window.PerenCampanhaSave,dom};
}
test("Provenance: correct NPCs, no invented transport costs",()=>{
 assert.equal(data.schema,"peren-eldroth-council-1");
 assert.deepEqual(data.companions.map(n=>n.name), [...doc.companhia.membros.map(x=>x.nome), doc.familiar.nome]);
 assert.equal(data.routes.length,3);
 assert.deepEqual(data.routes.map(x=>x.id),["oficial","clandestina","autonoma"]);
 assert.ok(!JSON.stringify(data).includes("peças de ouro de pedágio"));
 new Script(code);new Script(scene);
 for(const s of ["eldrothCouncil","councilPeople","councilTopics","routeChoices","planCouncilRoute","conselho-eldroth.js"])assert.ok(html.includes(s),s);
 for(const s of ["./conselho-eldroth.js","./data/conselho-eldroth.json"])assert.ok(sw.includes(JSON.stringify(s)),s);
});
test("Choices require an explicit campaign record, Veyra consultation, then plan",()=>{
 const h=harness({"peren_carcaca_save_v1":"classic","peren_phaser_save_m1hf_preview_v1":"preview"});
 assert.throws(()=>h.store.saveChoice({type:"dialogo",npc:"veyra",topic:"rotas"}),/Inicie/);
 h.start();
 assert.equal(h.store.read().choices.length,0);
 assert.throws(()=>h.store.saveChoice({type:"plano",route:"oficial"}),/Consulte Veyra/);
 h.store.saveChoice({type:"dialogo",npc:"veyra",topic:"rotas"});
 h.store.saveChoice({type:"dialogo",npc:"dren",topic:"vigia"});
 h.store.saveChoice({type:"plano",route:"oficial"});
 assert.equal(h.store.read().choices.length,3);
 h.store.saveChoice({type:"plano",route:"clandestina"});
 assert.equal(h.store.read().choices.length,3,"replacing provisional plan does not duplicate commitments");
 assert.equal(h.store.read().choices.find(x=>x.type==="plano").route,"clandestina");
 h.store.saveChoice({type:"dialogo",npc:"veyra",topic:"rotas"});
 assert.equal(h.store.read().choices.length,3,"dialogue is idempotent");
 assert.deepEqual(h.writes.filter(k=>k!=="peren_campanha_v1"),[]);
 assert.equal(h.data.get("peren_carcaca_save_v1"),"classic");
 assert.equal(h.data.get("peren_phaser_save_m1hf_preview_v1"),"preview");
 assert.equal(h.store.read().checkpoint,"acampamento_eldroth_pos_cripta");
 assert.equal(h.store.read().phase,"preparacao");
 assert.equal(h.store.read().chronicleRef,"1.0.0");
});
test("Corrupt/future saves remain protected",()=>{
 const h=harness({[K]:JSON.stringify({schema:"peren-campaign-save",schemaVersion:99})});
 assert.equal(h.dom.get("beginCampaign").disabled,true);
 assert.throws(()=>h.store.saveChoice({type:"dialogo",npc:"veyra",topic:"rotas"}));
 assert.equal(h.writes.length,0);
});
test("Legacy empty-choice LORE-03 save still loads",()=>{
 const h=harness({[K]:JSON.stringify({schema:"peren-campaign-save",schemaVersion:1,mode:"campanha",checkpoint:"acampamento_eldroth_pos_cripta",phase:"preparacao",chronicleRef:"1.0.0",createdAt:"2026-10-21T00:00:00.000Z",updatedAt:"2026-10-21T00:00:00.000Z",choices:[]})});
 assert.ok(h.store.read());assert.equal(h.writes.length,0);assert.equal(h.dom.get("beginCampaign").hidden,true);
});
