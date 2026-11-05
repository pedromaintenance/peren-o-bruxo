/**
 * Peren — estudo não canônico de recursos.
 * Zero import no Phaser ou clássico. Magnitudes são FIXTURES DE QA fornecidas,
 * NUNCA derivadas das intensidades I–III de ingredientes.
 * Hipóteses são declaradas explicitamente pelo chamador.
 */
export const RESOURCE_EFFECTS=Object.freeze({
 dano_saude:{process:"damage_current",resource:"saude"},
 dano_magia:{process:"damage_current",resource:"magia"},
 restaurar_saude:{process:"restore_current",resource:"saude"},
 restaurar_magia:{process:"restore_current",resource:"magia"},
 aumentar_saude:{process:"modify_maximum_hypothesis",resource:"saude"},
 aumentar_magia:{process:"modify_maximum_hypothesis",resource:"magia"},
 diminuir_magia:{process:"unresolved_maximum_or_efficacy",resource:"magia"},
 regenerar_saude:{process:"increase_regeneration_hypothesis",resource:"saude"},
 regenerar_magia:{process:"increase_regeneration_hypothesis",resource:"magia"},
 diminuir_regeneracao_magia:{process:"decrease_regeneration_hypothesis",resource:"magia"}
});
const RESOURCE_NAMES=["saude","magia"];
function nonNegative(value,label){if(typeof value!=="number"||!Number.isFinite(value)||value<0)throw Error(label+" deve ser um número finito não negativo")}
function cloneState(input){
 const out={};
 for(const key of RESOURCE_NAMES){
  const src=input?.[key];
  if(!src)throw Error("Recurso ausente: "+key);
  for(const f of ["current","max","baseRate"])nonNegative(src[f],key+"."+f);
  if(src.current>src.max)throw Error("Valor atual excede o máximo de "+key);
  out[key]={current:src.current,max:src.max,baseRate:src.baseRate};
 }
 return out;
}
function resolveImmediate(event){
 const info=RESOURCE_EFFECTS[event?.effectId];
 if(!info||!["damage_current","restore_current"].includes(info.process))throw Error("Efeito não imediato neste cenário: "+event?.effectId);
 nonNegative(event.magnitude,"magnitude de teste");
 return {...info,effectId:event.effectId,magnitude:event.magnitude};
}
function guardRevival(resource,before,after){
 // PV zero pode acionar derrota/resgate: não assumir que poção ou regeneração ressuscite.
 if(resource==="saude"&&before===0&&after>0)throw Error("Recuperação desde PV zero exige regra de derrota/revivificação aprovada");
}
function changeCurrent(state,effect){
 const r=state[effect.resource],old=r.current;
 const signed=effect.process==="damage_current"?-effect.magnitude:effect.magnitude;
 const next=Math.max(0,Math.min(r.max,r.current+signed));
 guardRevival(effect.resource,old,next);
 r.current=next;
 return {effectId:effect.effectId,resource:effect.resource,before:old,after:r.current,
  requested:effect.magnitude,applied:Math.abs(r.current-old),wasted:effect.magnitude-Math.abs(r.current-old)};
}
export function simulateImmediate(input,effects,policy="ordered_as_provided"){
 if(!Array.isArray(effects))throw Error("events obrigatório");
 if(!["ordered_as_provided","damage_before_restore","restore_before_damage","net_by_resource"].includes(policy))throw Error("política desconhecida");
 const out=cloneState(input),prepared=effects.map(resolveImmediate);
 const ordered=policy==="damage_before_restore"?[...prepared].sort((a,b)=>(a.process==="damage_current"?-1:1)-(b.process==="damage_current"?-1:1)):
 policy==="restore_before_damage"?[...prepared].sort((a,b)=>(a.process==="restore_current"?-1:1)-(b.process==="restore_current"?-1:1)):prepared;
 const changes=[];
 if(policy==="net_by_resource"){
  for(const key of RESOURCE_NAMES){
   const involved=ordered.filter(x=>x.resource===key);
   if(!involved.length)continue;
   const delta=involved.reduce((n,e)=>n+(e.process==="damage_current"?-e.magnitude:e.magnitude),0);
   const r=out[key],before=r.current;
   const next=Math.max(0,Math.min(r.max,r.current+delta));
   guardRevival(key,before,next);
   r.current=next;
   changes.push({resource:key,requestedDelta:delta,appliedDelta:r.current-before,
    effectIds:involved.map(e=>e.effectId).sort()});
  }
 }else for(const effect of ordered)changes.push(changeCurrent(out,effect));
 return {state:out,policy,changes,note:"Ordenação e magnitudes são alternativas de QA. Não definem uso real de preparado."};
}
export function simulateCapacity(input,event,policy="preserve_current"){
 const out=cloneState(input),info=RESOURCE_EFFECTS[event?.effectId];
 if(!info||!["modify_maximum_hypothesis","unresolved_maximum_or_efficacy"].includes(info.process))throw Error("Este não é efeito de capacidade em estudo");
 nonNegative(event.magnitude,"magnitude de teste");
 if(!["preserve_current","preserve_deficit","preserve_ratio","efficacy_only_unresolved"].includes(policy))throw Error("política desconhecida");
 if(info.process==="unresolved_maximum_or_efficacy"&&policy==="efficacy_only_unresolved"){
  return {state:out,policy,applied:false,unresolved:"Eficácia arcana não possui atributo de runtime especificado",note:"Não assume alteração do máximo."};
 }
 if(info.process==="modify_maximum_hypothesis"&&policy==="efficacy_only_unresolved")throw Error("Política reservada a Diminuir Magia");
 const r=out[info.resource],before={...r},sign=event.effectId==="diminuir_magia"?-1:1;
 r.max=Math.max(0,before.max+sign*event.magnitude);
 if(policy==="preserve_current")r.current=Math.min(r.max,before.current);
 else if(policy==="preserve_deficit")r.current=Math.max(0,Math.min(r.max,r.max-(before.max-before.current)));
 else if(policy==="preserve_ratio")r.current=before.max===0?0:Math.floor(r.max*before.current/before.max);
 guardRevival(info.resource,before.current,r.current);
 return {state:out,policy,applied:true,before,after:{...r},
  note:"Mudança de capacidade transitória: regra de expiração e escala não aprovadas."};
}
export function simulateRegeneration(input,effects,ticks){
 const out=cloneState(input);
 if(!Number.isInteger(ticks)||ticks<0||ticks>50)throw Error("Ticks de teste devem ser inteiros entre 0 e 50");
 if(!Array.isArray(effects))throw Error("Lista de efeitos inválida");
 const deltas={saude:0,magia:0};
 for(const e of effects){
  const info=RESOURCE_EFFECTS[e?.effectId];
  if(!info||!["increase_regeneration_hypothesis","decrease_regeneration_hypothesis"].includes(info.process))throw Error("Não é efeito de taxa: "+e?.effectId);
  nonNegative(e.magnitude,"magnitude de taxa de QA");
  deltas[info.resource]+=info.process==="decrease_regeneration_hypothesis"?-e.magnitude:e.magnitude;
 }
 const effective=Object.fromEntries(RESOURCE_NAMES.map(id=>[id,Math.max(0,out[id].baseRate+deltas[id])]));
 const snapshots=[];
 for(let tick=1;tick<=ticks;tick++){
  const before=structuredClone(out);
  for(const id of RESOURCE_NAMES){
   const r=out[id],next=Math.min(r.max,r.current+effective[id]);
   guardRevival(id,r.current,next);
   r.current=next;
  }
  snapshots.push({tick,before,after:structuredClone(out)});
 }
 return {state:out,deltaRate:deltas,effectiveRate:effective,snapshots,
  note:"Tick, magnitude e piso 0 são hipóteses de demonstração, não tempo nem cura aprovados."};
}
