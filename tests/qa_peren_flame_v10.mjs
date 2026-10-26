import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,checkInstalledFlame,playFlameOverlay} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const BASE="phaser-demo-m1hf/art/battle/runtime-v84/";
const marker=JSON.parse(readFileSync(resolve(ROOT,BASE+"flame-v10.json"),"utf8"));

test("approved flame uses five equal-size cells without visual neighbors",()=>{
 assert.equal(marker.schema,"peren-flame-v10");
 assert.equal(CONTRACT.flame.key,"peren-v10-flame");
 assert.deepEqual([CONTRACT.flame.width,CONTRACT.flame.height],[384,370]);
 assert.equal(CONTRACT.flame.frames,5);
 assert.deepEqual(CONTRACT.flame.durations,[145,165,220,170,180]);
 assert.deepEqual(marker.dimensions,[1920,370]);
 assert.equal(marker.frames,5);
});
test("require real author-approved flame PNG, exact dimensions and digest",()=>{
 const f=resolve(ROOT,BASE+marker.asset);
 assert.ok(existsSync(f),"Missing flame-v10.png from GitHub checkout");
 const b=readFileSync(f);
 assert.equal(b.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(b.readUInt32BE(16),1920);
 assert.equal(b.readUInt32BE(20),370);
 assert.equal(b[25],6,"Required RGBA PNG");
 assert.equal(b.length,marker.bytes);
 assert.equal(createHash("sha256").update(b).digest("hex"),marker.sha256);
});
test("optional flame requires a validated marker and actual PNG availability",async()=>{
 const good=async(url,opts)=>opts?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledFlame(good,null),true);
 assert.equal(await checkInstalledFlame(async()=>({ok:false,status:404}),null),false);
 const missing=async(url,opts)=>opts?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledFlame(missing,null),false);
});
test("flame overlay plays only 0–4 then destroys sprite without changing combat",async()=>{
 const seen=[],queue=[],alphas=[],positions=[];
 const actor={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
 setAlpha(v){alphas.push(v);return this},setFrame(n){seen.push(n);return this},destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:key=>key===CONTRACT.flame.key},
  add:{sprite:(x,y)=>{positions.push([x,y]);return actor}},events:{once(){},off(){}},
  time:{delayedCall(ms,cb){queue.push({ms,cb});return {remove(){}}}}};
 const pending=playFlameOverlay(scene);
 assert.equal(queue[0].ms,270,"Flame impact starts after Peren begins casting");
 queue[0].cb();
 for(let i=0;i<5;i++){assert.equal(queue[i+1].ms,CONTRACT.flame.durations[i]);queue[i+1].cb()}
 assert.deepEqual(alphas,[0,1]);
 assert.ok(positions[0][0]>900*.7,"Flame should appear over the opponent");
 assert.deepEqual(await pending,{played:true,reason:"complete"});
 assert.deepEqual(seen,[0,1,2,3,4]);
 assert.equal(actor.active,false);
});
test("both approved fire PNGs and their manifests are cached for offline play",()=>{
 const sw=readFileSync(resolve(ROOT,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 for(const p of ["sparks-v10.png","sparks-v10.json","flame-v10.png","flame-v10.json"])
  assert.ok(sw.includes("./art/battle/runtime-v84/"+p),"Missing precache: "+p);
});
