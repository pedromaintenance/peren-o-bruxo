import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const page=await readFile(new URL('../review.html',import.meta.url),'utf8');
const vite=await readFile(new URL('../vite.config.js',import.meta.url),'utf8');
test('galeria é exportada como página do Vite sem substituir o jogo',()=>{
  assert.match(vite,/index\.html/);
  assert.match(vite,/review\.html/);
  assert.match(page,/Ateliê de Sprites/);
  assert.match(page,/href="\.\/"/);
});
test('galeria cobre 128 quadros de Peren e três espécies',()=>{
  assert.match(page,/columns:32,rows:4/);
  assert.match(page,/columns:4,rows:7/);
  for(const name of ['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'])assert.match(page,new RegExp(name));
  for(const action of ['idle','walk','run','interact','gather','hurt','cast','attack'])assert.match(page,new RegExp("'"+action+"'"));
});
test('galeria não acessa ou altera save',()=>{
  assert.doesNotMatch(page,/localStorage|sessionStorage|peren_carcaca_save_v1|peren_phaser_save_m1d_v1/);
  assert.match(page,/prefers-reduced-motion/);
  assert.match(page,/imageSmoothingEnabled=false/);
});
