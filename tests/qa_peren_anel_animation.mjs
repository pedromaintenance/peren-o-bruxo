import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
const base=resolve(fileURLToPath(new URL("..",import.meta.url)));
const file=p=>readFileSync(resolve(base,p));
const source=file("assets/icons/sources/anel-5poses-original.png");
const webp=file("assets/icons/anel.webp");
const m=JSON.parse(file("assets/icons/anel-animation.json"));
const sha=b=>createHash("sha256").update(b).digest("hex");
test("source five-pose ring preserved byte for byte",()=>{
 assert.equal(sha(source),m.sourceSha256);
 assert.equal(source.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.deepEqual([source.readUInt32BE(16),source.readUInt32BE(20)],[2048,689]);
});
test("ring icon is genuine animated WebP in existing path",()=>{
 assert.equal(webp.toString("ascii",0,4),"RIFF");
 assert.equal(webp.toString("ascii",8,12),"WEBP");
 assert.equal(webp.toString("ascii",12,16),"VP8X");
 assert.equal(webp.readUInt8(20)&2,2,"VP8X animation flag missing");
 assert.ok(webp.indexOf(Buffer.from("ANIM"))>0);
 assert.equal(webp.toString("ascii").match(/ANMF/g).length,8);
 assert.equal(sha(webp),m.outputSha256);
 assert.deepEqual(m.outputDimensions,[160,160]);
 assert.deepEqual(m.timeline,[0,1,2,3,4,3,2,1]);
});
test("existing inventory img uses ring path and root PWA cache is versioned",()=>{
 const game=file("game.js").toString();
 const sw=file("sw.js").toString();
 assert.match(game,/return n\.includes\('anel'\)\?'anel':'tomo'/);
 assert.match(game,/assets\/icons\/\$\{iconAsset\(it\)\}\.webp/);
 assert.ok(sw.includes(m.cacheVersion));
 assert.ok(sw.includes("'anel'"));
 assert.ok(sw.includes("./assets/icons/"));
});