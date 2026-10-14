import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PNG} from 'pngjs';
const base=new URL('../public/',import.meta.url);
const file=path=>PNG.sync.read(readFileSync(new URL(path,base)));
test('M1h-B tem atlas independente, 128 quadros e modifica apenas a faixa de cabeça',()=>{
 const a=file('art-m1h/characters/peren/peren-atlas.png');
 const b=file('art-m1hb/characters/peren/peren-atlas.png');
 assert.equal(a.width,1536);assert.equal(a.height,256);
 assert.equal(a.width,b.width);assert.equal(a.height,b.height);
 let headPixelsChanged=0;
 for(let d=0;d<4;d++)for(let act=0;act<8;act++)for(let frame=0;frame<4;frame++){
  let headChanged=false,bodyChanged=0;
  for(let y=0;y<64;y++)for(let x=0;x<48;x++){
   const i=(((d*64+y)*a.width)+(act*4+frame)*48+x)*4;
   let changed=false;
   for(let k=0;k<4;k++)if(a.data[i+k]!==b.data[i+k])changed=true;
   if(y<=42&&changed){headChanged=true;headPixelsChanged++}
   if(y>=43&&changed)bodyChanged++;
  }
  assert.equal(bodyChanged,0,'Body animation was changed at dir='+d+' action='+act+' frame='+frame);
  assert.ok(headChanged,'No changed head for frame dir='+d+' action='+act+' frame='+frame);
 }
 assert.ok(headPixelsChanged>128*40,'Expected real new head silhouette across all frames');
});
test('M1h-B possui 3 retratos 256x256 alterados com cor e silhueta',()=>{
 for(const type of ['portrait.png','portrait-cast.png','portrait-hurt.png']){
  const before=file('art-m1h/characters/peren/'+type),after=file('art-m1hb/characters/peren/'+type);
  assert.equal(after.width,256);assert.equal(after.height,256);
  let changed=0;
  for(let i=0;i<before.data.length;i+=4)if(Array.from({length:4},(_,k)=>before.data[i+k]!==after.data[i+k]).some(Boolean))changed++;
  assert.ok(changed>5500,type+' should not be just recoloured');
 }
 const report=JSON.parse(readFileSync(new URL('art-m1hb/characters/peren/report.json',base),'utf8'));
 assert.equal(report.stage,'M1h-B');assert.equal(report.approval,'pendente');
 assert.equal(report.report[0].frames,128);
});
test('M1h-B permanece opt-in e não modifica saves nem IDs de animação',()=>{
 const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
 for(const path of ['../src/exploration.js','../src/ui-inventory.js','../src/main.js','../review.html'])
  assert.match(read(path),/m1hb/);
 const js=read('../src/exploration.js');
 assert.match(js,/ai\*4\+3/);
 assert.doesNotMatch(read('../src/progress.js'),/art-m1hb/);
 assert.doesNotMatch(read('../src/combat.js'),/art-m1hb/);
 const gallery=read('../review.html');
 for(const opt of ['m1e','m1h','m1hb'])assert.match(gallery,new RegExp('value="'+opt+'"'));
});
