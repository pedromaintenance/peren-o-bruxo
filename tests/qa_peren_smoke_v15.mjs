import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,checkInstalledSmoke,playSmokeOverlay} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const path="phaser-demo-m1hf/art/battle/runtime-v84/";
const marker=JSON.parse(readFileSync(resolve(root,path+"smoke-v15.json"),"utf8"));
const expected="e71b3cc5455f15a97fe550cd617db6c1df75b06eae90785c031e73decfee2485";

test("eighth fire effect Smoke has five genuine RGBA phases",()=>{
 const spec=CONTRACT.smoke;
 assert.equal(spec.key,"peren-v15-smoke");
 assert.deepEqual([spec.width,spec.height,spec.frames],[416,280,5]);
 assert.deepEqual(spec.durations,[125,160,220,170,145]);
 assert.equal(spec.delayMs,630);
 assert.equal(marker.schema,"peren-smoke-v15");
 assert.equal(marker.asset,"smoke-v15.png");
 assert.deepEqual(marker.dimensions,[2080,280]);
 assert.deepEqual(marker.frame_size,[416,280]);
 assert.equal(marker.frames,5);
 assert.deepEqual(marker.source_x_ranges,[[104,288],[463,757],[827,1220],[1282,1594],[1753,1950]]);
 assert.equal(marker.sha256,expected);
});
test("Smoke PNG is actually checked into GitHub with exact SHA-256",()=>{
 const filename=resolve(root,path+"smoke-v15.png");
 assert.ok(existsSync(filename),"Missing actual RGBA smoke atlas");
 const bytes=readFileSync(filename);
 assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(bytes.readUInt32BE(16),2080);
 assert.equal(bytes.readUInt32BE(20),280);
 assert.equal(bytes[25],6,"Must be RGBA PNG");
 assert.equal(bytes.length,529234);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),expected);
});
test("Smoke safely disables if PNG/manifest is missing or invalid",async()=>{
 const ok=async(url,options)=>options?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 const missing=async(url,options)=>options?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledSmoke(ok,null),true);
 assert.equal(await checkInstalledSmoke(missing,null),false);
 assert.equal(await checkInstalledSmoke(async()=>({ok:false,status:404}),null),false);
 assert.equal(await checkInstalledSmoke(async()=>({ok:true,json:async()=>({...marker,frame_size:[420,280]})}),null),false);
});
test("Smoke starts after 630ms, plays 0–4 then destroys overlay",async()=>{
 const frames=[],alphas=[],queue=[];
 const sprite={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
  setAlpha(v){alphas.push(v);return this},setFrame(n){frames.push(n);return this},destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:k=>k===CONTRACT.smoke.key},
  add:{sprite:()=>sprite},events:{once(){},off(){}},
  time:{delayedCall(ms,callback){queue.push({ms,callback});return {remove(){}}}}};
 const pending=playSmokeOverlay(scene);
 assert.deepEqual(alphas,[0]);
 assert.deepEqual(frames,[]);
 assert.equal(queue[0].ms,630);
 queue[0].callback();
 for(let i=0;i<5;i++){assert.equal(queue[i+1].ms,CONTRACT.smoke.durations[i]);queue[i+1].callback()}
 assert.deepEqual(await pending,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3,4]);
 assert.deepEqual(alphas,[0,1]);
 assert.equal(sprite.active,false);
});
test("Smoke PNG and JSON are included in offline PWA cache",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/const CACHE="peren-phaser-m1hf-preview-[a-z0-9-]+-v\d+-20\d{6}";/);
 for(const ext of ["png","json"])assert.ok(sw.includes("./art/battle/runtime-v84/smoke-v15."+ext));
});
