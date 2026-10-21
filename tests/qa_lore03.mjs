// LORE-03: mode contract and campaign storage isolation.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
import {runInNewContext,Script} from "node:vm";
const dir=resolve(dirname(fileURLToPath(import.meta.url)),"../phaser-demo-m1hf");
const modes=readFileSync(resolve(dir,"modos.html"),"utf8");
const campaign=readFileSync(resolve(dir,"campanha.html"),"utf8");
const source=readFileSync(resolve(dir,"campanha.js"),"utf8");
const hub=readFileSync(resolve(dir,"index.html"),"utf8");
const sw=readFileSync(resolve(dir,"demo-sw.js"),"utf8");

function createHarness(initial={}) {
 const elements=new Map(["beginCampaign","exportCampaign","slotStatus","slotDescription"].map(id=>[id,{hidden:false,disabled:false,textContent:"",events:{},addEventListener(name,fn){this.events[name]=fn}}]));
 const data=new Map(Object.entries(initial)), writes=[];
 const localStorage={
  getItem(k){return data.has(k)?data.get(k):null},
  setItem(k,v){writes.push(k);data.set(k,String(v))}
 };
 const document={getElementById(id){return elements.get(id)},createElement(){return {click(){},remove(){}}},body:{append(){}}};
 runInNewContext(source,{document,localStorage,Date,JSON,Blob,URL:{createObjectURL(){return "blob:example"},revokeObjectURL(){}},setTimeout(){}});
 return {elements,data,writes,start:()=>elements.get("beginCampaign").events.click(),exportSave:()=>elements.get("exportCampaign").events.click()};
}

test("duas entradas de modo existem e não falsificam capacidade jogável",()=>{
 assert.match(hub,/id="selectPerenMode" href="\.\/modos.html"/);
 assert.match(modes,/href="\.\/index.html"/);
 assert.match(modes,/href="\.\/campanha.html"/);
 assert.match(modes,/Estrutura de campanha em construção/);
 assert.match(campaign,/a rota ainda/i);
 assert.match(campaign,/id="beginCampaign"/);
 new Script(source);
});

test("abrir a campanha não escreve nem lê outros saves",()=>{
 const h=createHarness({"peren_carcaca_save_v1":"classic","peren_phaser_save_m1d_v1":"m1d","peren_phaser_save_m1hf_preview_v1":"m1hf"});
 assert.deepEqual(h.writes,[]);
 assert.equal(h.elements.get("beginCampaign").hidden,false);
 h.start();
 assert.deepEqual(h.writes,["peren_campanha_v1"]);
 const obj=JSON.parse(h.data.get("peren_campanha_v1"));
 assert.deepEqual([obj.schema,obj.mode,obj.schemaVersion,obj.checkpoint,obj.phase,obj.chronicleRef,obj.choices.length],
 ["peren-campaign-save","campanha",1,"acampamento_eldroth_pos_cripta","preparacao","1.0.0",0]);
 assert.deepEqual(["peren_carcaca_save_v1","peren_phaser_save_m1d_v1","peren_phaser_save_m1hf_preview_v1"].map(x=>h.data.get(x)),["classic","m1d","m1hf"]);
 assert.equal(h.elements.get("beginCampaign").hidden,true);
 h.start();
 assert.equal(h.writes.length,1,"não reinicializar slot existente");
});

test("slot desconhecido bloqueia sobrescrita ao invés de corromper",()=>{
 const h=createHarness({"peren_campanha_v1":JSON.stringify({schema:"peren-campaign-save",schemaVersion:5})});
 assert.equal(h.elements.get("beginCampaign").disabled,true);
 assert.deepEqual(h.writes,[]);
 assert.match(h.elements.get("slotStatus").textContent,/não farei nenhuma sobrescrita/i);
});

test("precache contém os três recursos da campanha e o modo",()=>{
 for(const p of ["modos.html","campanha.html","campanha.js"]){
  assert.ok(sw.includes('"./'+p+'"'),p);
 }
 assert.match(campaign,/href="\.\/cronica.html"/);
});
