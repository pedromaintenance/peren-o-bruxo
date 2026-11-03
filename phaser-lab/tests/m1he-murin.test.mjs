import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PNG} from 'pngjs';
const root=new URL('../public/',import.meta.url);
for(const id of ['mob-galho-infectado','mob-fungo-violeta','mob-ettercap']){
 test('M1h-E '+id+' retains 7 animations, silhouette and alpha',()=>{
  const a=PNG.sync.read(readFileSync(new URL('art/monsters/'+id+'/atlas.png',root)));
  const b=PNG.sync.read(readFileSync(new URL('art-m1he/monsters/'+id+'/atlas.png',root)));
  assert.equal(a.width,256);assert.equal(a.height,448);
  assert.equal(b.width,a.width);assert.equal(b.height,a.height);
  let changed=0;
  for(let i=0;i<a.data.length;i+=4){
   assert.equal(b.data[i+3],a.data[i+3],'alpha regression at '+i/4);
   if([0,1,2].some(k=>a.data[i+k]!==b.data[i+k]))changed++;
  }
  assert.ok(changed>100,'Expected visible pixel alteration');
  const p=PNG.sync.read(readFileSync(new URL('art-m1he/monsters/'+id+'/portrait.png',root)));
  assert.ok(p.width>0&&p.height>0);
 });
}
test('M1h-E does not modify monster catalogue or save logic',()=>{
 const src=readFileSync(new URL('../src/exploration.js',import.meta.url),'utf8');
 assert.match(src,/artVariant==='m1he'/);
 assert.match(src,/MONSTER_ART/);
 const progress=readFileSync(new URL('../src/progress.js',import.meta.url),'utf8');
 assert.doesNotMatch(progress,/art-m1he/);
});
