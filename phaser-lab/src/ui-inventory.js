// M1g-B — read-only inventory view. Never mutates progress or synthesizes equipment.
import {maxClassicHp,maxClassicMp,weaponStats,inventoryTotal} from './progress.js';

export const INVENTORY_TABS=Object.freeze([
  {id:'all',label:'Todos',symbol:'▦'},
  {id:'equipment',label:'Equipamentos',symbol:'⚔'},
  {id:'consumable',label:'Consumíveis',symbol:'⚗'},
  {id:'ingredient',label:'Ingredientes',symbol:'❧'},
  {id:'quest',label:'Missão',symbol:'✉'},
  {id:'other',label:'Outros',symbol:'✧'}
]);
const EQUIPMENT=Object.freeze([
  {key:'weapon',label:'Arma',symbol:'⚔'},
  {key:'armor',label:'Armadura',symbol:'♜'},
  {key:'relic',label:'Relíquia',symbol:'✦'}
]);
const text=v=>String(v??'');
const fold=v=>text(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
export function inventoryCategory(item){
  if(!item)return 'other';
  const id=fold(item.id),cat=fold(item.categoria||item.tipo||''),name=fold(item.nome);
  if(/^(eq-|arma-|armadura-|relic-)/.test(id)||/(equip|arma|armadura|reliquia|escudo)/.test(cat))return 'equipment';
  if(/^(mis-|quest-|qst-)/.test(id)||/(missao|quest|chave de missao)/.test(cat))return 'quest';
  if(/^(ing-|mat-)/.test(id)||/(ingrediente|materia|recurso|mineral|flora)/.test(cat))return 'ingredient';
  if(/^(ger-pocao|ger-rac|ger-comida|cons-)/.test(id)||/(consumo|consum|pocao|tonico|comida|alimento|mantimento)/.test(cat))return 'consumable';
  if(/pocao|elixir|tonico/.test(name))return 'consumable';
  return 'other';
}
export const itemSymbol=category=>({equipment:'⚔',consumable:'⚗',ingredient:'❧',quest:'✉',other:'✦'})[category]||'✦';
export function inventoryViewModel(state,catalogs,{category='all',query='',selectedId=null}={}){
  const equip=EQUIPMENT.map(slot=>{
    const id=state.equip?.[slot.key]||null,item=id?catalogs.itensById[id]:null;
    return {...slot,id,label:slot.label,name:item?.nome|| (id?'Item não localizado':'Vazio')};
  });
  const equipped=new Set(equip.map(s=>s.id).filter(Boolean));
  const items=Object.entries(state.bag||{}).filter(([,amount])=>Number.isSafeInteger(amount)&&amount>0).map(([id,amount])=>{
    const item=catalogs.itensById[id];
    if(!item)return null;
    const group=inventoryCategory(item);
    return {id,amount,category:group,name:item.nome||id,description:item.descricao||item.descricaoCurta||'Nenhuma descrição registrada no catálogo.',type:item.categoria||item.tipo||'Item',
      value:Number.isFinite(item.valor)?item.valor:null,level:Number.isFinite(item.nivel)?item.nivel:null,
      attack:Number.isFinite(item.ataque)?item.ataque:null,defense:Number.isFinite(item.defesa)?item.defesa:null,
      symbol:itemSymbol(group),equipped:equipped.has(id),zone:item.zona||null};
  }).filter(Boolean).sort((a,b)=>Number(b.equipped)-Number(a.equipped)||a.name.localeCompare(b.name,'pt-BR'));
  const needle=fold(query.trim());
  const filtered=items.filter(item=>(category==='all'||item.category===category)&&(!needle||fold(item.name+' '+item.type+' '+item.id).includes(needle)));
  const current=filtered.find(item=>item.id===selectedId)||filtered[0]||null;
  const stats=weaponStats(state,catalogs),maxHp=maxClassicHp(state,catalogs),maxMp=maxClassicMp(state);
  return {
    items,filtered,selected:current,selectedId:current?.id||null,equip,
    character:{
      level:state.level,gold:state.gold,xp:state.exp,xpGoal:state.level*62,
      hp:state.hp,maxHp,mp:state.mp,maxMp,attack:stats.attack,defense:stats.defense,
      types:items.length,quantity:inventoryTotal(state)
    }
  };
}
const pct=(v,maximum)=>Math.min(100,Math.max(0,Math.round((v/Math.max(1,maximum))*100)));
const setText=(doc,id,value)=>{const el=doc.getElementById(id);if(el)el.textContent=text(value)};
function element(doc,tag,className,content){
  const el=doc.createElement(tag);if(className)el.className=className;if(content!==undefined)el.textContent=text(content);return el;
}

export function createInventoryScreen({document:doc,bridge,catalogs}){
  const root=doc.getElementById('inventoryUI'),grid=doc.getElementById('invGrid'),tablist=doc.getElementById('invTabs');
  const queryInput=doc.getElementById('invSearch');
  if(!root||!grid||!tablist||!queryInput)throw Error('Estrutura do inventário M1g-B ausente.');
  let category='all',selectedId=null,lastFocus=null,model=null;
  const isOpen=()=>!root.hidden;
  const tabs=INVENTORY_TABS.map(tab=>{
    const button=element(doc,'button','inv-tab ui-button',tab.symbol+' '+tab.label);
    button.type='button';button.dataset.category=tab.id;button.setAttribute('role','tab');
    button.addEventListener('click',()=>setCategory(tab.id));
    tablist.append(button);return button;
  });
  function render({focusItem=false}={}){
    model=inventoryViewModel(bridge.state,catalogs,{category,query:queryInput.value,selectedId});
    selectedId=model.selectedId;
    const s=model.character;
    setText(doc,'invLevel','Nível '+s.level);
    setText(doc,'invGold',s.gold.toLocaleString('pt-BR'));
    setText(doc,'invXp',s.xp+' / '+s.xpGoal);
    setText(doc,'invHp',s.hp+' / '+s.maxHp);
    setText(doc,'invMp',s.mp+' / '+s.maxMp);
    setText(doc,'invAttack',s.attack);
    setText(doc,'invDefense',s.defense);
    setText(doc,'invCount',model.filtered.length+' tipos · '+model.filtered.reduce((n,i)=>n+i.amount,0)+' unidades');
    for(const [id,val,max] of [['invXpFill',s.xp,s.xpGoal],['invHpFill',s.hp,s.maxHp],['invMpFill',s.mp,s.maxMp]]){
      const fill=doc.getElementById(id);if(fill)fill.style.width=pct(val,max)+'%';
    }
    const slots=doc.getElementById('invEquipment');slots.replaceChildren();
    for(const slot of model.equip){
      const card=element(doc,'div','inv-equipped');
      const symbol=element(doc,'span','inv-equipped-symbol',slot.symbol);
      const content=element(doc,'div','inv-equipped-copy');
      content.append(element(doc,'small','',slot.label),element(doc,'strong','',slot.name));
      card.append(symbol,content);slots.append(card);
    }
    tabs.forEach((tab,i)=>{
      const active=INVENTORY_TABS[i].id===category;
      tab.setAttribute('aria-selected',String(active));
      tab.classList.toggle('is-active',active);
      tab.tabIndex=active?0:-1;
    });
    grid.replaceChildren();
    if(!model.filtered.length){
      grid.append(element(doc,'p','inv-empty','Nenhum item nesta categoria. Os filtros não alteram a mochila.'));
    }
    for(const item of model.filtered){
      const btn=element(doc,'button','inv-item');
      btn.type='button';btn.dataset.itemId=item.id;
      btn.classList.toggle('is-selected',item.id===selectedId);
      btn.setAttribute('aria-pressed',String(item.id===selectedId));
      btn.setAttribute('aria-label',item.name+', quantidade '+item.amount+(item.equipped?', equipado':''));
      btn.append(element(doc,'span','inv-item-icon',item.symbol),
        element(doc,'span','inv-item-label',item.name),
        element(doc,'span','inv-item-count','×'+item.amount));
      if(item.equipped)btn.append(element(doc,'span','inv-item-equipped','Equipado'));
      btn.addEventListener('click',()=>selectItem(item.id,true));
      grid.append(btn);
    }
    const selected=model.selected;
    setText(doc,'invSelectedName',selected?.name||'Nenhum item selecionado');
    setText(doc,'invSelectedCategory',selected?.type||'—');
    setText(doc,'invSelectedDescription',selected?.description||'Os itens disponíveis aparecerão aqui após coleta, compra ou criação.');
    setText(doc,'invSelectedAmount',selected?'Possui: '+selected.amount:'Bolsa sem itens nesta categoria');
    setText(doc,'invSelectedValue',selected?.value!==null&&selected?.value!==undefined?'Valor base: '+selected.value+' ouro':'Valor não informado');
    setText(doc,'invSelectedAttributes',selected?[
      selected.attack!==null?'Ataque +'+selected.attack:null,
      selected.defense!==null?'Defesa +'+selected.defense:null,
      selected.level!==null?'Nível '+selected.level:null,
      selected.equipped?'Atualmente equipado':null
    ].filter(Boolean).join(' · ')||'Sem modificadores registrados':'');
    setText(doc,'invSelectedSymbol',selected?.symbol||'◇');
    const active=grid.querySelector('.is-selected');
    active?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
    if(focusItem)active?.focus({preventScroll:true});
  }
  function selectItem(id,focus=false){selectedId=id;render({focusItem:focus});}
  function setCategory(next){
    if(!INVENTORY_TABS.some(t=>t.id===next))return;
    category=next;selectedId=null;render();
  }
  function cycleTab(delta){
    const current=INVENTORY_TABS.findIndex(t=>t.id===category);
    setCategory(INVENTORY_TABS[(current+delta+INVENTORY_TABS.length)%INVENTORY_TABS.length].id);
  }
  function move(dx,dy=0){
    if(!isOpen())return;
    if(!model)render();
    if(!model.filtered.length)return;
    const columns=Math.max(1,Math.round(grid.clientWidth/118));
    const n=model.filtered.findIndex(i=>i.id===selectedId);
    const step=(dy*columns)+dx;
    const next=Math.max(0,Math.min(model.filtered.length-1,n+step));
    selectItem(model.filtered[next].id,true);
  }
  const close=()=>{
    if(!isOpen())return;
    root.hidden=true;
    lastFocus?.focus?.({preventScroll:true});
  };
  const open=()=>{
    lastFocus=doc.activeElement;
    root.hidden=false;queryInput.value='';category='all';selectedId=null;
    render();root.querySelector('#invClose')?.focus({preventScroll:true});
  };
  root.querySelector('#invClose').addEventListener('click',close);
  queryInput.addEventListener('input',()=>{selectedId=null;render()});
  root.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
    if(event.key==='Tab'){
      const targets=Array.from(root.querySelectorAll('button:not(:disabled),input:not(:disabled)')).filter(el=>el.offsetParent!==null);
      const first=targets[0],last=targets[targets.length-1];
      if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last?.focus()}
      else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first?.focus()}
      return;
    }
    if(event.target===queryInput)return;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'||event.key==='ArrowDown'||event.key==='ArrowUp'){
      event.preventDefault();event.stopPropagation();
      if(event.target?.getAttribute('role')==='tab'){
        if(event.key==='ArrowLeft')cycleTab(-1);
        if(event.key==='ArrowRight')cycleTab(1);
      }else{
        move(Number(event.key==='ArrowRight')-Number(event.key==='ArrowLeft'),
          Number(event.key==='ArrowDown')-Number(event.key==='ArrowUp'));
      }
    }
  });
  // Single atlas frame is a real Peren sprite, never a flattened interactive mockup.
  const sprite=doc.getElementById('invSprite'),ctx=sprite?.getContext('2d');
  if(ctx){
    const atlas=new Image();
    atlas.onload=()=>{ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,48,64);ctx.drawImage(atlas,0,0,48,64,0,0,48,64)};
    atlas.src=new URLSearchParams(location.search).get('art')==='m1h'?'./art-m1h/characters/peren/peren-atlas.png':'./art/characters/peren/peren-atlas.png';
  }
  return {open,close,isOpen,move,cycleTab,render,get view(){return model},get category(){return category}};
}
