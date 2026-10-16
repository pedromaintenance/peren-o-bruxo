import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PNG} from 'pngjs';
const root=new URL('../public/',import.meta.url);
const names=['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'];
const actions=['idle','walk','alert','attack','hurt','retreat','death'];
const read=(path)=>PNG.sync.read(readFileSync(new URL(path,root)));
const frame=(a,x,y)=>{
  const pixels=[];
  for(let row=y*64;row<(y+1)*64;row++){
    const from=(row*a.width+x*64)*4;
    pixels.push(a.data.subarray(from,from+64*4));
  }
  return Buffer.concat(pixels);
};
for(const name of names)test('M1h-F '+name+' atlas / portrait valid',()=>{
  const atlas=read('art-m1hf/monsters/'+name+'/atlas.png');
  assert.equal(atlas.width,256);assert.equal(atlas.height,448);
  const portrait=read('art-m1hf/monsters/'+name+'/portrait.png');
  assert.equal(portrait.width,160);assert.equal(portrait.height,160);
  assert.ok(atlas.data.some((v,i)=>i%4===3&&v>0),'expected real opaque pixels');
});
test('M1h-F Ettercap contains distinct action poses, not static duplicated frames',()=>{
  const atlas=read('art-m1hf/monsters/mob-ettercap/atlas.png');
  for(let row=0;row<actions.length;row++){
    const variants=new Set([0,1,2,3].map(x=>frame(atlas,x,row).toString('base64')));
    assert.ok(variants.size>=3,actions[row]+': expected at least three unique frames');
  }
  const old=read('art-m1he/monsters/mob-ettercap/atlas.png');
  assert.notDeepEqual(atlas.data,old.data,'new creature art must differ from existing M1h-E');
});
test('M1h-F fallbacks keep both other creatures byte-for-byte in pixel data',()=>{
  for(const name of names.slice(0,2)){
    assert.deepEqual(read('art-m1hf/monsters/'+name+'/atlas.png').data,read('art-m1he/monsters/'+name+'/atlas.png').data);
    assert.deepEqual(read('art-m1hf/monsters/'+name+'/portrait.png').data,read('art-m1he/monsters/'+name+'/portrait.png').data);
  }
});
test('M1h-F origin, runtime opt-in and saves remain isolated',()=>{
  const source=readFileSync(new URL('../src/exploration.js',import.meta.url),'utf8');
  assert.match(source,/artVariant==='m1hf'/);
  const loader=readFileSync(new URL('../scripts/sync-assets.mjs',import.meta.url),'utf8');
  assert.match(loader,/murin-m1hf-generator\.mjs/);
  const progress=readFileSync(new URL('../src/progress.js',import.meta.url),'utf8');
  assert.doesNotMatch(progress,/art-m1hf/);
  for(const file of ['spider.png','spider_walk1.png','spider_walk2.png','spider_hit.png','spider_dead.png']){
    assert.ok(read('art-m1hf/kenney-platformer-spider/'+file).width>0);
  }
  const report=JSON.parse(readFileSync(new URL('art-m1hf/monsters/report.json',root),'utf8'));
  assert.deepEqual(report.playable,['mob-ettercap']);
  assert.equal(report.uniqueness.length,actions.length);
});
