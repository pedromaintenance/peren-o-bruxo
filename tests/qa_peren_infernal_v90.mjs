import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {CONTRACT,CINEMATIC_ACTIONS,validateAssetMarker,checkInstalledAssets,playVisualSequence,infernalFeatherWidth} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const path="phaser-demo-m1hf/art/battle/runtime-v84/";
const manifest=JSON.parse(readFileSync(resolve(root,path+"battle-asset-pack-v90.json"),"utf8"));
const sha="fc2ecca170a76c76e89ad846709b0d9659e57699eb0611441736ce81a17b22c9";

test("Infernal v9.0 uses eight equal-size 512×341 cells and its own key",()=>{
 assert.equal(CONTRACT.infernal.width,512);
 assert.equal(CONTRACT.infernal.height,341);
 assert.equal(CONTRACT.infernal.frames,8);
 assert.equal(CONTRACT.infernal.file,"infernal-v90.png");
 assert.equal(CONTRACT.infernal.key,"peren-v90-infernal");
 assert.equal(CINEMATIC_ACTIONS["spell:mag-raio-de-fogo"],"infernal");
 assert.equal(CINEMATIC_ACTIONS["spell:mag-misseis-magicos"],"void");
});
test("v9 manifest authorizes new Infernal but preserves seven earlier sprites",()=>{
 assert.equal(manifest.version,"9.0.0");
 assert.equal(manifest.schema,"peren-battle-art-v90");
 assert.equal(manifest.frame_dimensions.infernal[0],512);
 assert.equal(manifest.frame_dimensions.infernal[1],341);
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
 assert.match(sw,/preview-sparks-v10-20261024/);
 for(const p of ["battle-asset-pack-v90.json","infernal-v90.png"])assert.ok(sw.includes(p),p);
});
test("release gate: approved PNG must be committed and byte-identical",()=>{
 const p=resolve(root,path+"infernal-v90.png");
 assert.ok(existsSync(p),"Infernal v9.0 PNG must be present in the repository before publication.");
 const buf=readFileSync(p);
 assert.equal(buf.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(buf.readUInt32BE(16),2048);
 assert.equal(buf.readUInt32BE(20),682);
 assert.equal(createHash("sha256").update(buf).digest("hex"),sha);
 assert.equal(manifest.files.find(x=>x.path==="infernal-v90.png").bytes,buf.length);
});

test("v9.2 preserves all eight atlas cells but never renders the corrupted last skull",()=>{
 assert.equal(infernalFeatherWidth(512),44);
 assert.ok(infernalFeatherWidth(512)>0 && infernalFeatherWidth(512)<512/2);
 assert.equal(CONTRACT.infernal.tailMs,320);
 assert.equal(CONTRACT.infernal.frames,8,"atlas remains 4×2 unchanged");
 assert.equal(CONTRACT.infernal.playFrames,7,"last atlas cell is intentionally excluded");
 assert.equal(manifest.files.find(x=>x.path==="infernal-v90.png")?.sha256,sha);
});
test("Infernal skips the ghost-skull frame #7 and dissolves frame #6 before idle returns",async()=>{
 const delays=[],frames=[],alpha=[],tweens=[],visible=[];
 const base={active:true,visible:true,setVisible(v){this.visible=v;visible.push(v);return this}};
 const actor={active:true,x:100,y:200,scaleX:1,scaleY:1,
  setOrigin(){return this},setDepth(){return this},setScale(){return this},
  setFrame(n){frames.push(n);return this},setAlpha(v){alpha.push(v);return this},
  destroy(){this.active=false}};
 const queue=[];
 const scene={
  textures:{exists:()=>true},scale:{width:600,height:420},
  add:{sprite:()=>actor},
  events:{once(){},off(){}},
  tweens:{add(opts){tweens.push(opts);return{stop(){}}}},
  time:{delayedCall(ms,cb){delays.push(ms);queue.push(cb);return{remove(){}}}}
 };
 const playing=playVisualSequence(scene,"infernal",{base:{sprite:base}});
 for(let i=0;i<7;i++)queue[i]();
 assert.deepEqual(await playing,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3,4,5,6]);
 assert.equal(frames.includes(7),false,"ghost-skull frame must never be rendered");
 assert.deepEqual(delays,[180,180,180,180,180,180,320]);
 assert.deepEqual(visible,[false,true]);
 assert.equal(tweens.length,1);
 assert.equal(tweens[0].targets,actor);
 assert.equal(tweens[0].alpha,0);
 assert.equal(tweens[0].duration,320);
 assert.ok(alpha.includes(.92));
 assert.equal(actor.active,false);
});
