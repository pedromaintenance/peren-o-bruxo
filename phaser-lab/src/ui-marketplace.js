/**
 * M1g-D — Portomonte marketplace presentation layer.
 * Stock is the existing *city supplies* of the Phaser hub, not invented stock
 * tied to an NPC. Merchant identities/descriptions come from cidades.json.
 */
import {purchasePrice,salePrice,tradeQuote} from './progress.js';
import {inventoryCategory,itemSymbol} from './ui-inventory.js';

// Existing M1d Portomonte trading list, kept byte-for-byte by item ID.
export const PORTOMONTE_SUPPLIES=Object.freeze([
 'ing-blue-mountain-flower','ing-red-mountain-flower','ing-mudcrab-chitin',
 'mat-agua-purificada','ger-pocao-restauradora','mat-couro-curtido',
 'mat-carvao-de-forja','ger-racoes-de-viagem'
]);
const fmt=n=>new Intl.NumberFormat('pt-BR').format(n);
const fold=t=>String(t??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
const portrayals={
 'portomonte-sofia-do-porto-seguro':'./scenes/merchants/sofia.svg',
 'portomonte-jonathan-o-taberneiro':'./scenes/merchants/jonathan.svg',
 'portomonte-alina-das-conchas':'./scenes/merchants/alina.svg'
};
export function marketplaceViewModel(state,catalogs,{mode='buy',merchantId=null,query='',selectedId=null,quantity=1,limit=72}={}){
 const city=catalogs.cidadesById[state.city];
 const merchants=city?.mercadores||[];
 const merchant=merchants.find(m=>m.id===merchantId)||merchants[0]||null;
 // Other cities have no implementation-backed city stock yet.
 const cityStock=city?.id==='portomonte'?PORTOMONTE_SUPPLIES:[];
 const ids=mode==='buy'?cityStock:Object.keys(state.bag).filter(id=>state.bag[id]>0);
 const equipped=new Set([state.equip?.weapon,state.equip?.armor,state.equip?.relic].filter(Boolean));
 const items=ids.map(id=>{
   const item=catalogs.itensById[id];if(!item)return null;
   const category=inventoryCategory(item),owned=state.bag[id]||0;
   return {id,name:item.nome||id,description:item.descricao||item.descricaoCurta||'Sem descrição registrada no catálogo.',
     type:item.categoria||item.tipo||'Item',icon:itemSymbol(category),category,
     owned,equipped:equipped.has(id),price:mode==='buy'?purchasePrice(state,item,city):salePrice(state,item,city),
     level:item.nivel??null,value:item.valor??null};
 }).filter(Boolean);
 const needle=fold(query.trim());
 const filtered=items.filter(item=>!needle||fold(item.name+' '+item.type+' '+item.id).includes(needle))
  .sort((a,b)=>Number(a.equipped)-Number(b.equipped)||a.name.localeCompare(b.name,'pt-BR'));
 const selected=filtered.find(i=>i.id===selectedId)||filtered[0]||null;
 const count=Number.isSafeInteger(quantity)?Math.max(1,Math.min(99,quantity)):1;
 let quote=null,problem='';
 if(selected){
   if(mode==='sell'&&selected.equipped)problem='Item equipado: não pode ser vendido.';
   else if(mode==='sell'&&count>selected.owned)problem='Quantidade maior que a disponível na bolsa.';
   else{
     try{quote=tradeQuote(state,catalogs.itensById[selected.id],city,mode,count);}
     catch(err){problem=err.message;}
   }
 }
 return {city:city?.nome||state.city,merchant,merchants,portrait:portrayals[merchant?.id]||'',
  mode,gold:state.gold,items:filtered.slice(0,Math.max(1,limit)),total:filtered.length,
  selected,selectedId:selected?.id||null,quantity:count,quote,problem,
  stockNotice:mode==='buy'?
    (city?.id==='portomonte'
       ?'Suprimentos comuns de Portomonte. O catálogo ainda não define estoques individuais de mercadores.'
       :'A cidade ainda não possui catálogo de suprimentos integrado.'):
    'Itens reais da mochila; equipamentos atuais não podem ser vendidos.'};
}
const el=(doc,tag,cls,text)=>{const item=doc.createElement(tag);if(cls)item.className=cls;if(text!==undefined)item.textContent=String(text);return item;};
const put=(doc,id,text)=>{const node=doc.getElementById(id);if(node)node.textContent=String(text??'');};
export function createMarketplaceScreen({document:doc,bridge,catalogs,onChange=()=>{}}){
 const root=doc.getElementById('tradeUI'),list=doc.getElementById('tradeItems'),seller=doc.getElementById('tradeMerchants'),
       search=doc.getElementById('tradeSearch'),amount=doc.getElementById('tradeQuantity'),confirm=doc.getElementById('tradeConfirm'),
       more=doc.getElementById('tradeMore');
 if(!root||!list||!seller||!search||!amount||!confirm||!more)throw Error('Estrutura do comércio M1g-D incompleta.');
 let mode='buy',merchantId=null,selectedId=null,limit=72,busy=false,lastCommittedAt=-Infinity,lastCommittedSignature='',priorFocus=null,model=null;
 const isOpen=()=>!root.hidden;
 function render({focusItem=false}={}){
   model=marketplaceViewModel(bridge.state,catalogs,{mode,merchantId,query:search.value,
     selectedId,quantity:Number(amount.value),limit});
   selectedId=model.selectedId;merchantId=model.merchant?.id||null;
   put(doc,'tradeCity',model.city);
   put(doc,'tradeGold',fmt(model.gold));
   put(doc,'tradeMerchantName',model.merchant?.nome||'Sem comerciante');
   put(doc,'tradeMerchantProfile',model.merchant?.perfil||'');
   put(doc,'tradeMerchantDescription',model.merchant?.descricao||'Nenhum comerciante cadastrado para esta cidade.');
   const portrait=doc.getElementById('tradePortrait');
   if(portrait){portrait.hidden=!model.portrait;if(model.portrait&&portrait.getAttribute('src')!==model.portrait)portrait.src=model.portrait;
     portrait.alt=model.merchant?'Retrato provisório de '+model.merchant.nome:'';}
   put(doc,'tradeStockNotice',model.stockNotice);
   for(const tab of root.querySelectorAll('[data-trade-mode]')){
     const active=tab.dataset.tradeMode===mode;
     tab.setAttribute('aria-pressed',String(active));tab.classList.toggle('is-active',active);
   }
   seller.replaceChildren();
   for(const merchant of model.merchants){
     const button=el(doc,'button','ui-button trade-merchant',merchant.nome);
     button.type='button';button.dataset.merchantId=merchant.id;
     button.setAttribute('aria-pressed',String(merchant.id===merchantId));
     if(merchant.id===merchantId)button.classList.add('is-active');
     button.addEventListener('click',()=>{merchantId=merchant.id;render();});
     seller.append(button);
   }
   list.replaceChildren();
   for(const item of model.items){
     const button=el(doc,'button','trade-item');
     button.type='button';button.dataset.itemId=item.id;
     button.setAttribute('aria-pressed',String(item.id===selectedId));
     if(item.id===selectedId)button.classList.add('is-selected');
     button.append(el(doc,'span','trade-item-symbol',item.icon));
     const desc=el(doc,'span','trade-item-copy');
     desc.append(el(doc,'strong','',item.name),el(doc,'small','',item.type+' · na bolsa: '+item.owned));
     button.append(desc,el(doc,'span','trade-item-cost',(mode==='buy'?'◈ ':'+◈ ')+fmt(item.price)));
     if(item.equipped&&mode==='sell')button.append(el(doc,'small','trade-equipped','Equipado'));
     button.addEventListener('click',()=>{selectedId=item.id;amount.value='1';render({focusItem:true});});
     list.append(button);
   }
   if(!model.total)list.append(el(doc,'p','trade-empty','Nenhum item disponível neste filtro.'));
   put(doc,'tradeCount',model.total+' itens');
   more.hidden=limit>=model.total;
   put(doc,'tradeMore','Ver mais itens ('+model.items.length+' / '+model.total+')');
   const item=model.selected;
   put(doc,'tradeDetailName',item?.name||'Selecione um item');
   put(doc,'tradeDetailIcon',item?.icon||'◇');
   put(doc,'tradeDetailType',item?.type||'—');
   put(doc,'tradeDetailDescription',item?.description||'Selecione um item para conferir descrição e preço.');
   put(doc,'tradeOwned',item?'Possui: '+item.owned:'');
   put(doc,'tradeUnitPrice',item?'Preço unitário: '+fmt(item.price)+' ouro':'');
   put(doc,'tradeTotal',model.quote?'Total: '+fmt(model.quote.gold)+' ouro':'Total indisponível');
   put(doc,'tradeReason',model.problem||(item?'Preço calculado pelas regras do comércio do Peren.':'Sem item selecionado.'));
   const reason=doc.getElementById('tradeReason');
   if(reason)reason.dataset.ready=String(Boolean(model.quote));
   confirm.disabled=!model.quote||busy;
   confirm.textContent=busy?'Negociando…':model.quote?
     (mode==='buy'?'Comprar ':'Vender ')+model.quantity+' × '+item.name:
     'Negociação indisponível';
   amount.max=String(mode==='sell'?(item?.owned||1):99);
   amount.min='1';
   const active=list.querySelector('.is-selected');
   active?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
   if(focusItem)active?.focus({preventScroll:true});
   return model;
 }
 function setMode(newMode){
   if(!['buy','sell'].includes(newMode)||newMode===mode)return;
   mode=newMode;selectedId=null;amount.value='1';search.value='';limit=72;
   put(doc,'tradeFeedback','Escolha um item e confirme a quantidade.');
   doc.getElementById('tradeFeedback').dataset.state='';
   render();
 }
 function adjustQuantity(delta){
   if(!isOpen())return;
   const max=Math.min(99,mode==='sell'?(model?.selected?.owned||1):99);
   amount.value=String(Math.max(1,Math.min(max,Number(amount.value||1)+delta)));
   render();
 }
 function move(delta){
   if(!isOpen()||!model?.items.length)return;
   const current=model.items.findIndex(item=>item.id===selectedId);
   const next=Math.max(0,Math.min(model.items.length-1,current+delta));
   selectedId=model.items[next].id;amount.value='1';render({focusItem:true});
 }
 function transact(){
   const signature=mode+':'+selectedId+':'+amount.value;
   root.dataset.tradeAttempt=JSON.stringify({busy,open:isOpen(),signature,lastCommittedSignature,elapsed:performance.now()-lastCommittedAt});
   // Suppress only the *same* double-tap, never a distinct buy→sell operation.
   if(busy||!isOpen()||(performance.now()-lastCommittedAt<450&&signature===lastCommittedSignature))return false;
   // Recalculate against the current bridge state; never trust cached prices.
   const fresh=marketplaceViewModel(bridge.state,catalogs,{mode,merchantId,query:search.value,selectedId,quantity:Number(amount.value),limit});
   if(!fresh.selected||!fresh.quote||fresh.selected.id!==selectedId){render();return false;}
   busy=true;confirm.disabled=true;
   try{
     const result=bridge.execute({type:mode,id:selectedId,quantity:fresh.quantity});
     lastCommittedAt=performance.now();lastCommittedSignature=signature;
     put(doc,'tradeFeedback',(mode==='buy'?'Comprado: ':'Vendido: ')+fresh.quantity+' × '+fresh.selected.name+
       ' · '+fmt(result.result.gold)+' moedas. Progresso salvo.');
     doc.getElementById('tradeFeedback').dataset.state='success';
     onChange(result);
     return true;
   }catch(error){
     put(doc,'tradeFeedback','Negociação recusada: '+(error?.message||error));
     doc.getElementById('tradeFeedback').dataset.state='error';
     return false;
   }finally{busy=false;render();}
 }
 function close(){
   if(!isOpen())return;
   root.hidden=true;priorFocus?.focus?.({preventScroll:true});
 }
 function open(initialMode='buy'){
   priorFocus=doc.activeElement;root.hidden=false;
   mode=initialMode==='sell'?'sell':'buy';merchantId=null;selectedId=null;search.value='';amount.value='1';limit=72;
   put(doc,'tradeFeedback','Selecione um item para negociar.');
   doc.getElementById('tradeFeedback').dataset.state='';
   render();doc.getElementById('tradeClose').focus({preventScroll:true});
 }
 doc.getElementById('tradeClose').addEventListener('click',close);
 confirm.addEventListener('click',transact);
 search.addEventListener('input',()=>{selectedId=null;limit=72;render()});
 amount.addEventListener('change',()=>{
   const max=Math.min(99,mode==='sell'?(model?.selected?.owned||1):99);
   amount.value=String(Math.max(1,Math.min(max,Math.trunc(Number(amount.value)||1))));
   render();
 });
 more.addEventListener('click',()=>{limit+=72;render()});
 for(const tab of root.querySelectorAll('[data-trade-mode]'))tab.addEventListener('click',()=>setMode(tab.dataset.tradeMode));
 root.addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
   if(event.key==='Tab'){
     const focusable=[...root.querySelectorAll('button:not(:disabled),input:not(:disabled)')].filter(node=>node.offsetParent!==null);
     if(!focusable.length)return;
     if(event.shiftKey&&doc.activeElement===focusable[0]){event.preventDefault();focusable.at(-1).focus();}
     else if(!event.shiftKey&&doc.activeElement===focusable.at(-1)){event.preventDefault();focusable[0].focus();}
     return;
   }
   if(event.target===search||event.target===amount)return;
   if(event.key==='ArrowUp'||event.key==='ArrowDown'){
     event.preventDefault();event.stopPropagation();move(event.key==='ArrowDown'?1:-1);
   }
   if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
     event.preventDefault();event.stopPropagation();adjustQuantity(event.key==='ArrowRight'?1:-1);
   }
 });
 return {open,close,render,isOpen,transact,move,adjustQuantity,setMode,
   get mode(){return mode},get view(){return model}};
}
