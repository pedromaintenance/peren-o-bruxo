/* LORE-05 — A Margem do Rio Ancestral, promessa e três moedas sem dono. */
(() => {
"use strict";
const host=document.getElementById("ancestralRiver");
if(!host||!window.PerenCampanhaSave)return;
const store=window.PerenCampanhaSave;
const $=id=>document.getElementById(id);
const el=(name,label,css)=>{
  const node=document.createElement(name);
  if(label!=null)node.textContent=label;
  if(css)node.className=css;
  return node;
};
const pick=(save,type)=>save?.choices.find(c=>c.type===type);
let canon=null;
const state=()=>{
  try{return store.read()}catch(e){setStatus("Save incompatível. Não será modificado.");return undefined}
};
function setStatus(message){$("riverStatus").textContent=message}
function addText(target,heading,value){
  const p=el("p");
  p.append(el("strong",heading+" "),document.createTextNode(value));
  target.append(p);
}
function clear(node){node.replaceChildren()}
function render(){
 if(!canon)return;
 const s=state();
 const available=Boolean(s?.phase==="aproximacao"||s?.phase==="margem");
 host.hidden=!available;
 if(!available)return;
 const heading=$("riverTitle");
 const approaching=s.phase==="aproximacao";
 heading.textContent=approaching?"O Rio Ancestral — Aproximação":"O Rio Ancestral — À margem";
 $("riverBeforeArrival").hidden=!approaching;
 $("riverAtBank").hidden=approaching;
 if(approaching){
   const observed=pick(s,"observacao");
   $("riverApproach").textContent=observed?
     "O reconhecimento inicial está registrado. A próxima cena aproxima a comitiva da margem; não atravessa o rio, não cobra pedágio e não resolve encontros.":
     "Primeiro escolha, na Expedição, como reconhecer o caminho. A chegada à margem depende dessa decisão.";
   $("riverReach").disabled=!observed;
   return;
 }
 const route=pick(s,"partida")?.route;
 const description=canon.arrival[route];
 $("riverBankScene").replaceChildren(el("h3",description.title),el("p",description.description),el("p",description.constraints,"muted"));
 const done=Boolean(pick(s,"moedas"));
 const ritual=$("riverCoins");
 clear(ritual);
 ritual.append(el("h3","O voto das três moedas"),el("p",canon.coins.scene));
 const quote=document.createElement("blockquote");
 quote.textContent="“"+canon.coins.phrase+"”";
 ritual.append(quote,el("p",canon.coins.effect,"muted"));
 if(done){
   ritual.append(el("p","✓ Voto pronunciado e três moedas entregues à corrente. Este rito não pode ser repetido neste save.","river-completed"));
 }else{
   const btn=el("button","Recitar o voto e entregar as três moedas");
   btn.type="button";btn.id="riverOfferCoins";
   btn.addEventListener("click",()=>{
     if(!window.confirm("Entregar definitivamente as três moedas reservadas e recitar «"+canon.coins.phrase+"»? Esta ação NÃO poderá ser desfeita."))return;
     try{
       store.saveChoice({type:"moedas",phrase:canon.coins.phrase});
       setStatus("Três moedas entregues ao Rio Ancestral. O ouro pessoal e as demais promessas permanecem inalterados.");
     }catch(e){setStatus("A oferenda não foi registrada: "+String(e.message||e))}
   });
   ritual.append(btn);
 }
 const preparations=$("riverRiteRequirements");
 clear(preparations);
 preparations.append(el("h3","Preparação do retorno à cripta"),el("p",canon.returnRite.goal),el("p",canon.returnRite.mask,"muted"));
 for(const r of canon.returnRite.requirements){
   const item=el("article",null,"river-requirement");
   item.append(el("h4",r.title),el("p",r.description),el("small","Estado: PENDENTE. "+r.unknown));
   const noted=s.choices.some(c=>c.type==="pendencia"&&c.task===r.task);
   if(noted)item.append(el("p","✓ Prioridade anotada; requisito ainda não cumprido.","muted"));
   else{
     const b=el("button","Anotar prioridade — não cumprir requisito","river-note");
     b.type="button";
     b.addEventListener("click",()=>{
       try{store.saveChoice({type:"pendencia",task:r.task});setStatus("Prioridade anotada. Nada foi obtido nem confirmado.");}
       catch(e){setStatus("Não foi possível anotar a prioridade: "+String(e.message||e))}
     });
     item.append(b);
   }
   preparations.append(item);
 }
 $("riverUnknown").textContent="Ainda indefinido: "+canon.stillUnknown.join("; ")+".";
}
$("riverReach").addEventListener("click",()=>{
 const s=state();
 if(!s||s.phase!=="aproximacao"){setStatus("A chegada já ocorreu ou a campanha não está pronta.");return}
 const route=pick(s,"partida")?.route;
 if(!route||!pick(s,"observacao")){setStatus("Falta o plano ou o reconhecimento inicial.");return}
 if(!window.confirm("Avançar até a margem do Rio Ancestral? O grupo NÃO atravessará, e não haverá pedágio, ouro gasto, cura ou combate automático."))return;
 try{store.saveChoice({type:"chegada",route});setStatus("A companhia chegou à margem. Travessia e pagamentos permanecem pendentes.");}
 catch(e){setStatus("Não foi possível registrar a chegada: "+String(e.message||e))}
});
window.addEventListener("peren:campaign-changed",render);
fetch("./data/rio-ancestral.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(d=>{
 if(d.schema!=="peren-rio-ancestral-1"||!d.coins||d.returnRite.requirements.length!==3)throw Error("Arquivo de rito inválido");
 canon=d;render();
}).catch(()=>setStatus("O arquivo do Rio Ancestral não carregou. Atualize o cache quando estiver conectado; nenhum save foi alterado."));
})();
