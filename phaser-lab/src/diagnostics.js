/** Diagnostic report for voluntary player bug reports.
 * The report contains no inventory, spell list, location seed, journal, save body,
 * localStorage values, query string, email or upload mechanism.
 */
const clip=(input,max=180)=>String(input??'').replace(/[\r\n\t]+/g,' ').slice(0,max);
export function createDiagnosticLog({limit=24,clock=()=>new Date().toISOString()}={}){
 const events=[],cap=Math.max(1,Math.min(60,Math.floor(limit)||24));
 return {
  record(type,message=''){
   events.push({at:clock(),type:clip(type,28),message:clip(message,180)});
   if(events.length>cap)events.splice(0,events.length-cap);
  },
  snapshot(){return events.map(e=>({...e}))}
 };
}
export function buildDiagnosticReport({version='dev',generatedAt,pathname,viewport,online,save,scene,battle,events=[]}={}){
 const p=save?.character||{};
 const out={
  format:'peren-m1hf-diagnostic-v1',
  app:'Peren Phaser M1h-F',
  build:clip(version,48),
  timestamp:clip(generatedAt,40),
  route:clip(pathname,140),
  viewport:{width:Number(viewport?.width)||0,height:Number(viewport?.height)||0},
  network:{online:Boolean(online)},
  progress:{
   schema:Number(save?.schema)||0,revision:Number(save?.revision)||0,
   origin:clip(save?.origin,40),day:Number(p.day)||0,level:Number(p.level)||0,kills:Number(p.kills)||0
  },
  scene:{
   explorationActive:Boolean(scene?.explorationActive),
   explorationPaused:Boolean(scene?.explorationPaused),
   battleActive:Boolean(scene?.battleActive)
  },
  battle:battle?{
   status:clip(battle.status,20),round:Number(battle.round)||0,
   monster:clip(battle.monster,60),busy:Boolean(battle.busy)
  }:null,
  lastEvents:(Array.isArray(events)?events:[]).slice(-24).map(e=>({
   at:clip(e?.at,40),type:clip(e?.type,28),message:clip(e?.message,180)
  }))
 };
 return out;
}
