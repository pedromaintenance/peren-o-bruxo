// LORE-02 regressions. Run: node --test tests/qa_lore02.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname, resolve} from "node:path";
import {runInNewContext} from "node:vm";

const folder = resolve(dirname(fileURLToPath(import.meta.url)), "../phaser-demo-m1hf");
const source = resolve(folder, "../lore/peren/Dossie_Peren_Kerrhylon_RPG_Carcaca.json");
const json = JSON.parse(readFileSync(resolve(folder, "data/cronica-canonica.json"), "utf8"));
const canon = JSON.parse(readFileSync(source, "utf8"));
const script = readFileSync(resolve(folder, "cronica.js"), "utf8");
const page = readFileSync(resolve(folder, "cronica.html"), "utf8");
const game = readFileSync(resolve(folder, "index.html"), "utf8");
const worker = readFileSync(resolve(folder, "demo-sw.js"), "utf8");

test("a projeção mantém origem, 21 capítulos e quatro companheiros", () => {
  assert.equal(json.schema, "peren-chronicle-1");
  assert.equal(json.sourceVersion, canon.metadados.versao_dossie);
  assert.equal(json.timeline.length, 21);
  assert.equal(json.company.length, 4);
  assert.deepEqual(json.timeline.map(t => t.title), canon.linha_do_tempo.map(t => t.titulo));
  assert.deepEqual(json.company.map(c => c.name), canon.companhia.membros.map(c => c.nome));
  assert.equal(json.familiar.name, canon.familiar.nome);
  assert.equal(json.patron.name, canon.protagonista.patrono.nome);
  assert.equal(json.character.level, 7);
});

test("juramento, moedas e máscara não são reescritos", () => {
  const mask = json.relics.find(r => r.id === "mascara_sem_nome");
  assert.match(mask.condition, /NÃO foi saqueada/);
  assert.equal(json.relics.find(r => r.id === "tres_moedas").condition, canon.reliquias_e_itens_especiais.find(r => r.id === "tres_moedas").estado);
  assert.ok(json.promises.some(p => p.id === "juramento_cajado"));
  assert.ok(json.promises.some(p => p.id === "segundo_ritual_cripta"));
  assert.match(json.currentScene.openChoice, /Rio Ancestral/);
});

test("menu alcançável, retorno e precache versionado", () => {
  assert.match(game, /id="readCampChronicle"[^>]+href="\.\/cronica\.html"/);
  assert.match(page, /href="\.\/index\.html"/);
  assert.match(page, /name="viewport"/);
  assert.match(page, /@media\(max-width:560px\)/);
  for (const item of ["./cronica.html", "./cronica.js", "./data/cronica-canonica.json"]) {
    assert.ok(worker.includes(JSON.stringify(item)), item);
  }
});

test("leitor sem APIs de persistência nem HTML não confiável", () => {
  assert.doesNotMatch(script, /localStorage|sessionStorage|indexedDB|innerHTML|saveProgress|writeSave/);
  assert.match(script, /\.textContent\s*=/);
  assert.match(script, /\.replaceChildren\(/);
});

test("DOM simulado renderiza sete seções e 21 marcos sem salvar", async () => {
  class FakeNode {
    constructor(tag) {this.tag = tag; this.children = []; this.hidden = false; this.textContent = ""; this.className = ""; this.events = {};}
    append(...nodes) {this.children.push(...nodes); return this;}
    replaceChildren(...nodes) {this.children = nodes; return this;}
    addEventListener(name, cb) {this.events[name] = cb;}
  }
  const root = new FakeNode("div");
  const document = {
    getElementById: id => {assert.equal(id, "chronicleRoot"); return root;},
    createElement: tag => new FakeNode(tag),
    createTextNode: value => new FakeNode("#text").append(value)
  };
  const fetch = async () => ({ok: true, json: async () => json});
  runInNewContext(script, {document, fetch, Promise, console});
  await new Promise(resolve => setImmediate(resolve));
  const sections = root.children.filter(x => x.tag === "details");
  assert.equal(sections.length, 7);
  const events = sections[1].children[1].children.filter(x => x.className === "entry timeline-entry");
  assert.equal(events.length, 21);
  assert.ok(sections.every(s => !s.open), "seções começam fechadas");
});
