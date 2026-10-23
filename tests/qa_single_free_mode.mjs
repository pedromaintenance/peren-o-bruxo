// Product contract: one free-mode game. D&D table RPG is conceptual reference only.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {dirname,resolve,join} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const phaser=join(root,"phaser-demo-m1hf");
const get=path=>readFileSync(join(root,path),"utf8");
const hub=get("phaser-demo-m1hf/index.html");
const sw=get("phaser-demo-m1hf/demo-sw.js");
const readme=get("README.md");
const lore=get("lore/peren/README.md");
const roadmap=get("ROADMAP.md");
const portrait="art/characters/peren/official-v2/peren-portrait-official-256.png";
const obsolete=[
 "modos.html","campanha.html","campanha.js","cronica.html","cronica.js",
 "conselho-eldroth.js","expedicao-eldroth.js","rio-ancestral.js","dividas-mortos.js",
 "data/cronica-canonica.json","data/conselho-eldroth.json","data/expedicao-eldroth.json",
 "data/rio-ancestral.json","data/dividas-mortos.json"
];
test("one-game navigation has no second mode or D&D narrative campaign buttons",()=>{
 assert.doesNotMatch(hub,/id="selectPerenMode"|id="readCampChronicle"|href="\.\/(?:modos|campanha|cronica)\.html"/);
 assert.match(hub,/id="showJournal"/);
 assert.match(hub,/id="hudGold"/);
 assert.match(hub,/id="phaser"/);
 assert.ok(hub.includes('src="./art/characters/peren/official-v2/peren-portrait-official-256.png"'));
 assert.match(readme,/um único jogo sandbox/i);
 assert.match(lore,/referência de criação/i);
 assert.match(roadmap,/um único Modo Livre/);
});
test("retired dual-game pages are absent while official art and complete RPG lore remain",()=>{
 for(const file of obsolete)assert.equal(existsSync(join(phaser,file)),false,file);
 for(const path of [
  "lore/peren/Dossie_Peren_Kerrhylon_RPG_Carcaca.json",
  "lore/peren/ASSETS_OFICIAIS.md",
  "lore/peren/ADAPTACAO_AO_JOGO.md",
  "phaser-demo-m1hf/"+portrait,
  "phaser-demo-m1hf/art/characters/peren/atlas.json",
  "phaser-demo-m1hf/art/characters/peren/peren-atlas.png",
  "phaser-demo-m1hf/manifest.webmanifest"
 ])assert.ok(existsSync(join(root,path)),path);
});
test("precaching only assets that exist, without old second-game paths",()=>{
 const list=JSON.parse(sw.match(/const FILES=(\[[^\n]+\]);/)[1]);
 assert.ok(list.includes("./"+portrait));
 assert.ok(list.includes("./index.html"));
 assert.equal(new Set(list).size,list.length);
 for(const f of obsolete)assert.ok(!list.includes("./"+f),"unexpected offline campaign "+f);
 for(const f of list)if(f!=="./")assert.ok(existsSync(join(phaser,f)),"missing precache resource "+f);
 assert.match(sw,/battler-v81-20261022/);
 assert.match(sw,/k\.startsWith\(CACHE_PREFIX\)/);
});
test("there is no code wiping or migrating previous campaign saves",()=>{
 assert.doesNotMatch(hub,/localStorage\.clear\(|peren_campanha_v1|localStorage\.removeItem\(/);
 assert.doesNotMatch(sw,/peren_campanha_v1|localStorage/);
 assert.match(get("lore/peren/ADAPTACAO_AO_JOGO.md"),/não apagar/);
});
