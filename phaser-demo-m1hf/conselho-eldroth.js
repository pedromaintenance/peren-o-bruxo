/* LORE-04 Council — no simulated travel, combat, costs or automatic NPC consent. */
(() => {
"use strict";
const root=document.getElementById("eldrothCouncil");
if(!root || !window.PerenCampanhaSave)return;
const store=window.PerenCampanhaSave;
let content=null, current="veyra", chosenRoute=null;
const $=id=>document.getElementById(id);
const mk=(tag,label,cls)=>{
  const e=document.createElement(tag);
  if(label!=null)e.textContent=label;
  if(cls)e.className=cls;
  return e;
};
function report(t){$("councilStatus").textContent=t}
function progress(){
  try{return store.read()}
  catch(err){report("O save de campanha não pode ser lido; nenhum diálogo será gravado.");return null}
}
function recorded(c,s){
  return Boolean(s?.choices?.some(x=>x.type==="dialogo" && x.npc===c.id && x.topic===c.topic));
}
function sectionClear(el){el.replaceChildren()}
function renderNPC(){
  const s=progress();
  const people=$("councilPeople");
  sectionClear(people);
  for(const npc of content.companions){
    const b=mk("button",npc.name,"council-person");
    b.type="button";
    b.setAttribute("aria-pressed",String(current===npc.id));
    const completed=npc.topics.filter(topic=>recorded({id:npc.id,topic:topic.id},s)).length;
    b.append(mk("small",completed+"/2 assuntos consultados"));
    b.addEventListener("click",()=>{current=npc.id;renderNPC()});
    people.append(b);
  }
  const active=content.companions.find(x=>x.id===current);
  $("councilName").textContent=active.name;
  $("councilRole").textContent=active.role;
  const topics=$("councilTopics");
  sectionClear(topics);
  for(const topic of active.topics){
    const b=mk("button",(recorded({id:active.id,topic:topic.id},s)?"✓ ":"✧ ")+topic.label,"council-topic");
    b.type="button";
    b.disabled=!s||s.phase!=="preparacao";
    b.addEventListener("click",()=>{
      const latest=progress();
      if(!latest){report("Inicie o registro da Campanha antes de registrar conversas.");return}
      try{
        store.saveChoice({type:"dialogo",npc:active.id,topic:topic.id});
        const response=$("councilResponse");
        sectionClear(response);
        response.append(mk("strong","Conversa · "+active.name),mk("p",topic.response),mk("small",topic.note));
        report("Conversa registrada no save da Campanha. Nenhuma tarefa foi concluída automaticamente.");
        renderNPC();
        renderRoutes();
      }catch(err){report("A conversa não pôde ser registrada: "+String(err.message||err))}
    });
    topics.append(b);
  }
  if(!s)report("Inicie o Registro da Campanha para desbloquear conversas e planejar a travessia.");
}
function renderRoutes(){
  const s=progress();
  const consulted=Boolean(s?.choices.some(x=>x.type==="dialogo" && x.npc==="veyra" && x.topic==="rotas"));
  const last=s?.choices.filter(x=>x.type==="plano").at(-1)?.route||null;
  const routes=$("routeChoices");
  sectionClear(routes);
  for(const route of content.routes){
    const label=mk("label",null,"route-choice");
    const input=document.createElement("input");
    input.type="radio";input.name="eldrothRoute";input.value=route.id;
    input.disabled=!consulted||s.phase!=="preparacao";
    input.checked=(chosenRoute||last)===route.id;
    input.addEventListener("change",()=>{chosenRoute=route.id;updatePlanButton()});
    const description=mk("span",null);
    description.append(mk("strong",route.name),mk("small","Possibilidade: "+route.benefit),mk("small","Risco: "+route.risk),mk("small",route.unknown));
    label.append(input,description);
    routes.append(label);
  }
  $("planCouncilRoute").disabled=!consulted||s.phase!=="preparacao";
  const output=$("routeStatus");
  if(!s)output.textContent="Sem registro de Campanha: escolha uma jornada e inicie o slot.";
  else if(!consulted)output.textContent="Primeiro converse com Veyra sobre as três travessias.";
  else if(s.phase==="aproximacao")output.textContent="Partida registrada. A rota está fechada enquanto a marcha está em andamento; a travessia ainda não ocorreu.";
  else if(last)output.textContent="Plano atual: "+content.routes.find(r=>r.id===last).name+". Nenhuma travessia realizada. Você pode rever o plano.";
  else output.textContent="Veyra foi consultada. Escolha um plano para a saída do acampamento, sem iniciar a viagem.";
  updatePlanButton();
}
function updatePlanButton(){
  const radio=$("routeChoices").querySelector('input[name="eldrothRoute"]:checked');
  $("planCouncilRoute").textContent=radio?"Registrar plano: "+content.routes.find(r=>r.id===radio.value).name:"Registrar plano provisório";
}
$("planCouncilRoute").addEventListener("click",()=>{
  const chosen=$("routeChoices").querySelector('input[name="eldrothRoute"]:checked');
  if(!chosen){report("Escolha uma travessia antes de registrar o plano.");return}
  if(!window.confirm("Registrar "+content.routes.find(r=>r.id===chosen.value).name+" como PLANO, sem atravessar o Rio nem obrigar seus companheiros?"))return;
  try{
    store.saveChoice({type:"plano",route:chosen.value});
    report("Plano registrado. Ainda não há partida, cobrança, consumo de recursos nem consentimento imposto.");
    chosenRoute=null;
    renderRoutes();
  }catch(err){report("Plano não registrado: "+String(err.message||err))}
});
window.addEventListener("peren:campaign-changed",()=>{if(content){renderNPC();renderRoutes()}});
fetch("./data/conselho-eldroth.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(data=>{
  if(data.schema!=="peren-eldroth-council-1"||data.companions.length!==5||data.routes.length!==3)throw Error("Formato incompleto");
  content=data;
  $("councilSource").textContent=data.note;
  renderNPC();renderRoutes();
}).catch(()=>{
  report("Não foi possível abrir o conselho. Atualize o cache conectado e tente novamente; o save permanece intacto.");
});
})();
