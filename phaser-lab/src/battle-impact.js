/**
 * M1h-F.12 — Read-only battle impact indicators for the DOM HUD.
 * Compare two public state snapshots from the SAME encounter.
 * Damage is calculated strictly from the HP already resolved by combat.js.
 */
const hp=(value,max)=>Number.isFinite(value)&&Number.isFinite(max)&&max>0
  ?Math.min(max,Math.max(0,Math.floor(value))):null;
export function battleImpact(previous,current){
 if(!previous||!current||!previous.key||previous.key!==current.key)return null;
 const beforeEnemy=hp(previous.enemyHp,previous.enemyMaxHp);
 const afterEnemy=hp(current.enemyHp,current.enemyMaxHp);
 const beforeHero=hp(previous.hp,previous.maxHp);
 const afterHero=hp(current.hp,current.maxHp);
 const delta=(before,after)=>before===null||after===null?null:
   before===after?null:{kind:after<before?'damage':'heal',amount:Math.abs(after-before)};
 const enemy=delta(beforeEnemy,afterEnemy);
 const hero=delta(beforeHero,afterHero);
 return enemy||hero?{enemy,hero}:null;
}
