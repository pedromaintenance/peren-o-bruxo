/**
 * Peren — PROTÓTIPO DE GAME DESIGN: contribuição marginal de 3ª/4ª fontes.
 * Não define potência final, duração, estabilidade ou custo; não integra Phaser.
 * O "núcleo" e o "excedente" são ÍNDICES de intensidade de origem para estudo.
 */
const UNITS=[2,3,4];
const approved=new Set(['aprovado','nome_e_sinergia_aprovados','exemplo_canonico_aprovado']);
const idsSorted=xs=>[...new Set(xs)].sort((a,b)=>a.localeCompare(b));
export function examineMixture(curadoria,catalogo,ingredientIds){
 if(!Array.isArray(ingredientIds)||!UNITS.includes(ingredientIds.length))throw Error('Amostra: 2 a 4 tipos');
 if(ingredientIds.some(x=>typeof x!=='string')||idsSorted(ingredientIds).length!==ingredientIds.length)
   throw Error('IDs devem ser tipos distintos');
 const items=curadoria?.itens||{},sources=new Map();
 for(const id of ingredientIds){
  const material=items[id];if(!material||!Array.isArray(material.atributos))throw Error('Ingrediente não existe: '+id);
  const observed=new Set();
  for(const attr of material.atributos){
   if(typeof attr.id!=='string'||!Number.isInteger(attr.intensidade)||attr.intensidade<1||attr.intensidade>3)throw Error('Curadoria inválida em '+id);
   if(observed.has(attr.id))throw Error('Efeito duplicado no mesmo ingrediente: '+id+'/'+attr.id);
   observed.add(attr.id);
   if(!sources.has(attr.id))sources.set(attr.id,[]);
   sources.get(attr.id).push({ingredientId:id,intensity:attr.intensidade});
  }
 }
 const effects=[...sources].filter(([id,src])=>src.length>=2)
  .map(([id,src])=>{
    const desc=[...src].sort((a,b)=>b.intensity-a.intensity||a.ingredientId.localeCompare(b.ingredientId));
    const core=desc.slice(0,2).reduce((a,x)=>a+x.intensity,0);
    const extra=desc.slice(2).reduce((a,x)=>a+x.intensity,0);
    return {id,sourceCount:desc.length,origins:desc,
      originIndex:{twoStrongest:core,otherSources:extra,allSources:core+extra},
      note:"Os índices não são potência, duração, estabilidade ou bônus aprovados."};
  }).sort((a,b)=>a.id.localeCompare(b.id));
 const active=new Set(effects.map(e=>e.id));
 const incompatibilities=(catalogo?.incompatibilidades||[])
  .filter(x=>approved.has(x.estado)&&Array.isArray(x.efeitos)&&x.efeitos.every(x=>active.has(x)))
  .map(x=>x.id).sort();
 const synergies=(catalogo?.sinergias||[])
  .filter(x=>approved.has(x.estado)&&Array.isArray(x.efeitos_necessarios)&&x.efeitos_necessarios.every(x=>active.has(x)))
  .map(x=>x.id).sort();
 return {ingredientIds:idsSorted(ingredientIds),effects,classification:{
  impure:incompatibilities.length>0,approvedIncompatibilityIds:incompatibilities,approvedSynergyIds:synergies
 }};
}
export function compareAdditionalSource(before,after){
 const old=new Map((before?.effects||[]).map(e=>[e.id,e]));
 const next=new Map((after?.effects||[]).map(e=>[e.id,e]));
 const removed=[...old.keys()].filter(x=>!next.has(x)).sort();
 const newlyActivated=[...next.keys()].filter(x=>!old.has(x)).sort();
 const reinforcements=[...next].filter(([id,e])=>old.has(id)&&e.sourceCount>old.get(id).sourceCount)
  .map(([id,e])=>({
    effectId:id,extraSourceCount:e.sourceCount-old.get(id).sourceCount,
    coreDelta:e.originIndex.twoStrongest-old.get(id).originIndex.twoStrongest,
    nonCoreDelta:e.originIndex.otherSources-old.get(id).originIndex.otherSources,
    fullIndexDelta:e.originIndex.allSources-old.get(id).originIndex.allSources
  })).sort((a,b)=>a.effectId.localeCompare(b.effectId));
 return {
  newlyActivated,reinforcements,removed,
  addedIncompatibilityIds:after.classification.approvedIncompatibilityIds.filter(x=>!before.classification.approvedIncompatibilityIds.includes(x)),
  addedApprovedSynergies:after.classification.approvedSynergyIds.filter(x=>!before.classification.approvedSynergyIds.includes(x)),
  note:"A ativação é monotônica. O índice extra NÃO é duração ou qualidade reais."
 };
}
export function examineSequence(curadoria,catalogo,orderedIngredientIds){
 if(!Array.isArray(orderedIngredientIds)||orderedIngredientIds.length<2||orderedIngredientIds.length>4)
   throw Error('Amostra sequencial de 2 a 4 tipos');
 if(idsSorted(orderedIngredientIds).length!==orderedIngredientIds.length)throw Error('Fonte duplicada');
 const snapshots=[];
 for(let n=2;n<=orderedIngredientIds.length;n++){
   const mixture=examineMixture(curadoria,catalogo,orderedIngredientIds.slice(0,n));
   snapshots.push({step:n,mixture,marginal:n===2?null:compareAdditionalSource(snapshots[snapshots.length-1].mixture,mixture)});
 }
 return snapshots;
}
