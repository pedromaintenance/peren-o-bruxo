import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PNG} from 'pngjs';
const root=new URL('../public/',import.meta.url);
const species=['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'];
const actions=['idle','walk','alert','attack','hurt','retreat','death'];
const read=path=>PNG.sync.read(readFileSync(new URL(path,root)));
function frame(atlas,x,y){
 const parts=[];
 for(let row=y*64;row<(y+1)*64;row++){
  const start=(row*atlas.width+x*64)*4;
  parts.push(atlas.data.subarray(start,start+64*4));
 }
 return Buffer.concat(parts);
}
for(const id of species){
 test('M1h-F '+id+' has a valid, different PNG atlas and portrait',()=>{
  const atlas=read('art-m1hf/monsters/'+id+'/atlas.png');
  assert.equal(atlas.width,256);assert.equal(atlas.height,448);
  const portrait=read('art-m1hf/monsters/'+id+'/portrait.png');
  assert.equal(portrait.width,160);assert.equal(portrait.height,160);
  assert.ok(atlas.data.some((v,i)=>i%4===3&&v>0),'expected nontransparent pixels');
  const original=read('art-m1he/monsters/'+id+'/atlas.png');
  assert.notDeepEqual(atlas.data,original.data,id+': M1h-F must not be a disguised M1h-E fallback');
  for(const [row,action] of actions.entries()){
   const poses=[0,1,2,3].map(col=>frame(atlas,col,row));
   const unique=new Set(poses.map(p=>p.toString('base64')));
   assert.ok(unique.size>=3,id+' '+action+': expected at least 3 distinct images');
   for(const [col,pose] of poses.entries()){
    let coverage=0;
    for(let i=3;i<pose.length;i+=4)if(pose[i]>0)coverage++;
    assert.ok(coverage>=50,id+' '+action+' frame '+col+': image nearly blank ('+coverage+' pixels)');
    assert.ok(coverage<=2300,id+' '+action+' frame '+col+': unexpected opaque rectangle ('+coverage+' pixels)');
   }
  }
 });
}
test('M1h-F source assets are actual local licensed PNGs',()=>{
 for(const [folder,files] of Object.entries({
   'kenney-platformer-spider':['spider.png','spider_walk1.png','spider_walk2.png','spider_hit.png','spider_dead.png'],
   'kenney-mushrooms':['tallShroom_red.png','tinyShroom_red.png','stemShroom.png','shroomRedMid.png'],
   'oga-forest':['forest_tiles.png']
 })){
  for(const file of files){
   const x=read('art-m1hf/'+folder+'/'+file);
   assert.ok(x.width>0&&x.height>0,folder+'/'+file+' cannot be decoded');
  }
 }
});
test('M1h-F sprite pipeline is opt-in and never writes save code',()=>{
 const exploration=readFileSync(new URL('../src/exploration.js',import.meta.url),'utf8');
 assert.match(exploration,/artVariant==='m1hf'/);
 const sync=readFileSync(new URL('../scripts/sync-assets.mjs',import.meta.url),'utf8');
 assert.match(sync,/murin-m1hf-generator\.mjs/);
 assert.match(sync,/murin-m1hf-botanical-generator\.mjs/);
 const progress=readFileSync(new URL('../src/progress.js',import.meta.url),'utf8');
 assert.doesNotMatch(progress,/art-m1hf/);
 const report=JSON.parse(readFileSync(new URL('art-m1hf/monsters/report.json',root),'utf8'));
 assert.deepEqual(report.playable,species);
 assert.deepEqual(report.fallingBackToM1hE,[]);
 assert.equal(report.uniqueness.length,actions.length);
 assert.equal(report.botanicals.length,2);
 for(const botanical of report.botanicals){
  assert.deepEqual(botanical.uniqueness.map(e=>e.action),actions);
  assert.ok(botanical.uniqueness.every(e=>e.uniqueFrames>=3));
 }
});
