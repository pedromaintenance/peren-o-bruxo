/** M1h-F.14: read-only recent combat log, never serialized to a save. */
export function createBattleTranscript(cap=24){
 const limit=Math.max(1,Math.min(100,Math.trunc(Number(cap)||24)));
 let key=null,previous=[],entries=[],signature='';
 function reset(){key=null;previous=[];entries=[];signature='';}
 function snapshot(){return {key,entries:entries.map(e=>({...e}))};}
 function observe(state){
  if(typeof state?.key!=='string'||!state.key)return snapshot();
  if(state.key!==key){reset();key=state.key;}
  const log=Array.isArray(state.log)?state.log.filter(s=>typeof s==='string'&&s.trim()).slice(0,3):[];
  const stamp=JSON.stringify([state.round,state.status,log]);
  if(stamp===signature)return snapshot();
  let overlap=0;
  for(let n=Math.min(previous.length,log.length);n>0;n--){
   if(log.slice(log.length-n).every((text,i)=>text===previous[i])){overlap=n;break;}
  }
  const fresh=log.slice(0,log.length-overlap);
  entries=[...fresh.map(text=>({text})),...entries].slice(0,limit);
  previous=[...log];signature=stamp;
  return snapshot();
 }
 return Object.freeze({reset,snapshot,observe});
}
