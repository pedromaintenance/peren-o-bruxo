/**
 * Navegação por família > efeito conhecido > ingredientes.
 * Modo livre não mostra os efeitos ocultos antes da experiência.
 * Efeitos permanentes e aplicação em itens dependem de regras futuras.
 */
import {ALCHEMY_FAMILIES,effectDirectory,ingredientOptions,nextStudyEffect} from './alchemy.js';
const txt=v=>String(v??'');
function node(doc,tag,cls,label){
  const e=doc.createElement(tag);if(cls)e.className=cls;
  if(label!==undefined)e.textContent=txt(label);
  return e;
}
const set=(doc,id,val)=>{const e=doc.getElementById(id);if(e)e.textContent=txt(val)};

export function createAlchemyScreen({document:doc,bridge,catalogs,onChange=()=>{}}){
  const data=catalogs.curadoria_ingredientes;
  if(!data?.itens)throw Error('A bancada alquímica exige a curadoria canônica.');
  const ids=['alchemySidebar','alchemyWorkbench','alchemyResult','alchemyFamilies','alchemyEffectList',
    'alchemyKnownMode','alchemyFreeMode','alchemyA','alchemyB','alchemyStudy','alchemyBrew',
    'alchemyFeedback','alchemyCreated','alchemyLegacy','alchemyReturn'];
  const elements=Object.fromEntries(ids.map(id=>[id,doc.getElementById(id)]));
  if(ids.some(id=>!elements[id]))throw Error('Estrutura alquímica incompleta.');
  // Sem efeitos descobertos, começar no modo livre para evitar uma bancada vazia.
  const initialKnowledge=Object.values(bridge.state.alchemy?.known||{}).some(v=>Array.isArray(v)&&v.length);
  let family='pocao',effectId=null,mode=initialKnowledge?'known':'free',idA='',idB='',lastResult=null,busy=false;
  let visible=false,legacyMode=false;
  const isVisible=()=>visible;
  const isDynamic=()=>visible&&!legacyMode;
  const feedback=(message,state='')=>{
    elements.alchemyFeedback.textContent=message;
    elements.alchemyFeedback.dataset.state=state;
  };
  function choices(){
    return ingredientOptions(data,bridge.state.alchemy.known,bridge.state.bag,{
      effectId:mode==='known'?effectId:null
    });
  }
  function syncSelectors(options){
    // Selectors are created exclusively from owned materials; the UI never
    // leaks undiscovered effect properties in its labels or markup.
    const [a,b]=[elements.alchemyA,elements.alchemyB];
    const allowed=new Set(options.map(o=>o.id));
    if(!allowed.has(idA))idA='';
    if(!allowed.has(idB)||idB===idA)idB='';
    for(const [select,selected] of [[a,idA],[b,idB]]){
      select.replaceChildren(node(doc,'option','','Selecione um ingrediente'));
      select.firstChild.value='';
      for(const o of options){
        const op=node(doc,'option','',o.name+' · ×'+o.count);
        op.value=o.id;select.append(op);
      }
      select.value=selected;
    }
  }
  function paintDirectory(directory){
    elements.alchemyFamilies.replaceChildren();
    for(const f of directory){
      const b=node(doc,'button','ui-button alchemy-family',f.icon+' '+f.name);
      b.type='button';b.dataset.family=f.id;
      b.setAttribute('aria-pressed',String(family===f.id));
      b.classList.toggle('is-active',family===f.id);
      b.append(node(doc,'small','',f.effects.length+' efeitos descobertos'));
      b.addEventListener('click',()=>{family=f.id;effectId=null;idA='';idB='';mode='known';render()});
      elements.alchemyFamilies.append(b);
    }
    const current=directory.find(f=>f.id===family);
    set(doc,'alchemyFamilyLabel',current?.name||'Alquimia');
    elements.alchemyEffectList.replaceChildren();
    if(!current?.effects.length){
      elements.alchemyEffectList.append(node(doc,'p','alchemy-muted',
        family==='elixir'||family==='balsamo'?
          'Nenhum efeito deste preparo tem regras de aplicação aprovadas. A família permanece reservada.':
          'Nenhum efeito descoberto nesta família. Estude ou experimente ingredientes.'));
    }
    for(const e of current?.effects||[]){
      const b=node(doc,'button','alchemy-effect',e.name);
      b.type='button';b.dataset.effectId=e.id;
      b.classList.toggle('is-ready',e.ready);
      b.classList.toggle('is-dim',!e.ready);
      b.classList.toggle('is-selected',effectId===e.id);
      b.setAttribute('aria-pressed',String(effectId===e.id));
      const status=node(doc,'small','',e.ready?'✦ Preparável':'◌ Sem par conhecido disponível');
      b.append(status);
      b.addEventListener('click',()=>{effectId=e.id;mode='known';idA='';idB='';render()});
      elements.alchemyEffectList.append(b);
    }
    return current;
  }
  function paintPreparations(){
    const s=bridge.state,box=elements.alchemyCreated;
    box.replaceChildren();
    const rows=(s.alchemy?.preparations||[]).slice(-6).reverse();
    if(!rows.length)box.append(node(doc,'p','alchemy-muted','Nenhuma mistura produzida nesta jornada.'));
    for(const p of rows){
      const card=node(doc,'div','alchemy-created-row');
      card.append(node(doc,'strong','',p.effects.map(e=>e.nome).join(' · ')),
        node(doc,'small','',p.ingredients.map(id=>data.itens[id]?.nome||id).join(' + ')));
      box.append(card);
    }
    set(doc,'alchemyFailureCount',s.alchemy?.failed||0);
  }
  function render(){
    if(!isDynamic())return;
    const s=bridge.state;
    const directory=effectDirectory(data,s.alchemy?.known,s.bag,s.actions);
    const current=paintDirectory(directory);
    const selected=current?.effects.find(e=>e.id===effectId)||null;
    if(effectId&&!selected){effectId=null;idA='';idB='';}
    const modeKnown=mode==='known';
    elements.alchemyKnownMode.setAttribute('aria-pressed',String(modeKnown));
    elements.alchemyFreeMode.setAttribute('aria-pressed',String(!modeKnown));
    elements.alchemyKnownMode.classList.toggle('is-active',modeKnown);
    elements.alchemyFreeMode.classList.toggle('is-active',!modeKnown);
    set(doc,'alchemyTarget',modeKnown?selected?.name||'Escolha um efeito descoberto':'Experiência sem receita conhecida');
    set(doc,'alchemyModeDescription',modeKnown?
      'Escolha duas fontes conhecidas deste efeito. As outras propriedades compartilhadas também surgirão.':
      'Combine quaisquer dois ingredientes. Os efeitos permanecem ocultos até a tentativa.');
    const options=choices();
    syncSelectors(options);
    const enabled=s.actions>0&&!busy&&Boolean(idA&&idB&&idA!==idB);
    elements.alchemyBrew.disabled=!enabled;
    elements.alchemyBrew.textContent=busy?'Preparando...':modeKnown?'⚗ Produzir preparação':'✧ Experimentar mistura';
    const studyIngredient=idA&&data.itens[idA];
    const studyNext=studyIngredient?nextStudyEffect(data,s.alchemy.known,idA):null;
    elements.alchemyStudy.disabled=!idA||!studyNext||s.actions<=0||busy;
    elements.alchemyStudy.textContent=studyNext?'Estudar ingrediente':'Sem propriedades por descobrir';
    set(doc,'alchemyOwned',options.length+' ingredientes disponíveis neste modo');
    set(doc,'alchemyActions',s.actions+' ações restantes');
    paintPreparations();
    if(lastResult){
      if(lastResult.type==='brewPair'&&lastResult.valid)
        set(doc,'alchemyLastResult','Resultado: '+lastResult.preparation.effects.map(e=>e.nome).join(' · '));
      else if(lastResult.type==='brewPair')
        set(doc,'alchemyLastResult','Mistura fracassada: nenhum efeito coincidente.');
      else if(lastResult.type==='studyIngredient')
        set(doc,'alchemyLastResult','Estudo: '+lastResult.effect.nome+' descoberto.');
    }else set(doc,'alchemyLastResult','Experimente sem conhecer as propriedades ou estude ingredientes para revelar seus efeitos.');
  }
  function show(next){
    if(!next)legacyMode=false;
    visible=Boolean(next);
    for(const key of ['alchemySidebar','alchemyWorkbench','alchemyResult'])
      elements[key].hidden=!isDynamic();
    for(const key of ['craftLegacyBrowser','craftLegacyWorkbench','craftResultLegacy']){
      const e=doc.getElementById(key);if(e)e.hidden=isDynamic();
    }
    elements.alchemyReturn.hidden=!visible||!legacyMode;
    if(isDynamic())render();
  }
  function toggleLegacy(next){
    if(!visible)return;
    legacyMode=Boolean(next);
    show(true);
  }
  function execute(command){
    // O botão é desabilitado após o commit e as seleções são zeradas.
    // Não bloquear um novo comando diferente executado rapidamente após estudar.
    if(busy||!isDynamic())return false;
    busy=true;try{
      const tx=bridge.execute(command);
      lastResult=tx.result;
      idA='';idB='';
      feedback(tx.result.valid===false?
        'Experimento fracassou. Ingredientes e ação consumidos; nenhuma propriedade ativada.':
        command.type==='studyIngredient'?'Estudo concluído: '+tx.result.effect.nome+'.':
        'Preparação registrada. Os efeitos compartilhados foram descobertos.','success');
      onChange(tx);render();
      return true;
    }catch(err){
      feedback('Não foi possível executar: '+(err?.message||err),'error');
      render();return false;
    }finally{busy=false;render();}
  }
  elements.alchemyLegacy.addEventListener('click',()=>toggleLegacy(true));
  elements.alchemyReturn.addEventListener('click',()=>toggleLegacy(false));
  elements.alchemyA.addEventListener('change',()=>{
    idA=elements.alchemyA.value;if(idA===idB)idB='';render();
  });
  elements.alchemyB.addEventListener('change',()=>{
    idB=elements.alchemyB.value;render();
  });
  elements.alchemyKnownMode.addEventListener('click',()=>{mode='known';idA='';idB='';render();});
  elements.alchemyFreeMode.addEventListener('click',()=>{mode='free';idA='';idB='';render();});
  elements.alchemyStudy.addEventListener('click',()=>{if(idA)execute({type:'studyIngredient',id:idA})});
  elements.alchemyBrew.addEventListener('click',()=>{if(idA&&idB&&idA!==idB)
    execute({type:'brewPair',ingredients:[idA,idB],focusEffect:mode==='known'?effectId:null})});
  return {show,render,isVisible,isDynamic};
}
