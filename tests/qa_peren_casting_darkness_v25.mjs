import test from "node:test";
import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import {CONTRACT,getAnimationPlan,checkInstalledCastingDarkness,playVisualSequence,installOnBattleScene} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const folder="phaser-demo-m1hf/art/characters/peren/battler/casting/";
const manifest=JSON.parse(readFileSync(resolve(root,folder+"manifest.json"),"utf8"));
const sha="56741939ea593a08aed4f9e6d71e8f71b59c2314d2dd5e4162fabf5e0194c97d";
const order=[1,2,3,4,5,6,7,6,5,6,5,4,3,2,1];

test("darkness art is a committed 7-cell transparent PNG at unchanged 682px height",()=>{
 const p=resolve(root,folder+"peren-casting-darkness.png");
 assert.ok(existsSync(p));
 const bytes=readFileSync(p);
 assert.equal(bytes.length,871103);
 assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(bytes.readUInt32BE(16),3584);
 assert.equal(bytes.readUInt32BE(20),682);
 assert.equal(bytes[25],6,"PNG must retain RGBA transparency");
 assert.equal(createHash("sha256").update(bytes).digest("hex"),sha);
 const m=manifest.animations.find(x=>x.id==="peren-casting-darkness");
 assert.deepEqual(m.frames,[0,1,2,3,4,5,6]);
 assert.deepEqual(m.sequence,order);
 assert.deepEqual([m.atlas.columns,m.atlas.width,m.atlas.height,m.atlas.frameWidth,m.atlas.frameHeight],[7,3584,682,512,682]);
 assert.deepEqual(m.source.cropWidths,[293,293,293,293,292,292,292]);
 assert.equal(m.source.height,682);
 assert.equal(m.sha256,sha);
});
test("Escuridão maps only to Darkness; fire, ice and magic missiles remain unchanged",()=>{
 const spec=CONTRACT.castingDarkness;
 assert.equal(getAnimationPlan("spell:mag-escuridao"),"castingDarkness");
 assert.equal(getAnimationPlan("spell:mag-raio-de-gelo"),"castingIce");
 assert.equal(getAnimationPlan("spell:mag-raio-de-fogo"),"infernal");
 assert.equal(getAnimationPlan("spell:mag-misseis-magicos"),"void");
 assert.deepEqual([spec.frames,spec.playFrames,spec.width,spec.height,spec.frameMs],[7,15,512,682,60]);
 assert.deepEqual(spec.sequence,order.map(x=>x-1));
 assert.equal(spec.frameMs*spec.playFrames,900,"15 frames in same duration as 5 conventional 180ms frames");
});
test("fifteen displayed timeline frames follow exactly the requested 7-pose sequence",async()=>{
 const frames=[],durations=[],positions=[],visibility=[],queue=[];
 const idle={active:true,visible:true,setVisible(v){this.visible=v;visibility.push(v);return this}};
 const actor={active:true,setOrigin(){return this},setDepth(){return this},setScale(x){this.scale=x;return this},
  setFrame(frame){frames.push(frame);return this},destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:key=>key===CONTRACT.castingDarkness.key},
  add:{sprite:(x,y)=>{positions.push([x,y]);return actor}},events:{once(){},off(){}},
  time:{delayedCall:(ms,fn)=>{durations.push(ms);queue.push(fn);return{remove(){}}}}};
 const playback=playVisualSequence(scene,"castingDarkness",{base:{sprite:idle}});
 for(let i=0;i<15;i++)queue[i]();
 assert.deepEqual(await playback,{played:true,reason:"complete"});
 assert.deepEqual(frames,order.map(x=>x-1));
 assert.deepEqual(durations,Array(15).fill(60));
 assert.equal(durations.reduce((x,y)=>x+y,0),900);
 assert.deepEqual(visibility,[false,true]);
 assert.ok(positions[0][0]<900*.35,"Peren should remain at caster's position");
 assert.equal(actor.active,false);
});
test("missing or tampered darkness source fails closed without interrupting combat",async()=>{
 const valid=async(u,o)=>o?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>manifest};
 const missing=async(u,o)=>o?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>manifest};
 const tampered=async(u,o)=>o?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>({...manifest,animations:manifest.animations.map(x=>x.id==="peren-casting-darkness"?{...x,sequence:[1]}:x)})};
 assert.equal(await checkInstalledCastingDarkness(valid,null),true);
 assert.equal(await checkInstalledCastingDarkness(missing,null),false);
 assert.equal(await checkInstalledCastingDarkness(tampered,null),false);
 assert.equal(await checkInstalledCastingDarkness(missing,{match:async()=>({ok:true,status:200})}),true);
 const called=[];
 const scene={preload(){},create(){},takeTurn(){return Promise.resolve(true)},
 animatePlayer(action){called.push(action);return Promise.resolve()},
 textures:{exists:()=>false},events:{once(){},off(){}},scene:{isActive:()=>false}};
 assert.equal(installOnBattleScene(scene,{doc:{getElementById(){return null}},castingDarknessEnabled:false}),true);
 await scene.animatePlayer("spell:mag-escuridao",[]);
 assert.deepEqual(called,["spell:mag-escuridao"],"original animation remains if caster asset is unavailable");
});
test("PWA precaches the real Darkness PNG and has a new versioned cache",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/const CACHE="peren-phaser-m1hf-preview-[a-z0-9-]+-v\\d+-20\\d{6}";/);
 const files=JSON.parse(sw.match(/const FILES=(\[[^\n]+\]);/)[1]);
 assert.ok(files.includes("./art/characters/peren/battler/casting/peren-casting-darkness.png"));
 assert.ok(files.includes("./art/characters/peren/battler/casting/manifest.json"));
 assert.ok(files.includes("./art/characters/peren/battler/casting/peren-casting-ice.png"));
 assert.ok(files.includes("./art/characters/peren/battler/casting/peren-casting-fire.png"));
 assert.equal(new Set(files).size,files.length);
});
