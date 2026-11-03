import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {PNG} from 'pngjs';
const base=new URL('../public/',import.meta.url);
const path=name=>new URL(name,base);
const files=['peren-atlas.png','portrait.png','portrait-cast.png','portrait-hurt.png'];
test('M1h-A preserva os 128 frames 48×64 e transparência sem alterar a fonte',()=>{
 for(const file of files){
  const origin=path('art/characters/peren/'+file),candidate=path('art-m1h/characters/peren/'+file);
  assert.ok(existsSync(origin),file+' original indisponível');
  assert.ok(existsSync(candidate),file+' candidato indisponível');
  const a=PNG.sync.read(readFileSync(origin)),b=PNG.sync.read(readFileSync(candidate));
  assert.equal(b.width,a.width);assert.equal(b.height,a.height);
  if(file==='peren-atlas.png')assert.deepEqual([b.width,b.height],[1536,256]);
  let changed=0,opaque=0;
  for(let i=0;i<a.data.length;i+=4){
   assert.equal(b.data[i+3],a.data[i+3],'alpha deve ser preservado');
   if(a.data[i+3]){
    opaque++;
    if(a.data[i]!==b.data[i]||a.data[i+1]!==b.data[i+1]||a.data[i+2]!==b.data[i+2])changed++;
   }
  }
  assert.ok(changed>opaque*.02,'A variante deve mudar ao menos 2% dos pixels opacos: '+file);
 }
});
test('M1h-A mantém o original e o ensaio artístico separados',()=>{
 const plan=JSON.parse(readFileSync(path('art-m1h/characters/peren/report.json'),'utf8'));
 assert.equal(plan.status,'em_producao');
 assert.equal(plan.approval,'pendente');
 assert.equal(plan.report.length,4);
 const game=readFileSync(new URL('../src/exploration.js',import.meta.url),'utf8');
 const inventory=readFileSync(new URL('../src/ui-inventory.js',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const gallery=readFileSync(new URL('../review.html',import.meta.url),'utf8');
 for(const text of [game,inventory,main])assert.match(text,/art-m1h/);
 assert.match(gallery,/id="perenVariant"/);
 assert.match(gallery,/art-m1h/);
 assert.match(game,/new URLSearchParams\(location\.search\)/);
 assert.doesNotMatch(readFileSync(new URL('../src/progress.js',import.meta.url),'utf8'),/art-m1h/);
});
