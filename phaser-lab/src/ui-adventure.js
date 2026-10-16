// View model M1g-E. No combat or inventory transactions are performed here.
import {maxClassicHp,maxClassicMp} from './progress.js';
import {SPELLS,BATTLE_MONSTERS} from './combat.js';
export const ratio=(value,max)=>max>0?Math.round(100*Math.max(0,Math.min(1,value/max))):0;
const hints={
  attack:'Ataque físico, resolvido pelo motor do combate.',
  defend:'Postura defensiva contra o próximo ataque.',
  potion:'Consome uma poção restauradora real da bolsa.',
  flee:'Tenta fugir sem receber saque nem XP.'
};
export const actionDetails=id=>{
 if(id?.startsWith('spell:')){
  const spell=SPELLS.find(spell=>spell.id===id.slice(6));
  return spell?spell.name+' · '+spell.mana+' PM · '+spell.label:'Magia desconhecida';
 }
 return hints[id]||'Ação não disponível.';
};
export function expeditionViewModel(s,c,reg={}){
 const maxHp=maxClassicHp(s,c),maxMp=maxClassicMp(s);
 return {name:'Peren, o Bruxo',location:'Floresta de Mürin',hp:s.hp,maxHp,hpPercent:ratio(s.hp,maxHp),
  mp:s.mp,maxMp,mpPercent:ratio(s.mp,maxMp),level:s.level,gold:s.gold,day:s.day,
  gathered:Object.values(reg.collected||{}).reduce((sum,value)=>sum+(Number(value)||0),0),
  weather:reg.weather||'sereno',threat:reg.threat||'Patrulhas distantes',
  status:reg.status||'Explore a floresta e encontre recursos.',canReturn:Boolean(reg.atExit)};
}
export function battleViewModel(s){
 if(!s)return null;
 return {round:s.round,monster:s.monster,enemyHp:s.enemyHp,enemyMaxHp:s.enemyMaxHp,enemyPercent:ratio(s.enemyHp,s.enemyMaxHp),
  hp:s.hp,maxHp:s.maxHp,hpPercent:ratio(s.hp,s.maxHp),mp:s.mp,maxMp:s.maxMp,mpPercent:ratio(s.mp,s.maxMp),
  potions:s.potions,level:s.level,log:(s.log||[]).join(' · '),
  busy:Boolean(s.busy),finished:s.status!=='active',status:s.status};
}
export function fillGauge(doc,id,value,max){
 const bar=doc.getElementById(id);if(!bar)return;
 bar.style.width=ratio(value,max)+'%';bar.setAttribute('aria-valuenow',String(value));bar.setAttribute('aria-valuemax',String(max));
}

/** Canonical, read-only reward preview. Rewards are committed only on confirmation. */
export function battleOutcomeViewModel(state,catalogs){
 if(!state||state.status==='active')return null;
 if(state.status==='won'){
  const reward=BATTLE_MONSTERS[state.enemyId];
  if(!reward)return {title:'Vitória',details:'Recompensa não encontrada no bestiário.',status:'warning'};
  const itemName=catalogs?.itensById?.[reward.drop]?.nome||reward.drop;
  return {title:'Vitória · saque a receber',details:`${reward.xp} XP · ${reward.gold} moedas · 1× ${itemName}`,
   status:'won',gold:reward.gold,xp:reward.xp,drop:reward.drop};
 }
 if(state.status==='lost')return {title:'Derrota · resgate',details:'Sem XP ou saque. Peren retorna ferido.',status:'lost'};
 if(state.status==='fled')return {title:'Retirada concluída',details:'Sem XP ou saque. O inimigo permanece na floresta.',status:'fled'};
 return {title:'Desfecho',details:'Nenhuma recompensa prevista.',status:'warning'};
}
