/**
 * Peren — INVESTIGAÇÃO DE DESIGN: uso contextual de preparos.
 * Experimental, isolado, NÃO importável no runtime. Sem save, sem inventário canônico.
 * Nenhum custo de ação, alvo, tipo de administração ou tempo aqui é canônico.
 * Integração requer aprovação de semântica, resistência, transações e saves.
 */
const RESEARCH_POLICY="peren.alchemy.context.QA_ONLY";
export const CONTEXTS=Object.freeze(["combat","exploration","rest"]);
export const ACTIONS=Object.freeze(["drink","administer","apply_to_item"]);
export const IMMEDIATE_IDS=Object.freeze({
 dano_saude:{resource:"hp",sign:-1},
 restaurar_saude:{resource:"hp",sign:1},
 dano_magia:{resource:"mp",sign:-1},
 restaurar_magia:{resource:"mp",sign:1}
});
const SUPPORTED=new Set(Object.keys(IMMEDIATE_IDS));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const copy=x=>JSON.parse(JSON.stringify(x));
const blank=()=>({success:false,code:"unresolved",message:"A aplicação exige decisão mecânica; nenhum item foi consumido."});
function safeInteger(v,min=0,max=999999){
 return Number.isSafeInteger(v)&&v>=min&&v<=max;
}
function validateSnapshot(env){
 if(!env||typeof env!=="object"||Array.isArray(env))throw Error("Snapshot de QA inválido");
 if(!env.actors||!env.bag||!env.preparations||!env.ledger)throw Error("Snapshot de QA incompleto");
 if(!safeInteger(env.actions))throw Error("Ações de QA inválidas");
 for(const actor of Object.values(env.actors)){
  for(const [current,max] of [["hp","maxHp"],["mp","maxMp"]]){
   if(!safeInteger(actor[current])||!safeInteger(actor[max])||actor[current]>actor[max])
    throw Error("Recursos de QA inválidos");
  }
 }
 for(const q of Object.values(env.bag))if(!safeInteger(q))throw Error("Estoque de QA inválido");
 return env;
}
function commandFingerprint(command){
 return JSON.stringify({txId:command.txId,context:command.context,action:command.action,
  prepId:command.prepId,targetId:command.targetId});
}
function getDisposition(env,command,policy){
 const out=blank();
 if(policy?.schema!==RESEARCH_POLICY||policy.approved===true){
  out.code="missing_review_policy";return out;
 }
 if(!command||typeof command!=="object"||Array.isArray(command))return {...out,code:"bad_command"};
 if(!CONTEXTS.includes(command.context)||!ACTIONS.includes(command.action))
  return {...out,code:"invalid_context_action"};
 if(!command.txId||typeof command.txId!=="string"||!/^[a-zA-Z0-9_:-]{1,80}$/.test(command.txId))
  return {...out,code:"invalid_transaction_id"};
 if(typeof command.prepId!=="string"||typeof command.targetId!=="string")
  return {...out,code:"invalid_target_or_preparation"};
 const prep=env.preparations[command.prepId];
 if(!prep||!Array.isArray(prep.effectIds)||!Array.isArray(prep.knownEffectIds))
  return {...out,code:"missing_preparation"};
 if(prep.provenance!=="qa-dynamic-v1")return {...out,code:"legacy_semantics_unresolved"};
 if(!safeInteger(env.bag[command.prepId]??0)||!env.bag[command.prepId])
  return {...out,code:"no_stock"};
 const target=env.actors[command.targetId];if(!target)return {...out,code:"missing_target"};
 if(command.action==="apply_to_item")return {...out,code:"object_application_unresolved"};
 if(!["pocao","veneno"].includes(prep.family))return {...out,code:"family_application_unresolved"};
 if(command.context==="rest"&&!policy.allowDeliberateUseAtRest)
  return {...out,code:"rest_is_not_automatic_use"};
 const role=command.targetId==="peren"?"self":"other_actor";
 const permitKey=[command.context,command.action,role].join(":");
 if(policy.permits?.[permitKey]!==true)return {...out,code:"target_or_action_unresolved"};
 if(role==="other_actor"&&policy.hostileResistanceQaResolved!==true)
  return {...out,code:"resistance_or_consent_unresolved"};
 if(!safeInteger(policy.actionCost))return {...out,code:"action_cost_undefined"};
 if(env.actions<policy.actionCost)return {...out,code:"insufficient_qa_actions"};
 if(!["net_by_resource","damage_before_restore","restore_before_damage"].includes(policy.resolution))
  return {...out,code:"resolution_undefined"};
 if(prep.effectIds.length===0||prep.effectIds.some(id=>typeof id!=="string"||!SUPPORTED.has(id)))
  return {...out,code:"effect_semantics_unresolved"};
 if(new Set(prep.effectIds).size!==prep.effectIds.length)
  return {...out,code:"duplicate_effect_id"};
 if(!prep.knownEffectIds.every(id=>typeof id==="string"&&prep.effectIds.includes(id)))
  return {...out,code:"invalid_character_knowledge"};
 if(!prep.effectIds.every(id=>safeInteger(policy.magnitudes?.[id])))
  return {...out,code:"effect_magnitude_unapproved"};
 // HP zero is not assumed to be a reversible defeated state.
 if(target.hp===0&&prep.effectIds.includes("restaurar_saude")&&policy.magnitudes.restaurar_saude>0)
  return {...out,code:"revival_unresolved"};
 return {success:true,code:"ready",message:"Pronto apenas como cenário de QA; nenhuma regra de uso foi aprovada.",
  target,prep,role,permitKey};
}
export function inspectUse(env,command,policy){
 const valid=validateSnapshot(env);
 const fingerprint=command&&typeof command==="object"&&commandFingerprint(command);
 const txId=command?.txId,record=typeof txId==="string"&&valid.ledger["use:"+txId];
 if(record){
  if(record.fingerprint!==fingerprint)return {...blank(),code:"transaction_id_collision"};
  return {success:true,code:"already_applied",message:"Operação já registrada; não consuma novamente.",
    receipt:copy(record.receipt)};
 }
 const d=getDisposition(valid,command,policy);
 // Never expose actual hidden effect IDs through a rejected-use explanation.
 return {success:d.success,code:d.code,message:d.message,
  ...(d.success?{knownEffectIds:d.prep.effectIds.filter(id=>d.prep.knownEffectIds.includes(id)).sort()}: {})};
}
function computeNextTarget(before,prep,policy){
 const after={...before},changes=[];
 const effects=prep.effectIds.map(id=>({id,...IMMEDIATE_IDS[id],magnitude:policy.magnitudes[id]}));
 const score=effect=>policy.resolution==="damage_before_restore"?(effect.sign<0?0:1):
  policy.resolution==="restore_before_damage"?(effect.sign>0?0:1):0;
 effects.sort((a,b)=>score(a)-score(b)||a.id.localeCompare(b.id));
 if(policy.resolution==="net_by_resource"){
  for(const resource of ["hp","mp"]){
   const relevant=effects.filter(e=>e.resource===resource);
   if(!relevant.length)continue;
   const delta=relevant.reduce((n,e)=>n+e.sign*e.magnitude,0),max=resource==="hp"?"maxHp":"maxMp";
   const val=clamp(before[resource]+delta,0,before[max]);
   if(resource==="hp"&&before.hp===0&&val>0)return {error:"revival_unresolved"};
   after[resource]=val;changes.push({resource,before:before[resource],after:val,kind:"qa-net"});
  }
 }else for(const e of effects){
  const max=e.resource==="hp"?"maxHp":"maxMp";
  const previous=after[e.resource],next=clamp(previous+e.sign*e.magnitude,0,after[max]);
  if(e.resource==="hp"&&previous===0&&next>0)return {error:"revival_unresolved"};
  after[e.resource]=next;
  changes.push({resource:e.resource,before:previous,after:next,kind:"qa-sequential"});
 }
 return {after,changes};
}
export function commitUse(env,command,policy){
 const inspected=inspectUse(env,command,policy);
 if(!inspected.success||inspected.code==="already_applied")
  return {applied:false,next:env,receipt:inspected.receipt||{code:inspected.code,message:inspected.message}};
 const pre=env.preparations[command.prepId],before=env.actors[command.targetId];
 const evaluated=computeNextTarget(before,pre,policy);
 if(evaluated.error)return {applied:false,next:env,receipt:{code:evaluated.error,message:"A regra de revivificação continua aberta."}};
 const next=copy(env);
 next.actors[command.targetId]=evaluated.after;
 next.bag[command.prepId]-=1;
 next.actions-=policy.actionCost;
 const receipt={
  code:"qa_applied",context:command.context,action:command.action,targetId:command.targetId,
  prepId:command.prepId,quantityConsumed:1,actionCost:policy.actionCost,
  visibleEffectIds:pre.effectIds.filter(id=>pre.knownEffectIds.includes(id)).sort(),
  note:"Este recibo não revela propriedades não identificadas pelo personagem."
 };
 next.ledger["use:"+command.txId]={fingerprint:commandFingerprint(command),receipt:copy(receipt)};
 return {applied:true,next,receipt,internalChanges:evaluated.changes};
}
export function changeContextWithoutUse(env,newContext){
 validateSnapshot(env);
 if(!CONTEXTS.includes(newContext))throw Error("Contexto inválido");
 // A passagem de contexto não ativa poção, duração, tick ou recuperação.
 return {next:env,context:newContext,applied:false,
  message:"Mudar de contexto não consome preparado nem executa regeneração automaticamente."};
}
export function exampleFixture(){
 return {
  actors:{peren:{hp:70,maxHp:100,mp:25,maxMp:80},foe:{hp:55,maxHp:55,mp:10,maxMp:10}},
  bag:{"qa-pocao-dupla":2,"qa-pocao-oculta":1,"qa-tonico-regenerador":1,"ger-pocao-restauradora":1},
  preparations:{
   "qa-pocao-dupla":{family:"pocao",provenance:"qa-dynamic-v1",effectIds:["restaurar_saude","restaurar_magia"],knownEffectIds:["restaurar_saude","restaurar_magia"]},
   "qa-pocao-oculta":{family:"pocao",provenance:"qa-dynamic-v1",effectIds:["restaurar_saude","dano_magia"],knownEffectIds:["restaurar_saude"]},
   "qa-tonico-regenerador":{family:"tonico",provenance:"qa-dynamic-v1",effectIds:["regenerar_saude"],knownEffectIds:["regenerar_saude"]},
   "ger-pocao-restauradora":{family:"pocao",provenance:"classic-legacy",effectIds:["restaurar_saude"],knownEffectIds:["restaurar_saude"]}
  },
  actions:3,ledger:{}
 };
}
export function researchPolicy(extra={}){
 return {schema:RESEARCH_POLICY,approved:false,
  permits:{"combat:drink:self":true,"exploration:drink:self":true},
  actionCost:1,resolution:"net_by_resource",
  magnitudes:{restaurar_saude:20,restaurar_magia:12,dano_saude:10,dano_magia:8},
  allowDeliberateUseAtRest:false,hostileResistanceQaResolved:false,
  ...extra};
}
