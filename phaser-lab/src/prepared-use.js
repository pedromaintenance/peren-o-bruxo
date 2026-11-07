/**
 * EXPERIMENTO JOGÁVEL de pré-alfa — não é balanceamento aprovado.
 * Preparo é instância única com ID; a batalha retém estoque temporariamente.
 * Somente restaurar_saude e restaurar_magia têm execução provisória.
 * Nenhum efeito de um lote pode ser descartado silenciosamente.
 */
export const PREALPHA_RESTORATION=Object.freeze({
 restaurar_saude:{field:'playerHp',maximum:'playerMaxHp',amount:24},
 restaurar_magia:{field:'playerMp',maximum:'playerMaxMp',amount:12}
});
export function inspectBattlePreparation(prep){
 if(!prep||typeof prep.id!=='string'||!prep.id||prep.family!=='pocao')
  return {ok:false,error:'Este preparo não possui via de uso aprovada no combate experimental.'};
 if(!Array.isArray(prep.effects)||prep.effects.length===0)
  return {ok:false,error:'Preparado sem propriedades válidas.'};
 const ids=prep.effects.map(effect=>effect?.id);
 if(ids.some(id=>typeof id!=='string')||new Set(ids).size!==ids.length)
  return {ok:false,error:'Preparado com propriedades inválidas ou repetidas.'};
 if(ids.some(id=>!(id in PREALPHA_RESTORATION)))
  return {ok:false,error:'Uma ou mais propriedades ainda não têm aplicação mecânica definida.'};
 return {ok:true,ids};
}
export function applyBattlePreparation(state,id){
 if(typeof id!=='string'||!id)return{state,error:'Selecione um frasco.'};
 const index=(state.preparations||[]).findIndex(p=>p.id===id);
 if(index<0)return{state,error:'Preparo indisponível neste combate.'};
 const prepared=state.preparations[index],checked=inspectBattlePreparation(prepared);
 if(!checked.ok)return {state,error:checked.error};
 if(state.playerHp<=0)return {state,error:'Derrota ou revivificação não estão definidas.'};
 const next={...state,preparations:state.preparations.filter((_,i)=>i!==index)};
 const changes=[];
 for(const effectId of checked.ids){
  const rule=PREALPHA_RESTORATION[effectId],before=next[rule.field];
  next[rule.field]=Math.min(next[rule.maximum],before+rule.amount);
  changes.push({effectId,before,after:next[rule.field],amountQa:rule.amount});
 }
 return {state:next,changes};
}
/** At settlement, the battle owns which IDs remain. It cannot create new flasks. */
export function reconcileBattlePreparations(original,remaining){
 if(!Array.isArray(original)||!Array.isArray(remaining))throw Error('Lista de preparados da batalha inválida.');
 const own=new Set();
 for(const prep of original){
  if(!prep||typeof prep.id!=='string'||own.has(prep.id))throw Error('Identidade de preparado duplicada na mochila.');
  own.add(prep.id);
 }
 const seen=new Set();
 for(const prep of remaining){
  if(!prep||typeof prep.id!=='string'||!own.has(prep.id)||seen.has(prep.id))
   throw Error('Saldo de preparados da batalha divergente.');
  seen.add(prep.id);
 }
 // IDs only: the properties/canonical effects come from the pre-battle source.
 return original.filter(prep=>seen.has(prep.id));
}
