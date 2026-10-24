// Release gate: do not declare new battler deployed when only JS/manifest exists.
// Validates exact byte-for-byte creator-approved v8.4 PNGs on the GitHub PR checkout.
import test from "node:test";
import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const dir=resolve(root,"phaser-demo-m1hf/art/battle/runtime-v84");
const files={
 "idle.png":{size:[2240,821],hash:"f597da9909787090ac48e1291ca692295a323dc4461638e773073dd1715543d4"},
 "infernal.png":{size:[2048,682],hash:"29c5c642289ed776c3475646c2d91c30cf6b65c54da0739c908b86e5ab688173"},
 "portrait_01.png":{size:[362,1086],hash:"c7da32b5a2aa98e36413280ca5ce413753201d15c28bcfd0c9e0405289225768"},
 "portrait_02.png":{size:[362,1086],hash:"555af850c9f0a869c5aafb8578ebdb2a2003c16305e7c21d5e8d8f465816c120"},
 "portrait_03.png":{size:[362,1086],hash:"4d46fba99a2f311949b78b6fb768096294b6ec5d7c67046fcaa4e4c9a184f58f"},
 "portrait_04.png":{size:[362,1086],hash:"da47932b624bc216d8f31fbececa7c0d95761b6c43237ecaeeb8f7e53e0dbdfd"},
 "summon.png":{size:[2048,1024],hash:"0a31ff32b60a0e793e4fa9ea405cd4da7cfc892c24f2226dccec5ee8c243935c"},
 "void.png":{size:[2560,1086],hash:"e72d153996dad30a1a6f54f45fdd332ceb186d3e413c6257c5b072010a259f25"}
};
test("production v8.4 has eight approved PNGs, no placeholders, validated bytes",()=>{
 const missing=Object.keys(files).filter(f=>!existsSync(resolve(dir,f)));
 assert.deepEqual(missing,[],
  "PNG FILES NOT DEPLOYED. Run: python ferramentas/instalar_battle_v84.py Peren_v84_BattleScene_Assets.zip; git add phaser-demo-m1hf/art/battle/runtime-v84; git commit; git push");
 for(const [name,expected] of Object.entries(files)){
  const bin=readFileSync(resolve(dir,name));
  assert.ok(bin.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),name+" invalid PNG signature");
  assert.deepEqual([bin.readUInt32BE(16),bin.readUInt32BE(20)],expected.size,name+" pixel dimensions");
  assert.equal(createHash("sha256").update(bin).digest("hex"),expected.hash,name+" different art revision");
 }
});
test("release includes exact matching manifest, not an unverified beta marker",()=>{
 const file=resolve(dir,"battle-asset-pack-v84.json");
 assert.ok(existsSync(file),"Release marker absent; no production art may be considered installed");
 const m=JSON.parse(readFileSync(file,"utf8"));
 assert.equal(m.schema,"peren-battle-art-v84");
 assert.equal(m.verified,true);
 assert.equal(m.frames?.void,11);
 assert.equal(m.frames?.infernal,8);
 const listed=new Map((m.files??[]).map(f=>[f.path,f.sha256]));
 assert.equal(listed.size,8);
 for(const [name,expected] of Object.entries(files))assert.equal(listed.get(name),expected.hash,"manifest mismatch "+name);
});
