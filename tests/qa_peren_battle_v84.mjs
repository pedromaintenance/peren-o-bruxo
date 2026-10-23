import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {CONTRACT,CINEMATIC_ACTIONS,getAnimationPlan,validateAssetMarker,checkInstalledAssets,playVisualSequence,installOnBattleScene,bootstrapBattleArt} from "../phaser-demo-m1hf/battle-art-runtime-v84.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(root,p),"utf8");
const required=["idle.png","infernal.png","void.png","summon.png",...CONTRACT.portraits];
const manifest={schema:"peren-battle-art-v84",verified:true,version:"8.4.0",files:required.map(path=>({path,sha256:"a".repeat(64)}))};
test("v8.4 contracts fit actual 4x2/4x3 sprite atlases",()=>{
 assert.equal(CONTRACT.idle.width,560);
 assert.equal(CONTRACT.idle.frames,4);
 assert.equal(CONTRACT.infernal.width,512);
 assert.equal(CONTRACT.infernal.frames,8);
 assert.equal(CONTRACT.void.width,640);
 assert.equal(CONTRACT.void.frames,11);
 assert.equal(CONTRACT.summon.frames,8);
 assert.equal(CONTRACT.summon.durations.reduce((a,b)=>a+b,0),2380);
 assert.deepEqual(CINEMATIC_ACTIONS,{"spell:mag-raio-de-fogo":"infernal","spell:mag-misseis-magicos":"void"});
 assert.equal(getAnimationPlan("spell:mag-raio-de-gelo"),null);
 assert.equal(getAnimationPlan("spell:mag-summon-greater-demon"),null);
});
test("no partial deploy: all eight PNG paths must exist before patching Phaser",async()=>{
 assert.equal(validateAssetMarker(manifest),true);
 assert.equal(validateAssetMarker({...manifest,files:manifest.files.slice(0,7)}),false);
 assert.equal(validateAssetMarker({...manifest,schema:"peren-battle-art-v81"}),false);
 const yes=async(url,opts)=>opts?.method==="HEAD"?{ok:true}:{ok:true,json:async()=>manifest};
 const fail=async(url,opts)=>opts?.method==="HEAD"&&url.includes("void.png")?{ok:false}:{ok:true,json:async()=>manifest};
 assert.equal(await checkInstalledAssets(yes),true);
 assert.equal(await checkInstalledAssets(fail),false);
 assert.equal(await checkInstalledAssets(async()=>({ok:false})),false);
 assert.deepEqual(await bootstrapBattleArt({windowRef:{},doc:{},fetcher:async()=>({ok:false})}),{enabled:false,reason:"binary-assets-not-deployed"});
});
test("battle bridge preloads precisely the verified sprites and retains gameplay",()=>{
 const loaded=[];
 const scene={preload(){return "original"},create(){},animatePlayer(){return Promise.resolve()},takeTurn(){return true},
  scene:{isActive:()=>false},load:{spritesheet:(...x)=>loaded.push(x)}};
 assert.equal(installOnBattleScene(scene,{doc:{}}),true);
 assert.equal(scene.preload(),"original");
 assert.deepEqual(loaded.map(x=>x[0]),[CONTRACT.idle.key,CONTRACT.infernal.key,CONTRACT.void.key,CONTRACT.summon.key]);
 assert.deepEqual(loaded.map(x=>x[2].endFrame),[3,7,10,7]);
 assert.equal(installOnBattleScene(scene,{doc:{}}),false);
});
test("late loading can recover an active encounter without restarting or modifying stats",()=>{
 let started=0,finished;
 const loaded=[];
 const mock={active:true,visible:true,setVisible(v){this.visible=v}};
 const scene={peren:mock,preload(){},create(){},animatePlayer(){return Promise.resolve()},takeTurn(){return true},
  scene:{isActive:()=>true},load:{spritesheet:(...x)=>loaded.push(x),once:(event,fn)=>{if(event==="complete")finished=fn},start(){started++}}};
 installOnBattleScene(scene,{doc:{}});
 assert.equal(started,1);
 assert.equal(loaded.length,4);
 assert.equal(typeof finished,"function");
});
test("infernal and Void Rift remain presentation-only wrappers, not new mechanics",()=>{
 const s=read("phaser-demo-m1hf/battle-art-runtime-v84.mjs");
 assert.doesNotMatch(s,/localStorage|sessionStorage|\.finishBattle\(|\.stepBattle\(/);
 assert.match(s,/Promise\.allSettled/);
 assert.match(s,/this\.__v84PreviewBusy/);
 assert.match(read("phaser-demo-m1hf/index.html"),/battle-art-runtime-v84\.mjs/);
 assert.match(read("phaser-demo-m1hf/demo-sw.js"),/battler-v84/);
});
test("Summon still restores visible idle after exact 2380 ms",async()=>{
 const ms=[],frames=[],queue=[];
 const target={visible:true,active:true,setVisible(x){this.visible=x}};
 const spr={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},setFrame(i){frames.push(i)},destroy(){this.active=false}};
 const scene={scale:{width:390,height:844},textures:{exists:()=>true},
  add:{sprite:()=>spr},events:{once(){},off(){}},
  time:{delayedCall:(t,cb)=>{ms.push(t);queue.push(cb);return{remove(){}}}}};
 const task=playVisualSequence(scene,"summon",{base:{sprite:target}});
 for(let i=0;i<8;i++)queue[i]();
 assert.deepEqual(await task,{played:true,reason:"complete"});
 assert.equal(ms.reduce((a,b)=>a+b,0),2380);
 assert.deepEqual(frames,[0,1,2,3,4,5,6,7]);
 assert.equal(target.visible,true);
});
