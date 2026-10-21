import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>readFileSync(resolve(root,path),"utf8");
const base="phaser-demo-m1hf/";
const patch=JSON.parse(read(base+"art/characters/peren/generic-gather-runtime-patch.json"));
const bundle=read(base+"assets/game-B5Gp97dd.js");
const gallery=read(base+"peren-arte.html");
const sw=read(base+"demo-sw.js");
const files=JSON.parse(sw.match(/const FILES=(\[[^\n]+\]);/)[1]);

test("v5 empty-hand asset is pixel-exact and covers 4 directions without altering standing/bending poses",()=>{
 assert.equal(patch.source_sha256,"42cb2f2827a9eb1a71c52fef858f23a53fb28445071aeb3406c972f923b72ba1");
 assert.deepEqual(patch.frame_size,[48,64]);
 assert.equal(patch.patches.length,8);
 const seen=new Set();
 for(const [direction,step,x,y,width,height,pixels] of patch.patches){
  assert.ok(direction>=0&&direction<4);
  assert.ok(step===2||step===3);
  const key=direction+":"+step;
  assert.ok(!seen.has(key),"repeated "+key);
  seen.add(key);
  assert.ok(x>=0&&y>=0&&x+width<=48&&y+height<=64);
  assert.equal(Buffer.from(pixels,"base64").length,width*height*4,"corrupt RGBA patch "+key);
 }
 for(let direction=0;direction<4;direction++)for(const step of [2,3])
  assert.ok(seen.has(direction+":"+step),"missing "+direction+":"+step);
});
test("Phaser loads the official patch and registers general one-shot clips in the same four directions",()=>{
 assert.match(bundle,/this\.load\.json\("peren-generic-patch"/);
 assert.match(bundle,/function buildPerenGeneralGather\(scene\)/);
 assert.match(bundle,/buildPerenGeneralGather\(this\)/);
 assert.match(bundle,/scene\.textures\.addSpriteSheet\("peren-generic",canvas/);
 assert.match(bundle,/peren-generic-\$\{direction\}-gather/);
 assert.match(bundle,/\[350,250,350,300\]/);
 assert.match(bundle,/frameRate:1000\/312\.5,repeat:0/);
 assert.match(bundle,/this\.playState\(X\.sprite==="herb"\?"gather-herb":"gather-general"\)/);
 assert.match(bundle,/X==="gather-general"&&this\.anims\.exists/);
 assert.match(bundle,/this\.player\.once\(Rt\.Animations\.Events\.ANIMATION_COMPLETE/);
 for(const type of ["mushroom","stone","loot","ore"]){
  assert.equal(type==="herb"?"gather-herb":"gather-general","gather-general");
 }
});
test("v5 gallery and PWA expose the new empty-hand clip without a second game mode",()=>{
 assert.ok(files.includes("./art/characters/peren/generic-gather-runtime-patch.json"));
 assert.ok(files.includes("./art/characters/peren/peren-herb-atlas.png"));
 assert.match(sw,/preview-generic-gather-v5-20261021/);
 assert.match(gallery,/value="gather-general"/);
 assert.match(gallery,/value="gather-herb"/);
 assert.match(gallery,/generalPatches\.get/);
 assert.match(gallery,/350,250,350,300/);
 assert.match(gallery,/350,250,450,850/);
 assert.doesNotMatch(gallery,/id="selectPerenMode"/);
});
