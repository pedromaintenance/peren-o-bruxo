/**
 * Contrato de PESQUISA de Venenos da pré-alfa (não é ação de gameplay).
 * Um Veneno não se bebe como Poção nem acerta automaticamente o inimigo.
 * Todas as vias permanecem bloqueadas até o criador decidir alvo, resistência
 * e quando o frasco é realmente consumido. Não mexe em inventário/save.
 */
export const POISON_ROUTES=Object.freeze({
 thrown_flask:Object.freeze({
  targetKind:'creature',
  contexts:['combat'],
  openDecisions:['alcance_e_mira','resistencia_do_alvo','efeitos_do_impacto','momento_do_consumo','custo_em_turno','falha_e_erro']
 }),
 weapon_coating:Object.freeze({
  targetKind:'weapon',
  contexts:['combat','exploration'],
  openDecisions:['elegibilidade_da_arma','duracao_da_cobertura','cargas_por_acerto','resistencia_do_alvo','persistencia_entre_cenas','uso_concorrente_com_balsamos']
 }),
 administered:Object.freeze({
  targetKind:'creature',
  contexts:['combat','exploration'],
  openDecisions:['consentimento_e_percepcao','via_de_contato','resistencia_do_alvo','custo_de_acao','uso_furtivo','falha_e_erro']
 })
});
const safeKind=k=>k==='enemy'||k==='ally'||k==='self'?'creature':k==='weapon'?'weapon':'unknown';
export function inspectPoisonRoute(preparation,{route,context,targetKind,targetId}={}){
 const result={ready:false,status:'blocked',phase:'research-only',
  message:'Venenos ainda exigem regras próprias de aplicação; nenhum frasco foi consumido.',
  route:typeof route==='string'?route:null,missing:[]};
 if(!preparation||preparation.family!=='veneno'||!Array.isArray(preparation.effects)||!preparation.effects.length){
  return {...result,status:'invalid_preparation'};
 }
 const cfg=POISON_ROUTES[route];
 if(!cfg)return {...result,status:'undefined_route',missing:['via_de_aplicacao']};
 if(!cfg.contexts.includes(context))return {...result,status:'unsupported_context',missing:['contexto']};
 if(!targetId||typeof targetId!=='string'||safeKind(targetKind)!==cfg.targetKind)
  return {...result,status:'invalid_target',missing:['alvo_valido']};
 if(preparation.effects.some(e=>typeof e?.id!=='string')||
    new Set(preparation.effects.map(e=>e.id)).size!==preparation.effects.length)
  return {...result,status:'invalid_effects',missing:['integridade_dos_efeitos']};
 if(preparation.effects.some(e=>!/^(dano_|diminuir_|fraqueza_)/.test(e.id)&&e.id!=='infligir_doenca'))
  return {...result,status:'mixed_semantics',missing:['resolver_todos_os_efeitos']};
 return {...result,status:'awaiting_authorial_rules',missing:[...cfg.openDecisions]};
}
/** Only internal QA: verifies which curatorial effects could enter a poison.
 * It does not define intensity-to-damage, delivery or resistance. */
export function poisonCandidateEvidence(preparation){
 if(!preparation||!Array.isArray(preparation.effects))return [];
 return preparation.effects.map(x=>x.id).filter(id=>typeof id==='string').sort();
}
