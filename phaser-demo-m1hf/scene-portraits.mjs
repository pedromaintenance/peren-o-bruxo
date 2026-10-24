/** Peren v6 scene portrait catalog. No network loads until the binary pack is installed.
 * Portable between future dialogue scenes, story screens and battle cut-ins.
 * This module does not alter combat rules or save state.
 */
export const PEREN_SCENE_PORTRAITS=Object.freeze([
 Object.freeze({id:"peren.scene.frontal",file:"portrait_01.png",label:"Frontal",tags:["neutral","dialogue"]}),
 Object.freeze({id:"peren.scene.manto",file:"portrait_02.png",label:"Manto em movimento",tags:["wind","travel"]}),
 Object.freeze({id:"peren.scene.orbe",file:"portrait_03.png",label:"Orbe astral",tags:["conjuration","focus"]}),
 Object.freeze({id:"peren.scene.invocacao",file:"portrait_04.png",label:"Mão estendida",tags:["invocation","dialogue"]})
]);
export const PEREN_PORTRAIT_BASE="./art/characters/peren/scenes/portraits/";
export const PEREN_PORTRAIT_SIZE=Object.freeze({width:362,height:1086});

/** Supply a known id; never construct a path from untrusted dialogue strings. */
export function scenePortrait(id){
 return PEREN_SCENE_PORTRAITS.find(p=>p.id===id)||null;
}
/** URL is relative to the /phaser-demo-m1hf/ document, not relative to the JS file. */
export function scenePortraitSrc(id){
 const entry=scenePortrait(id);
 return entry?PEREN_PORTRAIT_BASE+entry.file:null;
}
/** Only invoke once the images have been committed and manifest importStatus is complete.
 * By default does not request any missing resources, avoiding broken PWA installs.
 */
export function queuePerenScenePortraits(scene,{assetsInstalled=false}={}){
 if(!assetsInstalled)return 0;
 if(!scene?.load?.image)throw new TypeError("Phaser.Scene loader required");
 for(const entry of PEREN_SCENE_PORTRAITS){
  scene.load.image(entry.id,scenePortraitSrc(entry.id));
 }
 return PEREN_SCENE_PORTRAITS.length;
}
/** Preserve aspect ratio in dialogue, story scenes and cut-ins. */
export function fitScenePortrait(containerWidth,containerHeight,padding=0){
 const width=Math.max(0,Number(containerWidth)||0)-2*padding;
 const height=Math.max(0,Number(containerHeight)||0)-2*padding;
 const scale=Math.max(0,Math.min(width/PEREN_PORTRAIT_SIZE.width,height/PEREN_PORTRAIT_SIZE.height));
 return {scale,width:PEREN_PORTRAIT_SIZE.width*scale,height:PEREN_PORTRAIT_SIZE.height*scale};
}
