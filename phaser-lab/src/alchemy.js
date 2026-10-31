/**
 * Alquimia emergente: regras puras. O catálogo da curadoria é imutável.
 * A duração, potência final e aplicação de efeitos ainda NÃO estão definidas;
 * não inventar transformações permanentes, bálsamos ou reduções de poder.
 */
export const ALCHEMY_FAMILIES=Object.freeze([
  {id:'pocao',name:'Poções',description:'Fortalecimentos, restauração e proteção',icon:'⚗'},
  {id:'veneno',name:'Venenos',description:'Debilitações e danos',icon:'☠'},
  {id:'tonico',name:'Tônicos',description:'Efeitos mágicos especiais temporários',icon:'✧'},
  {id:'elixir',name:'Elixires',description:'Efeitos permanentes — aguardam regras próprias',icon:'◇'},
  {id:'balsamo',name:'Bálsamos',description:'Aplicação em itens — aguardam regras próprias',icon:'▣'}
]);
const TONTICOS=new Set(['frenesi','invisibilidade','medo','paralisia','respirar_na_agua','vampirismo','velocidade','visao_a_distancia','voar']);
export function effectFamily(id){
  if(TONTICOS.has(id))return 'tonico';
  if(/^(aumentar_|regenerar_|restaurar_|resistencia_)/.test(id)||id==='curar_doenca')return 'pocao';
  if(/^(dano_|diminuir_|fraqueza_)/.test(id)||id==='infligir_doenca')return 'veneno';
  // Unknown semantics must not be marketed as permanent or item-applicable.
  return 'tonico';
}
export function curatedItems(curadoria){
  const source=curadoria?.itens;
  if(!source||typeof source!=='object'||Array.isArray(source))throw Error('Curadoria alquímica indisponível.');
  return source;
}
export function resolveAlchemyPair(curadoria,ids){
  const source=curatedItems(curadoria);
  if(!Array.isArray(ids)||ids.length!==2||ids.some(id=>typeof id!=='string')||ids[0]===ids[1])
    throw Error('Escolha dois ingredientes distintos.');
  // Ordenar antes de ler os nomes garante A+B = B+A inclusive em rótulos com capitalização divergente.
  const ingredientIds=[...ids].sort();
  const selected=ingredientIds.map(id=>{
    const item=source[id];
    if(!item||!Array.isArray(item.atributos))throw Error('Ingrediente não reconhecido pela curadoria.');
    return {id,item};
  });
  const [left,right]=selected;
  const effects=left.item.atributos.filter(a=>right.item.atributos.some(b=>b.id===a.id)).map(a=>{
    const b=right.item.atributos.find(v=>v.id===a.id);
    return {id:a.id,nome:a.nome||b.nome||a.id,familia:effectFamily(a.id),
      origens:[{ingrediente:left.id,intensidade:a.intensidade},{ingrediente:right.id,intensidade:b.intensidade}]
        .sort((x,y)=>x.ingrediente.localeCompare(y.ingrediente))};
  }).sort((a,b)=>a.id.localeCompare(b.id));
  return {valid:effects.length>0,ingredientIds,effects};
}
export function knownEffectsFor(knowledge,ingredientId){
  return Array.isArray(knowledge?.[ingredientId])?knowledge[ingredientId]:[];
}
export function nextStudyEffect(curadoria,knowledge,id){
  const item=curatedItems(curadoria)[id];
  if(!item)throw Error('Ingrediente desconhecido.');
  return item.atributos.find(a=>!knownEffectsFor(knowledge,id).includes(a.id))||null;
}
export function effectDirectory(curadoria,knowledge,bag,actions=1){
  const items=curatedItems(curadoria),map=new Map();
  for(const [ingredientId,known] of Object.entries(knowledge||{})){
    const data=items[ingredientId];if(!data)continue;
    for(const id of new Set(Array.isArray(known)?known:[])){
      const effect=data.atributos.find(a=>a.id===id);if(!effect)continue;
      if(!map.has(id))map.set(id,{id,name:effect.nome||id,family:effectFamily(id),sources:[]});
      map.get(id).sources.push({id:ingredientId,name:data.nome||ingredientId,
        available:Math.max(0,Number(bag?.[ingredientId]||0))>0,
        amount:Math.max(0,Number(bag?.[ingredientId]||0))});
    }
  }
  const effects=[...map.values()].map(e=>({
    ...e,sources:e.sources.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')),
    ready:Number(actions)>0&&e.sources.filter(s=>s.available).length>=2
  })).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
  return ALCHEMY_FAMILIES.map(f=>({...f,effects:effects.filter(e=>e.family===f.id),
    enabled:effects.some(e=>e.family===f.id&&e.ready)}));
}
export function ingredientOptions(curadoria,knowledge,bag,{effectId=null}={}){
  return Object.entries(curatedItems(curadoria))
    .filter(([id])=>(bag?.[id]||0)>0 && (!effectId||knownEffectsFor(knowledge,id).includes(effectId)))
    .map(([id,item])=>({id,name:item.nome||id,count:bag[id],known:knownEffectsFor(knowledge,id).length}))
    .sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
}
export function discoverShared(knowledge,ids,effects){
  const next=Object.fromEntries(Object.entries(knowledge||{}).map(([id,arr])=>[id,[...arr]]));
  for(const id of ids)next[id]=[...new Set([...(next[id]||[]),...effects.map(e=>e.id)])].sort();
  return next;
}
