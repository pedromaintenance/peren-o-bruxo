/**
 * Peren v9.0: refined infernal art bridge for the distributed Phaser preview.
 *
 * DOES NOT modify stepBattle, health, mana, inventory or persisted saves.
 * Only installs if a verified battle-asset-pack-v90.json marker and all PNGs are deployed.
 * Thus the public build remains safe until PNGs actually reach GitHub Pages.
 */
const ROOT="./art/battle/runtime-v84/";
export const CONTRACT=Object.freeze({
 idle:{key:"peren-v84-idle",file:"idle.png",width:560,height:821,frames:4,fps:4},
 infernal:{key:"peren-v90-infernal",file:"infernal-v90.png",width:512,height:341,frames:8,frameMs:180},
 void:{key:"peren-v84-void",file:"void.png",width:640,height:362,frames:11,frameMs:135},
 summon:{key:"peren-v84-summon",file:"summon.png",width:512,height:512,frames:8,
  durations:[190,210,250,300,330,400,380,320]},
 portraits:["portrait_01.png","portrait_02.png","portrait_03.png","portrait_04.png"]
});
export const CINEMATIC_ACTIONS=Object.freeze({
 "spell:mag-raio-de-fogo":"infernal",
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
 const url=ROOT+file;
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
 const actor=scene.add.sprite(area.w*(compact?.43:.30),area.bottom-3,spec.key,0)
  .setOrigin(.5,1).setDepth(22);
 actor.setScale(Math.min(area.w*(compact?.84:.64)/spec.width,area.height*.89/spec.height));
 const delays=spec.durations||Array(spec.frames).fill(spec.frameMs);
 return new Promise(resolve=>{
  let current=0,timer=null,done=false;
  function complete(reason){
   if(done)return;
   done=true;timer?.remove?.(false);
   scene.events.off("shutdown",cancel);
   if(actor.active)actor.destroy();
   if(target?.active)target.setVisible(former);
   resolve({played:reason==="complete",reason});
  }
  const cancel=()=>complete("shutdown");
  scene.events.once("shutdown",cancel);
  function next(){
   if(done)return;
   if(current>=spec.frames)return complete("complete");
   actor.setFrame(current);
   timer=scene.time.delayedCall(delays[current++],next);
  }
  next();
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
export function installOnBattleScene(scene,{doc=document}={}){
 if(scene.__perenV84Installed)return false;
 scene.__perenV84Installed=true;
 const originalPreload=scene.preload;
 scene.preload=function(){
  const assets=[CONTRACT.idle,CONTRACT.infernal,CONTRACT.void,CONTRACT.summon];
  for(const a of assets)this.load.spritesheet(a.key,ROOT+a.file,{
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
  // Concurrently retain normal gameplay choreography, hits and HUD.
  const results=await Promise.allSettled([
   originalPlayer.call(this,action,events),
   playVisualSequence(this,effect,{base:this.__v84Idle})
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
  const assets=[CONTRACT.idle,CONTRACT.infernal,CONTRACT.void,CONTRACT.summon];
  const hydrate=()=>{
   if(!scene.peren?.active||scene.__v84Idle)return;
   scene.__v84Idle=useIdle(scene);
   addControls(scene,doc);
  };
  if(scene.load.once)scene.load.once("complete",hydrate);
  for(const a of assets)scene.load.spritesheet(a.key,ROOT+a.file,{
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
 for(let attempts=0;attempts<120;attempts++){
  const game=windowRef.__perenLab;
  if(game?.scene?.getScene){
   try{
    const scene=game.scene.getScene("BattleScene");
    return {enabled:installOnBattleScene(scene,{doc}),reason:"installed"};
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
