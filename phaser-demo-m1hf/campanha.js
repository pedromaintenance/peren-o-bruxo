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
function isValid(s) {
  return Boolean(s && typeof s==="object" && !Array.isArray(s) &&
    s.schema==="peren-campaign-save" && s.schemaVersion===VERSION &&
    s.mode==="campanha" && s.checkpoint==="acampamento_eldroth_pos_cripta" &&
    s.phase==="preparacao" && s.chronicleRef==="1.0.0" &&
    Array.isArray(s.choices) && s.choices.length===0);
}
function read() {
  const raw=localStorage.getItem(KEY);
  if(raw===null)return null;
  const obj=JSON.parse(raw);
  if(!isValid(obj))throw Error("Slot incompatível ou de versão futura; não sobrescrever");
  return obj;
}
function render() {
  start.hidden=Boolean(state);
  exportBtn.hidden=!state;
  if(state) {
    message.textContent="Registro existente preservado. Próximo marco: abrir a primeira cena jogável em Eldroth.";
    desc.textContent="Campanha iniciada, sem escolhas fictícias. A próxima etapa adicionará diálogos, viagem e decisões, mantendo este registro.";
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
