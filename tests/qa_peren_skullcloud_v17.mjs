import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,FIRE_OVERLAY_PRESET,checkInstalledSkullcloud,playSkullcloudOverlay} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const assetDir="phaser-demo-m1hf/art/battle/runtime-v84/";
const marker=JSON.parse(readFileSync(resolve(root,assetDir+"skullcloud-v17.json"),"utf8"));
const SHA="ca25e194fdb1060480b0d10f5d73f415c01caa377c6190a039f1e76f6474765b";

test("Fogo 10 preserves all five authored phases with equal transparent cells",()=>{
 const spec=CONTRACT.skullcloud;
 assert.equal(spec.key,"peren-v17-skullcloud");
 assert.deepEqual([spec.width,spec.height,spec.frames],[416,238,5]);
 assert.deepEqual(spec.durations,[135,180,240,185,155]);
 assert.equal(spec.delayMs,560);
 assert.equal(marker.delay_ms,560);
 assert.deepEqual(FIRE_OVERLAY_PRESET,["sparks","flame"],"starter spell reserves skull cloud for advanced magic");
 assert.equal(marker.schema,"peren-skullcloud-v17");
 assert.equal(marker.asset,spec.file);
 assert.deepEqual(marker.dimensions,[2080,238]);
 assert.deepEqual(marker.frame_size,[416,238]);
 assert.equal(marker.source_sha256,"26230a07430a23a4b9ea1b5d63071ddcb29148d89223996d61eb30fb7d8aa268");
 assert.deepEqual(marker.source_x_ranges,[[0,410],[410,819],[819,1229],[1229,1638],[1638,2048]]);
 assert.equal(marker.sha256,SHA);
});

test("creator's sprite is present in checkout, not merely referenced by JSON",()=>{
 const path=resolve(root,assetDir+"skullcloud-v17.png");
 assert.ok(existsSync(path),"Upload skullcloud-v17.png to this branch before merging the PR");
 const bytes=readFileSync(path);
 assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(bytes.readUInt32BE(16),2080);
 assert.equal(bytes.readUInt32BE(20),238);
 assert.equal(bytes[25],6);
 assert.equal(bytes.length,431542);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),SHA);
});

test("optional VFX needs both exact metadata and the PNG",async()=>{
 const yes=async(url,options)=>options?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 const no=async(url,options)=>options?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledSkullcloud(yes,null),true);
 assert.equal(await checkInstalledSkullcloud(no,null),false);
 assert.equal(await checkInstalledSkullcloud(async()=>({ok:false,status:404}),null),false);
 assert.equal(await checkInstalledSkullcloud(async()=>({ok:true,json:async()=>({...marker,sha256:"0".repeat(64)})}),null),false);
 assert.equal(await checkInstalledSkullcloud(async()=>({ok:true,json:async()=>({...marker,frame_size:[512,238]})}),null),false);
});

test("10th cloud animates 0–4 then releases visual resources without changing turns",async()=>{
 const frames=[],alphas=[],queue=[],positions=[],flips=[];
 const sprite={active:true,setOrigin(){return this},setDepth(){return this},
  setFlipX(value){flips.push(value);return this},
  setScale(){return this},setAlpha(n){alphas.push(n);return this},
  setFrame(n){frames.push(n);return this},destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:k=>k===CONTRACT.skullcloud.key},
  add:{sprite:(x,y)=>{positions.push([x,y]);return sprite}},
  events:{once(){},off(){}},
  time:{delayedCall(ms,callback){queue.push({ms,callback});return{remove(){}}}}};
 const p=playSkullcloudOverlay(scene);
 assert.deepEqual(alphas,[0]);
 assert.equal(queue[0].ms,560);
 assert.deepEqual(flips,[true],"skull cloud must face left after mirroring");
 queue[0].callback();
 for(let i=0;i<5;i++){
  assert.equal(queue[i+1].ms,CONTRACT.skullcloud.durations[i]);
  queue[i+1].callback();
 }
 assert.deepEqual(await p,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3,4]);
 assert.deepEqual(alphas,[0,1]);
 assert.equal(sprite.active,false);
 assert.ok(positions[0][0]>900*.7,"must be positioned on enemy side");
});

test("PWA precaches the approved v17 PNG and manifest under new cache version",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/preview-fire-bolt-v19-20261026/);
 for(const ext of ["png","json"])assert.ok(sw.includes("./art/battle/runtime-v84/skullcloud-v17."+ext));
});
