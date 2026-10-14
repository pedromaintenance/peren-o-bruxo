/** Pure turn-combat engine (Phaser-independent). M1c is a safe sandbox, NOT the classic save. */
import {hashSeed} from './world.js';

export const SPELLS = Object.freeze([
  {id:'mag-raio-de-fogo',name:'Raio de Fogo',mana:3,power:8,effect:'fire',label:'Fogo'},
  {id:'mag-raio-de-gelo',name:'Raio de Gelo',mana:3,power:7,effect:'ice',label:'Gelo'},
  {id:'mag-misseis-magicos',name:'Mísseis Mágicos',mana:7,power:9,effect:'arcane',label:'Arcano'}
]);
export const BATTLE_MONSTERS = Object.freeze({
 'mob-galho-infectado':{hp:24,attack:5,defense:1,xp:13,gold:8,drop:'ing-hanging-moss'},
 'mob-fungo-violeta':{hp:26,attack:5,defense:1,xp:15,gold:10,drop:'ing-imp-stool'},
 'mob-ettercap':{hp:51,attack:8,defense:2,xp:49,gold:38,drop:'ing-spider-egg'}
});
export const BATTLE_REWARD_IDS = Object.freeze(Object.values(BATTLE_MONSTERS).map(m=>m.drop));
export const defaultProfile = () => ({version:1,level:1,xp:0,gold:0,hp:114,mp:68,potions:3,kills:0,bag:{},claims:{},encounters:0});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function maxHp(level){return 114+(level-1)*23}
export function maxMp(level){return 68+(level-1)*15}
export function encounterKey(seed,instanceId){return `${encodeURIComponent(String(seed))}::${encodeURIComponent(String(instanceId))}`}
export function newBattle(beast,profile,key){
 const m=BATTLE_MONSTERS[beast.type];if(!m)throw Error('Monster not supported: '+beast.type);
 if(!key||typeof key!=='string')throw Error('Battle requires a stable encounter key');
 return {key,enemyId:beast.type,enemyName:beast.name,maxHp:m.hp,hp:m.hp,attack:m.attack,defense:m.defense,
   playerHp:clamp(profile.hp,1,profile.playerMaxHp||maxHp(profile.level)),playerMp:clamp(profile.mp,0,profile.playerMaxMp||maxMp(profile.level)),playerMaxHp:profile.playerMaxHp||maxHp(profile.level),playerMaxMp:profile.playerMaxMp||maxMp(profile.level),potions:profile.potions,playerAttack:profile.attack||null,playerDefense:profile.defense||null,learned:Array.isArray(profile.learned)?[...profile.learned]:null,
   round:1,defending:false,frozen:0,burning:0,status:'active',log:['As sombras de Mürin se fecham.'],lastEvent:'start'};
}
const sample=rng=>clamp(Number(rng()),0,0.999999);
export function stepBattle(battle,action,rng=Math.random){
 if(battle.status!=='active')return {state:battle,events:[],error:'Combate encerrado'};
 const b={...battle,log:[...battle.log],defending:false,lastEvent:action};
 let damage=0,effect='attack';const events=[];
 const roll=()=>sample(rng);
 if(action==='attack'){
   damage=(b.playerAttack?Math.max(8,Math.round(b.playerAttack*.62)):11)+Math.floor((b.round%3)*2)+Math.floor(roll()*7);effect='physical';
 }else if(action.startsWith('spell:')){
   const sp=SPELLS.find(x=>x.id===action.slice(6));
   if(!sp)return {state:battle,events:[],error:'Magia desconhecida'};
   if(b.learned&&!b.learned.includes(sp.id))return {state:battle,events:[],error:'Peren ainda não aprendeu esta magia'};
   if(b.playerMp<sp.mana)return {state:battle,events:[],error:'Mana insuficiente'};
   b.playerMp-=sp.mana;
   damage=sp.power+7+Math.floor(roll()*6);effect=sp.effect;
   if(effect==='ice')b.frozen=Math.max(b.frozen,1);
   if(effect==='fire')b.burning=Math.max(b.burning,2);
 }else if(action==='defend'){
   b.defending=true;b.playerMp=Math.min(b.playerMaxMp,b.playerMp+4);effect='defend';
 }else if(action==='potion'){
   if(b.potions<=0)return {state:battle,events:[],error:'Nenhuma poção restante'};
   b.potions--;b.playerHp=Math.min(b.playerMaxHp,b.playerHp+36);effect='potion';
 }else if(action==='flee'){
   b.status='fled';b.log.unshift('Peren se afasta antes de ser encurralado.');events.push({kind:'flee'});
   return {state:b,events};
 }else return {state:battle,events:[],error:'Ação desconhecida'};
 if(damage>0){const dealt=Math.max(1,Math.ceil(damage-b.defense*.38));b.hp=Math.max(0,b.hp-dealt);events.push({kind:'hit',source:'player',damage:dealt,effect});b.log.unshift(`${b.enemyName} recebe ${dealt} de dano.`)}
 else events.push({kind:effect,source:'player'});
 if(b.hp===0){b.status='won';events.push({kind:'victory'});b.log.unshift('A ameaça caiu.');return {state:b,events};}
 if(b.burning>0){const burn=3;b.hp=Math.max(0,b.hp-burn);b.burning--;events.push({kind:'burn',damage:burn});if(b.hp===0){b.status='won';events.push({kind:'victory'});return {state:b,events}}}
 if(b.frozen>0){b.frozen--;b.log.unshift(`${b.enemyName} não consegue reagir ao gelo.`);events.push({kind:'frozen'});}
 else{const strike=Math.max(2,Math.floor(b.attack*.48)+2+Math.floor(roll()*4));const protectedStrike=b.playerDefense?Math.max(2,strike-Math.floor(b.playerDefense*.22)):strike;const actual=b.defending?Math.ceil(protectedStrike*.48):protectedStrike;b.playerHp=Math.max(0,b.playerHp-actual);b.log.unshift(`${b.enemyName} ataca: ${actual} PV.`);events.push({kind:'hit',source:'enemy',damage:actual,effect:'physical'});}
 b.round++;
 if(b.playerHp===0){b.status='lost';events.push({kind:'defeat'});b.log.unshift('Peren cai entre as raízes de Mürin.');}
 return {state:b,events};
}
/** Atomic one-time settlement, keyed by region and instance. Never writes the classic save. */
export function settleBattle(profile,battle){
 if(battle.status!=='won')return {profile,reward:null,applied:false};
 if(profile.claims?.[battle.key])return {profile,reward:profile.claims[battle.key],applied:false};
 const source=BATTLE_MONSTERS[battle.enemyId];if(!source)throw Error('Unknown reward type');
 const reward={key:battle.key,monster:battle.enemyId,xp:source.xp,gold:source.gold,items:{[source.drop]:1}};
 const next={...profile,claims:{...profile.claims,[battle.key]:reward},bag:{...profile.bag},hp:battle.playerHp,mp:battle.playerMp,potions:battle.potions,level:profile.level,xp:profile.xp+source.xp,gold:profile.gold+source.gold,kills:profile.kills+1};
 next.bag[source.drop]=(next.bag[source.drop]||0)+1;
 let levels=0;while(next.level<200&&next.xp>=next.level*62&&levels<200){next.xp-=next.level*62;next.level++;levels++;next.hp=Math.min(maxHp(next.level),next.hp+23);next.mp=Math.min(maxMp(next.level),next.mp+15)}
 return {profile:next,reward:{...reward,levels},applied:true};
}
export function settleEscape(profile,battle){
 if(!['fled','lost'].includes(battle.status))return profile;
 if(battle.status==='lost')return {...profile,hp:Math.max(24,Math.floor(maxHp(profile.level)*.50)),mp:Math.max(12,Math.floor(maxMp(profile.level)*.50)),potions:battle.potions};
 return {...profile,hp:Math.max(1,battle.playerHp),mp:battle.playerMp,potions:battle.potions};
}
export function animationKey(action){return action.startsWith('spell:')?SPELLS.find(x=>x.id===action.slice(6))?.effect||'arcane':action}
/** A reproducible random stream used only for visuals/QA; no network or device time. */
export function battleRng(key){let s=hashSeed(key);return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296}}
