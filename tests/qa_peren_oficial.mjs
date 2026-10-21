import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {dirname,resolve,join} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const PREVIEW=join(ROOT,"phaser-demo-m1hf");
const canon=join(PREVIEW,"art/characters/peren/official-v2");
const read=p=>readFileSync(join(ROOT,p));
const hash=b=>createHash("sha256").update(b).digest("hex");
const portrait=readFileSync(join(canon,"peren-portrait-official-256.png"));
const actor=readFileSync(join(canon,"peren-actor-official-128.png"));
const atlas=read("phaser-demo-m1hf/art/characters/peren/official-v5/peren-atlas-normal-walkfix-v5.png");
const expected={
 "peren-portrait-official-256.png":{size:[256,256],sha:"81ae05daca03276ace5c8b463a81a4036be6834ae2e978397cd8b9f58d9a6cbf"},
 "peren-portrait-official-128.png":{size:[128,151],sha:"cab573bc7bac38fde239ad0710261d359eb53954bf81a4f939369cca18d3d68d"},
 "peren-actor-official-128.png":{size:[128,261],sha:"f4a611f6073a6436115ee6c73ef5e40b980bc7f7c98735b9483dd67e62e972c9"},
 "peren-atlas-official-48x64.png":{size:[768,512],sha:"a17344bda86f503faebd9fe3db65f951b3a0399d7fc39efb18d0b33e262316eb"}
};
function pngDimensions(raw){
 assert.equal(raw.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(raw.subarray(12,16).toString(),"IHDR");
 return [raw.readUInt32BE(16),raw.readUInt32BE(20)];
}
test("four runtime assets use official ZIP derivatives and match verified PNG dimensions and hashes",()=>{
 for(const [name,info] of Object.entries(expected)){
  const data=readFileSync(join(canon,name));
  assert.deepEqual(pngDimensions(data),info.size,name);
  assert.equal(hash(data),info.sha,name);
 }
});
test("player sprite atlas keeps all 128 indices and preserves the game's animation contract",()=>{
 for(const base of ["phaser-demo-m1hf/art/characters/peren","phaser-demo/art/characters/peren"]){
  const meta=JSON.parse(read(base+"/atlas.json"));
  assert.deepEqual(meta.directions,["down","left","right","up"]);
  assert.equal(meta.frameWidth,48);assert.equal(meta.frameHeight,64);
  const clips=Object.values(meta.animations);
  assert.equal(clips.length,32);
  const frameIndices=clips.flatMap(a=>a.frames);
  assert.equal(frameIndices.length,128);
  assert.deepEqual([...new Set(frameIndices)].sort((a,b)=>a-b),Array.from({length:128},(_,i)=>i));
 }
 for(const base of ["phaser-demo-m1hf/art/characters/peren","phaser-demo/art/characters/peren"])
  assert.equal(hash(read(base+"/peren-atlas.png")),hash(atlas),base);
});
test("all active and legacy Phaser Peren portrait variants point to the approved face",()=>{
 const roots=["phaser-demo-m1hf/art/characters/peren",...["art-m1h","art-m1hb","art-m1hc","art-m1hd"].map(s=>"phaser-demo-m1hf/"+s+"/characters/peren")];
 for(const dir of roots){
  assert.equal(hash(read(dir+"/peren-atlas.png")),hash(atlas),dir);
  for(const name of ["portrait.png","portrait-cast.png","portrait-hurt.png"]){
   assert.equal(hash(read(dir+"/"+name)),hash(portrait),dir+"/"+name);
  }
 }
 assert.equal(hash(read("phaser-demo/art/characters/peren/portrait.png")),hash(portrait));
});
test("one-game interfaces always refer to official versions; saved character data are untouched",()=>{
 const game=read("game.js").toString(),index=read("phaser-demo-m1hf/index.html").toString();
 const css=read("style.css").toString();
 assert.match(game,/hero-peren-official/);
 assert.match(game,/battle-peren-official/);
 assert.match(game,/peren-profile-header/);
 assert.match(css,/image-rendering:pixelated/);
 assert.doesNotMatch(index,/cabelos grisalhos|chapéu antigo|cabelos prateados/i);
 assert.equal((index.match(/peren-portrait-official-256\.png/g)||[]).length,3);
 assert.doesNotMatch(game,/peren_campanha_v1/);
 assert.ok(existsSync(join(PREVIEW,"peren-arte.html")));
});
test("offline precaches correct art with versioned caches and all game resources present",()=>{
 const pwa=read("phaser-demo-m1hf/demo-sw.js").toString();
 const root=read("sw.js").toString();
 const stable=read("phaser-demo/demo-sw.js").toString();
 assert.match(root,/0\.1\.4-peren-auditado/);
 assert.match(stable,/peren-herb-v5-20261021/);
 assert.match(pwa,/herb-only-v5-20261021/);
 for(const f of Object.keys(expected))assert.ok(pwa.includes("./art/characters/peren/official-v2/"+f));
 assert.match(root,/peren-actor-official-128.png/);
 assert.match(root,/peren-portrait-official-256.png/);
 assert.match(pwa,/peren-arte.html/);
});
