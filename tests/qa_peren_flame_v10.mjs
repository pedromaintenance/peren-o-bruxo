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
test("three flames share exactly one lower-center base, with a larger core and ±45° sides",async()=>{
 const created=[],queue=[];
 const mk=(x,y)=>{
  const sprite={active:true,x,y,rotation:0,frames:[],alphas:[],
   setOrigin(x,y){this.origin=[x,y];return this},
   setDepth(value){this.depth=value;return this},
   setScale(value){this.scale=value;return this},
   setRotation(value){this.rotation=value;return this},
   setAlpha(value){this.alphas.push(value);return this},
   setFrame(value){this.frames.push(value);return this},
   destroy(){this.active=false}};
  created.push(sprite);return sprite;
 };
 const scene={scale:{width:900,height:640},textures:{exists:key=>key===CONTRACT.flame.key},
  add:{sprite:(x,y)=>mk(x,y)},events:{once(){},off(){}},
  time:{delayedCall(ms,cb){queue.push({ms,cb});return {remove(){}}}}};
 const pending=playFlameOverlay(scene);
 assert.equal(created.length,3,"One central and two side sprites are required");
 const [center,left,right]=created;
 assert.ok(created.every(s=>Math.abs(s.x-900*.75)<.01),"Every flame uses same enemy X");
 assert.ok(created.every(s=>s.y===center.y),"All lower bases have same Y");
 assert.ok(created.every(s=>JSON.stringify(s.origin)==="[0.5,1]"),"Rotate around base center");
 assert.equal(center.rotation,0);
 assert.equal(left.rotation,-Math.PI/4);
 assert.equal(right.rotation,Math.PI/4);
 assert.ok(center.scale>left.scale&&center.scale>right.scale,"Center must be largest");
 assert.ok(Math.abs(left.scale-right.scale)<1e-10,"Side scales must be equal");
 assert.ok(Math.abs(left.scale-center.scale*.82)<1e-10,"Side flames must be 82% of center");
 assert.ok(center.depth>left.depth&&center.depth>right.depth,"Center should render in front");
 assert.deepEqual(created.map(s=>s.alphas),[[0],[0],[0]],"Initially hidden until impact");
 assert.equal(queue[0].ms,270,"Keep original impact preparation delay");
 queue[0].cb();
 for(let i=0;i<5;i++){assert.equal(queue[i+1].ms,CONTRACT.flame.durations[i]);queue[i+1].cb()}
 assert.deepEqual(await pending,{played:true,reason:"complete"});
 for(const sprite of created){
  assert.deepEqual(sprite.frames,[0,1,2,3,4],"All 3 flames share the same five frames");
  assert.deepEqual(sprite.alphas,[0,1],"All 3 flames become visible together");
  assert.equal(sprite.active,false,"No flame sprite may leak after impact");
 }
});
test("both approved fire PNGs and their manifests are cached for offline play",()=>{
 const sw=readFileSync(resolve(ROOT,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 for(const p of ["sparks-v10.png","sparks-v10.json","flame-v10.png","flame-v10.json"])
  assert.ok(sw.includes("./art/battle/runtime-v84/"+p),"Missing precache: "+p);
});

test("mobile triple flame keeps the same lower-center base with ±45° rotations",()=>{
 const created=[];
 const scene={scale:{width:390,height:844},textures:{exists:()=>true},
  add:{sprite:(x,y)=>{
   const s={active:true,x,y,rotation:0,
    setOrigin(x,y){this.origin=[x,y];return this},
    setDepth(v){this.depth=v;return this},setScale(v){this.scale=v;return this},
    setRotation(v){this.rotation=v;return this},setAlpha(){return this},
    setFrame(){return this},destroy(){this.active=false}};
   created.push(s);return s;
  }},events:{once(){},off(){}},
  time:{delayedCall(){return{remove(){}}}}};
 void playFlameOverlay(scene);
 assert.equal(created.length,3);
 assert.ok(created.every(s=>Math.abs(s.x-390*.74)<.01));
 assert.ok(created.every(s=>s.y===created[0].y));
 assert.ok(created.every(s=>s.origin[0]===.5&&s.origin[1]===1));
 assert.deepEqual(created.map(s=>s.rotation),[0,-Math.PI/4,Math.PI/4]);
 assert.ok(created[0].scale>created[1].scale&&created[0].scale>created[2].scale);
});
