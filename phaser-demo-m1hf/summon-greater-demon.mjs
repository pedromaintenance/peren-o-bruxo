/** Presentation-only Phaser 3 integration of Summon Greater Demon.
 * Animates eight supplied RGBA cells with exact source frame timings.
 * No spell, HP/MP, battle, inventory or save side effects.
 */
export const SUMMON_GREATER_DEMON=Object.freeze({
 id:"peren-summon-greater-demon",textureKey:"peren-summon-greater-demon-v1",
 sourcePath:"./art/characters/peren/battler/summon_greater_demon/atlases/peren_summon_greater_demon_4x2_512.png",
 frameWidth:512,frameHeight:512,frames:8,
 durationsMs:Object.freeze([190,210,250,300,330,400,380,320]),
 totalDurationMs:2380,repeat:0,origin:Object.freeze([0.5,1])
});
export function summonTimeline(ms){
 if(!Number.isFinite(ms))throw new TypeError("Elapsed ms must be finite");
 if(ms>=2380)return{frame:7,done:true};
 let remaining=Math.max(0,ms);
 for(let i=0;i<8;i++){if(remaining<SUMMON_GREATER_DEMON.durationsMs[i])return{frame:i,done:false};remaining-=SUMMON_GREATER_DEMON.durationsMs[i];}
 return{frame:7,done:true};
}
/** Preload only after real PNG binaries have been deployed. */
export function preloadSummonGreaterDemon(scene,{assetsInstalled=false,url=SUMMON_GREATER_DEMON.sourcePath}={}){
 if(!assetsInstalled)return false;
 if(!scene?.load?.spritesheet)throw new TypeError("Phaser scene loader required");
 scene.load.spritesheet(SUMMON_GREATER_DEMON.textureKey,url,{frameWidth:512,frameHeight:512,endFrame:7});
 return true;
}
/** Overlay the single-image composition, then restore the pre-existing battler idle.
 * Caller owns action selection and all rules. Falls back safely if texture missing.
 */
export function playSummonGreaterDemon(scene,actor,{sizeRatio=0.65}={}){
 const asset=SUMMON_GREATER_DEMON;
 if(!scene?.textures?.exists?.(asset.textureKey))return Promise.resolve({played:false,reason:"asset-missing"});
 if(!actor||typeof actor.setVisible!=="function")return Promise.reject(new TypeError("Battle actor required"));
 const visible=actor.visible,width=Number(scene.scale?.width)||390,height=Number(scene.scale?.height)||844;
 const scale=Math.min((width*.55)/512,(height*Math.min(Math.max(sizeRatio,.2),.9))/512);
 const overlay=scene.add.sprite(actor.x,actor.y,asset.textureKey,0)
  .setOrigin(.5,1).setScale(scale).setDepth((actor.depth||12)+1);
 actor.setVisible(false);
 return new Promise(resolve=>{
  let finished=false,timer=null;
  function finish(reason){
   if(finished)return;
   finished=true;timer?.remove?.(false);scene.events?.off?.("shutdown",interrupted);
   if(overlay.active)overlay.destroy();
   if(actor.active!==false)actor.setVisible(visible);
   resolve({played:reason==="complete",reason});
  }
  const interrupted=()=>finish("scene-shutdown");
  scene.events?.once?.("shutdown",interrupted);
  function advance(index){
   if(finished)return;
   if(index===8)return finish("complete");
   overlay.setFrame(index);
   timer=scene.time.delayedCall(asset.durationsMs[index],()=>advance(index+1));
  }
  advance(0);
 });
}
