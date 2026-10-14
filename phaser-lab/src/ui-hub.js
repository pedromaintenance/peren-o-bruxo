// M1g-A: presentation-only state. Rules and transactions remain in progress.js.
import {maxClassicHp,maxClassicMp,inventoryTotal} from './progress.js';
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export function hubViewModel(s,catalogs,origin='phaser'){
  const city=catalogs.cidadesById[s.city];
  const maxHp=maxClassicHp(s,catalogs),maxMp=maxClassicMp(s);
  const xpGoal=Math.max(1,s.level*62);
  const percent=(n,max)=>clamp(Math.round(n/Math.max(1,max)*100),0,100);
  return {
    day:'Dia '+s.day,gold:new Intl.NumberFormat('pt-BR').format(s.gold),
    level:'Nível '+s.level,xp:s.exp+' / '+xpGoal,xpPct:percent(s.exp,xpGoal),
    hp:s.hp+' / '+maxHp,hpPct:percent(s.hp,maxHp),
    mp:s.mp+' / '+maxMp,mpPct:percent(s.mp,maxMp),
    bag:inventoryTotal(s)+' itens na bolsa',
    source:origin==='classic-import'?'Cópia importada do Peren clássico':'Progresso Phaser independente',
    origin:city?.nome||s.city,actions:s.actions+' ações disponíveis',
  };
}
export function applyHubViewModel(doc,vm){
  const content={hubDay:vm.day,hubGold:vm.gold,hubLevel:vm.level,hubXpValue:vm.xp,
    hubHpValue:vm.hp,hubMpValue:vm.mp,hubBagCount:vm.bag,
    hubSaveOrigin:vm.source,hubAvailableActions:vm.actions};
  for(const [id,value] of Object.entries(content)){const node=doc.getElementById(id);if(node)node.textContent=value;}
  for(const [id,value] of [['hubXpFill',vm.xpPct],['hubHpFill',vm.hpPct],['hubMpFill',vm.mpPct]]){
    const el=doc.getElementById(id);if(el)el.style.width=value+'%';
  }
  const origin=doc.getElementById('hubOriginCity');if(origin)origin.textContent='Origem do save: '+vm.origin;
}
