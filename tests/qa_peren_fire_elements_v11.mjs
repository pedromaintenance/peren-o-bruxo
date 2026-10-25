import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,checkInstalledEmbers,checkInstalledPupil,playV11FireOverlay} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const prefix="phaser-demo-m1hf/art/battle/runtime-v84/";
const fixtures={
 embers:{bytes:1098226,sha:"e3f08845193058cdba534a364dac83da1b472b9cc96e323496f0502c2f580026",
  durations:[125,145,205,155,125],delay:190,checker:checkInstalledEmbers},
 pupil:{bytes:1018021,sha:"b172b67cdb1560ef0b0f80e08bdbeb77d1e512037d4825e06601f99d4ed571b4",
  durations:[135,165,230,170,160],delay:330,checker:checkInstalledPupil}
};
for(const [id,expected] of Object.entries(fixtures)){
 const spec=CONTRACT[id];
 const marker=JSON.parse(readFileSync(resolve(root,prefix+id+"-v11.json"),"utf8"));
 test(id+" v11 has five source-preserving equal-cell frames with matching hashes",()=>{
  assert.equal(marker.schema,"peren-"+id+"-v11");
  assert.equal(marker.asset,spec.file);
  assert.deepEqual([spec.width,spec.height,spec.frames],[416,682,5]);
  assert.deepEqual(spec.durations,expected.durations);
  assert.deepEqual(marker.frame_size,[416,682]);
  assert.deepEqual(marker.dimensions,[2080,682]);
  assert.equal(marker.bytes,expected.bytes);
  assert.equal(marker.sha256,expected.sha);
  const path=resolve(root,prefix+spec.file);
  assert.ok(existsSync(path),id+": binary missing from checkout");
  const bytes=readFileSync(path);
  assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
  assert.equal(bytes.readUInt32BE(16),2080);
  assert.equal(bytes.readUInt32BE(20),682);
  assert.equal(bytes[25],6,"RGBA pixel format required");
  assert.equal(bytes.length,expected.bytes);
  assert.equal(createHash("sha256").update(bytes).digest("hex"),expected.sha);
 });
 test(id+" refuses missing/corrupted manifest and no PNG",async()=>{
  const yes=async(url,options)=>options?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
  const no=async(url,options)=>options?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
  assert.equal(await expected.checker(yes,null),true);
  assert.equal(await expected.checker(no,null),false);
  assert.equal(await expected.checker(async()=>({ok:false,status:404}),null),false);
  const corrupt={...marker,frame_size:[512,512]};
  assert.equal(await expected.checker(async()=>({ok:true,json:async()=>corrupt}),null),false);
 });
 test(id+" animates frames 0–4 after staged delay, then destroys overlay",async()=>{
  const seen=[],alpha=[],queue=[];
  const actor={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
   setAlpha(n){alpha.push(n);return this},setFrame(n){seen.push(n);return this},
   destroy(){this.active=false}};
  const scene={scale:{width:900,height:640},textures:{exists:key=>key===spec.key},
   add:{sprite:()=>actor},events:{once(){},off(){}},
   time:{delayedCall(ms,fn){queue.push({ms,fn});return{remove(){}}}}
  };
  const pending=playV11FireOverlay(scene,id);
  assert.equal(queue[0].ms,expected.delay);
  assert.deepEqual(seen,[]);
  queue[0].fn();
  for(let i=0;i<5;i++){assert.equal(queue[i+1].ms,expected.durations[i]);queue[i+1].fn()}
  assert.deepEqual(await pending,{played:true,reason:"complete"});
  assert.deepEqual(seen,[0,1,2,3,4]);
  assert.deepEqual(alpha,[0,1]);
  assert.equal(actor.active,false);
 });
}
test("service worker caches the two new transparent atlases and metadata",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/preview-fire-burst-v13-20261025/);
 for(const id of Object.keys(fixtures))for(const ext of ["png","json"])
  assert.ok(sw.includes("./art/battle/runtime-v84/"+id+"-v11."+ext));
});
