/**
 * M1g-C — visual alchemy interface, backed exclusively by canonical craft transactions.
 * No economic formula or inventory mutation is duplicated in the UI.
 */
import {craftable,skillLevel} from './progress.js';
import {createAlchemyScreen} from './ui-alchemy.js';

const tx=v=>String(v??'');
const normal=v=>tx(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
const fmt=n=>new Intl.NumberFormat('pt-BR').format(n);
const icons={alquimia:'⚗',cozinha:'♨',curtume:'✥',forja:'⚒',encantamento:'✧',escrita:'✒',joalheria:'◇'};
const names={alquimia:'Alquimia',cozinha:'Cozinha',curtume:'Curtume',forja:'Forja',encantamento:'Encantamento',escrita:'Escrita',joalheria:'Joalheria'};

export function workshopViewModel(s,c,{station='all',search='',selectedId=null,limit=48}={}){
  const city=c.cidadesById[s.city];
  const available=new Set(city?.estacoes||[]);
  const recipes=c.receitas.filter(rec=>available.has(rec.estacao)).map(rec=>{
    const result=c.itensById[rec.resultado];
    const owned=Number(s.bag[rec.resultado]||0);
    const skill=skillLevel(s.skills?.[rec.pericia]);
    const requires=(rec.ingredientes||[]).map(ing=>{
      const item=c.itensById[ing.item];
      const have=Number(s.bag[ing.item]||0);
      return {id:ing.item,name:item?.nome||ing.item,have,need:ing.quantidade,ready:have>=ing.quantidade};
    });
    const reasons=[];
    if(skill<rec.nivel)reasons.push('Ofício insuficiente: '+skill+' / '+rec.nivel);
    if(requires.some(ing=>!ing.ready))reasons.push('Faltam ingredientes');
    if(s.actions<=0)reasons.push('Sem ações disponíveis; descanse');
    const eligible=craftable(s,rec,c)&&s.actions>0;
    return {id:rec.id,name:rec.nome,station:rec.estacao,stationName:names[rec.estacao]||rec.estacao,
      icon:icons[rec.estacao]||'✦',resultId:rec.resultado,resultName:result?.nome||rec.resultado,
      outputCount:rec.quantidade,description:result?.descricao||result?.descricaoCurta||'Sem descrição cadastrada.',
      type:result?.categoria||'Item',value:result?.valor??null,owned,requirements:requires,
      skillName:rec.pericia,skill,level:rec.nivel,eligible,reasons};
  });
  const needle=normal(search.trim());
  const filtered=recipes.filter(rec=>(station==='all'||rec.station===station)&&
    (!needle||normal(rec.name+' '+rec.resultName+' '+rec.stationName).includes(needle)));
  filtered.sort((a,b)=>Number(b.eligible)-Number(a.eligible)||a.level-b.level||a.name.localeCompare(b.name,'pt-BR'));
  const selected=filtered.find(rec=>rec.id===selectedId)||filtered[0]||null;
  return {city:city?.nome||s.city,stations:[{id:'all',name:'Todas',icon:'✦'},...Array.from(available).map(id=>({id,name:names[id]||id,icon:icons[id]||'✧'}))],
    total:recipes.length,filteredTotal:filtered.length,recipes:filtered.slice(0,Math.max(1,limit)),
    selected,actions:s.actions,gold:s.gold,day:s.day};
}
const put=(doc,id,value)=>{const el=doc.getElementById(id);if(el)el.textContent=tx(value);};
const el=(doc,tag,cls,text)=>{const e=doc.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=tx(text);return e;};

export function createWorkshopScreen({document:doc,bridge,catalogs,onChange=()=>{}}){
  const root=doc.getElementById('craftUI'),list=doc.getElementById('craftList'),
    search=doc.getElementById('craftSearch'),stations=doc.getElementById('craftStations'),
    button=doc.getElementById('craftMake'),more=doc.getElementById('craftMore');
  if(!root||!list||!search||!stations||!button||!more)throw Error('Interface M1g-C incompleta');
  let station='all',selectedId=null,limit=48,model=null,lastFocus=null,busy=false,lastCommittedAt=-Infinity;
  const alchemy=createAlchemyScreen({document:doc,bridge,catalogs,onChange});
  const isOpen=()=>!root.hidden;
  function select(id,{focus=false}={}){
    selectedId=id;render();
    if(focus)list.querySelector('[data-recipe-id="'+id+'"]')?.focus({preventScroll:true});
  }
  function setStation(id){
    if(!model?.stations.some(t=>t.id===id))return;
    station=id;selectedId=null;limit=48;render();
  }
  function cycleStation(dir){
    const arr=(model?.stations||[]).filter(x=>x.id!=='all');
    if(!arr.length)return;
    setStation(arr[(Math.max(0,arr.findIndex(t=>t.id===station))+dir+arr.length)%arr.length].id);
  }
  function render(){
    const s=bridge.state;
    model=workshopViewModel(s,catalogs,{station,search:search.value,selectedId,limit});
    selectedId=model.selected?.id||null;
    put(doc,'craftCity',model.city);
    put(doc,'craftDay','Dia '+model.day);
    put(doc,'craftActions',model.actions+' ações');
    put(doc,'craftGold',fmt(model.gold));
    put(doc,'craftRecipeCount',model.filteredTotal+' receitas encontradas');
    const tabNodes=model.stations.filter(t=>t.id!=='all').map(t=>{
      const b=el(doc,'button','ui-button craft-station',t.icon+' '+t.name);
      b.type='button';b.dataset.station=t.id;b.setAttribute('aria-pressed',String(t.id===station));
      if(t.id===station)b.classList.add('is-active');
      b.addEventListener('click',()=>setStation(t.id));return b;
    });stations.replaceChildren(...tabNodes);
    list.replaceChildren();
    // Large catalogues never appear as an undifferentiated list.
    // Other trades use type > required level; Alchemy uses family > effect.
    const groups=new Map();
    for(const rec of model.recipes){
      const tier=rec.level<=3?'Nível 1–3':rec.level<=7?'Nível 4–7':rec.level<=12?'Nível 8–12':'Nível 13+';
      const group=rec.type+' · '+tier;
      if(!groups.has(group))groups.set(group,[]);
      groups.get(group).push(rec);
    }
    for(const [label,rows] of groups){
      const folder=el(doc,'details','craft-group');
      const summary=el(doc,'summary','',label);
      summary.append(el(doc,'small','',rows.length+' receitas exibidas'));
      folder.append(summary);
      folder.open=rows.some(rec=>rec.id===selectedId);
      for(const r of rows){
      const b=el(doc,'button','craft-recipe');
      b.type='button';b.dataset.recipeId=r.id;b.setAttribute('aria-pressed',String(r.id===selectedId));
      if(r.id===selectedId)b.classList.add('is-selected');
      b.append(el(doc,'span','craft-recipe-icon',r.icon));
      const copy=el(doc,'span','craft-recipe-copy');
      copy.append(el(doc,'strong','',r.name),el(doc,'small','',r.stationName+' · Ofício '+r.level));
      b.append(copy,el(doc,'span','craft-recipe-ready',r.eligible?'PRONTA':'PENDENTE'));
      b.addEventListener('click',()=>select(r.id,{focus:true}));
      folder.append(b);
      }
      list.append(folder);
    }
    if(!model.filteredTotal)list.append(el(doc,'p','craft-empty','Nenhuma receita encontrada nesta oficina.'));
    more.hidden=limit>=model.filteredTotal;
    more.textContent='Mostrar mais receitas ('+model.recipes.length+' / '+model.filteredTotal+')';
    const r=model.selected;
    put(doc,'craftSelectedName',r?.name||'Selecione uma receita');
    put(doc,'craftSelectedStation',r?.stationName||'—');
    put(doc,'craftResultName',r?.resultName||'Sem resultado');
    put(doc,'craftResultCount',r?'× '+r.outputCount+' por preparação':'');
    put(doc,'craftResultOwned',r?'Na bolsa: '+r.owned:'');
    put(doc,'craftResultDescription',r?.description||'Descubra receitas nas estações disponíveis da cidade.');
    put(doc,'craftSkill',r?'Proficiência '+r.skillName+': '+r.skill+' / '+r.level:'');
    put(doc,'craftCostNote','Cada criação consome uma ação e produz a quantidade indicada pela receita.');
    put(doc,'craftResultIcon',r?.icon||'⚗');
    const ing=doc.getElementById('craftIngredients');ing.replaceChildren();
    if(r){
      for(const row of r.requirements){
        const cell=el(doc,'div','craft-ingredient'+(row.ready?' is-ready':' is-missing'));
        cell.append(el(doc,'span','craft-ingredient-icon','❧'),el(doc,'span','craft-ingredient-name',row.name),el(doc,'strong','craft-ingredient-amount',row.have+' / '+row.need));
        ing.append(cell);
      }
    }
    const canMake=Boolean(r?.eligible)&&!busy;
    button.disabled=!canMake;
    button.textContent=busy?'Preparando...':canMake?'⚗ Criar '+r.outputCount+' × '+r.resultName:'Criação indisponível';
    put(doc,'craftBlockReason',r?(r.reasons.length?r.reasons.join(' · '):'Materiais, ofício e ações suficientes.'):'Nenhuma receita selecionada.');
    const block=doc.getElementById('craftBlockReason');
    if(block)block.dataset.ready=String(Boolean(r?.eligible));
    alchemy.show(station==='alquimia');
    return model;
  }
  function make(){
    // A no controle não pode executar a receita legada escondida sob a bancada.
    if(alchemy.isDynamic())return false;
    // Mobile double taps and repeated controller A must never charge for two batches.
    if(busy||!isOpen()||performance.now()-lastCommittedAt<450)return false;
    const current=workshopViewModel(bridge.state,catalogs,{station,search:search.value,selectedId}).selected;
    if(!current?.eligible||current.id!==selectedId){render();return false;}
    busy=true;button.disabled=true;
    try{
      // One and only one canonical transaction. Quantity is defined by the catalog.
      const txResult=bridge.execute({type:'craft',id:current.id});
      lastCommittedAt=performance.now();
      put(doc,'craftFeedback','Criado: '+current.outputCount+' × '+current.resultName+' — progresso salvo.');
      doc.getElementById('craftFeedback').dataset.state='success';
      onChange(txResult);
      render();
      return true;
    }catch(error){
      put(doc,'craftFeedback','Não foi possível criar: '+(error?.message||error));
      doc.getElementById('craftFeedback').dataset.state='error';
      render();return false;
    }finally{busy=false;render();}
  }
  const close=()=>{
    if(!isOpen())return;
    root.hidden=true;lastFocus?.focus?.({preventScroll:true});
  };
  const open=()=>{
    lastFocus=doc.activeElement;
    root.hidden=false;
    station=catalogs.cidadesById[bridge.state.city]?.estacoes?.includes('alquimia')?'alquimia':
      catalogs.cidadesById[bridge.state.city]?.estacoes?.[0]||'all';
    selectedId=null;search.value='';limit=48;
    put(doc,'craftFeedback','Escolha uma receita para consultar os ingredientes.');
    doc.getElementById('craftFeedback').dataset.state='';
    render();doc.getElementById('craftClose').focus({preventScroll:true});
  };
  function move(delta){
    // Navegação por gamepad na bancada alquímica terá foco dedicado;
    // nunca mover seleção ou fabricar receita oculta inadvertidamente.
    if(alchemy.isDynamic())return false;
    if(!isOpen()||!model?.recipes.length)return;
    const index=model.recipes.findIndex(r=>r.id===selectedId);
    const next=Math.max(0,Math.min(model.recipes.length-1,index+delta));
    select(model.recipes[next].id,{focus:true});
  }
  button.addEventListener('click',make);
  doc.getElementById('craftClose').addEventListener('click',close);
  more.addEventListener('click',()=>{limit+=48;render()});
  search.addEventListener('input',()=>{selectedId=null;limit=48;render()});
  root.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
    if(event.key==='Tab'){
      const focusable=[...root.querySelectorAll('button:not(:disabled),input:not(:disabled)')].filter(n=>n.offsetParent!==null);
      if(!focusable.length)return;
      if(event.shiftKey&&doc.activeElement===focusable[0]){event.preventDefault();focusable.at(-1).focus();}
      if(!event.shiftKey&&doc.activeElement===focusable.at(-1)){event.preventDefault();focusable[0].focus();}
      return;
    }
    // No modo alquímico, as setas pertencem aos seletores de ingredientes,
    // não à navegação das receitas legadas.
    if(event.target===search||alchemy.isDynamic())return;
    if(event.key==='ArrowUp'||event.key==='ArrowDown'){
      event.preventDefault();event.stopPropagation();move(event.key==='ArrowDown'?1:-1);
    }
    if(event.target?.classList?.contains('craft-station')){
      if(event.key==='ArrowRight'){event.preventDefault();cycleStation(1);}
      if(event.key==='ArrowLeft'){event.preventDefault();cycleStation(-1);}
    }
  });
  return {open,close,isOpen,render,make,move,cycleStation,get view(){return model;}};
}
