// LORE-04 first visual integration: official Peren portrait + non-mutating camp consultation.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve, dirname} from "node:path";
const folder=resolve(dirname(fileURLToPath(import.meta.url)),"../phaser-demo-m1hf");
const read=p=>readFileSync(resolve(folder,p),"utf8");
const camp=read("campanha.html"),modes=read("modos.html"),sw=read("demo-sw.js");
const svg=read("art/characters/peren/official-v1/portrait-runtime.svg");
const saveScript=read("campanha.js");
test("portrait official is embedded self-contained, verified PNG signature and dimensions",()=>{
 assert.match(svg, /<svg[^>]+width="64" height="75"/);
 const b64=svg.match(/data:image\/png;base64,([^"]+)/)?.[1];
 assert.ok(b64,"missing data URI");
 const png=Buffer.from(b64,"base64");
 assert.equal(png.length,2614,"derivative binary integrity changed");
 assert.equal(png.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(png.readUInt32BE(16),64);
 assert.equal(png.readUInt32BE(20),75);
 assert.equal(png.toString("hex").slice(-24),"0000000049454e44ae426082","PNG ending");
 assert.match(svg,/image-rendering:pixelated/);
});
test("campaign and mode selection use official Peren portrait; previous atlas unchanged",()=>{
 const path="./art/characters/peren/official-v1/portrait-runtime.svg";
 assert.ok(camp.includes(path)&&modes.includes(path));
 assert.match(camp,/alt="Retrato oficial/);
 assert.match(camp,/Veyra Sull/);
 for(const name of ["Dren","Orel","Tavin Rook","Presas"])assert.ok(camp.includes(name));
 assert.match(camp,/rota ainda <strong>não foi escolhida<\/strong>/);
 assert.doesNotMatch(saveScript,/portrait-runtime|companion|timeline-entry/);
});
test("lore04 remains read-only and portrait offline",()=>{
 assert.match(sw,/peren-phaser-m1hf-preview-lore04(?:portrait|council|expedition)/);
 assert.ok(sw.includes('"./art/characters/peren/official-v1/portrait-runtime.svg"'));
 assert.match(camp,/<details class="companion">/);
 assert.doesNotMatch(camp,/localStorage|sessionStorage|indexedDB/);
});
