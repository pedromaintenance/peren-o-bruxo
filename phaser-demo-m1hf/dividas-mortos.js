/* LORE-05.2 — investigative leads and autonomous witnesses. Nothing here awards an item or completes the rite. */
(() => {
"use strict";
const host=document.getElementById("deadDebts");
if(!host||!window.PerenCampanhaSave)return;
const store=window.PerenCampanhaSave, byId=id=>document.getElementById(id);
const el=(tag,label,cls)=>{
  const x=document.createElement(tag);
  if(label!=null)x.textContent=String(label);
  if(cls)x.className=cls;
  return x;
};
const memo=(s,type,key,value)=>s?.choices.find(c=>c.type===type&&c[key]===value);
const status=message=>{byId("deadDebtsStatus").textContent=message};
let dossier=null;
function safeSave(){try{return store.read()}catch{status("Save incompatível: nenhum registro será alterado.");return undefined}}
function choose(entry,group,choice){
 const kind=group==="investigations"?"pista":"convite";
 const person=kind==="pista"?{subject:entry.subject,method:choice.id}:{npc:entry.npc,approach:choice.id};
 const descriptor=kind==="pista"?"a linha de investigação":"a resposta da testemunha";
 if(!window.confirm("Registrar "+descriptor+"? Trata-se de uma pista ou manifestação provisória, NÃO de um requisito cumprido."))return;
 try{
   store.saveChoice({type:kind,...person});
   status("Registro atualizado no save da Campanha. Os três requisitos continuam pendentes.");
 }catch(err){status("Não foi possível registrar: "+String(err.message||err))}
}
function renderSection(item,kind,s){
 const key=kind==="investigations"?"subject":"npc";
 const type=kind==="investigations"?"pista":"convite";
 const selected=memo(s,type,key,item[key]);
 const activeChoices=kind==="investigations"?item.methods:item.approaches;
 const article=el("article",null,"debt-topic");
 const heading=el("h4",item.title||item.name);
 const desc=el("p",item.purpose||item.context,"muted");
 article.append(heading,desc);
 if(selected){
   const selectedChoice=activeChoices.find(c=>c.id===(type==="pista"?selected.method:selected.approach));
   article.append(el("p","Registro atual: "+selectedChoice.label,"debt-selected"));
   article.append(el("p",selectedChoice.outcome));
   article.append(el("small",selectedChoice.signal));
 }else article.append(el("p","Nenhuma abordagem registrada. Os requisitos continuam pendentes.","muted"));
 for(const choice of activeChoices){
   const b=el("button",(selected&&(selected.method===choice.id||selected.approach===choice.id)?"✓ ":"")+choice.label,"debt-choice");
   b.type="button";b.disabled=!s;
   b.addEventListener("click",()=>choose(item,kind,choice));
   article.append(b);
 }
 return article;
}
function render(){
 if(!dossier)return;
 const s=safeSave();
 const visible=Boolean(s&&s.phase==="margem");
 host.hidden=!visible;
 if(!visible)return;
 const box1=byId("deadDebtsLeads"),box2=byId("deadDebtsWitnesses");
 box1.replaceChildren(...dossier.investigations.map(t=>renderSection(t,"investigations",s)));
 box2.replaceChildren(...dossier.witnesses.map(t=>renderSection(t,"witnesses",s)));
 const panel=byId("deadDebtsState");
 panel.replaceChildren();
 for(const [name,description] of Object.entries(dossier.state)){
   const p=el("p");p.append(el("strong",name+": "),document.createTextNode(description));panel.append(p);
 }
 const tally=s.choices.filter(c=>c.type==="pista"||c.type==="convite").length;
 byId("deadDebtsSummary").textContent=tally+" linhas de pesquisa ou convites registrados. Nenhum vaso, água, nome verdadeiro ou testemunho final confirmado.";
}
window.addEventListener("peren:campaign-changed",render);
fetch("./data/dividas-mortos.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(d=>{
 if(d.schema!=="peren-debts-investigation-1"||d.investigations.length!==2||d.witnesses.length!==2)throw Error("Estrutura incompatível");
 dossier=d;byId("deadDebtsNote").textContent=d.note;render();
}).catch(()=>status("Não foi possível carregar as Dívidas dos Mortos. O save não foi alterado; atualize o cache conectado."));
})();
