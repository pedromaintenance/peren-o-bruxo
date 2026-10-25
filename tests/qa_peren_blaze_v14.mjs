import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,checkInstalledBlaze,playBlazeOverlay} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const base="phaser-demo-m1hf/art/battle/runtime-v84/";
const marker=JSON.parse(readFileSync(resolve(root,base+"blaze-v14.json"),"utf8"));
const digest="c30c398166ca542f394615cffafe88431b0aeac88ccf74a74cb544a341d505c0";

test("seventh fire effect Labareda uses five RGBA cells with unchanged visual pixels",()=>{
 const spec=CONTRACT.blaze;
 assert.equal(spec.key,"peren-v14-blaze");
 assert.equal(spec.file,"blaze-v14.png");
 assert.deepEqual([spec.width,spec.height,spec.frames],[416,226,5]);
 assert.deepEqual(spec.durations,[120,150,210,155,135]);
 assert.equal(spec.delayMs,560);
 assert.equal(marker.schema,"peren-blaze-v14");
 assert.deepEqual(marker.dimensions,[2080,226]);
 assert.deepEqual(marker.frame_size,[416,226]);
 assert.equal(marker.frames,5);
 assert.deepEqual(marker.source_x_ranges,[[70,325],[448,773],[826,1222],[1267,1607],[1726,1974]]);
 assert.equal(marker.sha256,digest);
});
test("Labareda binary is actually committed with expected signature and SHA-256",()=>{
 const path=resolve(root,base+"blaze-v14.png");
 assert.ok(existsSync(path),"Missing committed Labareda v14 PNG");
 const bytes=readFileSync(path);
 assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(bytes.readUInt32BE(16),2080);
 assert.equal(bytes.readUInt32BE(20),226);
 assert.equal(bytes[25],6,"True RGBA PNG required");
 assert.equal(bytes.length,532291);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),digest);
});
test("optional seventh effect never blocks spell for unavailable or damaged assets",async()=>{
 const yes=async(url,opts)=>opts?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 const missing=async(url,opts)=>opts?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledBlaze(yes,null),true);
 assert.equal(await checkInstalledBlaze(missing,null),false);
 assert.equal(await checkInstalledBlaze(async()=>({ok:false,status:404}),null),false);
 assert.equal(await checkInstalledBlaze(async()=>({ok:true,json:async()=>({...marker,frame_size:[512,226]})}),null),false);
});
test("Labareda waits 560ms, plays 0 through 4 and always destroys its sprite",async()=>{
 const frames=[],alphas=[],queue=[];
 const sprite={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
  setAlpha(v){alphas.push(v);return this},setFrame(n){frames.push(n);return this},
  destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:key=>key==="peren-v14-blaze"},
  add:{sprite:()=>sprite},events:{once(){},off(){}},
  time:{delayedCall(ms,fn){queue.push({ms,fn});return {remove(){}}}}
 };
 const pending=playBlazeOverlay(scene);
 assert.deepEqual(alphas,[0]);
 assert.deepEqual(frames,[]);
 assert.equal(queue[0].ms,560);
 queue[0].fn();
 for(let i=0;i<5;i++){assert.equal(queue[i+1].ms,CONTRACT.blaze.durations[i]);queue[i+1].fn()}
 assert.deepEqual(await pending,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3,4]);
 assert.deepEqual(alphas,[0,1]);
 assert.equal(sprite.active,false);
});
test("offline cache includes real PNG and manifest after bump",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/preview-fire-blaze-v14-20261025/);
 for(const ext of ["png","json"])assert.ok(sw.includes("./art/battle/runtime-v84/blaze-v14."+ext));
});
