/**
 * Experimento puro de DOMINÂNCIA, não de potência final.
 * Branch de design isolada. NÃO importar no Phaser nem em build Pages.
 * A intensidade 1..3 pertence à origem do ingrediente; índices apenas
 * comparam hipóteses de ordenação, sem criar dano, duração ou bônus.
 */
export const HYPOTHESES=Object.freeze({
 soma_fontes:"Soma das intensidades de todas as fontes distintas",
 duas_maiores:"Soma das duas intensidades de origem mais altas",
 fonte_maxima:"Maior intensidade encontrada entre as fontes"
});
function normalize(ids) {
 if(!Array.isArray(ids))throw new Error('ingredientIds deve ser array');
 const list=[...new Set(ids)];
 if(list.length!==ids.length)throw new Error('Ingrediente repetido não cria outra espécie');
 if(list.some(x=>typeof x!=='string'))throw new Error('ID de ingrediente inválido');
 return list.sort();
}
function score(values,model){
 if(model==='soma_fontes')return values.reduce((a,b)=>a+b,0);
 if(model==='duas_maiores')return values.slice().sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);
 if(model==='fonte_maxima')return Math.max(...values);
 throw new Error('Hipótese não reconhecida: '+model);
}
export function investigateDominance(curadoria,ingredientIds) {
 const ids=normalize(ingredientIds),items=curadoria?.itens||{};
 if(ids.length<2||ids.length>4)throw new Error('Este estudo compara 2 a 4 tipos diferentes');
 const aggregate=new Map();
 for(const id of ids){
  const item=items[id];
  if(!item||!Array.isArray(item.atributos))throw new Error('Ingrediente ausente: '+id);
  for(const attr of item.atributos){
   if(typeof attr.id!=='string'||!Number.isInteger(attr.intensidade)||attr.intensidade<1||attr.intensidade>3)
    throw new Error('Atributo de origem inválido: '+id);
   if(!aggregate.has(attr.id))aggregate.set(attr.id,[]);
   aggregate.get(attr.id).push({ingredienteId:id,ingredienteNome:item.nome,intensidade:attr.intensidade});
  }
 }
 const effects=[...aggregate].filter(([id,v])=>v.length>=2).map(([id,sources])=>{
  sources.sort((a,b)=>a.ingredienteId.localeCompare(b.ingredienteId));
  const v=sources.map(s=>s.intensidade);
  return {id,origens:sources,indices:{
   soma_fontes:score(v,'soma_fontes'),
   duas_maiores:score(v,'duas_maiores'),
   fonte_maxima:score(v,'fonte_maxima')
  }};
 }).sort((a,b)=>a.id.localeCompare(b.id));
 const rankings={};
 for(const key of Object.keys(HYPOTHESES)){
  if(!effects.length){rankings[key]={indiceMaximo:null,dominantes:[],empate:false};continue;}
  const top=Math.max(...effects.map(e=>e.indices[key]));
  const winners=effects.filter(e=>e.indices[key]===top).map(e=>e.id);
  rankings[key]={indiceMaximo:top,dominantes:winners,empate:winners.length>1};
 }
 const outcomes=[...new Set(Object.values(rankings).map(x=>x.dominantes.join('|')))];
 return {ingredientIds:ids,effects,rankings,acordoEntreHipoteses:outcomes.length<=1,
  nota:'Índices COMPARATIVOS exploratórios. Não são potência final e não autorizam nome de item.'};
}
export function presentDominance(investigation,selectedHypothesis,identifiedEffectIds){
 const row=investigation?.rankings?.[selectedHypothesis];
 if(!row)throw new Error('Hipótese não calculada');
 const known=new Set(Array.isArray(identifiedEffectIds)?identifiedEffectIds:[]);
 const winners=row.dominantes;
 // Nunca expor um dominante que Peren ainda não conheceu.
 const visibility=winners.every(id=>known.has(id));
 return {status:winners.length===0?'sem_efeitos':!visibility?'indeterminado_para_personagem':winners.length>1?'empate':'dominante_unico',
  visibleDominants:visibility?winners:[],
  nomeDefinitivoAprovado:false,
  impurezaNaoAlterada:true,
  comentario:winners.length>1?'Empate: não escolher automaticamente o primeiro ID ou ingrediente.':''};
}
