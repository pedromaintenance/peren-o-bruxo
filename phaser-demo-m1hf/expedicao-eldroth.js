/* LORE-04.2 — Primeira etapa da expedição. Decisions are explicit, no fabricated gold/HP/dice. */
(() => {
"use strict";
const host=document.getElementById("eldrothExpedition");
if(!host || !window.PerenCampanhaSave)return;
const save=window.PerenCampanhaSave;
const $=id=>document.getElementById(id);
const mk=(tag,text,css)=>{
 const el=document.createElement(tag);
 if(text!==undefined&&text!==null)el.textContent=String(text);
 if(css)el.className=css;
 return el;
};
let content=null;
const good=new Map([["veyra","ritmo_compassado"],["dren","contrato_claro"],["orel","posicao_protegida"],["tavin","moedas_reservadas"]]);
const get=()=>{try{return save.read()}catch{return undefined}};
const latest=(s,type)=>s?.choices.filter(c=>c.type===type).at(-1);
const select=(s,npc)=>s?.choices.find(c=>c.type==="acordo" && c.npc===npc);
const ready=s=>s && [...good].every(([npc,term])=>select(s,npc)?.term===term);
function say(value){$("expeditionStatus").textContent=value}
function fill(target,...children){target.replaceChildren(...children)}
function appendLine(container,strong,body){
 const p=mk("p"); p.append(mk("strong",strong+" "),document.createTextNode(body));container.append(p);
}
function costLedger(){
 const target=$("expeditionCosts");
 fill(target);
 for(const c of content.materialLedger){
   const li=mk("li");li.append(mk("strong",c.key+": "),document.createTextNode(c.value));target.append(li);
 }
}
function render(){
 if(!content)return;
 const s=get();
 if(s===undefined){say("Registro incompatível: a expedição está bloqueada para preservar os dados.");return}
 $("expeditionSetup").hidden=Boolean(s?.phase==="aproximacao");
 $("expeditionApproach").hidden=!s||s.phase!=="aproximacao";
 $("expeditionReadiness").textContent=!s?"Crie o save da Campanha antes de negociar com a companhia.":s.phase==="preparacao"?"Negocie acordos voluntários com os quatro companheiros. Uma recusa bloqueia a partida, mas pode ser renegociada.":"Acordos fechados no início da viagem: nenhum dos personagens está submetido a um contrato forçado.";
 if(s?.phase==="preparacao" || !s) renderSetup(s);
 if(s?.phase==="aproximacao")renderApproach(s);
}
function renderSetup(s){
 const grid=$("expeditionAgreements");fill(grid);
 for(const p of content.agreements){
  const box=mk("article",null,"expedition-ally");
  box.append(mk("h4",p.name),mk("p",p.context,"muted"));
  const current=select(s,p.id);
  if(current){
    const opt=p.options.find(x=>x.id===current.term);
    box.append(mk("p",(opt.accepted?"Acordo aceito. ":"Proposta recusada. ")+opt.response,opt.accepted?"expedition-accepted":"expedition-declined"));
  }else box.append(mk("p","Nenhuma condição discutida neste save.","muted"));
  for(const option of p.options){
   const b=mk("button",(current?.term===option.id?"✓ ":"")+option.label,"expedition-choice");
   b.type="button";
   b.disabled=!s;
   b.addEventListener("click",()=>{
    if(!window.confirm("Apresentar a proposta a "+p.name+"? A reação será gravada no save da Campanha."))return;
    try{
      save.saveChoice({type:"acordo",npc:p.id,term:option.id});
      say(option.accepted?"Proposta aceita por "+p.name+".":"Proposta recusada por "+p.name+". É possível renegociar.");
    }catch(e){say("Não foi possível registrar: "+(e.message||String(e)))}
   });
   box.append(b);
  }
  grid.append(box);
 }
 const route=latest(s,"plano")?.route;
 const matched=content.routes.find(r=>r.id===route);
 const plan=$("expeditionRoute");
 if(!s)plan.textContent="Sem registro de Campanha.";
 else if(!matched)plan.textContent="Falta registrar no Conselho um plano de travessia.";
 else plan.textContent="Plano do Conselho: "+matched.name+". "+matched.cost+" "+matched.risk;
 $("expeditionDepart").disabled=!ready(s)||!matched;
 $("expeditionDepart").textContent=!ready(s)?"Aguardando os quatro acordos":!matched?"Escolha a rota no Conselho":"Iniciar marcha rumo ao Rio (sem atravessar)";
}
function renderApproach(s){
 const route=latest(s,"partida")?.route;
 const meta=content.routes.find(r=>r.id===route);
 const head=$("expeditionArrival");
 fill(head,mk("h3","A marcha começou — "+meta.name),mk("p",meta.scene));
 appendLine(head,"Custo:",meta.cost);
 appendLine(head,"Risco:",meta.risk);
 const already=latest(s,"observacao");
 const actions=$("expeditionObservations");fill(actions);
 for(const o of content.observations){
  const btn=mk("button",(already?.method===o.id?"✓ ":"")+o.name,"expedition-choice");
  btn.disabled=Boolean(already);
  btn.type="button";
  btn.addEventListener("click",()=>{
   if(!window.confirm("Registrar este método de reconhecimento? A escolha será persistente e não poderá ser desfeita nesta etapa."))return;
   try{
     save.saveChoice({type:"observacao",method:o.id});
     say("Escolha registrada. A passagem do Rio continua pendente.");
   }catch(e){say("Reconhecimento não registrado: "+(e.message||String(e)))}
  });
  actions.append(btn);
 }
 const consequence=$("expeditionConsequence");fill(consequence);
 if(already){
  const d=content.observations.find(o=>o.id===already.method);
  consequence.append(mk("h4","Consequência do reconhecimento"),mk("p",d.scene),mk("p",d.consequence,"expedition-accepted"),mk("small",d.unknown));
 }else consequence.append(mk("p","Escolha como investigar o caminho. Cada meio expõe o grupo a riscos diferentes; nenhuma travessia, combate ou custo monetário será executado aqui."));
}
$("expeditionDepart").addEventListener("click",()=>{
 const s=get();if(!s||s.phase!=="preparacao"){say("A partida já ocorreu ou o save não está disponível.");return}
 const route=latest(s,"plano")?.route;
 if(!ready(s)||!route){say("É necessário fechar quatro acordos voluntários e definir a rota.");return}
 if(!window.confirm("PARTIR de Eldroth? Os quatro acordos serão preservados, a rota ficará travada e não haverá travessia do Rio nesta etapa."))return;
 try{save.saveChoice({type:"partida",route});say("Partida registrada. O grupo segue por Eldroth, ainda sem alcançar o Rio.");}
 catch(e){say("Partida cancelada: "+(e.message||String(e)))}
});
window.addEventListener("peren:campaign-changed",render);
fetch("./data/expedicao-eldroth.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(d=>{
 if(d.schema!=="peren-eldroth-approach-1"||d.agreements.length!==4||d.routes.length!==3||d.observations.length!==3)throw Error("Dados da expedição incompletos");
 content=d;
 $("expeditionDisclaimer").textContent=d.disclaimer;
 $("expeditionStage").textContent=d.stage;
 costLedger();render();
}).catch(()=>say("O roteiro da expedição não pôde ser carregado. Os saves permanecem intactos."));
})();
