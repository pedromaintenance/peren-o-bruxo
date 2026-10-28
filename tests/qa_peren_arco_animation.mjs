import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
const base=resolve(fileURLToPath(new URL("..",import.meta.url)));
const file=p=>readFileSync(resolve(base,p));
const m=JSON.parse(file("assets/icons/arco-animation.json"));
const sha=b=>createHash("sha256").update(b).digest("hex");
test("approved five-pose bow original is intact and archived",()=>{
 const src=file(m.source);
 assert.equal(src.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.deepEqual([src.readUInt32BE(16),src.readUInt32BE(20)],[2048,748]);
 assert.equal(sha(src),m.sourceSha256);
 assert.ok(existsSync(resolve(base,m.backupPreviousStaticIcon)));
});
test("arco.webp is a real transparent eight-frame animated WebP",()=>{
 const b=file("assets/icons/arco.webp");
 assert.equal(b.toString("ascii",0,4),"RIFF");
 assert.equal(b.toString("ascii",8,12),"WEBP");
 assert.equal(b.toString("ascii",12,16),"VP8X");
 assert.equal(b.readUInt8(20)&2,2);
 assert.ok(b.indexOf(Buffer.from("ANIM"))>0);
 assert.equal((b.toString("ascii").match(/ANMF/g)||[]).length,8);
 assert.equal(sha(b),m.outputSha256);
 assert.deepEqual(m.outputDimensions,[160,160]);
 assert.deepEqual(m.timeline,[0,1,2,3,4,3,2,1]);
 assert.deepEqual(m.durationsMs,Array(8).fill(140));
});
test("existing bow items use same icon path and root PWA includes cache update",()=>{
 const game=file("game.js").toString(),sw=file("sw.js").toString();
 assert.match(game,/n.includes\('arco'\)\?'arco':'martelo'/);
 assert.match(game,/assets\/icons\/\$\{iconAsset\(it\)\}\.webp/);
 assert.ok(sw.includes(m.cacheVersion));
 assert.ok(sw.includes("'arco'"));
 assert.ok(sw.includes("'anel'"));
 assert.equal(file("assets/icons/anel.webp").subarray(0,4).toString("ascii"),"RIFF");
});
