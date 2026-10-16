import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const page=readFileSync(new URL('../teste.html',import.meta.url),'utf8');
const builder=readFileSync(new URL('../scripts/prepare-demo.mjs',import.meta.url),'utf8');

test('M1h-F.6: playtest local completo, acessivel e sem telemetria',()=>{
 assert.match(page,/<html lang="pt-BR">/);
 assert.match(page,/id="checklist"/);
 assert.match(page,/role="status" aria-live="polite"/);
 assert.match(page,/type='radio'/);
 assert.match(page,/navigator\.clipboard\?\.writeText/);
 assert.match(page,/URL\.createObjectURL/);
 assert.match(page,/prefers-reduced-motion:reduce/);
 assert.doesNotMatch(page,/(?:localStorage|sessionStorage)\.(?:setItem|removeItem|clear|getItem)/);
 assert.doesNotMatch(page,/\bfetch\(|XMLHttpRequest|sendBeacon/);
 assert.equal((page.match(/\['(?:Cidade e navegação|Controles por toque|Encontros e combate|Persistência|Diário de Peren|Recuperação de save|PWA e modo avião|Controle Xbox|Arte e legibilidade)'/g)||[]).length,9);
});
test('M1h-F.6: compilacao publica inclui guia somente na previa isolada',()=>{
 assert.match(builder,/if\(isolated\)await copyFile\(join\(lab,'teste.html'\),join\(dist,'teste.html'\)\)/);
 assert.match(builder,/id="m1hfPlaytestLink"/);
 assert.match(builder,/const precache=/);
 assert.match(builder,/cachePrefix=isolated\?'peren-phaser-m1hf-preview-'/);
});
