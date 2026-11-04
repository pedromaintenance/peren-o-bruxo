// EXPERIMENTO DE DESIGN — não importado pelo Phaser nem pelo protótipo publicado.
// Atesta a distinção entre: efeitos ativos, classificação de um lote, conhecimento de sinergia
// e primeiro lote compatível da mesma sinergia. Nada aqui muda ingredientes ou receitas.
const APPROVED_SYNERGIES = new Set(['nome_e_sinergia_aprovados','aprovado']);
const APPROVED_INCOMPATIBILITIES = new Set(['exemplo_canonico_aprovado','aprovado']);
const sortedUnique = list => [...new Set((Array.isArray(list)?list:[])
  .filter(x=>typeof x==='string'&&x.length>0))].sort();

export function classifyAlchemyEffects(effectIds, catalog, knownEffectIds=[]) {
  const activeEffects=sortedUnique(effectIds);
  const active=new Set(activeEffects);
  const visibleEffects=sortedUnique(knownEffectIds).filter(id=>active.has(id));
  const known=new Set(visibleEffects);
  const incompatibilities=(Array.isArray(catalog?.incompatibilidades)?catalog.incompatibilidades:[])
    .filter(x=>APPROVED_INCOMPATIBILITIES.has(x.estado)&&
      Array.isArray(x.efeitos)&&x.efeitos.length>=2&&
      x.efeitos.every(e=>active.has(e)))
    .sort((a,b)=>a.id.localeCompare(b.id));
  const matches=(Array.isArray(catalog?.sinergias)?catalog.sinergias:[])
    .filter(x=>APPROVED_SYNERGIES.has(x.estado)&&
      Array.isArray(x.efeitos_necessarios)&&x.efeitos_necessarios.length>=2&&
      x.efeitos_necessarios.every(e=>active.has(e)))
    .sort((a,b)=>a.id.localeCompare(b.id));
  const recognized=matches.filter(x=>x.efeitos_necessarios.every(e=>known.has(e)));
  const impure=incompatibilities.length>0;
  const publicImpurityReasons=incompatibilities
    .filter(x=>x.efeitos.every(e=>known.has(e))).map(x=>x.id);
  let label='Preparado de efeitos múltiplos',kind='comum';
  if(!activeEffects.length){label='Nenhum efeito ativado';kind='vazio';}
  else if(impure){label='Preparado Impuro';kind='impuro';}
  else if(recognized.length>1){label='Sinergias múltiplas reconhecidas';kind='multissinergia';}
  else if(recognized.length===1){label=recognized[0].nome;kind='combo';}
  else if(activeEffects.length===1){label='Preparado de efeito simples';}
  // Não escolher "maior efeito" por ordem alfabética: fórmula de potência NÃO aprovada.
  return {
    internal:{activeEffectIds:activeEffects,matchedComboIds:matches.map(x=>x.id),
      incompatibilityIds:incompatibilities.map(x=>x.id),impure},
    presentation:{kind,label,visibleEffectIds:visibleEffects,
      recognizedCombos:recognized.map(x=>({id:x.id,nome:x.nome})),
      knownIncompatibilityIds:publicImpurityReasons,
      hasHiddenEffects:visibleEffects.length<activeEffects.length}
  };
}

// Regra de conhecimento EXPERIMENTAL: reconhecer sinergia dentro do Impuro pode ensinar o
// conceito, sem afirmar que uma poção com nome especial e sem incompatibilidades foi produzida.
// O usuário ainda NÃO aprovou formalmente esta política.
export function recordComboObservation(previous, classification, transactionId) {
  if(typeof transactionId!=='string'||!transactionId.trim())throw new Error('transactionId obrigatório');
  const prior=previous&&typeof previous==='object'?previous:{};
  const processed={...(prior.processedTransactions||{})};
  const learned={...(prior.knownCombos||{})};
  if(processed[transactionId])return {
    state:{processedTransactions:processed,knownCombos:learned},
    newlyRecognized:[],firstCompatible:[],duplicate:true
  };
  const names=classification?.presentation?.recognizedCombos||[];
  const impure=Boolean(classification?.internal?.impure);
  const newlyRecognized=[],firstCompatible=[];
  for(const combo of names){
    if(!combo||typeof combo.id!=='string')continue;
    const old=learned[combo.id];
    if(!old){
      learned[combo.id]={
        firstRecognitionTransaction:transactionId,firstRecognizedInImpure:impure,
        firstCompatibleTransaction:impure?null:transactionId,
        observations:1,compatiblePreparations:impure?0:1
      };
      newlyRecognized.push(combo.id);
      if(!impure)firstCompatible.push(combo.id);
    }else{
      const first=(!impure&&!old.firstCompatibleTransaction);
      learned[combo.id]={...old,observations:(old.observations||0)+1,
        compatiblePreparations:(old.compatiblePreparations||0)+(impure?0:1),
        firstCompatibleTransaction:first?transactionId:old.firstCompatibleTransaction};
      if(first)firstCompatible.push(combo.id);
    }
  }
  processed[transactionId]=true;
  return {state:{processedTransactions:processed,knownCombos:learned},
    newlyRecognized,firstCompatible,duplicate:false};
}
