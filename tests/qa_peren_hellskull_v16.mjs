import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,checkInstalledHellskull,playHellskullOverlay} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const assets="phaser-demo-m1hf/art/battle/runtime-v84/";
const marker=JSON.parse(readFileSync(resolve(root,assets+"hellskull-v16.json"),"utf8"));
const SHA="ea971b558fa11e80bbd850eaceb7780b8dadb48a474da398fbf35fa92babb25d";

test("Hell Skull ninth fire effect has five source-preserved animation phases",()=>{
 const spec=CONTRACT.hellskull;
 assert.equal(spec.key,"peren-v16-hellskull");
 assert.deepEqual([spec.width,spec.height,spec.frames],[416,405,5]);
 assert.deepEqual(spec.durations,[130,165,230,175,145]);
 assert.equal(spec.delayMs,700);
 assert.equal(marker.schema,"peren-hellskull-v16");
 assert.equal(marker.asset,"hellskull-v16.png");
 assert.deepEqual(marker.dimensions,[2080,405]);
 assert.deepEqual(marker.frame_size,[416,405]);
 assert.deepEqual(marker.source_x_ranges,[[59,307],[463,758],[836,1211],[1294,1581],[1750,1973]]);
 assert.equal(marker.sha256,SHA);
});
test("corrected Hell Skull PNG is really in Git checkout and matches checksum",()=>{
 const file=resolve(root,assets+"hellskull-v16.png");
 assert.ok(existsSync(file),"Missing actual committed hellskull PNG");
 const bytes=readFileSync(file);
 assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(bytes.readUInt32BE(16),2080);
 assert.equal(bytes.readUInt32BE(20),405);
 assert.equal(bytes[25],6,"RG​BA pixel format required");
 assert.equal(bytes.length,628985);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),SHA);
});
test("optional ninth overlay never blocks old spell if manifest or PNG unavailable",async()=>{
 const yes=async(url,opts)=>opts?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 const no=async(url,opts)=>opts?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledHellskull(yes,null),true);
 assert.equal(await checkInstalledHellskull(no,null),false);
 assert.equal(await checkInstalledHellskull(async()=>({ok:false,status:404}),null),false);
 assert.equal(await checkInstalledHellskull(async()=>({ok:true,json:async()=>({...marker,frame_size:[512,405]})}),null),false);
});
test("new skull plays all five frames after 700ms then destroys its own sprite",async()=>{
 const frames=[],alphas=[],timers=[];
 const sprite={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
  setAlpha(n){alphas.push(n);return this},setFrame(n){frames.push(n);return this},destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:k=>k===CONTRACT.hellskull.key},
  add:{sprite:()=>sprite},events:{once(){},off(){}},
  time:{delayedCall(ms,callback){timers.push({ms,callback});return{remove(){}}}}};
 const done=playHellskullOverlay(scene);
 assert.deepEqual(alphas,[0]);
 assert.deepEqual(frames,[]);
 assert.equal(timers[0].ms,700);
 timers[0].callback();
 for(let i=0;i<5;i++){assert.equal(timers[i+1].ms,CONTRACT.hellskull.durations[i]);timers[i+1].callback()}
 assert.deepEqual(await done,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3,4]);
 assert.deepEqual(alphas,[0,1]);
 assert.equal(sprite.active,false);
});
test("new Hell Skull PNG and manifest present in offline service worker",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/const CACHE="peren-phaser-m1hf-preview-[a-z0-9-]+-v\d+-20\d{6}";/);
 for(const ext of ["png","json"])assert.ok(sw.includes("./art/battle/runtime-v84/hellskull-v16."+ext));
});
