import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PNG} from 'pngjs';
const root=new URL('../public/',import.meta.url);
const data=p=>readFileSync(new URL(p,root));
const img=p=>PNG.sync.read(data(p));
const old='art-m1hd/characters/peren/',next='art-m1he/characters/peren/';
test('M1h-E intentionally preserves every byte of the 128-frame animated atlas',()=>{
 const a=data(old+'peren-atlas.png'),b=data(next+'peren-atlas.png');
 assert.deepEqual(b,a);
 const atlas=PNG.sync.read(b);
 assert.deepEqual([atlas.width,atlas.height],[1536,256]);
});
test('M1h-E redesigns three veteran portraits without changing alpha or background',()=>{
 for(const name of ['portrait.png','portrait-cast.png','portrait-hurt.png']){
  const a=img(old+name),b=img(next+name);
  assert.deepEqual([a.width,a.height],[256,256]);
  assert.deepEqual([b.width,b.height],[256,256]);
  let count=0,lowerFace=0;
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
   const p=(y*256+x)*4;
   assert.equal(a.data[p+3],b.data[p+3],name+' alpha changed at '+x+','+y);
   if([0,1,2].some(k=>a.data[p+k]!==b.data[p+k])){
    assert.ok(x>=88&&x<=176&&y>=103&&y<=207,
      name+': paint escaped face envelope '+x+','+y);
    count++;
    if(y>147)lowerFace++;
   }
  }
  assert.ok(count>2300,name+' face not sufficiently redesigned '+count);
  assert.ok(lowerFace>500,name+' mouth/beard region not redesigned');
 }
 const report=JSON.parse(data(next+'report.json').toString());
 assert.equal(report.stage,'M1h-E');assert.equal(report.approval,'pendente');
 assert.equal(report.atlas.preserved,true);
});
test('M1h-E visual option never mutates gameplay or character storage',()=>{
 const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
 const gallery=read('../review.html');
 for(const name of ['m1e','m1h','m1hb','m1hc','m1hd','m1he'])
  assert.ok(gallery.includes('value="'+name+'"'),'Missing candidate '+name);
 for(const file of ['../src/main.js','../src/exploration.js','../src/ui-inventory.js'])
  assert.match(read(file),/art-m1he/);
 for(const file of ['../src/combat.js','../src/progress.js'])
  assert.doesNotMatch(read(file),/art-m1he/);
});
