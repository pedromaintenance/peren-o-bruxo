import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(resolve(root,p),"utf8");
test("v8.2 script is review-only and reproducible without changing combat state",()=>{
 const code=read("ferramentas/tratar_battlers_v82.py");
 assert.match(code,/right edge smootherstep alpha|smootherstep/i);
 assert.match(code,/sha256/);
 assert.match(code,/INPUTS=/);
 assert.match(code,/review_only_not_published/);
 assert.doesNotMatch(code,/git push|requests\.post|finishBattle|stepBattle/);
});
test("current Phaser app still uses approved v8.1 assets and no unreleased spells",()=>{
 const html=read("phaser-demo-m1hf/index.html");
 const runtime=read("phaser-demo-m1hf/battle-art-runtime-v81.mjs");
 assert.match(html,/battle-art-runtime-v81\.mjs/);
 assert.match(runtime,/const assets=\[CONTRACT\.idle,CONTRACT\.summon\]/);
 assert.match(runtime,/CINEMATIC_ACTIONS=Object\.freeze\(\{\}\)/);
 assert.match(runtime,/battle-asset-pack-v81\.json/);
 assert.doesNotMatch(runtime,/getAnimationPlan\("spell:mag-summon-greater-demon"\)/);
});
test("no invalid binary release entries added by the art review",()=>{
 const sw=read("phaser-demo-m1hf/demo-sw.js");
 assert.doesNotMatch(sw,/runtime-v82\/infernal\.png|runtime-v82\/void\.png/);
 assert.match(sw,/battle-art-runtime-v81\.mjs/);
});
