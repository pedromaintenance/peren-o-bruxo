import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,CINEMATIC_ACTIONS,validateAssetMarker,checkInstalledAssets} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const path="phaser-demo-m1hf/art/battle/runtime-v84/";
const manifest=JSON.parse(readFileSync(resolve(root,path+"battle-asset-pack-v90.json"),"utf8"));
const sha="b52a89a9737403071c898cfbcec428dbfd892a6e4ebc728f12a573892e785c0a";

test("Infernal v9.0 uses eight equal-size 543×362 cells and its own key",()=>{
 assert.equal(CONTRACT.infernal.width,543);
 assert.equal(CONTRACT.infernal.height,362);
 assert.equal(CONTRACT.infernal.frames,8);
 assert.equal(CONTRACT.infernal.file,"infernal-v90.png");
 assert.equal(CONTRACT.infernal.key,"peren-v90-infernal");
 assert.equal(CINEMATIC_ACTIONS["spell:mag-raio-de-fogo"],"infernal");
 assert.equal(CINEMATIC_ACTIONS["spell:mag-misseis-magicos"],"void");
});
test("v9 manifest authorizes new Infernal but preserves seven earlier sprites",()=>{
 assert.equal(manifest.version,"9.0.0");
 assert.equal(manifest.schema,"peren-battle-art-v90");
 assert.equal(manifest.frame_dimensions.infernal[0],543);
 assert.equal(manifest.frame_dimensions.infernal[1],362);
 assert.equal(manifest.frames.infernal,8);
 assert.equal(manifest.files.length,8);
 assert.equal(manifest.files.find(x=>x.path==="infernal-v90.png")?.sha256,sha);
 assert.equal(validateAssetMarker(manifest),true);
 assert.deepEqual(["idle.png","summon.png","void.png","portrait_01.png","portrait_02.png","portrait_03.png","portrait_04.png"].sort(),
 manifest.files.filter(x=>x.path!=="infernal-v90.png").map(x=>x.path).sort());
});
test("runtime only enables new art when deployed; online + offline existing paths still work",async()=>{
 const ok=async(u,o)=>o?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>manifest};
 const missing=async(u,o)=>o?.method==="HEAD"&&u.endsWith("infernal-v90.png")?{ok:false,status:404}:{ok:true,json:async()=>manifest};
 assert.equal(await checkInstalledAssets(ok,null),true);
 assert.equal(await checkInstalledAssets(missing,null),false);
});
test("PWA now imports v9 module, new marker, new PNG, and unique offline cache",()=>{
 const html=readFileSync(resolve(root,"phaser-demo-m1hf/index.html"),"utf8");
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(html,/battle-art-runtime-v90\.mjs/);
 assert.match(sw,/preview-infernal-v90-20261024/);
 for(const p of ["battle-asset-pack-v90.json","infernal-v90.png"])assert.ok(sw.includes(p),p);
});
test("release gate: approved PNG must be committed and byte-identical",()=>{
 const p=resolve(root,path+"infernal-v90.png");
 assert.ok(existsSync(p),"Approved PNG absent from GitHub. Upload Peren_Infernal_v90_GitHub_Ingest.zip through asset-ingest on this PR.");
 const buf=readFileSync(p);
 assert.equal(buf.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(buf.readUInt32BE(16),2172);
 assert.equal(buf.readUInt32BE(20),724);
 assert.equal(createHash("sha256").update(buf).digest("hex"),sha);
 assert.equal(manifest.files.find(x=>x.path==="infernal-v90.png").bytes,buf.length);
});
