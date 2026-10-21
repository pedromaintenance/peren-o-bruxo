import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {runInNewContext} from "node:vm";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const bundle=readFileSync(resolve(root,"phaser-demo-m1hf/assets/game-B5Gp97dd.js"),"utf8");
const page=readFileSync(resolve(root,"phaser-demo-m1hf/peren-arte.html"),"utf8");
const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
function method(before,after,name,globals={}){
 const a=bundle.indexOf(before),b=bundle.indexOf(after,a);
 assert.ok(a>0&&b>a,"Missing "+name);
 const js=bundle.slice(a,b).replace(new RegExp("^"+name+"\\(\\)"),"function "+name+"()");
 return runInNewContext(js+";"+name,globals);
}

test("Phaser registers four single-shot gather animations with precise frame durations",()=>{
 assert.match(bundle,/spritesheet\("peren-herb-gather",Xi\+"peren-herb-gather\.png"/);
 const videos=[];
 const a={exists:()=>false,generateFrameNumbers:(key,{start,end})=>Array.from({length:end-start+1},(_,i)=>({key,frame:start+i})),create:o=>videos.push(o)};
 const animsForPeren=method("animsForPeren(){","playState(X){","animsForPeren",{Vi:{down:0,left:1,right:2,up:3},Yi:["idle","walk","run","interact","gather","hurt","cast","attack"]});
 animsForPeren.call({anims:a});
 for(const [direction,row]of Object.entries({down:0,left:1,right:2,up:3})){
  const clip=videos.find(x=>x.key==="peren-herb-"+direction+"-gather");
  assert.ok(clip, direction+" missing");
  assert.equal(clip.repeat,0);
  assert.equal(clip.frameRate,4);
  assert.deepEqual(Array.from(clip.frames,x=>x.frame),[row*4,row*4+1,row*4+2,row*4+3]);
  assert.deepEqual(Array.from(clip.frames,x=>x.duration+250),[350,250,450,850]);
  assert.ok(clip.frames.every(x=>x.key==="peren-herb-gather"));
 }
 assert.equal(videos.length,40,"32 base + 4 wounded + 4 herb animations");
});
function runCollection(node){
 const trace=[],handlers=[];
 const progress={execute:p=>trace.push(["execute",p]),combatProfile:()=>({hp:114}),read:()=>({revision:1})};
 const registry={get:k=>k==="progressBridge"?progress:k==="collected"?{}:null,set:(...args)=>trace.push(["set",...args])};
 const actor={
  isGathering:false,world:{seed:"murin-001"},direction:"left",
  player:{x:0,y:0,setVelocity:()=>{},anims:{play:key=>trace.push(["anim",key])},once:(evt,cb)=>handlers.push(cb)},
  registry,game:{events:{emit:()=>{}}},collected:new Set(),resources:new Map(),playState:a=>trace.push(["fallback",a])
 };
 const collect=method("collect(){if(this.isGathering)","command(X){","collect",{ke:()=>node,Rt:{Animations:{Events:{ANIMATION_COMPLETE:"complete"}}}});
 return {actor,trace,handlers,collect:()=>collect.call(actor)};
}
test("Herbs animate before reward, only once, and preserve normal transaction/save flow",()=>{
 const h=runCollection({id:"herb-1",sprite:"herb",itemId:"ing-nirnroot",name:"Raiz Velada",count:2});
 h.collect();
 assert.deepEqual(h.trace.filter(x=>x[0]==="anim"),[["anim","peren-herb-left-gather"]]);
 assert.equal(h.trace.filter(x=>x[0]==="execute").length,0);
 assert.equal(h.actor.isGathering,true);
 h.collect();assert.equal(h.handlers.length,1);
 h.handlers[0]();
 assert.equal(h.trace.filter(x=>x[0]==="execute").length,1);
 assert.equal(h.trace.find(x=>x[0]==="execute")[1].nodeId,"herb-1");
 assert.ok(h.actor.collected.has("herb-1"));
 assert.equal(h.actor.isGathering,false);
 h.handlers[0]();assert.equal(h.trace.filter(x=>x[0]==="execute").length,1,"no duplicate reward");
});
test("Mushrooms remain generic: green herb cannot represent fungal loot",()=>{
 const f=runCollection({id:"mush-2",sprite:"mushroom",itemId:"ing-imp-stool",name:"Cogumelo do Imp",count:1});
 f.collect();
 assert.deepEqual(f.trace.filter(x=>x[0]==="fallback"),[["fallback","gather"]]);
 assert.equal(f.trace.filter(x=>x[0]==="anim").length,0);
 assert.equal(f.trace.filter(x=>x[0]==="execute").length,0);
 f.handlers[0]();assert.equal(f.trace.filter(x=>x[0]==="execute").length,1);
});
test("Gallery shows original 4-stage gesture and cache includes all assets",()=>{
 for(const x of ['value="gather"','id="replayGather"','peren-coleta-runtime-4x4-48x64.png','elapsed<350?0:elapsed<600?1:elapsed<1050?2:3'])
  assert.ok(page.includes(x),x);
 const files=JSON.parse(sw.match(/const FILES=(\[[^\n]+\]);/)[1]);
 for(const x of [
 "./art/characters/peren/peren-herb-gather.png",
 "./art/characters/peren/official-v5/peren-coleta-runtime-4x4-48x64.png",
 "./art/characters/peren/official-v5/peren-coleta-4x4-original-160x190.png",
 "./art/characters/peren/official-v5/runtime-provenance.json",
 ...["art-m1h","art-m1hb","art-m1hc","art-m1hd"].map(v=>`./${v}/characters/peren/peren-herb-gather.png`)
 ])assert.ok(files.includes(x),"not precached: "+x);
});
