import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,getAnimationPlan,checkInstalledIceShards,playIceShardsOverlay,installOnBattleScene} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const prefix="phaser-demo-m1hf/art/battle/runtime-v84/";
const marker=JSON.parse(readFileSync(resolve(root,prefix+"ice-shards-v26.json"),"utf-8"));
const HASH="30466d8902282951b6557220006a4b7b5999abdbf5434b46aefe3d4ab9d8741f";

test("Estilhaços is a real authored five-pose RGBA atlas without height resampling",()=>{
 const path=resolve(root,prefix+"ice-shards-v26.png");
 assert.ok(existsSync(path),"approved five-pose PNG must be committed");
 const buf=readFileSync(path);
 assert.equal(buf.length,1690843);
 assert.equal(buf.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(buf.readUInt32BE(16),2240);
 assert.equal(buf.readUInt32BE(20),682);
 assert.equal(buf[25],6,"PNG color type 6 = RGBA, transparent");
 assert.equal(createHash("sha256").update(buf).digest("hex"),HASH);
 assert.equal(marker.sha256,HASH);
 assert.equal(marker.schema,"peren-ice-shards-v26");
 assert.equal(marker.asset,"ice-shards-v26.png");
 assert.equal(marker.frames,5);
 assert.deepEqual(marker.frameSize,[448,682]);
 assert.deepEqual(marker.dimensions,[2240,682]);
 assert.deepEqual(marker.source.columnCuts,[0,420,820,1238,1660,2048]);
 assert.equal(marker.source.sha256,"c9d3e46ac48eeea0254ced1a24f34d37920cbefad5feae07c69014714e700e20");
});

test("basic Ice Bolt uses Peren's existing Ice caster and only one five-step hit effect",()=>{
 assert.equal(getAnimationPlan("spell:mag-raio-de-gelo"),"castingIce");
 assert.equal(getAnimationPlan("spell:mag-raio-de-fogo"),"infernal");
 assert.equal(getAnimationPlan("spell:mag-escuridao"),"castingDarkness");
 assert.equal(getAnimationPlan("spell:mag-misseis-magicos"),"void");
 assert.deepEqual([CONTRACT.castingIce.frames,CONTRACT.castingIce.width,CONTRACT.castingIce.height],[4,512,682]);
 const shards=CONTRACT.iceShards;
 assert.deepEqual([shards.width,shards.height,shards.frames],[448,682,5]);
 assert.deepEqual(shards.durations,[115,135,165,185,205]);
 assert.equal(shards.delayMs,345);
 assert.equal(shards.delayMs+shards.durations.reduce((a,b)=>a+b,0),1150,"effect ends with 1,150ms Ice caster");
});

test("actual target bounds anchor five Estilhaços frames without a second effect",async()=>{
 const positions=[],alphas=[],frames=[],durations=[],queue=[],created=[];
 const sprite={active:true,setOrigin(x,y){this.origin=[x,y];return this},
  setDepth(x){this.depth=x;return this},setScale(x){this.scale=x;return this},
  setAlpha(x){alphas.push(x);return this},setFrame(x){frames.push(x);return this},
  destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},
  enemySprite:{active:true,x:700,y:200,displayWidth:90,getBounds(){return{centerX:681,centerY:314,width:120}}},
  textures:{exists:key=>key===CONTRACT.iceShards.key},
  add:{sprite:(x,y,key,frame)=>{positions.push([x,y]);created.push([key,frame]);return sprite}},
  events:{once(){},off(){}},time:{delayedCall(ms,cb){durations.push(ms);queue.push(cb);return{remove(){}}}}};
 const task=playIceShardsOverlay(scene);
 assert.deepEqual(created,[[CONTRACT.iceShards.key,0]]);
 assert.deepEqual(positions,[[681,314]],"impact must use enemy bounds, not caster or viewport center");
 assert.deepEqual(sprite.origin,[.5,.5]);
 assert.equal(sprite.depth,29);
 assert.deepEqual(alphas,[0]);
 for(let step=0;step<6;step++){const next=queue.shift();assert.equal(typeof next,"function");next()}
 assert.deepEqual(await task,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3,4]);
 assert.deepEqual(durations,[345,115,135,165,185,205]);
 assert.deepEqual(alphas,[0,1]);
 assert.equal(sprite.active,false);
});

test("fallback still targets right-hand monster slot if the battler exposes no enemy sprite",async()=>{
 const pos=[],queue=[];
 const actor={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
  setAlpha(){return this},setFrame(){return this},destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:()=>true},add:{sprite:(x,y)=>{pos.push([x,y]);return actor}},
  events:{once(){},off(){}},time:{delayedCall(ms,cb){queue.push(cb);return{remove(){}}}}};
 const task=playIceShardsOverlay(scene);
 for(let i=0;i<6;i++)queue.shift()();
 await task;
 assert.equal(pos[0][0],900*.75,"never place Estilhaços over Peren");
});

test("unavailable or tampered shards fail safely; offline CacheStorage is supported",async()=>{
 const valid=async(url,opts)=>opts?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 const absent=async(url,opts)=>opts?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 const broken=async(url,opts)=>opts?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>({...marker,sha256:"0".repeat(64)})};
 assert.equal(await checkInstalledIceShards(valid,null),true);
 assert.equal(await checkInstalledIceShards(absent,null),false);
 assert.equal(await checkInstalledIceShards(broken,null),false);
 assert.equal(await checkInstalledIceShards(absent,{match:async()=>({ok:true,status:200})}),true);
});

test("Raio de Gelo never invokes bundled procedural VFX; damage state machine untouched",async()=>{
 const animations=[],turns=[];
 const scene={preload(){},create(){},animatePlayer(action){animations.push(action);return Promise.resolve("old-vfx")},
   takeTurn(action){turns.push(action);return Promise.resolve(true)},
   textures:{exists:()=>false},events:{once(){},off(){}},scene:{isActive:()=>false}};
 assert.equal(installOnBattleScene(scene,{doc:{getElementById(){return null}},iceShardsEnabled:false,castingIceEnabled:false}),true);
 await scene.animatePlayer("spell:mag-raio-de-gelo",[]);
 await scene.animatePlayer("spell:mag-raio-de-fogo",[]);
 assert.deepEqual(animations,[],"no procedural ice or fire is allowed");
 await scene.animatePlayer("attack",[]);
 assert.deepEqual(animations,["attack"],"physical attack remains unchanged");
 assert.equal(await scene.takeTurn("spell:mag-raio-de-gelo"),true);
 assert.deepEqual(turns,["spell:mag-raio-de-gelo"],"combat rules remain intact");
});

test("PWA caches the original Estilhaços PNG, integrity marker and the ice caster",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf-8");
 assert.match(sw,/preview-magic-ice-shards-v26-20261027/);
 const paths=JSON.parse(sw.match(/const FILES=(\[[^\n]+\]);/)[1]);
 for(const path of [
  "./art/battle/runtime-v84/ice-shards-v26.png",
  "./art/battle/runtime-v84/ice-shards-v26.json",
  "./art/characters/peren/battler/casting/peren-casting-ice.png"
 ]) assert.ok(paths.includes(path),"missing precached "+path);
 assert.equal(new Set(paths).size,paths.length);
});
