import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,checkInstalledSparks,playSparksOverlay} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const BASE="phaser-demo-m1hf/art/battle/runtime-v84/";
const marker=JSON.parse(readFileSync(resolve(ROOT,BASE+"sparks-v10.json"),"utf8"));

test("creator-approved sparks retain five equal cells and phase cadence",()=>{
 assert.equal(marker.schema,"peren-sparks-v10");
 assert.equal(CONTRACT.sparks.key,"peren-v10-sparks");
 assert.deepEqual([CONTRACT.sparks.width,CONTRACT.sparks.height],[416,682]);
 assert.equal(CONTRACT.sparks.frames,5);
 assert.deepEqual(CONTRACT.sparks.durations,[120,125,165,145,130]);
 assert.deepEqual(marker.dimensions,[2080,682]);
 assert.equal(marker.frames,5);
});
test("strict PNG release gate: author-approved binary must be COMMITTED",()=>{
 const path=resolve(ROOT,BASE+marker.asset);
 assert.ok(existsSync(path),"Missing sparks-v10.png. Commit the source-preserving PNG to the runtime-v84 folder.");
 const bytes=readFileSync(path);
 assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(bytes.readUInt32BE(16),2080);
 assert.equal(bytes.readUInt32BE(20),682);
 assert.equal(bytes[25],6,"Require lossless RGBA PNG");
 assert.equal(bytes.length,marker.bytes);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),marker.sha256);
});
test("optional art refuses missing manifest or PNG without blocking old Infernal",async()=>{
 const ok=async (url,opts)=>opts?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledSparks(ok,null),true);
 const badMarker=async ()=>({ok:false,status:404});
 assert.equal(await checkInstalledSparks(badMarker,null),false);
 const missing=async (url,opts)=>opts?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledSparks(missing,null),false);
});
test("runtime shows 0→4 and destroys overlay without modifying actor",async()=>{
 const shown=[],queue=[];
 const sprite={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
 setFrame(n){shown.push(n);return this},destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:key=>key===CONTRACT.sparks.key},
  add:{sprite:()=>sprite},events:{once(){},off(){}},
  time:{delayedCall(ms,cb){queue.push({ms,cb});return {remove(){}}}}};
 const pending=playSparksOverlay(scene);
 for(let i=0;i<5;i++){
  assert.equal(queue[i].ms,CONTRACT.sparks.durations[i]);
  queue[i].cb();
 }
 assert.deepEqual(await pending,{played:true,reason:"complete"});
 assert.deepEqual(shown,[0,1,2,3,4]);
 assert.equal(sprite.active,false);
});
test("PWA precaches v10 marker + spritesheet",()=>{
 const sw=readFileSync(resolve(ROOT,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/preview-fire-ring-v12-20261025/);
 assert.ok(sw.includes("./art/battle/runtime-v84/sparks-v10.png"));
 assert.ok(sw.includes("./art/battle/runtime-v84/sparks-v10.json"));
});
