/* Peren, o Bruxo — Laboratório de Itens.
   Lê data/itens.json e data/receitas.json sem alterá-los.
   O planejamento artístico é isolado no localStorage e exportável. */
(function(){
'use strict';
var ROOT='../', STORAGE='peren_item_lab_v1', DB={items:[],recipes:[],byId:new Map(),produced:new Map(),used:new Map(),families:[],manifest:null};
var state={schema:'peren-item-lab-1',records:{},groups:{},updatedAt:null};
var ui={tab:'overview',query:'',category:'all',rarity:'all',art:'all',priority:'all',page:1,recipeQuery:'',station:'all',recipeIssues:false,recipePage:1,familyQuery:'',pipelineCategory:'all'};
var names={overview:'Painel geral',catalog:'Catálogo de itens',recipes:'Livro de receitas',families:'Famílias e variações',pipeline:'Fila de arte',diagnostics:'Auditoria de dados'};
var pageSize=45, artLabels={sem:'Sem sprite',criacao:'Em criação',revisao:'Revisar / integrado',aprovado:'Aprovado'};
var main=document.getElementById('main'),modal=document.getElementById('modal'),modalContent=document.getElementById('modal-content'),toast=document.getElementById('toast');
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function fmt(n){return Number(n||0).toLocaleString('pt-BR');}
function size(a){return (a||[]).length;}
function uniq(a){return [...new Set(a)].sort(function(x,y){return x.localeCompare(y,'pt-BR');});}
function mark(value,kind){return '<span class="badge '+(kind||'')+'">'+esc(value)+'</span>';}
function itemRecord(id){return state.records[id]||{};}
function groupRecord(k){return state.groups[k]||{};}
function sourceImage(it){return [it.asset,it.sprite,it.imagem,it.image,it.imageUrl,it.iconePath,it.icone_url].find(function(v){return typeof v==='string'&&v.trim();})||'';}
function itemPath(it){return (itemRecord(it.id).assetPath||'').trim()||sourceImage(it);}
function assetUrl(path){path=String(path||'').trim();if(!path||/^(?:javascript|data|file):/i.test(path))return '';if(/^https?:\/\//i.test(path))return path;if(path.startsWith('../'))return path;if(path.startsWith('/'))return path;if(path.startsWith('./'))path=path.slice(2);return ROOT+path;}
function artState(it){var r=itemRecord(it.id),has=!!itemPath(it);if(r.status==='aprovado')return 'aprovado';if(r.status==='criacao')return 'criacao';if(r.status==='revisao'||has)return 'revisao';return 'sem';}
function artBadge(it){var a=artState(it);return mark(artLabels[a],a==='sem'?'missing':a==='criacao'?'working':a==='aprovado'?'approved':'info');}
function priority(it){return itemRecord(it.id).priority||'normal';}
function variantLines(it){return (itemRecord(it.id).variants||[]);}
function variantMissing(it){return variantLines(it).filter(function(v){return v.status!=='aprovado';}).length;}
function familyVariantProgress(f){var target=Math.max(0,Number(groupRecord(f.key).target)||0),done=0;f.items.forEach(function(it){done+=variantLines(it).filter(function(v){return v.status==='aprovado';}).length;});return {target:target,done:done,missing:Math.max(0,target-done)};}
function sharedIcon(it){var n=norm(it.nome),cat=it.categoria;if(cat==='arma')return n.includes('arco')?'arco':n.includes('martelo')?'martelo':'espada';if(cat==='armadura')return n.includes('elmo')?'elmo':'armadura';if(cat==='pocao'||cat==='consumivel')return 'pocao';if(cat==='grimorio')return 'grimorio';if(cat==='reliquia'||cat==='acessorio')return n.includes('anel')?'anel':'tomo';if(cat==='ingrediente')return 'erva';if(cat==='material')return n.includes('osso')?'osso':n.includes('couro')?'cristal':n.includes('metal')||n.includes('minerio')?'cristal':'escama';return 'tomo';}
function sharedPath(it){return 'assets/icons/'+sharedIcon(it)+'.webp';}
function icon(it,cls){var image=assetUrl(itemPath(it))||assetUrl(sharedPath(it));return '<span class="item-icon '+(cls||'')+'">'+(image?'<img alt="" loading="lazy" src="'+esc(image)+'">':esc(it.icone||'◇'))+'</span>';}
function itemName(it){return esc(it?it.nome:'ID não encontrado');}
function familyKey(it){return String(it.categoria||'sem categoria')+' / '+String(it.tipo||'geral');}
function suggestVariant(it){var r=itemRecord(it.id);return variantMissing(it);}
function getIssues(r){var issues=[];if(!r.resultado||!DB.byId.has(r.resultado))issues.push('Resultado não encontrado');if(!Array.isArray(r.ingredientes)||!r.ingredientes.length)issues.push('Sem ingredientes');(r.ingredientes||[]).forEach(function(i){if(!i.item||!DB.byId.has(i.item))issues.push('Insumo ausente: '+i.item);if(!Number.isFinite(Number(i.quantidade))||Number(i.quantidade)<=0)issues.push('Quantidade inválida: '+i.item+' ('+i.quantidade+')');});if(Number(r.quantidade)<=0)issues.push('Quantidade de saída inválida');return issues;}
function filteredItems(){var q=norm(ui.query);return DB.items.filter(function(it){if(ui.category!=='all'&&it.categoria!==ui.category)return false;if(ui.rarity!=='all'&&it.raridade!==ui.rarity)return false;if(ui.art!=='all'&&artState(it)!==ui.art)return false;if(ui.priority!=='all'&&priority(it)!==ui.priority)return false;if(q&&!norm([it.nome,it.id,it.tipo,it.categoria,it.efeito,(it.efeitos||[]).join(' ')].join(' ')).includes(q))return false;return true;});}
function option(value,label,current){return '<option value="'+esc(value)+'"'+(value===current?' selected':'')+'>'+esc(label)+'</option>';}
function options(values,current){return values.map(function(x){return option(x,x,current);}).join('');}
function head(kicker,title,desc,right){return '<div class="section-head"><div><span class="eyebrow">'+esc(kicker)+'</span><h2>'+esc(title)+'</h2><p>'+esc(desc||'')+'</p></div>'+(right||'')+'</div>';}
function metric(label,n,sub){return '<div class="metric"><span>'+esc(label)+'</span><strong>'+fmt(n)+'</strong><small>'+esc(sub)+'</small></div>';}
function percent(n,d){return d?Math.round(n/d*100):0;}
function section(title,right){return '<div class="section-sub"><h3>'+title+'</h3>'+(right||'')+'</div>';}
function toastMsg(msg){toast.textContent=msg;toast.hidden=false;clearTimeout(toast._timer);toast._timer=setTimeout(function(){toast.hidden=true;},3400);}


function setTab(tab){if(!names[tab])return;ui.tab=tab;render();window.scrollTo({top:0,behavior:'smooth'});}
function render(){document.getElementById('crumb').textContent=names[ui.tab];document.querySelectorAll('.nav').forEach(function(n){n.classList.toggle('active',n.dataset.tab===ui.tab);});var html={overview:renderOverview,catalog:renderCatalog,recipes:renderRecipes,families:renderFamilies,pipeline:renderPipeline,diagnostics:renderDiagnostics}[ui.tab]();main.innerHTML=html;}
function renderOverview(){
 var counts={sem:0,criacao:0,revisao:0,aprovado:0},categories={},priorityCount=0,pendingVars=0;
 DB.items.forEach(function(i){counts[artState(i)]++;categories[i.categoria||'sem categoria']=(categories[i.categoria||'sem categoria']||0)+1;if(priority(i)==='alta'||priority(i)==='critica')priorityCount++;pendingVars+=variantMissing(i);});
 var cats=Object.entries(categories).sort(function(a,b){return b[1]-a[1];});
 var ranked=DB.items.filter(function(i){return artState(i)==='sem';}).map(function(i){return {item:i,n:(DB.used.get(i.id)||[]).length+(DB.produced.get(i.id)||[]).length};}).sort(function(a,b){return b.n-a.n;}).slice(0,10);
 var stationCount={};DB.recipes.forEach(function(r){stationCount[r.estacao]=(stationCount[r.estacao]||0)+1;});
 var iss=DB.recipes.filter(function(r){return getIssues(r).length;}).length;var revised=DB.items.filter(function(i){return i.categoria==='ingrediente'&&i.atributos_revisados;}).length,ingCount=DB.items.filter(function(i){return i.categoria==='ingrediente';}).length,recipesRevising=DB.recipes.filter(function(r){return r.revisao_alquimica_pendente;}).length;var familyGaps=DB.families.reduce(function(a,f){return a+familyVariantProgress(f).missing;},0);
 return head('PANORAMA • INVENTÁRIO ORIGINAL','A forja ainda não terminou','Todas as métricas abaixo são calculadas ao abrir os JSONs do próprio Peren. Ícone/emoji não conta como sprite desenhado.')+
 '<div class="cards-metrics">'+metric('Itens do jogo',DB.items.length,'Todas as categorias')+metric('Receitas de crafting',DB.recipes.length,'Sete estações e seus vínculos')+metric('Sem sprite mapeado',counts.sem,'Inclui ícones provisórios')+metric('Variações pendentes',pendingVars+familyGaps,'Itens + metas das famílias')+metric('Ingredientes revisados',revised,'De '+fmt(ingCount)+' ingredientes')+metric('Receitas sob revisão',recipesRevising,'Alquimia herdada a conferir')+'</div>'+
 '<div class="note"><strong>Diferença essencial:</strong> o jogo já possui ícones genéricos em <code>assets/icons/</code>, que aparecem como prévias compartilhadas. O campo <code>icone</code> também pode ser textual. <strong>Ícone de categoria não equivale a sprite exclusivo ou aprovado</strong>. Os registros de novos assets são atualizados pelo chat no repositório. Marque a aprovação apenas após revisar a arte.</div>'+
 '<div class="split">'+
 '<div class="panel">'+section('Categorias de itens',mark(cats.length+' categorias','info'))+
 cats.map(function(x){return '<div class="breakdown"><button data-action="category" data-category="'+esc(x[0])+'">'+esc(x[0])+'</button><div class="bar"><i style="width:'+percent(x[1],cats[0][1])+'%"></i></div><strong>'+fmt(x[1])+'</strong></div>';}).join('')+'</div>'+
 '<div class="panel">'+section('Cobertura visual',mark(fmt(counts.aprovado)+' aprovados','approved'))+
 ['sem','criacao','revisao','aprovado'].map(function(k){return '<div class="breakdown"><button data-action="artfilter" data-status="'+k+'">'+esc(artLabels[k])+'</button><div class="bar"><i style="width:'+percent(counts[k],DB.items.length)+'%"></i></div><strong>'+fmt(counts[k])+'</strong></div>';}).join('')+
 section('Receitas por ofício')+Object.entries(stationCount).sort(function(a,b){return b[1]-a[1];}).map(function(x){return '<div class="breakdown"><button data-action="stationfilter" data-station="'+esc(x[0])+'">'+esc(x[0])+'</button><div class="bar"><i style="width:'+percent(x[1],DB.recipes.length)+'%"></i></div><strong>'+fmt(x[1])+'</strong></div>';}).join('')+'</div></div>'+
 section('Pontos de maior reaproveitamento','<button class="btn slim ghost" data-action="nav" data-tab="families">Planejar famílias →</button>')+
 '<p class="quiet">Itens sem sprite ordenados por número de receitas que os produzem ou consomem. Priorizar esses ingredientes costuma destravar muitas telas de uma vez.</p><div class="table-wrap"><table><thead><tr><th>Item</th><th>Categoria</th><th class="right">Receitas relacionadas</th><th>Arte</th><th></th></tr></thead><tbody>'+
 ranked.map(function(x){var i=x.item;return '<tr><td><div class="item-name">'+icon(i)+'<div><button class="clickable" data-action="item" data-id="'+esc(i.id)+'">'+esc(i.nome)+'</button><div class="item-id">'+esc(i.id)+'</div></div></div></td><td>'+esc(i.categoria)+'</td><td class="right">'+fmt(x.n)+'</td><td>'+artBadge(i)+'</td><td><button class="btn slim ghost" data-action="item" data-id="'+esc(i.id)+'">Ver ficha</button></td></tr>';}).join('')+'</tbody></table></div>'+
 '<div class="note warning">Auditoria inicial: <strong>'+fmt(iss)+' receitas com inconsistências de referência ou quantidade</strong> detectadas na fonte. <button class="btn slim ghost" data-action="nav" data-tab="diagnostics">Inspecionar</button></div>';
}
function renderCatalog(){
 var found=filteredItems(),totalPages=Math.max(1,Math.ceil(found.length/pageSize)),page=Math.min(ui.page,totalPages);ui.page=page;var slice=found.slice((page-1)*pageSize,page*pageSize),cats=uniq(DB.items.map(function(x){return x.categoria||'sem categoria';})),rarities=uniq(DB.items.map(function(x){return x.raridade||'sem raridade';}));
 return head('CATÁLOGO • TODOS OS OBJETOS','Arquivo dos itens','Pesquise por nome, ID, efeito ou tipo. Abra a ficha para consultar atributos, receitas, estado visual e exportar o JSON individual.',mark(fmt(found.length)+' registros','info'))+
 '<div class="filters"><div class="field search"><label for="f-search">Pesquisar item</label><input id="f-search" data-filter="query" placeholder="Nome, ID, efeito, tipo…" value="'+esc(ui.query)+'"></div>'+
 '<div class="field"><label for="f-cat">Categoria</label><select id="f-cat" data-filter="category">'+option('all','Todas',ui.category)+options(cats,ui.category)+'</select></div>'+
 '<div class="field"><label for="f-rarity">Raridade</label><select id="f-rarity" data-filter="rarity">'+option('all','Todas',ui.rarity)+options(rarities,ui.rarity)+'</select></div>'+
 '<div class="field"><label for="f-art">Situação do asset</label><select id="f-art" data-filter="art">'+option('all','Todas',ui.art)+Object.keys(artLabels).map(function(k){return option(k,artLabels[k],ui.art);}).join('')+'</select></div>'+
 '<div class="field"><label for="f-priority">Prioridade</label><select id="f-priority" data-filter="priority">'+option('all','Todas',ui.priority)+option('critica','Crítica',ui.priority)+option('alta','Alta',ui.priority)+option('normal','Normal',ui.priority)+option('baixa','Baixa',ui.priority)+'</select></div></div>'+
 '<div class="table-wrap"><table><thead><tr><th>Item / ID</th><th>Categoria • Tipo</th><th>Raridade</th><th class="right">Receitas</th><th>Estado visual</th><th>Variações</th><th></th></tr></thead><tbody>'+
 (slice.length?slice.map(function(i){var links=(DB.used.get(i.id)||[]).length+(DB.produced.get(i.id)||[]).length;return '<tr><td><div class="item-name">'+icon(i)+'<div><button class="clickable" data-action="item" data-id="'+esc(i.id)+'">'+esc(i.nome)+'</button><div class="item-id">'+esc(i.id)+'</div></div></div></td><td>'+esc(i.categoria||'—')+'<div class="quiet">'+esc(i.tipo||'—')+'</div></td><td>'+esc(i.raridade||'—')+'</td><td class="right">'+fmt(links)+'</td><td>'+artBadge(i)+'</td><td>'+(variantLines(i).length?mark(variantMissing(i)+' / '+variantLines(i).length+' pend.','working'):'<span class="dim">—</span>')+'</td><td><button class="btn slim ghost" data-action="item" data-id="'+esc(i.id)+'">Ver ficha</button></td></tr>';}).join(''):'<tr><td colspan="7"><div class="empty">Nenhum item combina com os filtros.</div></td></tr>')+
 '</tbody></table></div>'+pagination(page,totalPages,found.length,'itempage');
}
function pagination(p,total,count,action){return '<div class="pagination"><small>'+fmt(count)+' resultados • Página '+p+' de '+total+'</small><div class="actions"><button class="btn slim ghost" data-action="'+action+'" data-page="'+(p-1)+'" '+(p<=1?'disabled':'')+'>← Anterior</button><button class="btn slim ghost" data-action="'+action+'" data-page="'+(p+1)+'" '+(p>=total?'disabled':'')+'>Próxima →</button></div></div>';}
function recipeMatches(){var q=norm(ui.recipeQuery);return DB.recipes.filter(function(r){if(ui.station!=='all'&&r.estacao!==ui.station)return false;if(ui.recipeIssues&&!getIssues(r).length)return false;if(q&&!norm([r.nome,r.id,r.resultado,r.estacao].concat((r.ingredientes||[]).map(function(x){return itemName(DB.byId.get(x.item));})).join(' ')).includes(q))return false;return true;});}
function renderRecipes(){var rows=recipeMatches(),pages=Math.max(1,Math.ceil(rows.length/pageSize));ui.recipePage=Math.min(ui.recipePage,pages);var sample=rows.slice((ui.recipePage-1)*pageSize,ui.recipePage*pageSize);
 return head('COMPÊNDIO • CRAFTING','Livro de receitas','Fórmulas reais do jogo, vinculadas por IDs aos itens de entrada e saída. Os problemas de quantidade aparecem destacados.',mark(fmt(rows.length)+' fórmulas','info'))+
 '<div class="filters"><div class="field search"><label>Pesquisar receita ou ingrediente</label><input id="r-search" placeholder="Receita, resultado, ingrediente…" data-filter="recipeQuery" value="'+esc(ui.recipeQuery)+'"></div><div class="field"><label>Estação / Ofício</label><select data-filter="station">'+option('all','Todas as estações',ui.station)+options(uniq(DB.recipes.map(function(r){return r.estacao;})),ui.station)+'</select></div><label class="inline-check"><input type="checkbox" data-filter="recipeIssues" '+(ui.recipeIssues?'checked':'')+'> Apenas inconsistências</label></div>'+
 '<div class="table-wrap"><table><thead><tr><th>Receita</th><th>Estação / Nível</th><th>Ingredientes</th><th>Resultado</th><th>Validação</th><th></th></tr></thead><tbody>'+
 (sample.length?sample.map(function(r){var result=DB.byId.get(r.resultado),problems=getIssues(r);return '<tr><td><button class="clickable" data-action="recipe" data-id="'+esc(r.id)+'">'+esc(r.nome)+'</button><div class="item-id">'+esc(r.id)+'</div></td><td>'+esc(r.estacao)+'<div class="quiet">Nível '+esc(r.nivel)+'</div></td><td>'+esc((r.ingredientes||[]).map(function(x){var i=DB.byId.get(x.item);return x.quantidade+'× '+(i?i.nome:x.item);}).join(' + '))+'</td><td>'+esc(result?result.nome:r.resultado)+'<div class="quiet">× '+esc(r.quantidade)+'</div></td><td>'+mark(problems.length?problems.length+' alerta(s)':'Íntegra',problems.length?'missing':'good')+'</td><td><button class="btn slim ghost" data-action="recipe" data-id="'+esc(r.id)+'">Abrir</button></td></tr>';}).join(''):'<tr><td colspan="6"><div class="empty">Nenhuma receita encontrada.</div></td></tr>')+
 '</tbody></table></div>'+pagination(ui.recipePage,pages,rows.length,'recipepage');
}
function renderFamilies(){var q=norm(ui.familyQuery),all=DB.families.filter(function(f){return !q||norm(f.key).includes(q);});
 return head('ESTRATÉGIA DE ASSETS','Famílias visuais','Agrupamento automático por categoria e tipo. Uma arte-base pode servir a vários itens. A discussão visual e a atualização dos assets acontecem no chat; aqui ficam apenas os estados e as metas versionadas.')+
 '<div class="note"><strong>Não é necessário desenhar 1.744 poções exclusivas.</strong> O acompanhamento é feito pelo repositório, não por formulários neste HTML. As famílias podem compartilhar um master com variações, mas só arquivos revisados serão considerados aprovados.</div>'+
 '<div class="filters"><div class="field search"><label>Buscar família</label><input id="family-search" data-filter="familyQuery" placeholder="Ex.: pocao / veneno" value="'+esc(ui.familyQuery)+'"></div></div><div class="families-grid">'+
 all.map(function(f){var gr=groupRecord(f.key),done=f.items.filter(function(i){return artState(i)==='aprovado';}).length,vp=familyVariantProgress(f);return '<div class="family"><span class="eyebrow">'+esc(f.category)+'</span><h3>'+esc(f.type)+'</h3><div class="family-meta"><span>'+fmt(f.items.length)+' itens</span><span>'+fmt(done)+' aprovados</span></div><div class="mini-bar"><i style="width:'+percent(done,f.items.length)+'%"></i></div><div class="quiet">'+esc(gr.strategy||'Estratégia visual ainda não definida.')+'</div><div class="family-meta"><span>Variações: '+vp.done+' / '+(gr.target||'—')+'</span><span>'+(vp.missing?vp.missing+' a produzir':gr.target?'Meta atingida':'Sem meta')+'</span></div><div class="family-foot"><button class="btn slim ghost" data-action="familyitems" data-key="'+esc(encodeURIComponent(f.key))+'">Ver itens</button><button class="btn slim" data-action="family" data-key="'+esc(encodeURIComponent(f.key))+'">Ver família</button></div></div>';}).join('')+
 '</div>'+(all.length?'':'<div class="empty">Nenhuma família corresponde à busca.</div>');
}
function renderPipeline(){var cats=uniq(DB.items.map(function(x){return x.categoria||'sem categoria';})),arr=DB.items.filter(function(i){return ui.pipelineCategory==='all'||i.categoria===ui.pipelineCategory;});
 return head('PRODUÇÃO • KANBAN','Fila de arte','Itens distribuídos por estágio visual. Os arquivos e os estados são mantidos no repositório; esta página apenas consulta. Listas limitadas a 22 exemplos por coluna para manter o painel leve.')+
 '<div class="filters"><div class="field" style="max-width:300px"><label>Categoria</label><select data-filter="pipelineCategory">'+option('all','Todas',ui.pipelineCategory)+options(cats,ui.pipelineCategory)+'</select></div><button class="btn ghost" data-action="exportcsv">↓ Exportar fila CSV</button></div>'+
 '<div class="pipeline">'+Object.keys(artLabels).map(function(key){var list=arr.filter(function(i){return artState(i)===key;});list.sort(function(a,b){return orderPriority(a)-orderPriority(b)||a.nome.localeCompare(b.nome,'pt-BR');});return '<div class="pipeline-col"><h3>'+esc(artLabels[key])+' <span>'+fmt(list.length)+'</span></h3>'+
 list.slice(0,22).map(function(i){return '<div class="pipeline-card" data-action="item" data-id="'+esc(i.id)+'"><div class="flex">'+icon(i)+'<div class="grow"><b>'+esc(i.nome)+'</b><small>'+esc(i.categoria)+' · '+esc(priority(i))+'</small></div></div>'+(variantMissing(i)?'<small>'+variantMissing(i)+' variações pendentes</small>':'')+'</div>';}).join('')+
 (list.length>22?'<button class="btn slim ghost" style="width:100%;margin-top:12px" data-action="pipelinefilter" data-status="'+key+'">Ver '+fmt(list.length-22)+' restantes →</button>':'')+(list.length?'':'<div class="empty">Sem itens</div>')+'</div>';}).join('')+'</div>';
}
function renderDiagnostics(){var issues=DB.recipes.map(function(r){return {recipe:r,problems:getIssues(r)};}).filter(function(x){return x.problems.length;}),hasVariants=DB.items.filter(function(i){return variantLines(i).length;}).length,assigned=DB.items.filter(function(i){return !!itemPath(i);}).length,without=DB.items.length-assigned;
 return head('CONTROLE DE INTEGRIDADE','Auditoria de dados e assets','Uma receita referencialmente íntegra não garante balanceamento. Esta página aponta anomalias objetivas sem modificar os JSONs originais.')+
 '<div class="cards-metrics">'+metric('Receitas com alertas',issues.length,'Quantidades e IDs inválidos')+metric('Receitas sem alertas',DB.recipes.length-issues.length,'Integridade estrutural')+metric('Assets vinculados',assigned,'Caminho no dado ou anotação')+metric('Itens com plano de variantes',hasVariants,'Registros personalizados')+'</div>'+
 '<div class="note warning"><strong>Importante:</strong> '+fmt(without)+' itens não possuem caminho de imagem mapeado. Isto não comprova que nenhum arquivo exista no repositório: o catálogo de itens ainda não relaciona automaticamente imagens de outras pastas. A vinculação é atualizada no repositório conforme novos assets são criados no chat.</div>'+
 section('Alertas em receitas',mark(fmt(issues.length)+' ocorrências','missing'))+
 (issues.length?'<div class="alert-list">'+issues.slice(0,60).map(function(x){return '<div class="alert"><div><b>'+esc(x.recipe.nome)+'</b><div class="quiet">'+esc(x.problems.join(' · '))+'</div></div><button class="btn slim ghost" data-action="recipe" data-id="'+esc(x.recipe.id)+'">Ver receita</button></div>';}).join('')+'</div>'+(issues.length>60?'<p class="quiet">Mostrando 60 registros. Use a aba Receitas → Apenas inconsistências para consultar todos.</p>':''):'<div class="alert good">Nenhuma inconsistência estrutural encontrada.</div>')+
 section('Regras de classificação')+
 '<div class="panel"><div class="stack"><div>'+mark('Sem sprite','missing')+' — apenas emoji ou nenhuma referência de arquivo; pode existir arte não vinculada.</div><div>'+mark('Em criação','working')+' — estado marcado manualmente, mesmo antes do arquivo existir.</div><div>'+mark('Revisar / integrado','info')+' — há caminho de imagem ou está aguardando revisão.</div><div>'+mark('Aprovado','approved')+' — aprovado manualmente; não equivale a teste automatizado do jogo.</div></div></div>';
}
function orderPriority(i){return ({critica:0,alta:1,normal:2,baixa:3})[priority(i)]??2;}
function openModal(html){modalContent.innerHTML=html;modal.hidden=false;document.body.style.overflow='hidden';var focus=modal.querySelector('input,button');if(focus)focus.focus();}
function closeModal(){modal.hidden=true;modalContent.innerHTML='';document.body.style.overflow='';}
function modalHeading(kicker,title,subtitle){return '<div class="modal-top"><div><span class="eyebrow">'+esc(kicker)+'</span><h2 id="modal-title">'+esc(title)+'</h2><div class="item-id">'+esc(subtitle||'')+'</div></div><button class="close" data-action="close" aria-label="Fechar">×</button></div>';}
function labeled(label,html,wide){return '<div class="field '+(wide?'wide':'')+'"><label>'+esc(label)+'</label>'+html+'</div>';}
function attributePanel(it){
 if(it.categoria!=='ingrediente')return '';
 var attrs=it.atributos;
 if(!Array.isArray(attrs)||!attrs.length){
  return section('Atributos alquímicos')+'<div class="note warning"><strong>Aguardando curadoria:</strong> este ingrediente ainda usa a lista antiga de efeitos. A regra nova é mínimo de três atributos, intensidade de 1 a 3. Nenhuma intensidade foi inferida automaticamente.</div>'+
  '<div class="flex">'+(it.efeitos||[]).map(function(e){return mark(e,'working');}).join('')+'</div>';
 }
 return section('Atributos canônicos',mark('CURADORIA REVISADA','good'))+
 '<div class="attribute-list">'+attrs.map(function(a){
  var level=Number(a.intensidade)||0;
  return '<div class="attribute-row"><div><strong>'+esc(a.nome||a.id)+'</strong><small>'+esc(a.id||'')+'</small></div>'+
   '<div class="intensity"><div class="intensity-ticks">'+[1,2,3].map(function(n){return '<i class="'+(n<=level?'lit':'')+'"></i>';}).join('')+'</div><b>'+level+' / 3</b></div></div>';
 }).join('')+'</div>'+
 '<p class="quiet" style="margin:10px 0">Regra: pelo menos três atributos; outros são permitidos quando definidos. Intensidade: 1 (baixa), 2 (média), 3 (alta).</p>';
}
function editItem(id){
 var it=DB.byId.get(id);if(!it){toastMsg('Item não encontrado');return;}
 var r=itemRecord(id),made=DB.produced.get(id)||[],used=DB.used.get(id)||[],visual=itemPath(it),image=assetUrl(visual)||assetUrl(sharedPath(it));
 var related=function(arr,title){return '<div class="recipe-box"><b>'+title+' ('+fmt(arr.length)+')</b><div class="stack" style="margin-top:8px">'+arr.slice(0,10).map(function(x){return '<button class="clickable" data-action="recipe" data-id="'+esc(x.id)+'">'+esc(x.nome)+'</button>'+(x.revisao_alquimica_pendente?'<small>Revisão alquímica pendente</small>':'');}).join('')+(arr.length>10?'<span class="quiet">+ '+fmt(arr.length-10)+' outras receitas no catálogo.</span>':'')+(!arr.length?'<span class="quiet">Nenhuma receita registrada.</span>':'')+'</div></div>';};
 var details=['<div class="details">'];
 function detail(k,v){details.push('<div><span>'+esc(k)+'</span><b>'+esc(v==null?'—':v)+'</b></div>');}
 detail('Categoria',it.categoria);detail('Tipo',it.tipo);detail('Origem de coleta',it.zona_exclusiva?it.zona_exclusiva+' (exclusiva)':it.zona||'—');
 detail('Raridade',it.raridade);detail('Nível',it.nivel);detail('Valor base',it.valor);detail('Proveniência de dados',it.origem);
 detail('Caminho de sprite individual',visual||'não vinculado');details.push('</div>');
 var body=modalHeading('CATÁLOGO CANÔNICO',it.nome,id)+
 '<div class="modal-body"><div class="preview"><div class="preview-img">'+(image?'<img src="'+esc(image)+'" alt="Ícone para '+esc(it.nome)+'">':esc(it.icone||'◇'))+'</div><div class="stack">'+
 '<div class="flex">'+artBadge(it)+mark(it.raridade||'sem raridade','info')+'</div><p>'+esc(it.descricao||'Descrição narrativa ainda não definida.')+'</p>'+
 '<p>O ícone visual pode ser compartilhado com a categoria. Não constitui prova de sprite exclusivo.</p></div></div>'+
 attributePanel(it)+section('Dados de referência')+details.join('')+
 section('Receitas relacionadas')+'<div class="stack">'+related(made,'Produzem este item')+related(used,'Consomem este item')+'</div>'+
 '<div class="note"><strong>Fluxo de revisão:</strong> exporte ou copie o JSON desta ficha e traga para nossa conversa. As correções entram no repositório; esta página é somente leitura.</div></div>'+
 '<div class="modal-actions"><button class="btn ghost" data-action="close">Fechar</button><button class="btn ghost" data-action="copyitem" data-id="'+esc(id)+'">Copiar JSON</button><button class="btn" data-action="exportitem" data-id="'+esc(id)+'">↓ Exportar JSON do item</button></div>';
 openModal(body);
}
function editRecipe(id){var r=DB.recipes.find(function(x){return x.id===id;});if(!r)return;var result=DB.byId.get(r.resultado),problems=getIssues(r),inputs=(r.ingredientes||[]).map(function(x){var it=DB.byId.get(x.item);return '<div class="recipe-box"><div class="flex">'+(it?icon(it):'<span class="item-icon">?</span>')+'<div class="grow"><button class="clickable" data-action="item" data-id="'+esc(x.item)+'">'+esc(it?it.nome:x.item)+'</button><div class="quiet">Quantidade: '+esc(x.quantidade)+' · '+(it?artLabels[artState(it)]:'Item ausente')+'</div></div></div></div>';}).join('');
 openModal(modalHeading('LIVRO DE RECEITAS',r.nome,r.id)+
 '<div class="modal-body"><div class="flex">'+mark('Estação: '+r.estacao,'info')+mark('Nível '+r.nivel,'working')+mark('Produz × '+r.quantidade,'info')+'</div>'+
 section('Ingredientes')+'<div class="stack">'+inputs+'</div>'+
 section('Resultado')+'<div class="recipe-box"><div class="flex">'+(result?icon(result):'<span class="item-icon">?</span>')+'<div class="grow"><button class="clickable" data-action="item" data-id="'+esc(r.resultado)+'">'+esc(result?result.nome:r.resultado)+'</button><div class="quiet">'+(result?esc(result.categoria)+' • '+artLabels[artState(result)]:'Item ausente na base')+'</div></div></div></div>'+
 section('Verificação')+(r.revisao_alquimica_pendente?'<div class="note warning"><strong>Revisão alquímica pendente:</strong> '+esc(r.nota_revisao||'Ingredientes com atributos alterados precisam de reavaliação de compatibilidade.')+'</div>':'')+(problems.length?'<div class="alert-list">'+problems.map(function(p){return '<div class="alert">'+esc(p)+'</div>';}).join('')+'</div>':'<div class="alert good">Referências e quantidades estruturalmente válidas.</div>')+
 '<div class="note">As receitas são apenas consultadas aqui. Para corrigir quantidades ou resultados, altere o arquivo <code>data/receitas.json</code> no repositório do jogo, com seus testes de regressão.</div></div>'+
 '<div class="modal-actions"><button class="btn ghost" data-action="close">Fechar</button></div>');
}
function editFamily(encoded){
 var key=decodeURIComponent(encoded),f=DB.families.find(function(x){return x.key===key;});
 if(!f)return;
 var r=groupRecord(key),p=familyVariantProgress(f),approved=f.items.filter(function(i){return artState(i)==='aprovado';}).length;
 openModal(modalHeading('FAMÍLIA VISUAL',key,fmt(f.items.length)+' itens nesta família')+
 '<div class="modal-body"><div class="details"><div><span>Itens na categoria</span><b>'+fmt(f.items.length)+'</b></div>'+
 '<div><span>Sprites aprovados</span><b>'+fmt(approved)+'</b></div><div><span>Variações planejadas</span><b>'+fmt(p.target||0)+'</b></div>'+
 '<div><span>Variações pendentes</span><b>'+fmt(p.missing)+'</b></div>'+
 '<div><span>Master registrado</span><b>'+esc(r.base||'não vinculado')+'</b></div></div>'+
 '<p class="quiet">'+esc(r.strategy||'Estratégia visual ainda não registrada no repositório.')+'</p>'+
 '<div class="note">A estratégia da família e os arquivos dos assets são definidos em conversa e versionados no repositório, não aqui.</div></div>'+
 '<div class="modal-actions"><button class="btn ghost" data-action="close">Fechar</button><button class="btn" data-action="familyitems" data-key="'+esc(encoded)+'">Ver itens desta família</button></div>');
}
function renderError(e){main.innerHTML=head('ERRO DE CARREGAMENTO','O arquivo não pôde ser aberto','O laboratório precisa ser acessado via GitHub Pages (ou servidor HTTP local) para ler os JSONs do jogo.')+'<div class="note warning">'+esc(e.message)+'</div><div class="actions"><a class="btn" href="./">Tentar novamente</a><a class="btn ghost" href="../">Voltar ao jogo</a></div>';}
function download(name,content,mime){
 var blob=new Blob([content],{type:mime+';charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(function(){URL.revokeObjectURL(url);},1200);
}
function safeName(id){return String(id||'item').replace(/[^a-z0-9_-]/gi,'-');}
function exportSingleItem(id){
 var it=DB.byId.get(id);if(!it){toastMsg('Item não encontrado.');return;}
 download('peren-item-'+safeName(it.id)+'.json',JSON.stringify(it,null,2)+'\n','application/json');
 toastMsg('JSON de '+it.nome+' exportado.');
}
function copySingleItem(id){
 var it=DB.byId.get(id);if(!it)return;
 var content=JSON.stringify(it,null,2);
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(content).then(function(){toastMsg('JSON de '+it.nome+' copiado.');},function(){toastMsg('Não foi possível copiar. Use Exportar JSON.');});}
 else{toastMsg('Área de transferência indisponível. Use Exportar JSON.');}
}
function exportCatalog(){
 download('peren-itens-canonicos.json',JSON.stringify(DB.items,null,2)+'\n','application/json');
 toastMsg('Catálogo JSON exportado.');
}
function exportCsv(){
 var rows=[['id','nome','categoria','tipo','raridade','origem_exclusiva','atributos_revisados','atributos','situacao_asset','asset_individual','variantes_pendentes']];
 DB.items.forEach(function(i){
  rows.push([i.id,i.nome,i.categoria,i.tipo||'',i.raridade||'',i.zona_exclusiva||'',!!i.atributos_revisados,(i.atributos||[]).map(function(x){return x.nome+' '+x.intensidade;}).join(' | '),artState(i),itemPath(i),variantMissing(i)]);
 });
 var csv=rows.map(function(row){return row.map(function(x){return '"'+String(x==null?'':x).replace(/"/g,'""')+'"';}).join(';');}).join('\r\n');
 download('peren-fila-artes.csv','\ufeff'+csv,'text/csv');
}
document.addEventListener('click',function(e){
 var b=e.target.closest('[data-action]');if(!b)return;var a=b.dataset.action,tab=b.dataset.tab,id=b.dataset.id;
 if(a==='nav'){setTab(tab);return;}if(a==='close'){closeModal();return;}
 if(a==='item'){editItem(id);return;}if(a==='recipe'){editRecipe(id);return;}if(a==='family'){editFamily(b.dataset.key);return;}
 if(a==='exportitem'){exportSingleItem(id);return;}if(a==='copyitem'){copySingleItem(id);return;}if(a==='exportcatalog'){exportCatalog();return;}if(a==='exportcsv'){exportCsv();return;}
 if(a==='category'){ui.category=b.dataset.category;ui.page=1;setTab('catalog');return;}
 if(a==='artfilter'||a==='pipelinefilter'){ui.art=b.dataset.status;ui.page=1;setTab('catalog');return;}
 if(a==='stationfilter'){ui.station=b.dataset.station;ui.recipePage=1;setTab('recipes');return;}
 if(a==='familyitems'){var key=decodeURIComponent(b.dataset.key),f=DB.families.find(function(x){return x.key===key;});if(!f)return;ui.category=f.category;ui.query=f.type==='geral'?'':f.type;ui.page=1;closeModal();setTab('catalog');return;}
 if(a==='itempage'){ui.page=Math.max(1,Number(b.dataset.page));render();return;}if(a==='recipepage'){ui.recipePage=Math.max(1,Number(b.dataset.page));render();return;}
});
modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)closeModal();});

document.addEventListener('change',function(e){var key=e.target.dataset.filter;if(!key)return;ui[key]=e.target.type==='checkbox'?e.target.checked:e.target.value;if(key==='recipeQuery'||key==='station'||key==='recipeIssues')ui.recipePage=1;else ui.page=1;render();});
var inputTimer;document.addEventListener('input',function(e){var key=e.target.dataset.filter;if(!['query','recipeQuery','familyQuery'].includes(key))return;ui[key]=e.target.value;clearTimeout(inputTimer);var el=e.target;inputTimer=setTimeout(function(){var start=el.selectionStart,end=el.selectionEnd,id=el.id;ui.page=1;ui.recipePage=1;render();var fresh=document.getElementById(id);if(fresh){fresh.focus();if(start!=null)fresh.setSelectionRange(start,end);}},180);});
document.addEventListener('error',function(e){if(e.target.tagName==='IMG'&&e.target.closest('.item-icon,.preview-img')){var p=e.target.parentElement;if(p&&!p.dataset.fallback){p.dataset.fallback='1';p.textContent='◇';p.title='Imagem não carregada; verifique o caminho do asset.';}}},true);
async function init(){try{var paths=['data/itens.json','data/receitas.json','data/manifesto_dados.json'];var data=await Promise.all(paths.map(async function(path){var r=await fetch(ROOT+path,{cache:'no-cache'});if(!r.ok)throw new Error(path+' — HTTP '+r.status);return r.json();}));if(!Array.isArray(data[0])||!Array.isArray(data[1]))throw new Error('Formato inválido de itens ou receitas.');DB.items=data[0];DB.recipes=data[1];DB.manifest=data[2];try{var assets=await fetch('./estado-assets.json',{cache:'no-cache'});if(assets.ok){var manifest=await assets.json();state.records=manifest.records||{};state.groups=manifest.groups||{};}}catch(e){console.warn('Manifesto de assets indisponível:',e);}DB.items.forEach(function(i){DB.byId.set(i.id,i);});DB.recipes.forEach(function(r){if(!DB.produced.has(r.resultado))DB.produced.set(r.resultado,[]);DB.produced.get(r.resultado).push(r);(r.ingredientes||[]).forEach(function(x){if(!DB.used.has(x.item))DB.used.set(x.item,[]);DB.used.get(x.item).push(r);});});var m=new Map();DB.items.forEach(function(it){var k=familyKey(it);if(!m.has(k))m.set(k,{key:k,category:it.categoria||'sem categoria',type:it.tipo||'geral',items:[]});m.get(k).items.push(it);});DB.families=[...m.values()].sort(function(a,b){return b.items.length-a.items.length;});document.getElementById('local-status').textContent='✓ Dados do repositório carregados';render();}catch(e){console.error(e);renderError(e);}}
init();
})();