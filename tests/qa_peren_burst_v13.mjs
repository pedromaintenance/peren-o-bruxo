import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,checkInstalledBurst,playBurstOverlay} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const base="phaser-demo-m1hf/art/battle/runtime-v84/";
const marker=JSON.parse(readFileSync(resolve(root,base+"burst-v13.json"),"utf8"));
const digest="5bee8cdc44b3dac2d1301b8df47577b598e81268730db8590c7841867205c4fa";

test("sixth fire effect preserves all five source art phases and correct sprite grid",()=>{
 const spec=CONTRACT.burst;
 assert.equal(spec.key,"peren-v13-burst");
 assert.equal(spec.file,"burst-v13.png");
 assert.deepEqual([spec.width,spec.height,spec.frames],[416,336,5]);
 assert.deepEqual(spec.durations,[130,150,200,150,135]);
 assert.equal(spec.delayMs,490);
 assert.equal(marker.schema,"peren-burst-v13");
 assert.deepEqual(marker.dimensions,[2080,336]);
 assert.deepEqual(marker.frame_size,[416,336]);
 assert.equal(marker.frames,5);
 assert.equal(marker.sha256,digest);
 assert.deepEqual(marker.source_x_ranges,[[0,420],[420,830],[830,1230],[1230,1670],[1670,2048]]);
});
test("uploaded Burst PNG binary must match transparent RGBA source atlas and checksum",()=>{
 const path=resolve(root,base+"burst-v13.png");
 assert.ok(existsSync(path),"Burst PNG absent in checked-out GitHub branch");
 const bytes=readFileSync(path);
 assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(bytes.readUInt32BE(16),2080);
 assert.equal(bytes.readUInt32BE(20),336);
 assert.equal(bytes[25],6,"RGBA is required");
 assert.equal(bytes.length,594525);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),digest);
});
test("Burst optional preload disables safely for missing or invalid remote asset",async()=>{
 const yes=async(url,opt)=>opt?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 const no=async(url,opt)=>opt?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledBurst(yes,null),true);
 assert.equal(await checkInstalledBurst(no,null),false);
 assert.equal(await checkInstalledBurst(async()=>({ok:false,status:404}),null),false);
 assert.equal(await checkInstalledBurst(async()=>({ok:true,json:async()=>({...marker,frame_size:[500,336]})}),null),false);
});
test("Burst waits 490ms, plays 0–4 and cleans up its sprite",async()=>{
 const frames=[],alphas=[],queue=[];
 const sprite={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
 setAlpha(v){alphas.push(v);return this},setFrame(v){frames.push(v);return this},
 destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:key=>key==="peren-v13-burst"},
  add:{sprite:()=>sprite},events:{once(){},off(){}},
  time:{delayedCall(ms,fn){queue.push({ms,fn});return{remove(){}}}}};
 const running=playBurstOverlay(scene);
 assert.deepEqual(alphas,[0]);
 assert.deepEqual(frames,[]);
 assert.equal(queue[0].ms,490);
 queue[0].fn();
 for(let i=0;i<5;i++){assert.equal(queue[i+1].ms,CONTRACT.burst.durations[i]);queue[i+1].fn()}
 assert.deepEqual(await running,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3,4]);
 assert.deepEqual(alphas,[0,1]);
 assert.equal(sprite.active,false);
});
test("PWA retains Burst PNG and manifest for offline play",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/const CACHE="peren-phaser-m1hf-preview-[a-z0-9-]+-v\d+-20\d{6}";/);
 for(const ext of ["png","json"])assert.ok(sw.includes("./art/battle/runtime-v84/burst-v13."+ext));
});
