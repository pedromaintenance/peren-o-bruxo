import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {CONTRACT,getAnimationPlan,checkInstalledCastingIce,playVisualSequence,installOnBattleScene} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const folder="phaser-demo-m1hf/art/characters/peren/battler/casting/";
const marker=JSON.parse(readFileSync(resolve(root,folder+"manifest.json"),"utf8"));

test("committed ice spritesheet matches exact approved RGBA PNG and all four atlas cells",()=>{
 const p=resolve(root,folder+"peren-casting-ice.png");
 assert.ok(existsSync(p),"binary PNG must actually be committed");
 const bytes=readFileSync(p);
 assert.equal(bytes.length,1694500);
 assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(bytes.readUInt32BE(16),2048);
 assert.equal(bytes.readUInt32BE(20),682);
 assert.equal(bytes[25],6);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),"2d39f3d6cea6d198ba3d49eec265cc7f9453c8c40132a9829e01857f428c9064");
 const m=marker.animations.find(a=>a.id==="peren-casting-ice");
 assert.deepEqual(m?.frames,[0,1,2,3]);
 assert.equal(m.sha256,"2d39f3d6cea6d198ba3d49eec265cc7f9453c8c40132a9829e01857f428c9064");
});
test("ice selects new casting while basic fire and arcane spells keep their existing rules",()=>{
 assert.equal(getAnimationPlan("spell:mag-raio-de-gelo"),"castingIce");
 assert.equal(getAnimationPlan("spell:mag-raio-de-fogo"),"infernal");
 assert.equal(getAnimationPlan("spell:mag-misseis-magicos"),"void");
 assert.deepEqual([CONTRACT.castingIce.width,CONTRACT.castingIce.height,CONTRACT.castingIce.frames],[512,682,4]);
 assert.deepEqual(CONTRACT.castingIce.durations,[250,300,300,300]);
 assert.equal(CONTRACT.castingIce.path,"./art/characters/peren/battler/casting/peren-casting-ice.png");
});
test("missing, invalid or offline ice PNG falls back safely",async()=>{
 const good=async(url,opts)=>opts?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 const missing=async(url,opts)=>opts?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 const broken=async(url,opts)=>opts?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>({...marker,animations:marker.animations.filter(a=>a.id!=="peren-casting-ice")})};
 assert.equal(await checkInstalledCastingIce(good,null),true);
 assert.equal(await checkInstalledCastingIce(missing,null),false);
 assert.equal(await checkInstalledCastingIce(broken,null),false);
 assert.equal(await checkInstalledCastingIce(missing,{match:async()=>({ok:true,status:200})}),true);
});
test("ice plays frames 0–3, stays on caster side and restores Idle",async()=>{
 const frames=[],delays=[],queue=[],positions=[],visible=[];
 const idle={active:true,visible:true,setVisible(v){this.visible=v;visible.push(v);return this}};
 const spr={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
  setFrame(n){frames.push(n);return this},destroy(){this.active=false}};
 const scene={scale:{width:900,height:640},textures:{exists:key=>key===CONTRACT.castingIce.key},
  add:{sprite:(x,y)=>{positions.push([x,y]);return spr}},events:{once(){},off(){}},
  time:{delayedCall(ms,cb){delays.push(ms);queue.push(cb);return{remove(){}}}}};
 const task=playVisualSequence(scene,"castingIce",{base:{sprite:idle}});
 for(let i=0;i<4;i++)queue[i]();
 assert.deepEqual(await task,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3]);
 assert.deepEqual(delays,CONTRACT.castingIce.durations);
 assert.deepEqual(visible,[false,true]);
 assert.ok(positions[0][0]<900*.35);
 assert.equal(spr.active,false);
});
test("basic ice and fire suppress legacy procedural visuals without changing combat turns",async()=>{
 const calls=[];
 const scene={preload(){},create(){},animatePlayer(action){calls.push(action);return Promise.resolve("legacy")},
  takeTurn(){return Promise.resolve(true)},textures:{exists:()=>false},
  events:{once(){},off(){}},scene:{isActive:()=>false}};
 assert.equal(installOnBattleScene(scene,{doc:{getElementById(){return null}},castingIceEnabled:false}),true);
 await scene.animatePlayer("spell:mag-raio-de-gelo",[]);
 await scene.animatePlayer("spell:mag-raio-de-fogo",[]);
 assert.deepEqual(calls,[],"both basic elemental spells suppress the bundled procedural effects");
});
test("PWA includes approved ice PNG and caster manifest",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/const CACHE="peren-phaser-m1hf-preview-[a-z0-9-]+-v\d+-20\d{6}";/);
 for(const p of ["./art/characters/peren/battler/casting/peren-casting-ice.png",
                 "./art/characters/peren/battler/casting/peren-casting-fire.png",
                 "./art/characters/peren/battler/casting/manifest.json"]){
  assert.ok(sw.includes(p),"Missing offline asset "+p);
 }
});
