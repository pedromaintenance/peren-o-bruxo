import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PNG} from 'pngjs';
const root=new URL('../public/',import.meta.url);
const raw=p=>readFileSync(new URL(p,root));
const image=p=>PNG.sync.read(raw(p));
const d='art-m1hd/characters/peren/',c='art-m1hc/characters/peren/';
test('M1h-D alters expression in all 128 frames, preserving alpha and body pixels',()=>{
 const before=image(c+'peren-atlas.png'),after=image(d+'peren-atlas.png');
 assert.deepEqual([before.width,before.height],[1536,256]);
 assert.deepEqual([after.width,after.height],[1536,256]);
 let changed=0,framesChanged=0;
 for(let dir=0;dir<4;dir++)for(let action=0;action<8;action++)for(let frame=0;frame<4;frame++){
  let frameChanges=0;
  for(let y=0;y<64;y++)for(let x=0;x<48;x++){
   const i=((dir*64+y)*before.width+(action*4+frame)*48+x)*4;
   assert.equal(after.data[i+3],before.data[i+3],
    'Alpha changed in '+dir+':'+action+':'+frame);
   const differs=[0,1,2].some(k=>after.data[i+k]!==before.data[i+k]);
   if(y>=43)assert.equal(differs,false,
    'Body changed in '+dir+':'+action+':'+frame);
   if(differs){frameChanges++;changed++;}
  }
  framesChanged+=Number(frameChanges>0);
 }
 assert.equal(framesChanged,128,'Every frame must have facial or back-of-head refinement');
 assert.ok(changed>200,'Expected clear changes across the animation');
});
test('M1h-D rebuilds three portraits without adding transparency or pixel noise outside the face',()=>{
 for(const name of ['portrait.png','portrait-cast.png','portrait-hurt.png']){
  const before=image(c+name),after=image(d+name);
  assert.deepEqual([before.width,before.height],[256,256]);
  let changed=0;
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
   const k=(y*256+x)*4;
   assert.equal(before.data[k+3],after.data[k+3],name+': alpha');
   const diff=[0,1,2].some(i=>before.data[k+i]!==after.data[k+i]);
   if(diff){
    changed++;
    assert.ok(x>=90&&x<=170&&y>=108&&y<=169,
     name+': changed pixel outside facial expression '+x+','+y);
   }
  }
  assert.ok(changed>100,'Facial expression unchanged in '+name);
 }
 const report=JSON.parse(raw(d+'report.json'));
 assert.equal(report.stage,'M1h-D');
 assert.equal(report.status,'em_producao');
 assert.equal(report.approval,'pendente');
});
test('M1h-D opt-in leaves gameplay and previous art options intact',()=>{
 const file=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 for(const path of ['../src/main.js','../src/exploration.js','../src/ui-inventory.js','../review.html'])
  assert.match(file(path),/m1hd/);
 const gallery=file('../review.html');
 for(const variant of ['m1e','m1h','m1hb','m1hc','m1hd'])
  assert.ok(gallery.includes('value="'+variant+'"'));
 for(const path of ['../src/combat.js','../src/progress.js'])
  assert.doesNotMatch(file(path),/art-m1hd/);
});
