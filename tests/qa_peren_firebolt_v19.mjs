import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {
 CONTRACT,FIRE_OVERLAY_PRESET,getAnimationPlan,
 checkInstalledCastingFire,playVisualSequence,installOnBattleScene
} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const folder="phaser-demo-m1hf/art/characters/peren/battler/casting/";
const marker=JSON.parse(readFileSync(resolve(root,folder+"manifest.json"),"utf8"));

test("basic Fire Bolt uses small hand sparks and enemy flame, not skulls",()=>{
 assert.equal(getAnimationPlan("spell:mag-raio-de-fogo"),"infernal","preserve legacy action identifier while changing rendering only");
 assert.deepEqual(FIRE_OVERLAY_PRESET,["sparks","flame"]);
 assert.equal(CONTRACT.castingFire.key,"peren-v19-casting-fire");
 assert.deepEqual(CONTRACT.castingFire.durations,[250,300,300,300]);
 assert.deepEqual([CONTRACT.castingFire.width,CONTRACT.castingFire.height,CONTRACT.castingFire.frames],[512,682,4]);
 assert.equal(CONTRACT.flame.delayMs,270);
 assert.ok(CONTRACT.skullcloud,"advanced skull-cloud asset remains in catalogue");
});
test("original neutral and fire-lit 2048x682 spritesheets exist with exact creator hashes",()=>{
 assert.equal(marker.schema,"peren.battle-casting/v1");
 assert.deepEqual([marker.atlas.columns,marker.atlas.rows,marker.atlas.width,marker.atlas.height],[4,1,2048,682]);
 assert.deepEqual([marker.atlas.frameWidth,marker.atlas.frameHeight],[512,682]);
 for(const id of ["peren-casting","peren-casting-fire"]){
  const item=marker.animations.find(a=>a.id===id);
  assert.ok(item,"Missing casting manifest "+id);
  assert.deepEqual(item.frames,[0,1,2,3]);
  const path=resolve(root,folder+item.file);
  assert.ok(existsSync(path),"Missing original creator asset "+item.file);
  const bytes=readFileSync(path);
  assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
  assert.equal(bytes.readUInt32BE(16),2048);
  assert.equal(bytes.readUInt32BE(20),682);
  assert.equal(bytes[25],6,"RGBA source required");
  assert.equal(createHash("sha256").update(bytes).digest("hex"),item.sha256,"Do not modify original sprite pixels");
 }
});
test("approved casting sprite must be deployed or precached before the runtime enables it",async()=>{
 const good=async(u,o)=>o?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>marker};
 const missing=async(u,o)=>o?.method==="HEAD"?{ok:false,status:404}:{ok:true,json:async()=>marker};
 assert.equal(await checkInstalledCastingFire(good,null),true);
 assert.equal(await checkInstalledCastingFire(missing,null),false);
 assert.equal(await checkInstalledCastingFire(async()=>({ok:false,status:404}),null),false);
 const malformed=async(u,o)=>o?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>({...marker,atlas:{...marker.atlas,frameWidth:600}})};
 assert.equal(await checkInstalledCastingFire(malformed,null),false);
 const badHash=async(u,o)=>o?.method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>({...marker,animations:marker.animations.map(a=>a.id==="peren-casting-fire"?{...a,sha256:"0".repeat(64)}:a)})};
 assert.equal(await checkInstalledCastingFire(badHash,null),false);
 const cached={match:async()=>({ok:true,status:200})};
 assert.equal(await checkInstalledCastingFire(missing,cached),true,"existing offline PWA must still load casting PNG");
});
test("fire-lit character animates 0→3, stays on the idle actor's side and restores idle",async()=>{
 const frames=[],delays=[],positions=[],visibility=[];
 const base={active:true,visible:true,setVisible(value){this.visible=value;visibility.push(value);return this}};
 const sprite={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},
  setFrame(n){frames.push(n);return this},destroy(){this.active=false}};
 const callbacks=[];
 const scene={scale:{width:900,height:640},
  textures:{exists:key=>key===CONTRACT.castingFire.key},
  add:{sprite:(x,y)=>{positions.push([x,y]);return sprite}},
  events:{once(){},off(){}},
  time:{delayedCall(ms,callback){delays.push(ms);callbacks.push(callback);return{remove(){}}}}
 };
 const task=playVisualSequence(scene,"castingFire",{base:{sprite:base}});
 for(let i=0;i<4;i++)callbacks[i]();
 assert.deepEqual(await task,{played:true,reason:"complete"});
 assert.deepEqual(frames,[0,1,2,3]);
 assert.deepEqual(delays,CONTRACT.castingFire.durations);
 assert.deepEqual(visibility,[false,true]);
 assert.equal(sprite.active,false);
 assert.ok(positions[0][0]<900*.35,"Peren's casting must stay on left side");
});
test("PWA includes caster and basic spells with separate advanced assets preserved",()=>{
 const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
 assert.match(sw,/const CACHE="peren-phaser-m1hf-preview-[a-z0-9-]+-v\d+-20\d{6}";/);
 for(const p of ["./art/characters/peren/battler/casting/manifest.json",
                  "./art/characters/peren/battler/casting/peren-casting-fire.png",
                  "./art/battle/runtime-v84/sparks-v10.png",
                  "./art/battle/runtime-v84/flame-v10.png"]){
  assert.ok(sw.includes(p),"Offline cache missing "+p);
 }
 assert.ok(sw.includes("skullcloud-v17.png"),"Advanced spell asset must remain available");
});

test("Fire Bolt suppresses bundled procedural vfx-fire without changing other battle actions",async()=>{
 const invoked=[];
 const scene={
  preload(){},create(){},takeTurn(){return Promise.resolve(true)},
  animatePlayer(action){invoked.push(action);return Promise.resolve("legacy");},
  textures:{exists:()=>false},events:{once(){},off(){}},
  scene:{isActive:()=>false}
 };
 assert.equal(installOnBattleScene(scene,{doc:{getElementById(){return null}},sparksEnabled:false,flameEnabled:false,castingFireEnabled:false}),true);
 await scene.animatePlayer("spell:mag-raio-de-fogo",[]);
 assert.deepEqual(invoked,[],"fire must NEVER invoke bundled procedural vfx-fire animation");
 await scene.animatePlayer("spell:mag-misseis-magicos",[]);
 assert.deepEqual(invoked,["spell:mag-misseis-magicos"],"other spells keep their built-in animation path");
 await scene.animatePlayer("attack",[]);
 assert.deepEqual(invoked,["spell:mag-misseis-magicos","attack"],"physical attacks keep original path");
 assert.equal(await scene.takeTurn("spell:mag-raio-de-fogo"),true,"combat state machine remains intact");
});
