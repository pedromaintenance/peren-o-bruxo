/**
 * M1h-F.7 — Manual da Expedição. Read-only help, no save/telemetry access.
 * Every instruction reflects currently implemented actions in the Phaser preview.
 */
export const GUIDE_SECTIONS=Object.freeze([
 {id:'explorar',label:'Explorar',symbol:'❧',title:'CAMINHOS DE MÜRIN',intro:'A floresta esconde recursos e criaturas. Recuar também é uma decisão.',
  lines:[
   ['No celular','Mova Peren com o controle circular inferior esquerdo. Use Correr para acelerar e Colher perto dos materiais.'],
   ['No teclado','WASD ou setas movem. Shift corre. E ou Espaço coleta. Esc retorna a Portomonte.'],
   ['No controle Xbox','Analógico esquerdo ou direcional movimenta; RT, RB ou L3 corre; A ou X coleta; B/Menu abre Portomonte.'],
   ['Ao encontrar uma criatura','Observe e entre na batalha ou recue. A floresta continua após o desfecho.']
  ]},
 {id:'combate',label:'Combate',symbol:'⚔',title:'A ARTE DE SOBREVIVER',intro:'O combate é por turnos: cada comando traz uma consequência.',
  lines:[
   ['Atacar e defender','Ataque com a arma equipada ou use Defesa para diminuir o perigo no turno seguinte.'],
   ['Poções e feitiços','Use Poção para recuperar recursos disponíveis. Fogo, Gelo e Mísseis consomem pontos de mana (PM).'],
   ['Fugir','Você pode tentar escapar; a fuga não é uma vitória e não concede recompensas de batalha.'],
   ['Teclado e Xbox','No teclado, use os botões na tela ou as teclas indicadas no painel. No Xbox, direcional seleciona, A confirma, B recua, X usa poção, Y usa Fogo.']
  ]},
 {id:'cidade',label:'Portomonte',symbol:'⌂',title:'ENTRE A OFICINA E A ESTRADA',intro:'Tudo o que recolher e conquistar pertence ao mesmo progresso experimental.',
  lines:[
   ['Oficina','A bancada usa receitas e ingredientes reais do catálogo. Verifique o custo antes de fabricar.'],
   ['Comércio e inventário','Compre e venda itens em Portomonte. Consulte a bolsa para conferir os materiais carregados.'],
   ['Diário','O Diário reúne crônicas e transações já presentes no seu save. Pesquise, filtre e exporte Markdown quando quiser.'],
   ['Descanso e novos mapas','Descansar avança o dia; Gerar nova floresta troca a rota, sem reiniciar Peren.']
  ]},
 {id:'seguranca',label:'Saves e testes',symbol:'✦',title:'GUARDE O QUE SOBREVIVEU',intro:'O protótipo não é o jogo clássico. Seus dados são independentes.',
  lines:[
   ['Salvamento','A prévia grava o progresso experimental no navegador. Não use “Limpar dados do site” para atualizar.'],
   ['Backup','Em Portomonte, baixe um backup antes de testar importação, reinstalação ou limpeza do navegador.'],
   ['Recuperação','Se o save experimental estiver danificado, a tela de resgate permite baixar o original e restaurar explicitamente. Nunca apaga dados automaticamente.'],
   ['Testes reais','Registre Android, offline/PWA e controle físico na Bancada de Teste. Esses dispositivos ainda precisam de validação humana.']
  ]}
]);
const el=(doc,tag,cls,content)=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(content!==undefined)node.textContent=content;return node;};
export function createGuideScreen({document:doc}){
 const root=doc.getElementById('guideUI'),hub=doc.getElementById('hub'),
  button=doc.getElementById('showGuide'),closeButton=doc.getElementById('guideClose'),
  tabs=doc.getElementById('guideTabs'),content=doc.getElementById('guideContent');
 if(!root||!hub||!button||!closeButton||!tabs||!content)throw Error('Manual de Mürin ausente do HTML.');
 let active='explorar',previousFocus=null;
 const isOpen=()=>!root.hidden;
 const tabButtons=GUIDE_SECTIONS.map(section=>{
  const b=el(doc,'button','guide-tab ui-button',section.symbol+' '+section.label);
  b.type='button';b.dataset.guideSection=section.id;b.setAttribute('aria-pressed','false');
  b.addEventListener('click',()=>select(section.id));
  tabs.append(b);return b;
 });
 function render(){
  const section=GUIDE_SECTIONS.find(x=>x.id===active)||GUIDE_SECTIONS[0];
  tabButtons.forEach((b,i)=>{
   const current=GUIDE_SECTIONS[i].id===section.id;
   b.classList.toggle('is-active',current);b.setAttribute('aria-pressed',String(current));
  });
  content.replaceChildren();
  content.append(el(doc,'h3','',section.title),el(doc,'p','guide-lead',section.intro));
  for(const [title,description] of section.lines){
   const article=el(doc,'article','guide-note');
   article.append(el(doc,'h4','',title),el(doc,'p','',description));
   content.append(article);
  }
  if(section.id==='seguranca'){
   const a=el(doc,'a','guide-test-link','↗ Abrir Bancada de Teste de Campo');
   a.href='./teste.html';a.target='_blank';a.rel='noopener noreferrer';
   content.append(a);
  }
 }
 function select(section){
  if(!GUIDE_SECTIONS.some(x=>x.id===section))return;
  active=section;render();content.scrollTop=0;
 }
 function open(){
  if(isOpen())return;
  previousFocus=doc.activeElement;
  active='explorar';root.hidden=false;hub.inert=true;
  render();closeButton.focus({preventScroll:true});
 }
 function close(){
  if(!isOpen())return;
  root.hidden=true;hub.inert=false;
  if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
  else button.focus({preventScroll:true});
 }
 function cycleTab(delta){
  const i=GUIDE_SECTIONS.findIndex(s=>s.id===active);
  select(GUIDE_SECTIONS[(i+delta+GUIDE_SECTIONS.length)%GUIDE_SECTIONS.length].id);
 }
 root.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
  if((event.key==='ArrowLeft'||event.key==='ArrowRight')&&tabButtons.includes(doc.activeElement)){
   event.preventDefault();cycleTab(event.key==='ArrowLeft'?-1:1);
   tabButtons[GUIDE_SECTIONS.findIndex(s=>s.id===active)].focus({preventScroll:true});return;
  }
  if(event.key!=='Tab')return;
  const focusable=[...root.querySelectorAll('button:not(:disabled),a[href]')].filter(x=>x.getClientRects().length);
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first?.focus();}
 });
 button.addEventListener('click',open);
 closeButton.addEventListener('click',close);
 return {open,close,isOpen,cycleTab,scroll:delta=>content.scrollBy({top:delta*140,behavior:'auto'})};
}
