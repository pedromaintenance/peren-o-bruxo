import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(fileURLToPath(new URL("..",import.meta.url)));
const read=p=>readFileSync(resolve(root,p));
const m=JSON.parse(read("assets/icons/armadura-animation.json"));
const hash=b=>createHash("sha256").update(b).digest("hex");
test("original five-pose armour RGBA source is unchanged",()=>{
 const s=read(m.source);
 assert.equal(s.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.deepEqual([s.readUInt32BE(16),s.readUInt32BE(20)],[2048,748]);
 assert.equal(hash(s),m.sourceSha256);
 assert.ok(existsSync(resolve(root,m.backupPreviousStaticIcon)));
});
test("armadura.webp is a real eight-frame transparent animated WebP",()=>{
 const b=read(m.animation);
 assert.equal(b.toString("ascii",0,4),"RIFF");
 assert.equal(b.toString("ascii",8,12),"WEBP");
 assert.equal(b.toString("ascii",12,16),"VP8X");
 assert.equal(b.readUInt8(20)&2,2,"animation bit not set");
 assert.ok(b.indexOf(Buffer.from("ANIM"))>0);
 assert.equal((b.toString("ascii").match(/ANMF/g)||[]).length,8);
 assert.deepEqual(m.outputDimensions,[160,160]);
 assert.deepEqual(m.timeline,[0,1,2,3,4,3,2,1]);
 assert.equal(hash(b),m.outputSha256);
});
test("inventory still selects armor icon, saves unaffected, PWA versioned",()=>{
 const game=read("game.js").toString(),sw=read("sw.js").toString();
 assert.match(game,/if\(it\.categoria==='armadura'\)return n\.includes\('elmo'\)\?'elmo':'armadura'/);
 assert.match(game,/assets\/icons\/\$\{iconAsset\(it\)\}\.webp/);
 assert.match(game,/localStorage\.setItem\('peren_carcaca_save_v1'/);
 assert.ok(sw.includes(m.cacheVersion));
 assert.ok(sw.includes("'armadura'"));
 assert.ok(sw.includes("'anel'"));
 assert.ok(sw.includes("'arco'"));
});
