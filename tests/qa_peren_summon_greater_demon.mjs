import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
import {SUMMON_GREATER_DEMON,summonTimeline,preloadSummonGreaterDemon,playSummonGreaterDemon} from "../phaser-demo-m1hf/summon-greater-demon.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const pack=JSON.parse(readFileSync(resolve(root,"phaser-demo-m1hf/art/characters/peren/battler/summon_greater_demon/manifest.json"),"utf8"));
test("matches original source manifest and exact timings",()=>{
 assert.equal(pack.frames.length,8);
 assert.deepEqual(pack.frameSize,[512,512]);
 assert.deepEqual(pack.atlasSize,[2048,1024]);
 assert.equal(SUMMON_GREATER_DEMON.totalDurationMs,2380);
 assert.deepEqual(pack.frames.map(x=>x.durationMs),SUMMON_GREATER_DEMON.durationsMs);
 assert.deepEqual(summonTimeline(189),{frame:0,done:false});
 assert.deepEqual(summonTimeline(190),{frame:1,done:false});
 assert.deepEqual(summonTimeline(2060),{frame:7,done:false});
 assert.deepEqual(summonTimeline(2380),{frame:7,done:true});
 assert.equal(pack.runtimeStatus,"adapter-available-not-activated");
 assert.match(pack.mechanics,/no new spell/);
});
test("missing image is fail-safe and does not touch battle actor",async()=>{
 const actor={visible:true,setVisible(){throw Error("Actor must not be touched")}};
 assert.equal(preloadSummonGreaterDemon(null),false);
 assert.deepEqual(await playSummonGreaterDemon({textures:{exists:()=>false}},actor),{played:false,reason:"asset-missing"});
});
test("runtime stages exactly eight frames, then restores idle",async()=>{
 let time=0;const callbacks=[],frames=[],visibility=[];
 const sprite={active:true,setOrigin(){return this},setScale(){return this},setDepth(){return this},setFrame(n){frames.push(n)},destroy(){this.active=false}};
 const actor={x:5,y:6,depth:12,visible:true,active:true,setVisible(v){visibility.push(v);this.visible=v}};
 const scene={textures:{exists:()=>true},scale:{width:390,height:844},add:{sprite:()=>sprite},
 events:{once:()=>{},off:()=>{}},time:{delayedCall:(ms,fn)=>{callbacks.push({ms,fn});return{remove:()=>{}}}}};
 const run=playSummonGreaterDemon(scene,actor);
 for(let i=0;i<8;i++){const step=callbacks[i];assert.equal(step.ms,SUMMON_GREATER_DEMON.durationsMs[i]);time+=step.ms;step.fn()}
 assert.deepEqual(await run,{played:true,reason:"complete"});
 assert.equal(time,2380);
 assert.deepEqual(frames,[0,1,2,3,4,5,6,7]);
 assert.deepEqual(visibility,[false,true]);
 assert.equal(sprite.active,false);
});
