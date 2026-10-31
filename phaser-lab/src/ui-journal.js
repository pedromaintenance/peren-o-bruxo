/**
 * M1h-F.5 — Diário de Peren. Entirely read-only: source of truth is the
 * existing v2 envelope (last 80 transactions) and classic journal (last 90).
 * No invented quests, timestamps, drops, currencies, visits or new save fields.
 */
export const JOURNAL_TABS=Object.freeze([
 {id:'all',label:'Atividade',icon:'✦'},
 {id:'chronicle',label:'Crônicas',icon:'✎'},
 {id:'battle',label:'Combates',icon:'⚔'},
 {id:'gather',label:'Coletas',icon:'❧'},
 {id:'craft',label:'Ofícios',icon:'⚗'},
 {id:'trade',label:'Comércio',icon:'◈'},
 {id:'other',label:'Outros',icon:'☾'}
]);
const TYPES=Object.freeze({
 victory:{category:'battle',name:'Vitória',icon:'⚔'},
 escape:{category:'battle',name:'Retirada do combate',icon:'↩'},
 collect:{category:'gather',name:'Coleta',icon:'❧'},
 craft:{category:'craft',name:'Item criado',icon:'⚗'},
 buy:{category:'trade',name:'Compra',icon:'◈'},
 sell:{category:'trade',name:'Venda',icon:'◇'},
 endDay:{category:'other',name:'Novo dia',icon:'☾'},
 selectSeed:{category:'other',name:'Nova rota',icon:'✦'}
});
const str=v=>String(v??'');
const fold=v=>str(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
const safeList=a=>Array.isArray(a)?a:[];
const safeInt=v=>Number.isSafeInteger(v)&&v>=0?v:0;
const cleanLine=v=>str(v).replace(/[\r\n\t]+/g,' ').trim().slice(0,300);
function eventFor(row,catalogs){
 const type=str(row?.type),config=TYPES[type]||{category:'other',name:'Registro',icon:'✧'};
 const id=str(row?.description);
 const entity=catalogs?.itensById?.[id]||catalogs?.monstrosById?.[id];
 const detail=entity?.nome||id||'';
 const rev=Number.isSafeInteger(row?.rev)&&row.rev>=0?row.rev:null;
 return {kind:'event',category:config.category,icon:config.icon,title:config.name,
  detail:cleanLine(detail),revision:rev,search:fold(config.name+' '+detail+' '+type),rawType:type};
}
/** Pure view model, no storage, timestamps, mutations or network. */
export function journalViewModel(envelope,catalogs,{category='all',query=''}={}){
 const env=envelope||{},character=env.character||{};
 const events=safeList(env.history).slice(-80).map(x=>eventFor(x,catalogs)).reverse();
 const chronicles=safeList(character.journal).slice(0,90).map((entry,i)=>({
  kind:'chronicle',category:'chronicle',icon:'✎',title:cleanLine(entry),
  detail:'',revision:null,search:fold(entry),index:i
 }));
 const counts={all:events.length,chronicle:chronicles.length,battle:0,gather:0,craft:0,trade:0,other:0};
 for(const entry of events)counts[entry.category]=(counts[entry.category]||0)+1;
 const active=JOURNAL_TABS.some(tab=>tab.id===category)?category:'all';
 const pool=active==='chronicle'?chronicles:events.filter(e=>active==='all'||e.category===active);
 const needle=fold(str(query).trim()).slice(0,120);
 const entries=pool.filter(entry=>!needle||entry.search.includes(needle));
 return {entries,counts,category:active,query:str(query),
  totalRecorded:events.length,chronicles:chronicles.length,
  summary:{
   day:safeInt(character.day),level:safeInt(character.level),kills:safeInt(character.kills),
   crafted:safeInt(character.crafted),gold:safeInt(character.gold),
   city:catalogs?.cidadesById?.[character.city]?.nome||str(character.city||'—'),
   seed:str(env.worlds?.activeSeed||'murin-001')
  }};
}
/** Deliberate, local-only download: includes the player's own saved chronicle. */
export function journalMarkdown(envelope,catalogs){
 const all=journalViewModel(envelope,catalogs);
 const chronicle=journalViewModel(envelope,catalogs,{category:'chronicle'});
 const s=all.summary;
 return [
 '# Diário de Peren — registro da jornada',
 '',
 'Cidade atual: '+cleanLine(s.city),
 'Dia atual: '+s.day+' · Nível: '+s.level+' · Vitórias acumuladas: '+s.kills,
 'Ofícios concluídos: '+s.crafted+' · Ouro atual: '+s.gold,
 'Seed ativa: '+cleanLine(s.seed),
 '',
 '## Crônicas do personagem (últimas '+chronicle.chronicles+')',
 ...chronicle.entries.map(entry=>'- '+cleanLine(entry.title)),
 '',
 '## Atividades recentes (últimas '+all.totalRecorded+' transações retidas)',
 ...all.entries.map(entry=>'- '+(entry.revision!==null?'Registro '+entry.revision+' · ':'')+
  cleanLine(entry.title)+(entry.detail?' — '+cleanLine(entry.detail):'')),
 '',
 '> Exportação voluntária e local. O histórico limitado não é uma lista integral de eventos nem prova a data de cada ação.',
 ''
 ].join('\n');
}
const make=(doc,tag,className,text)=>{
 const el=doc.createElement(tag);if(className)el.className=className;
 if(text!==undefined)el.textContent=str(text);return el;
};
export function createJournalScreen({document:doc,bridge,catalogs}){
 const root=doc.getElementById('journalUI'),tabsRoot=doc.getElementById('journalTabs');
 const closeButton=doc.getElementById('journalClose'),list=doc.getElementById('journalEntries');
 const search=doc.getElementById('journalSearch'),status=doc.getElementById('journalStatus');
 const hub=doc.getElementById('hub');
 if(!root||!tabsRoot||!closeButton||!list||!search||!hub)throw Error('Painel do diário M1h-F.5 não encontrado.');
 let category='all',previousFocus=null,model=null;
 const isOpen=()=>!root.hidden;
 const tabs=JOURNAL_TABS.map(tab=>{
  const b=make(doc,'button','journal-tab ui-button',tab.icon+' '+tab.label);
  b.type='button';b.dataset.category=tab.id;b.setAttribute('aria-pressed','false');
  b.addEventListener('click',()=>setCategory(tab.id));
  tabsRoot.append(b);return b;
 });
 function render(){
  model=journalViewModel(bridge.read(),catalogs,{category,query:search.value});
  for(const [key,value] of Object.entries({
   journalDay:'Dia '+model.summary.day,
   journalLevel:'Nível '+model.summary.level,
   journalKills:String(model.summary.kills),
   journalCrafted:String(model.summary.crafted),
   journalCity:model.summary.city,
   journalSeed:'Mapa: '+model.summary.seed,
   journalCount:model.entries.length+' registros exibidos · '+model.totalRecorded+' transações recentes · '+model.chronicles+' crônicas'
  })){
   const el=doc.getElementById(key);if(el)el.textContent=value;
  }
  tabs.forEach((tab,i)=>{
   const entry=JOURNAL_TABS[i],current=entry.id===category;
   tab.classList.toggle('is-active',current);tab.setAttribute('aria-pressed',String(current));
   tab.title=entry.label+' ('+model.counts[entry.id]+')';
  });
  list.replaceChildren();
  if(!model.entries.length){
   list.append(make(doc,'p','journal-empty',
    search.value.trim()?'Nenhum registro corresponde à busca.':'Ainda não há registros nesta categoria. Explore Mürin e retorne para consultar a jornada.'));
   return;
  }
  for(const entry of model.entries){
   const row=make(doc,'article','journal-entry');
   row.dataset.kind=entry.kind;row.dataset.category=entry.category;
   row.append(make(doc,'span','journal-entry-icon',entry.icon));
   const copy=make(doc,'div','journal-entry-copy');
   copy.append(make(doc,'strong','',entry.title));
   if(entry.detail)copy.append(make(doc,'p','',entry.detail));
   if(entry.revision!==null)copy.append(make(doc,'small','', 'Registro de save #'+entry.revision+' · sem data individual'));
   row.append(copy);list.append(row);
  }
 }
 function setCategory(next){
  if(!JOURNAL_TABS.some(tab=>tab.id===next))return;
  category=next;list.scrollTop=0;render();
 }
 function cycleTab(delta){
  const at=JOURNAL_TABS.findIndex(t=>t.id===category);
  setCategory(JOURNAL_TABS[(at+delta+JOURNAL_TABS.length)%JOURNAL_TABS.length].id);
 }
 function open(){
  if(isOpen())return;
  previousFocus=doc.activeElement;root.hidden=false;hub.inert=true;
  search.value='';category='all';render();closeButton.focus({preventScroll:true});
 }
 function close(){
  if(!isOpen())return;
  root.hidden=true;hub.inert=false;
  if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
 }
 closeButton.addEventListener('click',close);
 search.addEventListener('input',render);
 doc.getElementById('journalExport').addEventListener('click',()=>{
  try{
   const source=bridge.read(),markdown=journalMarkdown(source,catalogs);
   const url=URL.createObjectURL(new Blob([markdown],{type:'text/markdown;charset=utf-8'}));
   const anchor=make(doc,'a');anchor.href=url;
   anchor.download='peren-m1hf-diario-dia-'+safeInt(source.character?.day)+'.md';
   doc.body.append(anchor);anchor.click();anchor.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1800);
   status.textContent='Diário salvo neste aparelho. Nada foi enviado automaticamente.';
  }catch(error){status.textContent='Não foi possível baixar o diário: '+str(error?.message);}
 });
 root.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
  if(event.key!=='Tab')return;
  const focusable=[...root.querySelectorAll('button:not(:disabled),input:not(:disabled)')];
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last.focus();}
  if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus();}
 });
 return {open,close,isOpen,render,cycleTab,scroll:delta=>list.scrollBy({top:delta*130,behavior:'auto'})};
}
