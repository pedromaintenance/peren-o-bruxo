import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const load=p=>readFileSync(resolve(root,p),"utf8");
const bundle=load("phaser-demo-m1hf/assets/game-B5Gp97dd.js");
const gallery=load("phaser-demo-m1hf/peren-arte.html");
const sw=load("phaser-demo-m1hf/demo-sw.js");
const atlas=JSON.parse(load("phaser-demo-m1hf/art/characters/peren/atlas.json"));
const data=JSON.parse(load("phaser-demo-m1hf/art/characters/peren/official-v5/runtime-provenance.json"));
test("gather animation triggers only for herb nodes, mushrooms use preexisting generic gather",()=>{
 assert.match(bundle,/this\.playState\(X\.sprite==="herb"\?"gather-herb":"gather"\)/);
 assert.match(bundle,/sprite:"herb"/);
 assert.match(bundle,/sprite:"mushroom"/);
 assert.match(bundle,/X\.sprite==="herb"/);
 const choose=sprite=>sprite==="herb"?"gather-herb":"gather";
 for(const category of ["mushroom","stone","loot","ore",undefined])assert.equal(choose(category),"gather");
 assert.equal(choose("herb"),"gather-herb");
 assert.match(bundle,/type:"collect",seed:this\.world\.seed,nodeId:X\.id/);
});
test("Phaser registers 4 one-shot herb sequences with per-frame durations",()=>{
 assert.match(bundle,/this\.load\.spritesheet\("peren-herb",Xi\+"peren-herb-atlas\.png"/);
 assert.match(bundle,/peren-herb-\$\{X\}-gather/);
 for(const [suffix,dur] of [[16,350],[17,250],[18,450],[19,850]]) {
  assert.ok(bundle.includes('frame:Y*32+'+suffix+',duration:'+dur),'missing herb frame '+suffix);
 }
 assert.match(bundle,/frameRate:1000\/475,repeat:0/);
 assert.match(bundle,/this\.player\.once\(Rt\.Animations\.Events\.ANIMATION_COMPLETE/);
 assert.deepEqual(data.herbFrameMs,[350,250,450,850]);
 assert.equal(data.oneShot,true);
 assert.equal(atlas.runtime.herbGather.eligibility,"node.sprite === 'herb' (excludes mushroom)");
});
test("walk-fix and herb sprites share 128-frame atlas without altering other action slots",()=>{
 for(const action of ["down-gather","left-gather","right-gather","up-gather"]) {
  assert.equal(atlas.animations[action].frames.length,4);
 }
 assert.equal(data.otherFramesUnchanged,112);
 assert.deepEqual(data.walkLoop,[0,1,2,1]);
 assert.equal(data.walkFrameMs,180);
 assert.match(bundle,/peren-wounded/);
});
test("preview and offline correctly include source and new herb atlas without new game mode",()=>{
 const files=JSON.parse(sw.match(/const FILES=(\[[^\n]+\]);/)[1]);
 for(const path of ["./art/characters/peren/peren-herb-atlas.png","./art/characters/peren/official-v5/peren-atlas-herb-v5.png","./art/characters/peren/official-v5/peren-atlas-normal-walkfix-v5.png","./art/characters/peren/official-v5/runtime-provenance.json"]){
  assert.ok(files.includes(path),'not cached '+path);
 }
 assert.match(sw,/battler-v89/);
 assert.match(gallery,/value="gather-herb"/);
 assert.match(gallery,/350,250,450,850/);
 assert.doesNotMatch(gallery,/id="selectPerenMode"/);
});
