import test from "node:test";
import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,checkInstalledRing,playRingOverlay} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const prefix="phaser-demo-m1hf/art/battle/runtime-v84/";
const marker=JSON.parse(readFileSync(resolve(root,prefix+"ring-v12.json"),"utf8"));
const sha="24eecad72e0a402ef79447940fb05cf737ca4f439e520882f1e6447c96797fb4";

test("fifth fire effect Ring retains five actual source-preserving frames",()=>{
 const spec=CONTRACT.ring;
 assert.equal(spec.key,"peren-v12-ring");
 assert.equal(spec.file,"ring-v12.png");
 assert.deepEqual([spec.width,spec.height,spec.frames],[480,682,5]);
 assert.deepEqual(spec.durations,[130,155,190,170,145]);
 assert.equal(spec.delayMs,430);
 assert.equal(marker.schema,"peren-ring-v12");
 assert.deepEqual(marker.frame_size,[480,682]);
 assert.deepEqual(marker.dimensions,[2400,682]);
 assert.equal(marker.frames,5);
 assert.equal(marker.sha256,sha);
 assert.deepEqual(marker.source_x_ranges,[[0,381],[381,795],[795,1261],[1261,1665],[1665,2048]]);
});
test("real Ring RGBA PNG is committed, intact and correctly segmented",()=>{
 const path=resolve(root,prefix+"ring-v12.png");
 assert.ok(existsSync(path),"Release blocked: ring-v12.png is missing");
 const bytes=readFileSync(path);
 assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(bytes.readUInt32BE(16),2400);
 assert.equal(bytes.readUInt32BE(20),682);
 assert.equal(bytes[25],6,"RGBA PNG is required");
 assert.equal(bytes.length,971008);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),sha);
});
test("Ring loading is optional, protected against missing or invalid assets",async()=>{
 const ok=async(url,options)=>options?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 const missing=async(url,options)=>options?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledRing(ok,null),true);
 assert.equal(await checkInstalledRing(missing,null),false);
 assert.equal(await checkInstalledRing(async()=>({ok:false,status:404}),null),false);
 assert.equal(await checkInstalledRing(async()=>({ok:true,json:async()=>({...marker,frame_size:[512,682]})}),null),false);
});
test("Ring starts after 430ms, displays frames 0 through 4 and cleans itself up",async()=>{
 const frames=[],alphas=[],queue=[];
 const sprite={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
  setAlpha(n){alphas.push(n);return this},setFrame(n){frames.push(n);return this},
  destroy(){this.active=false}};
 const scene={scale:{width:960,height:720},textures:{exists:key=>key==="peren-v12-ring"},
  add:{sprite:()=>sprite},events:{once(){},off(){}},
  time:{delayedCall(ms,fn){queue.push({ms,fn});return{remove(){}}}}
 };
 const result=playRingOverlay(scene);
 assert.deepEqual(alphas,[0]);
 assert.deepEqual(frames,[]);
 assert.equal(queue[0].ms,430);
 queue[0].fn();
 for(let i=0;i<5;i++){assert.equal(queue[i+1].ms,CONTRACT.ring.durations[i]);queue[i+1].fn()}
 assert.deepEqual(await result,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3,4]);
 assert.deepEqual(alphas,[0,1]);
 assert.equal(sprite.active,false);
});
test("v12 offline service worker precaches actual Ring PNG and manifest",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/preview-fire-smoke-v15-20261025/);
 for(const ext of ["png","json"])assert.ok(sw.includes("./art/battle/runtime-v84/ring-v12."+ext));
});
