/**
 * Necessidades e mortalidade: camada biológica extensível, desacoplada do relógio.
 * Classes/espécies mágicas FUTURAS alteram traits; esta versão NÃO concede
 * vampirismo, imortalidade ou ressurreição como poderes desbloqueados.
 */
export const DEFAULT_PHYSIOLOGY=Object.freeze({
 form:'metamorfo',diet:'food',sleep:'required',mortality:'mortal',
 agingRate:1,lifespanYears:120,resurrection:'none'
});
// Provisório de pré-alfa: 120 anos jogáveis DEPOIS de 922 EC, não é lore
// que determine idade ou expectativa de vida racial de Peren antes do início.
export const SURVIVAL_RULES=Object.freeze({
 hungerLossPerHour:2,sleepLossPerHour:3,hungerLossSleepingPerHour:1,
 sleepRecoveryPerHour:14,mealRecovery:40,starvationDamagePerHour:5,
 sleepDeprivationDamagePerHour:3
});
const limit=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const validNumber=(n,other)=>typeof n==='number'&&Number.isFinite(n)?n:other;
export function normalizePhysiology(source){
 const s=source&&typeof source==='object'&&!Array.isArray(source)?source:{};
 const valid=(field,options)=>options.includes(s[field])?s[field]:DEFAULT_PHYSIOLOGY[field];
 return {
  form:typeof s.form==='string'&&/^[a-z0-9_-]{2,40}$/.test(s.form)?s.form:DEFAULT_PHYSIOLOGY.form,
  diet:valid('diet',['food','blood','none']),sleep:valid('sleep',['required','none']),
  mortality:valid('mortality',['mortal','immortal']),
  agingRate:limit(validNumber(s.agingRate,DEFAULT_PHYSIOLOGY.agingRate),0,10),
  lifespanYears:limit(validNumber(s.lifespanYears,DEFAULT_PHYSIOLOGY.lifespanYears),1,100000),
  resurrection:valid('resurrection',['none','pending','permitted'])
 };
}
export function newSurvival(){
 return {hunger:100,rest:100,ageMinutes:0,healthDebt:0,alive:true,causeOfDeath:null,physiology:{...DEFAULT_PHYSIOLOGY}};
}
export function normalizeSurvival(source,legacyFatigue=0){
 const n=source&&typeof source==='object'&&!Array.isArray(source)?source:{};
 return {hunger:limit(validNumber(n.hunger,100),0,100),
  rest:limit(validNumber(n.rest,100-limit(validNumber(legacyFatigue,0),0,100)),0,100),
  ageMinutes:limit(validNumber(n.ageMinutes,0),0,100000*366*1440),
  healthDebt:limit(validNumber(n.healthDebt,0),0,0.999999),
  alive:n.alive!==false,causeOfDeath:typeof n.causeOfDeath==='string'?n.causeOfDeath:null,
  physiology:normalizePhysiology(n.physiology)};
}
const round=n=>Math.round(n*10000)/10000;
export function advanceSurvival(current,minutes,{sleeping=false,hp=114,maximumHp=114}={}){
 if(!Number.isSafeInteger(minutes)||minutes<0)throw Error('Duração biológica inválida.');
 const s=normalizeSurvival(current);
 if(!s.alive||minutes===0)return {survival:s,hp,damage:0,death:false};
 const hrs=minutes/60,p=s.physiology;
 const hunger=p.diet==='none'?s.hunger:Math.max(0,s.hunger-hrs*(sleeping?SURVIVAL_RULES.hungerLossSleepingPerHour:SURVIVAL_RULES.hungerLossPerHour));
 const rest=p.sleep==='none'?s.rest:limit(s.rest+hrs*(sleeping?SURVIVAL_RULES.sleepRecoveryPerHour:-SURVIVAL_RULES.sleepLossPerHour),0,100);
 const oldHunger=s.hunger,oldRest=s.rest;
 // Damage applies only to hours spent depleted, never retroactively to
 // the whole duration when the bar first hits zero.
 const starve=p.diet==='none'?0:Math.max(0,hrs-Math.max(0,oldHunger)/(sleeping?SURVIVAL_RULES.hungerLossSleepingPerHour:SURVIVAL_RULES.hungerLossPerHour));
 const exhausted=p.sleep==='none'?0:sleeping?0:Math.max(0,hrs-Math.max(0,oldRest)/SURVIVAL_RULES.sleepLossPerHour);
 const damage=starve*SURVIVAL_RULES.starvationDamagePerHour+exhausted*SURVIVAL_RULES.sleepDeprivationDamagePerHour;
 // Damage remains integer at the HP boundary. Fractional damage accumulates
 // persistently and does not disappear between short 3-minute world ticks.
 const totalDamage=s.healthDebt+damage;
 const appliedDamage=Math.floor(totalDamage+1e-8);
 const healthDebt=round(totalDamage-appliedDamage);
 const nextHp=Math.max(0,Math.round(Math.min(maximumHp,hp))-appliedDamage);
 const ageMinutes=s.ageMinutes+minutes*p.agingRate;
 const lifespanExceeded=p.mortality==='mortal'&&ageMinutes>=p.lifespanYears*365.25*1440;
 const death=nextHp<=0||lifespanExceeded;
 const cause=lifespanExceeded?'velhice':starve>0?'inanição':exhausted>0?'privação de sono':null;
 return {survival:{...s,hunger:round(hunger),rest:round(rest),ageMinutes:round(ageMinutes),healthDebt,
  alive:!death,causeOfDeath:death?cause:null},hp:death?0:nextHp,damage:round(damage),death};
}
export function eatMeal(current,{recovery=SURVIVAL_RULES.mealRecovery}={}){
 const s=normalizeSurvival(current);
 if(!s.alive)throw Error('Peren não pode se alimentar enquanto estiver morto.');
 if(s.physiology.diet!=='food')throw Error('Esta forma não se alimenta de rações comuns.');
 if(s.hunger>=100)throw Error('Peren não está com fome.');
 return {...s,hunger:round(Math.min(100,s.hunger+recovery))};
}
export function canAct(survival){return normalizeSurvival(survival).alive}
export function survivalSummary(s){
 const state=normalizeSurvival(s);
 return {alive:state.alive,hunger:state.hunger,rest:state.rest,
  hungerLabel:state.hunger<=0?'FAMINTO':state.hunger<25?'MUITA FOME':state.hunger<55?'COM FOME':'ALIMENTADO',
  sleepLabel:state.rest<=0?'EXAUSTO':state.rest<25?'QUASE SEM DORMIR':state.rest<55?'SONOLENTO':'DESCANSADO',
  ageYears:Number((state.ageMinutes/(365.25*1440)).toFixed(2))};
}
