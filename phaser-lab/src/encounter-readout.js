/**
 * M1h-F.11 — Encounter reconnaissance. Read-only information from actual
 * creature base sight/speed and canonical battle profile. No battle odds,
 * buffs, mutation, save access, or changes to monsterDecision().
 */
import {MURIN_BEASTS} from './encounters.js';
import {maxHp,maxMp} from './combat.js';
const behaviorNames=Object.freeze({
 sentinela:'Sentinela',esporo:'Errante de esporos',cacador:'Caçador'
});
export function encounterReadout(info={},profile={}){
 const beast=MURIN_BEASTS.find(m=>m.id===info?.type);
 const behavior=beast?.behavior||info?.behavior;
 const behaviorName=behaviorNames[behavior]||'Ameaça desconhecida';
 const sight=beast?.sight;
 const sightText=Number.isFinite(sight)?
  (sight>=7?'percepção de longo alcance':sight<=4?'percepção de curto alcance':'percepção intermediária'):
  'percepção desconhecida';
 const pace=Number.isFinite(beast?.speed)?
  (beast.speed>=70?'movimento veloz':beast.speed<=40?'movimento lento':'movimento cadenciado'):
  'movimento desconhecido';
 const level=Number.isFinite(profile?.level)&&profile.level>0?Math.floor(profile.level):1;
 const hpMax=Number.isFinite(profile?.playerMaxHp)&&profile.playerMaxHp>0?Math.floor(profile.playerMaxHp):maxHp(level);
 const mpMax=Number.isFinite(profile?.playerMaxMp)&&profile.playerMaxMp>0?Math.floor(profile.playerMaxMp):maxMp(level);
 const finite=(value,otherwise)=>Number.isFinite(value)?value:otherwise;
 const hp=Math.max(0,Math.min(hpMax,Math.floor(finite(profile?.hp,hpMax))));
 const mp=Math.max(0,Math.min(mpMax,Math.floor(finite(profile?.mp,mpMax))));
 const potions=Math.max(0,Math.floor(finite(profile?.potions,0)));
 const vitality=hp/hpMax<=.35?'FERIDO GRAVEMENTE':hp/hpMax<=.65?'FERIDO':'EM CONDIÇÕES DE LUTAR';
 const state=hp/hpMax<=.35?'danger':hp/hpMax<=.65?'warning':'neutral';
 return {
  behavior:`${behaviorName} · ${sightText} · ${pace}`,
  tactic:'Cobertura e neblina dificultam a percepção; correr facilita a detecção.',
  vitality,state,
  supplies:`PV ${hp}/${hpMax} · PM ${mp}/${mpMax} · Poções ${potions}`
 };
}
