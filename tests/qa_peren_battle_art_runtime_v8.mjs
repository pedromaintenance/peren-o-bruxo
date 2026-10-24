import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {
 CONTRACT,CINEMATIC_ACTIONS,getAnimationPlan,validateAssetMarker,
 checkInstalledAssets,playVisualSequence,installOnBattleScene,bootstrapBattleArt
} from "../phaser-demo-m1hf/battle-art-runtime-v8.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=(path)=>readFileSync(resolve(root,path),"utf8");
const marker={schema:"peren-battle-art-v8",verified:true,
 files:["idle.png","infernal.png","void.png","summon.png",...CONTRACT.portraits]
 .map(path=>({path,sha256:"a".repeat(64)}))};
test("art director is opt-in and ignores missing or corrupt asset packs",async()=>{
 assert.equal(validateAssetMarker(marker),true);
 assert.equal(validateAssetMarker({...marker,verified:false}),false);
 assert.equal(validateAssetMarker({...marker,files:marker.files.slice(1)}),false);
 assert.equal(await checkInstalledAssets(async()=>({ok:false})),false);
 assert.equal(await checkInstalledAssets(async()=>({ok:true,json:async()=>marker})),true);
 const disabled=await bootstrapBattleArt({
  windowRef:{},doc:{},fetcher:async()=>({ok:false})
 });
 assert.deepEqual(disabled,{enabled:false,reason:"binary-assets-not-deployed"});
});
test("existing spell commands retain their mechanics and gain optional art only",()=>{
 assert.equal(getAnimationPlan("spell:mag-raio-de-fogo"),"infernal");
 assert.equal(getAnimationPlan("spell:mag-misseis-magicos"),"void");
 assert.equal(getAnimationPlan("spell:mag-raio-de-gelo"),null);
 assert.equal(getAnimationPlan("attack"),null);
 assert.equal(getAnimationPlan("spell:mag-summon-greater-demon"),null);
 assert.equal(CINEMATIC_ACTIONS["spell:mag-summon-greater-demon"],undefined);
 const source=read("phaser-demo-m1hf/assets/game-B5Gp97dd.js");
 assert.match(source,/function Di\(/);
 assert.match(read("phaser-demo-m1hf/index.html"),/battle-art-runtime-v90\.mjs/);
 assert.match(read("phaser-demo-m1hf/demo-sw.js"),/battle-art-runtime-v90\.mjs/);
});
test("frames are shown and original battler restored after visual choreography",async()=>{
 const queue=[],shown=[],visibility=[];
 const original={visible:true,active:true,setVisible(v){visibility.push(v);this.visible=v}};
 const actor={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
  setFrame(v){shown.push(v);return this},destroy(){this.active=false}};
 const callbacks=new Map();
 const scene={textures:{exists:()=>true},scale:{width:390,height:844},
  add:{sprite:()=>actor},events:{
   once:(k,v)=>callbacks.set(k,v),off:(k,v)=>{if(callbacks.get(k)===v)callbacks.delete(k)}
  },
  time:{delayedCall:(ms,cb)=>{queue.push({ms,cb});return{remove(){}}}}};
 const pending=playVisualSequence(scene,"summon",{base:{sprite:original}});
 let elapsed=0;
 for(let i=0;i<8;i++){
  const step=queue[i];assert.equal(step.ms,CONTRACT.summon.durations[i]);
  elapsed+=step.ms;step.cb();
 }
 assert.deepEqual(await pending,{played:true,reason:"complete"});
 assert.deepEqual(shown,[0,1,2,3,4,5,6,7]);
 assert.deepEqual(visibility,[false,true]);
 assert.equal(elapsed,2380);
 assert.equal(actor.active,false);
});
test("battle hooks preload all four verified spritesheets and preserve original handlers",()=>{
 const loaded=[],original={preload(){return "legacy-preload";},
 create(){return "legacy-create"},animatePlayer(){return Promise.resolve("legacy-anim")},
 takeTurn(){return Promise.resolve("legacy-turn")}};
 const scene={...original,load:{spritesheet:(...args)=>loaded.push(args)},
 textures:{exists:()=>false}};
 assert.equal(installOnBattleScene(scene,{doc:{}}),true);
 assert.equal(installOnBattleScene(scene,{doc:{}}),false);
 assert.equal(scene.preload(),"legacy-preload");
 assert.equal(loaded.length,4);
 for(let i=0;i<4;i++){
  assert.equal(loaded[i][0],Object.values(CONTRACT)[i].key);
  assert.equal(loaded[i][2].endFrame,Object.values(CONTRACT)[i].frames-1);
 }
});
test("missing texture never blocks a turn or touches hero",async()=>{
 const out=await playVisualSequence({textures:{exists:()=>false}},"summon",{base:null});
 assert.deepEqual(out,{played:false,reason:"missing-asset"});
});

test("asset marker enables the real BattleScene bridge exactly once",async()=>{
 const scene={preload(){return "legacy"},create(){return undefined},
  animatePlayer(){return Promise.resolve()},takeTurn(){return Promise.resolve(true)}};
 const result=await bootstrapBattleArt({
  windowRef:{__perenLab:{scene:{getScene:name=>{assert.equal(name,"BattleScene");return scene}}}},
  doc:{},fetcher:async()=>({ok:true,json:async()=>marker})
 });
 assert.deepEqual(result,{enabled:true,reason:"installed"});
 assert.equal(scene.__perenV8Installed,true);
 assert.equal(installOnBattleScene(scene,{doc:{}}),false);
});
test("combat gameplay source is unchanged; battle art only overlays events",()=>{
 const js=read("phaser-demo-m1hf/battle-art-runtime-v8.mjs");
 assert.doesNotMatch(js,/localStorage|sessionStorage|ledger\s*\[|\.finishBattle\(|\.stepBattle\(/);
 assert.match(js,/Promise\.allSettled/);
 assert.match(js,/this\.__v8PreviewBusy/);
 assert.match(js,/preload\s*=function/);
});
