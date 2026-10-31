import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PNG} from 'pngjs';
const root=new URL('../public/',import.meta.url);
const raw=path=>readFileSync(new URL(path,root));
const img=path=>PNG.sync.read(raw(path));
const prefix='characters/peren/';
const oldDir='art-m1hb/',newDir='art-m1hc/';
test('M1h-C preserves all 128 48x64 cells and modifies their heads, never the body',()=>{
 const before=img(oldDir+prefix+'peren-atlas.png'),after=img(newDir+prefix+'peren-atlas.png');
 assert.deepEqual([before.width,before.height],[1536,256]);
 assert.deepEqual([after.width,after.height],[1536,256]);
 let changed=0,headFrames=0;
 for(let d=0;d<4;d++)for(let a=0;a<8;a++)for(let f=0;f<4;f++){
  let count=0;
  for(let y=0;y<64;y++)for(let x=0;x<48;x++){
   const off=((d*64+y)*1536+(a*4+f)*48+x)*4;
   const diff=[0,1,2,3].some(ch=>before.data[off+ch]!==after.data[off+ch]);
   assert.equal(before.data[off+3],after.data[off+3],'Transparency modified in frame '+d+':'+a+':'+f);
   if(y>=43)assert.equal(diff,false,'Body damaged at direction '+d+' action '+a+' frame '+f);
   if(diff){count++;changed++;}
  }
  if(count>0)headFrames++;
 }
 assert.equal(headFrames,128,'Every animation should have at least one refined hair or beard pixel');
 assert.ok(changed>300,'New art should be visibly different from M1h-B');
});
test('M1h-C portraits are new, keep 256px composition and alpha',()=>{
 for(const name of ['portrait.png','portrait-cast.png','portrait-hurt.png']){
  const before=img(oldDir+prefix+name),after=img(newDir+prefix+name);
  assert.deepEqual([after.width,after.height],[256,256]);
  let changed=0;
  for(let i=0;i<before.data.length;i+=4){
   assert.equal(after.data[i+3],before.data[i+3],'Portrait alpha changed '+name);
   if([0,1,2].some(c=>after.data[i+c]!==before.data[i+c]))changed++;
  }
  assert.ok(changed>200,name+' has too few refined pixels: '+changed);
 }
 const report=JSON.parse(raw(newDir+prefix+'report.json').toString('utf8'));
 assert.equal(report.stage,'M1h-C');assert.equal(report.state,'em_producao');assert.equal(report.approval,'pendente');
});
test('M1h-C is strictly opt-in and cannot modify gameplay or classic save',()=>{
 for(const path of ['exploration.js','ui-inventory.js','main.js']){
  const txt=readFileSync(new URL('../src/'+path,import.meta.url),'utf8');
  assert.match(txt,/m1hc/);assert.match(txt,/art-m1hc/);
 }
 const gallery=readFileSync(new URL('../review.html',import.meta.url),'utf8');
 for(const v of ['m1e','m1h','m1hb','m1hc'])
  assert.match(gallery,new RegExp('value="'+v+'"'));
 for(const path of ['combat.js','progress.js'])
  assert.doesNotMatch(readFileSync(new URL('../src/'+path,import.meta.url),'utf8'),/m1hc/);
});
