/* LORE-03: one deliberately independent and minimally versioned campaign checkpoint.
 * No reads/writes to classic or Phaser preview keys. No gameplay or lore mutation here. */
(() => {
"use strict";
const KEY="peren_campanha_v1", VERSION=1;
const start=document.getElementById("beginCampaign");
const exportBtn=document.getElementById("exportCampaign");
const message=document.getElementById("slotStatus");
const desc=document.getElementById("slotDescription");
let state=null;
const NPCS=new Set(["veyra","dren","orel","tavin","presas"]);
const ROUTES=new Set(["oficial","clandestina","autonoma"]);
const TOPICS={
  veyra:["rotas","ferimentos"],
  dren:["vigia","contrato"],
  orel:["testemunho","temores"],
  tavin:["moedas","suprimentos"],
  presas:["reconhecimento","seguranca"]
};
function validChoice(c) {
  if(!c || typeof c!=="object" || Array.isArray(c))return false;
  if(typeof c.at!=="string" || !/^\d{4}-\d{2}-\d{2}T/.test(c.at))return false;
  if(c.type==="dialogo")return NPCS.has(c.npc) && TOPICS[c.npc].includes(c.topic);
  if(c.type==="plano")return ROUTES.has(c.route);
  return false;
}
function isValid(s) {
  return Boolean(s && typeof s==="object" && !Array.isArray(s) &&
    s.schema==="peren-campaign-save" && s.schemaVersion===VERSION &&
    s.mode==="campanha" && s.checkpoint==="acampamento_eldroth_pos_cripta" &&
    s.phase==="preparacao" && s.chronicleRef==="1.0.0" &&
    Array.isArray(s.choices) && s.choices.length<=24 && s.choices.every(validChoice));
}
function read() {
  const raw=localStorage.getItem(KEY);
  if(raw===null)return null;
  const obj=JSON.parse(raw);
  if(!isValid(obj))throw Error("Slot incompatível ou de versão futura; não sobrescrever");
  return obj;
}
function saveChoice(payload) {
  // Persist only the player's explicit decisions. Do not assume consent or travel.
  if(!payload || !["dialogo","plano"].includes(payload.type))throw Error("Escolha inválida");
  const prev=read();
  if(!prev)throw Error("Inicie o registro da campanha para escolher");
  const now=new Date().toISOString();
  const item={...payload,at:now};
  if(!validChoice(item))throw Error("Escolha incompatível");
  const choices=prev.choices.slice();
  if(item.type==="dialogo" && choices.some(x=>x.type==="dialogo" && x.npc===item.npc && x.topic===item.topic))return prev;
  if(item.type==="plano"){
    if(!choices.some(x=>x.type==="dialogo" && x.npc==="veyra" && x.topic==="rotas"))throw Error("Consulte Veyra sobre as rotas primeiro");
    // A route here is a provisional plan, not a crossing; replacing it is allowed.
    for(let i=choices.length-1;i>=0;i--)if(choices[i].type==="plano")choices.splice(i,1);
  }
  if(choices.length>=24)throw Error("Limite de registros atingido; faça backup antes de prosseguir");
  choices.push(item);
  const next={...prev,updatedAt:now,choices};
  if(!isValid(next))throw Error("Registro não compatível");
  localStorage.setItem(KEY,JSON.stringify(next));
  state=read(); render();
  if(typeof window!=="undefined" && window.dispatchEvent)window.dispatchEvent(new Event("peren:campaign-changed"));
  return state;
}
if(typeof window!=="undefined"){
  Object.defineProperty(window,"PerenCampanhaSave", {value:Object.freeze({read,saveChoice}),writable:false,configurable:false});
}
function render() {
  start.hidden=Boolean(state);
  exportBtn.hidden=!state;
  if(state) {
    message.textContent="Registro da Campanha ativo. Converse com a companhia e planeje a travessia abaixo.";
    desc.textContent="Conversas e planos só são gravados após sua escolha. O grupo ainda está no acampamento; viagem e combate não foram iniciados.";
  }else{
    message.textContent="Nenhum slot de campanha. O Modo Livre permanece intocado.";
  }
}
try{state=read();render()}
catch(err){
  start.disabled=true;exportBtn.hidden=true;
  message.textContent="Há dados de campanha que não consigo interpretar. Não farei nenhuma sobrescrita. Guarde os dados do navegador antes de procurar suporte.";
}
start.addEventListener("click",()=>{
  try{
    const prior=localStorage.getItem(KEY);
    if(prior!==null){state=read();render();return}
    const stamp=new Date().toISOString();
    const next={schema:"peren-campaign-save",schemaVersion:VERSION,mode:"campanha",
      checkpoint:"acampamento_eldroth_pos_cripta",phase:"preparacao",
      chronicleRef:"1.0.0",createdAt:stamp,updatedAt:stamp,choices:[]};
    localStorage.setItem(KEY,JSON.stringify(next));
    state=read();
    render();
    if(typeof window!=="undefined" && window.dispatchEvent)window.dispatchEvent(new Event("peren:campaign-changed"));
  }catch(err){
    start.disabled=true;
    message.textContent="Não foi possível criar o registro. Armazenamento indisponível ou protegido; nenhum save anterior foi alterado.";
  }
});
exportBtn.addEventListener("click",()=>{
  try{
    state=read();
    if(!state){render();return}
    const blob=new Blob([JSON.stringify(state,null,2)+"\n"],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="peren-campanha-v1-backup.json";
    document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    message.textContent="Backup do slot preparado para download; nenhuma alteração no registro.";
  }catch(err){
    message.textContent="Não foi possível exportar o slot. O registro original foi preservado.";
  }
});
})();
