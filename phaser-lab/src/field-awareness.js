/**
 * M1h-F.8 — Field awareness readout. Pure presentation derived exclusively
 * from existing movement/perception data. No stealth roll, save fields or
 * new creature sensing is introduced by this module.
 */
export function fieldAwareness({cover=false,wet=false,sprint=false,weather='sereno',detected=0,investigating=0}={}){
 const chased=Number.isFinite(detected)?Math.max(0,Math.floor(detected)):0;
 const searching=Number.isFinite(investigating)?Math.max(0,Math.floor(investigating)):0;
 const fog=weather==='neblina';
 const conditions=[];
 if(cover)conditions.push('Folhagem dificulta a detecção');
 if(fog)conditions.push('Névoa encurta a visão inimiga');
 if(sprint)conditions.push('Corrida aumenta o alcance de detecção');
 if(wet)conditions.push('Solo úmido reduz a velocidade');
 const detail=conditions.length?conditions.join(' · '):'Sem cobertura: mantenha distância das patrulhas';
 if(chased>0)return {
  state:'danger',title:'CAÇADO',detail:chased===1?'Uma criatura detectou Peren. '+detail:`${chased} criaturas detectaram Peren. ${detail}`
 };
 if(searching>0)return {state:'warning',title:'RASTROS RECENTES',
  detail:'Uma criatura investiga o último paradeiro de Peren. '+detail};
 if(sprint)return {state:'warning',title:'PASSOS RUIDOSOS',detail};
 if(cover)return {state:'quiet',title:'SOB COBERTURA',detail};
 return {state:'neutral',title:'PASSOS CONTIDOS',detail};
}
