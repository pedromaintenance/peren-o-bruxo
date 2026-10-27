/**
 * Peren v9.0: refined infernal art bridge for the distributed Phaser preview.
 *
 * DOES NOT modify stepBattle, health, mana, inventory or persisted saves.
 * Only installs if a verified battle-asset-pack-v90.json marker and all PNGs are deployed.
 * Thus the public build remains safe until PNGs actually reach GitHub Pages.
 */
const ROOT="./art/battle/runtime-v84/";
const CAST_ROOT="./art/characters/peren/battler/casting/";
export const CONTRACT=Object.freeze({
 idle:{key:"peren-v84-idle",file:"idle.png",width:560,height:821,frames:4,fps:4},
 castingFire:{key:"peren-v19-casting-fire",file:"peren-casting-fire.png",path:CAST_ROOT+"peren-casting-fire.png",width:512,height:682,frames:4,durations:[250,300,300,300]},
 castingIce:{key:"peren-v24-casting-ice",file:"peren-casting-ice.png",path:CAST_ROOT+"peren-casting-ice.png",width:512,height:682,frames:4,durations:[250,300,300,300]},
 infernal:{key:"peren-v90-infernal",file:"infernal-v90.png",width:512,height:341,frames:8,playFrames:7,frameMs:180,tailMs:320},
 void:{key:"peren-v84-void",file:"void.png",width:640,height:362,frames:11,frameMs:135},
 summon:{key:"peren-v84-summon",file:"summon.png",width:512,height:512,frames:8,
  durations:[190,210,250,300,330,400,380,320]},
 sparks:{key:"peren-v10-sparks",file:"sparks-v10.png",width:416,height:682,frames:5,
  durations:[120,125,165,145,130]},
 flame:{key:"peren-v10-flame",file:"flame-v10.png",width:384,height:370,frames:5,
  durations:[145,165,220,170,180],delayMs:270},
 embers:{key:"peren-v11-embers",file:"embers-v11.png",width:416,height:682,frames:5,
  durations:[125,145,205,155,125]},
 pupil:{key:"peren-v11-pupil",file:"pupil-v11.png",width:416,height:682,frames:5,
  durations:[135,165,230,170,160]},
 ring:{key:"peren-v12-ring",file:"ring-v12.png",width:480,height:682,frames:5,
  durations:[130,155,190,170,145],delayMs:430},
 burst:{key:"peren-v13-burst",file:"burst-v13.png",width:416,height:336,frames:5,
  durations:[130,150,200,150,135],delayMs:490},
 blaze:{key:"peren-v14-blaze",file:"blaze-v14.png",width:416,height:226,frames:5,
  durations:[120,150,210,155,135],delayMs:560},
 smoke:{key:"peren-v15-smoke",file:"smoke-v15.png",width:416,height:280,frames:5,
  durations:[125,160,220,170,145],delayMs:630},
 hellskull:{key:"peren-v16-hellskull",file:"hellskull-v16.png",width:416,height:405,frames:5,
  durations:[130,165,230,175,145],delayMs:700},
 skullcloud:{key:"peren-v17-skullcloud",file:"skullcloud-v17.png",width:416,height:238,frames:5,
  durations:[135,180,240,185,155],delayMs:560},
 portraits:["portrait_01.png","portrait_02.png","portrait_03.png","portrait_04.png"]
});
// A basic Fire Bolt should not look like an apocalypse.
// Infernal skulls and unused flame variants stay in the library for future spells.
export const FIRE_OVERLAY_PRESET=Object.freeze(["sparks","flame"]);
export const CINEMATIC_ACTIONS=Object.freeze({
 "spell:mag-raio-de-fogo":"infernal",
 "spell:mag-raio-de-gelo":"castingIce",
 "spell:mag-misseis-magicos":"void"
}); // Purely visual: existing spell and save logic is unchanged.
export function getAnimationPlan(action){
 return CINEMATIC_ACTIONS[action]||null;
}
export function validateAssetMarker(marker){
 if(!marker||marker.schema!=="peren-battle-art-v90"||marker.verified!==true)return false;
 if(!Array.isArray(marker.files))return false;
 const required=[CONTRACT.idle.file,CONTRACT.infernal.file,CONTRACT.void.file,CONTRACT.summon.file,...CONTRACT.portraits];
 return required.every(file=>marker.files.some(f=>f.path===file&&/^[a-f0-9]{64}$/.test(f.sha256)));
}
/**
 * Pre-cached art is valid in airplane/offline mode. HEAD requests cannot be
 * intercepted by this PWA's GET-only service worker; check CacheStorage as
 * a fallback without downloading all PNG bodies into JavaScript memory.
 */
export async function assetAvailability(file,fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 const url=file.startsWith("./")?file:ROOT+file;
 try{
  const response=await fetcher(url,{method:"HEAD",cache:"no-cache"});
  if(response?.ok)return {ok:true,source:"network",status:response.status??200};
 }catch{}
 try{
  const cached=await cacheStore?.match?.(url);
  if(cached?.ok)return {ok:true,source:"cache",status:cached.status??200};
 }catch{}
 return {ok:false,source:"missing",status:null};
}

export async function checkInstalledAssets(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 try{
  const res=await fetcher(ROOT+"battle-asset-pack-v90.json",{cache:"no-cache"});
  if(!res.ok)return false;
  const manifest=await res.json();
  if(!validateAssetMarker(manifest))return false;
  const required=[CONTRACT.idle.file,CONTRACT.infernal.file,CONTRACT.void.file,CONTRACT.summon.file,...CONTRACT.portraits];
  // A registered service worker answers GET from precache, but cannot
  // satisfy offline HEAD; CacheStorage supplies the offline readiness proof.
  const checks=await Promise.all(required.map(file=>assetAvailability(file,fetcher,cacheStore)));
  return checks.every(check=>check.ok);
 }catch{return false}
}
/**
 * Report the exact reason why the new art cannot be activated.
 * This deliberately does not fetch image bodies, change the Scene or touch saves.
 * Debug it at /phaser-demo-m1hf/?debug-battler=1
 */
export async function diagnoseBattleArt(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 const expected=[CONTRACT.idle.file,CONTRACT.infernal.file,CONTRACT.void.file,
   CONTRACT.summon.file,...CONTRACT.portraits];
 let response;
 try{response=await fetcher(ROOT+"battle-asset-pack-v90.json",{cache:"no-store"})}
 catch(error){return {ready:false,code:"manifest-network-error",reason:String(error),missing:expected}};
 if(!response?.ok)return {ready:false,code:"manifest-not-found",status:response?.status??null,missing:expected};
 let marker;
 try{marker=await response.json()}catch(error){
  return {ready:false,code:"manifest-invalid-json",reason:String(error),missing:expected};
 }
 if(!validateAssetMarker(marker))return {ready:false,code:"manifest-invalid-schema-or-hashes",missing:expected};
 const checks=await Promise.all(expected.map(async file=>({
  file,...await assetAvailability(file,fetcher,cacheStore)
 })));
 const missing=checks.filter(x=>!x.ok).map(x=>x.file);
 const offline=checks.some(x=>x.source==="cache");
 return {ready:missing.length===0,
   code:missing.length?"png-missing":offline?"cached-assets-present":"assets-present",
   missing,checks,version:marker.version??null};
}
/** Sparks are optional until the author-approved PNG is committed and cached. */
export async function checkInstalledSparks(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 try{
  const response=await fetcher(ROOT+"sparks-v10.json",{cache:"no-cache"});
  if(!response?.ok)return false;
  const marker=await response.json();
  if(marker?.schema!=="peren-sparks-v10"||marker?.asset!==CONTRACT.sparks.file||
     marker?.frames!==5||marker?.frame_size?.[0]!==416||marker?.frame_size?.[1]!==682||
     !/^[a-f0-9]{64}$/.test(marker?.sha256??""))return false;
  return (await assetAvailability(CONTRACT.sparks.file,fetcher,cacheStore)).ok;
 }catch{return false}
}
export async function checkInstalledFlame(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 try{
  const response=await fetcher(ROOT+"flame-v10.json",{cache:"no-cache"});
  if(!response?.ok)return false;
  const marker=await response.json();
  if(marker?.schema!=="peren-flame-v10"||marker?.asset!==CONTRACT.flame.file||
     marker?.frames!==5||marker?.frame_size?.[0]!==384||marker?.frame_size?.[1]!==370||
     !/^[a-f0-9]{64}$/.test(marker?.sha256??""))return false;
  return (await assetAvailability(CONTRACT.flame.file,fetcher,cacheStore)).ok;
 }catch{return false}
}
/** Verify a v11 fire atlas independently; unshipped art never blocks original spells. */
async function checkInstalledV11Fire(id,fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 const spec=CONTRACT[id];
 try{
  const response=await fetcher(ROOT+spec.file.replace(".png",".json"),{cache:"no-cache"});
  if(!response?.ok)return false;
  const marker=await response.json();
  if(marker?.schema!=="peren-"+id+"-v11"||marker?.asset!==spec.file||
     marker?.frames!==spec.frames||marker?.frame_size?.[0]!==spec.width||
     marker?.frame_size?.[1]!==spec.height||
     !/^[a-f0-9]{64}$/.test(marker?.sha256??""))return false;
  return (await assetAvailability(spec.file,fetcher,cacheStore)).ok;
 }catch{return false}
}
export const checkInstalledEmbers=(fetcher,cacheStore)=>checkInstalledV11Fire("embers",fetcher,cacheStore);
export const checkInstalledPupil=(fetcher,cacheStore)=>checkInstalledV11Fire("pupil",fetcher,cacheStore);
/** Optional Ring asset: independent of the v11 and core Infernal art gates. */
export async function checkInstalledRing(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 const spec=CONTRACT.ring;
 try{
  const res=await fetcher(ROOT+"ring-v12.json",{cache:"no-cache"});
  if(!res?.ok)return false;
  const marker=await res.json();
  if(marker?.schema!=="peren-ring-v12"||marker?.asset!==spec.file||
     marker?.frames!==5||marker?.frame_size?.[0]!==spec.width||
     marker?.frame_size?.[1]!==spec.height||
     !/^[a-f0-9]{64}$/.test(marker?.sha256??""))return false;
  return (await assetAvailability(spec.file,fetcher,cacheStore)).ok;
 }catch{return false}
}
/** Sixth fire overlay is independently gated by its deployed binary+manifest. */
export async function checkInstalledBurst(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 const spec=CONTRACT.burst;
 try{
  const res=await fetcher(ROOT+"burst-v13.json",{cache:"no-cache"});
  if(!res?.ok)return false;
  const marker=await res.json();
  if(marker?.schema!=="peren-burst-v13"||marker?.asset!==spec.file||
     marker?.frames!==spec.frames||marker?.frame_size?.[0]!==spec.width||
     marker?.frame_size?.[1]!==spec.height||
     !/^[a-f0-9]{64}$/.test(marker?.sha256??""))return false;
  return (await assetAvailability(spec.file,fetcher,cacheStore)).ok;
 }catch{return false}
}
/** Seventh fire effect is optional, requiring real PNG and validated manifest. */
export async function checkInstalledBlaze(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 const spec=CONTRACT.blaze;
 try{
  const response=await fetcher(ROOT+"blaze-v14.json",{cache:"no-cache"});
  if(!response?.ok)return false;
  const marker=await response.json();
  if(marker?.schema!=="peren-blaze-v14"||marker?.asset!==spec.file||
     marker?.frames!==spec.frames||marker?.frame_size?.[0]!==spec.width||
     marker?.frame_size?.[1]!==spec.height||
     !/^[a-f0-9]{64}$/.test(marker?.sha256??""))return false;
  return (await assetAvailability(spec.file,fetcher,cacheStore)).ok;
 }catch{return false}
}
/** Optional smoke needs its actual RGBA PNG and matching five-frame manifest. */
export async function checkInstalledSmoke(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 const spec=CONTRACT.smoke;
 try{
  const response=await fetcher(ROOT+"smoke-v15.json",{cache:"no-cache"});
  if(!response?.ok)return false;
  const marker=await response.json();
  if(marker?.schema!=="peren-smoke-v15"||marker?.asset!==spec.file||
     marker?.frames!==spec.frames||marker?.frame_size?.[0]!==spec.width||
     marker?.frame_size?.[1]!==spec.height||
     !/^[a-f0-9]{64}$/.test(marker?.sha256??""))return false;
  return (await assetAvailability(spec.file,fetcher,cacheStore)).ok;
 }catch{return false}
}
/** Ninth fire overlay requires both the real corrected skull PNG and its marker. */
export async function checkInstalledHellskull(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 const spec=CONTRACT.hellskull;
 try{
  const response=await fetcher(ROOT+"hellskull-v16.json",{cache:"no-cache"});
  if(!response?.ok)return false;
  const marker=await response.json();
  if(marker?.schema!=="peren-hellskull-v16"||marker?.asset!==spec.file||
    marker?.frames!==spec.frames||marker?.frame_size?.[0]!==spec.width||
    marker?.frame_size?.[1]!==spec.height||
    !/^[a-f0-9]{64}$/.test(marker?.sha256??""))return false;
  return (await assetAvailability(spec.file,fetcher,cacheStore)).ok;
 }catch{return false}
}
/** Load real uploaded caster artwork only after its manifest and PNG are available. */
export async function checkInstalledCastingFire(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 try{
  const response=await fetcher(CAST_ROOT+"manifest.json",{cache:"no-cache"});
  if(!response?.ok)return false;
  const marker=await response.json(),atlas=marker?.atlas;
  const anim=marker?.animations?.find(a=>a.id==="peren-casting-fire");
  if(marker?.schema!=="peren.battle-casting/v1"||
     atlas?.columns!==4||atlas?.rows!==1||atlas?.width!==2048||atlas?.height!==682||
     atlas?.frameWidth!==512||atlas?.frameHeight!==682||
     anim?.file!=="peren-casting-fire.png"||
     JSON.stringify(anim?.frames)!=="[0,1,2,3]"||
     anim?.sha256!=="5264a9f2332341c98e4f76b7867e36e146822414ad64ca37ff559ce47f34fdc7")return false;
  return (await assetAvailability(CONTRACT.castingFire.path,fetcher,cacheStore)).ok;
 }catch{return false}
}
/** Check the original, committed four-frame transparent ice spell caster. */
export async function checkInstalledCastingIce(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 try{
  const response=await fetcher(CAST_ROOT+"manifest.json",{cache:"no-cache"});
  if(!response?.ok)return false;
  const marker=await response.json(),atlas=marker?.atlas;
  const anim=marker?.animations?.find(a=>a.id==="peren-casting-ice");
  if(marker?.schema!=="peren.battle-casting/v1"||
     atlas?.columns!==4||atlas?.rows!==1||atlas?.width!==2048||atlas?.height!==682||
     atlas?.frameWidth!==512||atlas?.frameHeight!==682||
     anim?.file!=="peren-casting-ice.png"||
     JSON.stringify(anim?.frames)!=="[0,1,2,3]"||
     anim?.sha256!=="2d39f3d6cea6d198ba3d49eec265cc7f9453c8c40132a9829e01857f428c9064")return false;
  return (await assetAvailability(CONTRACT.castingIce.path,fetcher,cacheStore)).ok;
 }catch{return false}
}
/** Fogo 10 requires both the deployed PNG and a matching, verified metadata file. */
export async function checkInstalledSkullcloud(fetcher=fetch,cacheStore=typeof caches==="undefined"?null:caches){
 const spec=CONTRACT.skullcloud;
 try{
  const response=await fetcher(ROOT+"skullcloud-v17.json",{cache:"no-cache"});
  if(!response?.ok)return false;
  const marker=await response.json();
  if(marker?.schema!=="peren-skullcloud-v17"||marker?.asset!==spec.file||
    marker?.frames!==spec.frames||marker?.frame_size?.[0]!==spec.width||
    marker?.frame_size?.[1]!==spec.height||
    marker?.dimensions?.[0]!==spec.width*spec.frames||
    marker?.dimensions?.[1]!==spec.height||
    marker?.sha256!=="ca25e194fdb1060480b0d10f5d73f415c01caa377c6190a039f1e76f6474765b")return false;
  return (await assetAvailability(spec.file,fetcher,cacheStore)).ok;
 }catch{return false}
}
function renderBattleArtDiagnostics(doc,result,diagnostic){
 if(!doc?.body)return;
 const previous=doc.getElementById("peren-battle-art-diagnostics");
 previous?.remove?.();
 const panel=doc.createElement("aside");
 panel.id="peren-battle-art-diagnostics";
 panel.setAttribute("role","status");
 panel.style.cssText="position:fixed;left:10px;bottom:10px;z-index:999999;max-width:min(92vw,400px);max-height:55vh;overflow:auto;background:#0b111df2;color:#fae4c4;border:1px solid #a88a52;border-radius:10px;padding:12px;box-shadow:0 6px 30px #0009;font:13px/1.5 monospace;white-space:pre-wrap";
 const title=doc.createElement("strong");
 title.textContent="Peren · Diagnóstico dos battlers v8.4";
 const details=doc.createElement("p");
 details.textContent=[
  "Carregamento: "+(result?.enabled?"ATIVO":"FALLBACK DO SPRITE ANTIGO"),
  "Motivo: "+(result?.reason||diagnostic.code),
  "Integridade remota: "+diagnostic.code,
  "Versão: "+(diagnostic.version||"não identificada"),
  "PNG ausente: "+(diagnostic.missing?.join(", ")||"nenhum"),
  "Faíscas v10 carregadas: "+Boolean(result?.sparksEnabled),
  "Conjuração de Fogo v19: "+Boolean(result?.castingFireEnabled),
  "Conjuração de Gelo v24: "+Boolean(result?.castingIceEnabled),
  "Chama v10: "+Boolean(result?.flameEnabled),
  "Composição visual: Faíscas na mão + Chama no inimigo",
  "BattleScene carregado: "+Boolean(doc.defaultView?.__perenLab?.scene?.getScene)
 ].join("\n");
 const close=doc.createElement("button");close.type="button";close.textContent="Fechar";
 close.style.cssText="margin-top:8px;background:#25354c;color:white;border:1px solid #b49a71;padding:6px 14px";
 close.addEventListener("click",()=>panel.remove());
 panel.append(title,details,close);
 doc.body.append(panel);
}

function battleArena(scene){
 const w=scene.scale.width,h=scene.scale.height;
 let top=h*.18,bottom=h*.73;
 if(typeof document!=="undefined"){
  const canvas=scene.game?.canvas?.getBoundingClientRect?.();
  const header=document.getElementById("battleHeader")?.getBoundingClientRect?.();
  const panel=document.getElementById("battlePanel")?.getBoundingClientRect?.();
  if(canvas?.height&&header&&panel){
   const ratio=h/canvas.height;
   top=(header.bottom-canvas.top)*ratio+6;
   bottom=(panel.top-canvas.top)*ratio-5;
  }
 }
 // Fall back to safe fractional placement while responsive CSS settles.
 if(bottom-top<Math.min(115,h*.20)){
  top=h*.18;bottom=h*.74;
 }
 return {w,h,top,bottom,height:bottom-top};
}
function contains(scene,key){return Boolean(scene.textures?.exists?.(key))}
/** Each frame is independent: never sample or borrow pixels from adjacent atlas cells. */
export function infernalFeatherWidth(frameWidth){
 return Math.max(1,Math.min(48,Math.round(frameWidth*.085)));
}
/**
 * The creator-approved atlas includes flames touching the left/right cell boundaries.
 * A per-frame alpha mask makes those hard vertical crop lines disappear WITHOUT
 * regenerating the PNG, changing its SHA-256 or touching gameplay logic.
 * The mask lives in local cell coordinates and follows the sprite's scale/origin.
 */
function softenInfernalEdges(scene,actor,spec){
 if(typeof document==="undefined"||!scene.textures?.addCanvas||!scene.make?.image||!actor.setMask)return null;
 const key="peren-v91-infernal-soft-edges";
 try{
  if(!scene.textures.exists(key)){
   const canvas=document.createElement("canvas");
   canvas.width=spec.width;canvas.height=spec.height;
   const ctx=canvas.getContext("2d");
   if(!ctx)return null;
   const edge=infernalFeatherWidth(spec.width)/spec.width;
   const gradient=ctx.createLinearGradient(0,0,spec.width,0);
   gradient.addColorStop(0,"rgba(255,255,255,0)");
   gradient.addColorStop(edge,"rgba(255,255,255,1)");
   gradient.addColorStop(1-edge,"rgba(255,255,255,1)");
   gradient.addColorStop(1,"rgba(255,255,255,0)");
   ctx.fillStyle=gradient;
   ctx.fillRect(0,0,spec.width,spec.height);
   scene.textures.addCanvas(key,canvas);
  }
  const image=scene.make.image({x:actor.x,y:actor.y,key,add:false})
   .setOrigin(.5,1).setScale(actor.scaleX,actor.scaleY);
  actor.setMask(image.createBitmapMask());
  return ()=>{
   if(actor.active)actor.clearMask(true);
   image.destroy();
  };
 }catch(error){
  console.warn("Infernal edge feather unavailable; original atlas kept",error);
  return null;
 }
}
function useIdle(scene){
 const cfg=CONTRACT.idle;
 if(!contains(scene,cfg.key)||!scene.peren)return null;
 if(!scene.anims.exists("peren-v84-idle-loop"))scene.anims.create({
   key:"peren-v84-idle-loop",frames:scene.anims.generateFrameNumbers(cfg.key,{start:0,end:3}),
   frameRate:cfg.fps,repeat:-1
 });
 const spr=scene.add.sprite(0,0,cfg.key,0).setOrigin(.5,1).setDepth(13);
 spr.play("peren-v84-idle-loop");
 const original=scene.peren;
 original.setVisible(false);
 const relayout=()=>{
  if(!spr.active)return;
  const a=battleArena(scene);
  const mobile=a.w<=620;
  const boundWidth=a.w*(mobile?.46:.38);
  const boundHeight=a.height*.9;
  spr.setPosition(a.w*(mobile?.27:.25),a.bottom-3)
     .setScale(Math.min(boundWidth/cfg.width,boundHeight/cfg.height));
 };
 relayout();
 scene.events.on("update",relayout);
 scene.events.once("shutdown",()=>{
  scene.events.off("update",relayout);
  spr.destroy();
  if(original.active)original.setVisible(true);
 });
 return {sprite:spr,relayout};
}
export function playVisualSequence(scene,id,{base=null}={}){
 const spec=CONTRACT[id];
 if(!spec||!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-asset"});
 const area=battleArena(scene);
 const target=base?.sprite;
 const former=target?.visible??true;
 if(target?.active)target.setVisible(false);
 const compact=area.w<=620;
 const elementalCast=id==="castingFire"||id==="castingIce";
 const actor=scene.add.sprite(area.w*(elementalCast?(compact?.27:.25):(compact?.43:.30)),area.bottom-3,spec.key,0)
  .setOrigin(.5,1).setDepth(22);
 actor.setScale(Math.min(area.w*(elementalCast?(compact?.46:.38):(compact?.84:.64))/spec.width,
  area.height*(elementalCast?.90:.89)/spec.height));
 // The atlas is eight cells, but infernal cell #7 contains a stray skull behind Peren.
 // Never display that source cell; instead dissolve cleanly out of cell #6.
 const renderedFrames=spec.playFrames??spec.frames;
 const delays=spec.durations||Array(renderedFrames).fill(spec.frameMs);
 // Only Infernal needs a spatial crop feather and a temporal fade-out.
 const releaseMask=id==="infernal"?softenInfernalEdges(scene,actor,spec):null;
 return new Promise(resolve=>{
  let current=0,timer=null,fadeTween=null,done=false;
  function complete(reason){
   if(done)return;
   done=true;timer?.remove?.(false);
   fadeTween?.stop?.();
   scene.events.off("shutdown",cancel);
   releaseMask?.();
   if(actor.active)actor.destroy();
   if(target?.active)target.setVisible(former);
   resolve({played:reason==="complete",reason});
  }
  const cancel=()=>complete("shutdown");
  scene.events.once("shutdown",cancel);
  function next(){
   if(done)return;
   if(current>=renderedFrames)return complete("complete");
   actor.setFrame(current);
   let duration=delays[current];
   if(id==="infernal"){
    if(current===renderedFrames-2)actor.setAlpha(.92);
    if(current===renderedFrames-1){
     duration=spec.tailMs||duration;
     // The last image genuinely dissolves instead of disappearing on a timer.
     fadeTween=scene.tweens?.add?.({
      targets:actor,alpha:0,duration,ease:"Sine.easeIn"
     })||null;
    }
   }
   current++;
   timer=scene.time.delayedCall(duration,next);
  }
  next();
 });
}
/** Five source-preserving spark phases near Peren's casting hand (no damage or mana). */
export function playSparksOverlay(scene){
 const spec=CONTRACT.sparks;
 if(!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-sparks"});
 const a=battleArena(scene),compact=a.w<=620;
 // Adjust only the starter spell's sparks: twice the v22 size, shifted
 // exactly 50 Phaser scene pixels right, toward the extended hand's fingertips.
 const sprite=scene.add.sprite(a.w*(compact?.30:.285)+50,a.top+a.height*.39,spec.key,0)
  .setOrigin(.5,.5).setDepth(24);
 const scale=1.20*Math.min(a.w*(compact?.12:.085)/spec.width,a.height*.29/spec.height);
 sprite.setScale(scale);
 return new Promise(resolve=>{
  let current=0,timer=null,done=false;
  const clear=(reason)=>{
   if(done)return;
   done=true;timer?.remove?.(false);scene.events.off("shutdown",cancel);
   if(sprite.active)sprite.destroy();
   resolve({played:reason==="complete",reason});
  };
  const cancel=()=>clear("shutdown");
  scene.events.once("shutdown",cancel);
  function next(){
   if(done)return;
   if(current===spec.frames)return clear("complete");
   sprite.setFrame(current);
   timer=scene.time.delayedCall(spec.durations[current++],next);
  }
  next();
 });
}
/** Three small five-stage flames at the enemy, all anchored at the same lower-center point. */
export function playFlameOverlay(scene){
 const spec=CONTRACT.flame;
 if(!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-flame"});
 const a=battleArena(scene),compact=a.w<=620;
 // One shared lower-center impact point: the two side flames pivot from
 // exactly the same base as the larger central flame.
 const baseX=a.w*(compact?.74:.75);
 const baseY=a.top+a.height*.50;
 const mainScale=Math.min(
  a.w*(compact?.22:.17)/spec.width,
  a.height*.40/spec.height
 );
 const sideScale=mainScale*.82;
 const createFlame=(scale,rotation,depth)=>scene.add.sprite(baseX,baseY,spec.key,0)
  .setOrigin(.5,1).setDepth(depth).setScale(scale).setRotation(rotation).setAlpha(0);
 const center=createFlame(mainScale,0,28);
 const left=createFlame(sideScale,-Math.PI/4,27);
 const right=createFlame(sideScale,Math.PI/4,27);
 const flames=[left,center,right];
 return new Promise(resolve=>{
  let current=0,timer=null,done=false;
  const clear=reason=>{
   if(done)return;
   done=true;timer?.remove?.(false);scene.events.off("shutdown",cancel);
   for(const flame of flames)if(flame.active)flame.destroy();
   resolve({played:reason==="complete",reason});
  };
  const cancel=()=>clear("shutdown");
  scene.events.once("shutdown",cancel);
  function next(){
   if(done)return;
   if(current>=spec.frames)return clear("complete");
   for(const flame of flames)flame.setFrame(current);
   timer=scene.time.delayedCall(spec.durations[current++],next);
  }
  timer=scene.time.delayedCall(spec.delayMs,()=>{
   if(done)return;
   for(const flame of flames)flame.setAlpha(1);
   next();
  });
 });
}
/** Reusable phased, single-use visual overlay: no gameplay state is changed. */
export function playV11FireOverlay(scene,id){
 if(id!=="embers"&&id!=="pupil")return Promise.resolve({played:false,reason:"unknown-effect"});
 const spec=CONTRACT[id];
 if(!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-"+id});
 const area=battleArena(scene),compact=area.w<=620;
 const embers=id==="embers";
 const sprite=scene.add.sprite(
  area.w*(embers?(compact?.53:.58):(compact?.68:.72)),
  area.top+area.height*(embers?.47:.45),spec.key,0
 ).setOrigin(.5,.5).setDepth(embers?25:23);
 sprite.setScale(Math.min(
  area.w*(embers?(compact?.34:.27):(compact?.28:.21))/spec.width,
  area.height*(embers?.71:.82)/spec.height
 ));
 // Stage the blast and pupil after sparks/flame ignition.
 const delayMs=embers?190:330;
 return new Promise(resolve=>{
  let frame=0,timer=null,done=false;
  const finish=reason=>{
   if(done)return;
   done=true;timer?.remove?.(false);
   scene.events.off("shutdown",cancel);
   if(sprite.active)sprite.destroy();
   resolve({played:reason==="complete",reason});
  };
  const cancel=()=>finish("shutdown");
  scene.events.once("shutdown",cancel);
  function next(){
   if(done)return;
   if(frame===spec.frames)return finish("complete");
   sprite.setFrame(frame);
   timer=scene.time.delayedCall(spec.durations[frame++],next);
  }
  // Sprite is held at alpha=0 until the first phase, so the first frame cannot
  // accidentally appear before the scheduled stage of the casting choreography.
  sprite.setAlpha(0);
  timer=scene.time.delayedCall(delayMs,()=>{if(done)return;sprite.setAlpha(1);next()});
 });
}
export const playEmbersOverlay=scene=>playV11FireOverlay(scene,"embers");
export const playPupilOverlay=scene=>playV11FireOverlay(scene,"pupil");
/** A single ring blooms behind the target: 5 source-preserved, staggered frames. */
export function playRingOverlay(scene){
 const spec=CONTRACT.ring;
 if(!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-ring"});
 const a=battleArena(scene),compact=a.w<=620;
 const sprite=scene.add.sprite(a.w*(compact?.72:.73),a.top+a.height*.47,spec.key,0)
  .setOrigin(.5,.5).setDepth(22);
 sprite.setScale(Math.min(a.w*(compact?.43:.29)/spec.width,a.height*.85/spec.height));
 sprite.setAlpha(0);
 return new Promise(resolve=>{
  let frame=0,timer=null,done=false;
  const complete=reason=>{
   if(done)return;
   done=true;timer?.remove?.(false);scene.events.off("shutdown",cancel);
   if(sprite.active)sprite.destroy();
   resolve({played:reason==="complete",reason});
  };
  const cancel=()=>complete("shutdown");
  scene.events.once("shutdown",cancel);
  const next=()=>{
   if(done)return;
   if(frame===spec.frames)return complete("complete");
   sprite.setFrame(frame);
   timer=scene.time.delayedCall(spec.durations[frame++],next);
  };
  timer=scene.time.delayedCall(spec.delayMs,()=>{
   if(done)return;
   sprite.setAlpha(1);next();
  });
 });
}
/** The five phases of the sixth fire effect converge on a fixed target point. */
export function playBurstOverlay(scene){
 const spec=CONTRACT.burst;
 if(!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-burst"});
 const a=battleArena(scene),compact=a.w<=620;
 const sprite=scene.add.sprite(a.w*(compact?.61:.61),a.top+a.height*.43,spec.key,0)
  .setOrigin(.5,.5).setDepth(26);
 sprite.setScale(Math.min(a.w*(compact?.48:.37)/spec.width,a.height*.65/spec.height));
 sprite.setAlpha(0);
 return new Promise(resolve=>{
  let frame=0,timer=null,done=false;
  function complete(reason){
   if(done)return;
   done=true;timer?.remove?.(false);scene.events.off("shutdown",cancel);
   if(sprite.active)sprite.destroy();
   resolve({played:reason==="complete",reason});
  }
  const cancel=()=>complete("shutdown");
  scene.events.once("shutdown",cancel);
  const next=()=>{
   if(done)return;
   if(frame>=spec.frames)return complete("complete");
   sprite.setFrame(frame);
   timer=scene.time.delayedCall(spec.durations[frame++],next);
  };
  timer=scene.time.delayedCall(spec.delayMs,()=>{
   if(done)return;
   sprite.setAlpha(1);next();
  });
 });
}
/** Source-faithful Labareda sweeps forward, with a shared incandescent tip. */
export function playBlazeOverlay(scene){
 const spec=CONTRACT.blaze;
 if(!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-blaze"});
 const area=battleArena(scene),compact=area.w<=620;
 const sprite=scene.add.sprite(area.w*(compact?.61:.61),area.top+area.height*.49,spec.key,0)
  .setOrigin(.5,.5).setDepth(27);
 sprite.setScale(Math.min(area.w*(compact?.51:.40)/spec.width,area.height*.69/spec.height));
 sprite.setAlpha(0);
 return new Promise(resolve=>{
  let frame=0,timer=null,done=false;
  function complete(reason){
   if(done)return;
   done=true;timer?.remove?.(false);scene.events.off("shutdown",cancel);
   if(sprite.active)sprite.destroy();
   resolve({played:reason==="complete",reason});
  }
  const cancel=()=>complete("shutdown");
  scene.events.once("shutdown",cancel);
  function next(){
   if(done)return;
   if(frame>=spec.frames)return complete("complete");
   sprite.setFrame(frame);
   timer=scene.time.delayedCall(spec.durations[frame++],next);
  }
  timer=scene.time.delayedCall(spec.delayMs,()=>{
   if(done)return;
   sprite.setAlpha(1);next();
  });
 });
}
/** Eighth fire layer: residual smoke expands after flame with no gameplay effects. */
export function playSmokeOverlay(scene){
 const spec=CONTRACT.smoke;
 if(!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-smoke"});
 const area=battleArena(scene),compact=area.w<=620;
 const sprite=scene.add.sprite(area.w*(compact?.66:.68),area.top+area.height*.46,spec.key,0)
  .setOrigin(.5,.5).setDepth(28);
 sprite.setScale(Math.min(area.w*(compact?.47:.36)/spec.width,area.height*.66/spec.height));
 sprite.setAlpha(0);
 return new Promise(resolve=>{
  let frame=0,timer=null,done=false;
  function complete(reason){
   if(done)return;
   done=true;timer?.remove?.(false);scene.events.off("shutdown",cancel);
   if(sprite.active)sprite.destroy();
   resolve({played:reason==="complete",reason});
  }
  const cancel=()=>complete("shutdown");
  scene.events.once("shutdown",cancel);
  function next(){
   if(done)return;
   if(frame>=spec.frames)return complete("complete");
   sprite.setFrame(frame);
   timer=scene.time.delayedCall(spec.durations[frame++],next);
  }
  timer=scene.time.delayedCall(spec.delayMs,()=>{
   if(done)return;
   sprite.setAlpha(1);next();
  });
 });
}
/** Corrected skull VFX belongs to the target side, never behind the player. */
export function playHellskullOverlay(scene){
 const spec=CONTRACT.hellskull;
 if(!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-hellskull"});
 const area=battleArena(scene),compact=area.w<=620;
 const sprite=scene.add.sprite(area.w*(compact?.78:.79),area.top+area.height*.43,spec.key,0)
  .setOrigin(.5,.5).setDepth(29);
 sprite.setScale(Math.min(area.w*(compact?.43:.28)/spec.width,area.height*.70/spec.height));
 sprite.setAlpha(0);
 return new Promise(resolve=>{
  let frame=0,timer=null,done=false;
  const complete=reason=>{
   if(done)return;
   done=true;timer?.remove?.(false);scene.events.off("shutdown",cancel);
   if(sprite.active)sprite.destroy();
   resolve({played:reason==="complete",reason});
  };
  const cancel=()=>complete("shutdown");
  scene.events.once("shutdown",cancel);
  function next(){
   if(done)return;
   if(frame>=spec.frames)return complete("complete");
   sprite.setFrame(frame);
   timer=scene.time.delayedCall(spec.durations[frame++],next);
  }
  timer=scene.time.delayedCall(spec.delayMs,()=>{
   if(done)return;
   sprite.setAlpha(1);next();
  });
 });
}
/** Fogo 10: five skull-cloud stages envelop the target after the earlier skull VFX. */
export function playSkullcloudOverlay(scene){
 const spec=CONTRACT.skullcloud;
 if(!contains(scene,spec.key))return Promise.resolve({played:false,reason:"missing-skullcloud"});
 const area=battleArena(scene),compact=area.w<=620;
 const sprite=scene.add.sprite(area.w*(compact?.78:.79),area.top+area.height*.42,spec.key,0)
  .setOrigin(.5,.5).setDepth(30).setFlipX(true);
 sprite.setScale(Math.min(area.w*(compact?.58:.46)/spec.width,area.height*.60/spec.height));
 sprite.setAlpha(0);
 return new Promise(resolve=>{
  let frame=0,timer=null,done=false;
  const complete=reason=>{
   if(done)return;
   done=true;timer?.remove?.(false);scene.events.off("shutdown",cancel);
   if(sprite.active)sprite.destroy();
   resolve({played:reason==="complete",reason});
  };
  const cancel=()=>complete("shutdown");
  scene.events.once("shutdown",cancel);
  function next(){
   if(done)return;
   if(frame>=spec.frames)return complete("complete");
   sprite.setFrame(frame);
   timer=scene.time.delayedCall(spec.durations[frame++],next);
  }
  timer=scene.time.delayedCall(spec.delayMs,()=>{
   if(done)return;
   sprite.setAlpha(1);next();
  });
 });
}
function addScenePortraitGallery(scene,doc){
 const dialog=doc.createElement("dialog");
 dialog.id="peren-v84-portraits-dialog";
 dialog.setAttribute("aria-label","Retratos de Peren — catálogo de cenas");
 dialog.style.cssText="position:fixed;inset:9% 8%;z-index:99999;max-height:82vh;max-width:650px;width:84%;background:#071016;color:#f2dbb1;border:2px solid #ab884f;border-radius:12px;box-shadow:0 0 0 9999px #0009;padding:12px;overflow:auto";
 const heading=doc.createElement("h3");heading.textContent="Peren · Quatro retratos de cena";
 const img=doc.createElement("img");
 img.alt="Retrato de corpo inteiro de Peren";img.style.cssText="display:block;object-fit:contain;width:100%;height:calc(60vh - 40px);";
 img.src=ROOT+CONTRACT.portraits[0];
 const nav=doc.createElement("div");
 nav.style.cssText="display:flex;gap:6px;flex-wrap:wrap";
 CONTRACT.portraits.forEach((p,i)=>{
  const b=doc.createElement("button");b.type="button";b.textContent="Retrato "+(i+1);
  b.addEventListener("click",()=>{img.src=ROOT+p;img.alt="Peren, retrato "+(i+1)});
  nav.append(b)
 });
 const close=doc.createElement("button");close.type="button";close.textContent="Fechar";
 close.addEventListener("click",()=>dialog.close());
 dialog.append(heading,img,nav,close);doc.body.append(dialog);
 scene.events.once("shutdown",()=>{dialog.close?.();dialog.remove()});
 return dialog;
}
function addControls(scene,doc){
 const panel=doc.getElementById("battlePanel");
 if(!panel)return;
 const holder=doc.createElement("div");holder.id="peren-v84-art-controls";
 holder.style.cssText="display:flex;gap:7px;flex-wrap:wrap;margin:7px 0;pointer-events:auto";
 const summon=doc.createElement("button");summon.type="button";
 summon.textContent="✦ Prévia: invocar demônio (sem custo)";
 summon.setAttribute("aria-label","Prévia visual da invocação, sem consumir mana nem iniciar um turno");
 summon.addEventListener("click",async()=>{
  if(scene.busy||scene.__v84PreviewBusy||scene.state?.status!=="active")return;
  scene.__v84PreviewBusy=true;summon.disabled=true;
  try{await playVisualSequence(scene,"summon",{base:scene.__v84Idle})}
  finally{scene.__v84PreviewBusy=false;summon.disabled=false}
 });
 const button=doc.createElement("button");button.type="button";button.textContent="▣ Retratos";
 const dialog=addScenePortraitGallery(scene,doc);
 button.addEventListener("click",()=>dialog.showModal());
 holder.append(summon,button);
 const details=doc.createElement("details");
 details.id="peren-v84-battle-extras";
 details.style.cssText="margin-top:5px;pointer-events:auto";
 const summary=doc.createElement("summary");
 summary.textContent="✦ Cenas e invocações (prévia)";
 summary.style.cssText="cursor:pointer;color:#f1d49f;font:600 12px system-ui;padding:4px 2px";
 details.append(summary,holder);
 panel.append(details);
 scene.events.once("shutdown",()=>{details.remove()});
}
export function installOnBattleScene(scene,{doc=document,sparksEnabled=false,flameEnabled=false,castingFireEnabled=false,castingIceEnabled=false}={}){
 if(scene.__perenV84Installed)return false;
 scene.__perenV84Installed=true;
 const originalPreload=scene.preload;
 scene.preload=function(){
  const assets=[CONTRACT.idle,CONTRACT.infernal,CONTRACT.void,CONTRACT.summon,...(sparksEnabled?[CONTRACT.sparks]:[]),...(flameEnabled?[CONTRACT.flame]:[]),...(castingFireEnabled?[CONTRACT.castingFire]:[]),...(castingIceEnabled?[CONTRACT.castingIce]:[])];
  for(const a of assets)this.load.spritesheet(a.key,a.path||ROOT+a.file,{
    frameWidth:a.width,frameHeight:a.height,endFrame:a.frames-1
  });
  return originalPreload.apply(this,arguments);
 };
 const originalCreate=scene.create;
 scene.create=function(){
  const result=originalCreate.apply(this,arguments);
  this.__v84Idle=useIdle(this);
  addControls(this,doc);
  return result;
 };
 const originalPlayer=scene.animatePlayer;
 scene.animatePlayer=async function(action,events){
  const effect=getAnimationPlan(action);
  if(!effect)return originalPlayer.call(this,action,events);
  // Fire Bolt starts with the new fire-lit Peren sprite, not the grand Infernal cinematic.
  // Missing casting art is non-fatal: keep the idle sprite and basic VFX.
  const fire=effect==="infernal",ice=effect==="castingIce";
  const casterEffect=fire?(castingFireEnabled?"castingFire":null):ice?(castingIceEnabled?"castingIce":null):effect;
  const fireOverlays=fire
   ?FIRE_OVERLAY_PRESET.filter(id=>id==="sparks"?sparksEnabled:flameEnabled)
     .map(id=>id==="sparks"?playSparksOverlay(this):playFlameOverlay(this))
   :[];
  // The bundled Phaser animatePlayer creates a legacy procedural `vfx-fire`
  // sprite for all spell actions containing "fogo". Skip THAT original
  // visual-only call for the basic Fire Bolt. Combat damage, mana,
  // counters and enemy responses belong to takeTurn/stepBattle and stay intact.
  const originalAnimation=fire
   ?Promise.resolve({played:false,reason:"legacy-procedural-fire-suppressed"})
   :originalPlayer.call(this,action,events);
  const results=await Promise.allSettled([
   originalAnimation,
   casterEffect?playVisualSequence(this,casterEffect,{base:this.__v84Idle}):Promise.resolve({played:false,reason:"casting-asset-unavailable"}),
   ...fireOverlays
  ]);
  const failure=results.find(r=>r.status==="rejected");
  if(failure)throw failure.reason;
 };
 const originalTakeTurn=scene.takeTurn;
 scene.takeTurn=function(action){
  if(this.__v84PreviewBusy)return Promise.resolve(false);
  return originalTakeTurn.call(this,action);
 };
 // A player may have opened combat while the versioned manifest was fetched.
 // Hot-hydrate that already-running scene instead of waiting for the next battle.
 if(scene.scene?.isActive?.() && scene.peren && !scene.__v84Idle && scene.load?.spritesheet){
  const assets=[CONTRACT.idle,CONTRACT.infernal,CONTRACT.void,CONTRACT.summon,...(sparksEnabled?[CONTRACT.sparks]:[]),...(flameEnabled?[CONTRACT.flame]:[]),...(castingFireEnabled?[CONTRACT.castingFire]:[]),...(castingIceEnabled?[CONTRACT.castingIce]:[])];
  const hydrate=()=>{
   if(!scene.peren?.active||scene.__v84Idle)return;
   scene.__v84Idle=useIdle(scene);
   addControls(scene,doc);
  };
  if(scene.load.once)scene.load.once("complete",hydrate);
  for(const a of assets)scene.load.spritesheet(a.key,a.path||ROOT+a.file,{
   frameWidth:a.width,frameHeight:a.height,endFrame:a.frames-1
  });
  if(scene.load.start)scene.load.start();
 }
 return true;
}
/** Detect the game after its dynamic catalogs finish booting; no saved state touched. */
export async function bootstrapBattleArt({windowRef=window,doc=document,fetcher=fetch}={}){
 const ready=await checkInstalledAssets(fetcher);
 if(!ready)return {enabled:false,reason:"binary-assets-not-deployed"};
 // Check already published magic-specific character sheets and Fire Bolt effects.
 const [sparksEnabled,flameEnabled,castingFireEnabled,castingIceEnabled]=await Promise.all([
  checkInstalledSparks(fetcher),checkInstalledFlame(fetcher),checkInstalledCastingFire(fetcher),checkInstalledCastingIce(fetcher)
 ]);
 for(let attempts=0;attempts<120;attempts++){
  const game=windowRef.__perenLab;
  if(game?.scene?.getScene){
   try{
    const scene=game.scene.getScene("BattleScene");
    return {enabled:installOnBattleScene(scene,{doc,sparksEnabled,flameEnabled,castingFireEnabled,castingIceEnabled}),reason:"installed",sparksEnabled,flameEnabled,castingFireEnabled,castingIceEnabled};
   }catch{}
  }
  await new Promise(r=>setTimeout(r,100));
 }
 return {enabled:false,reason:"phaser-not-ready"};
}
if(typeof window!=="undefined"&&typeof document!=="undefined"){
 bootstrapBattleArt().then(async result=>{
  window.__perenBattleArtV90=result;
  if(new URLSearchParams(window.location.search).get("debug-battler")==="1"){
   const diagnostic=await diagnoseBattleArt();
   window.__perenBattleArtDiagnosticV90=diagnostic;
   renderBattleArtDiagnostics(document,result,diagnostic);
  }
 }).catch(e=>console.warn("Battle Art v9.0 fallback",e));
}
