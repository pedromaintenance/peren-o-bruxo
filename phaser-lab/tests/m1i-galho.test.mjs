import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PNG} from 'pngjs';
const root=new URL('../public/',import.meta.url);
const read=p=>readFileSync(new URL(p,root));
const png=p=>PNG.sync.read(read(p));
const old='art/monsters/mob-galho-infectado/';
const art='art-m1i/monsters/mob-galho-infectado/';
test('M1i-A: Galho Infectado has exactly seven 4-frame clips at 64x64',()=>{
 const image=png(art+'atlas.png');
 assert.deepEqual([image.width,image.height],[256,448]);
 const original=png(old+'atlas.png');
 assert.deepEqual([original.width,original.height],[256,448]);
 let changed=0,changedFrames=0,nonempty=0;
 for(let a=0;a<7;a++)for(let f=0;f<4;f++){
  let sprite=0,different=0;
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){
   const px=((a*64+y)*image.width+f*64+x)*4;
   if(image.data[px+3])sprite++;
   if([0,1,2,3].some(i=>image.data[px+i]!==original.data[px+i]))different++;
  }
  assert.ok(sprite>100,'Blank frame '+a+':'+f);
  assert.ok(sprite<3000,'Monstrous overfill '+a+':'+f);
  if(sprite)nonempty++;
  if(different>100)changedFrames++;
  changed+=different;
 }
 assert.equal(nonempty,28);assert.equal(changedFrames,28);
 assert.ok(changed>7000,'Art remains too close to the previous atlas');
});
test('M1i-A: portrait is an actual distinct 160px visual with transparent corners',()=>{
 const a=png(art+'portrait.png'),b=png(old+'portrait.png');
 assert.deepEqual([a.width,a.height],[160,160]);
 assert.deepEqual([b.width,b.height],[160,160]);
 let solid=0;
 for(let i=3;i<a.data.length;i+=4)if(a.data[i]>0)solid++;
 assert.ok(solid>4000,'portrait lacks creature and frame');
 assert.equal(a.data[3],0,'top-left corner should remain transparent');
 assert.notDeepEqual(read(art+'portrait.png'),read(old+'portrait.png'));
 const report=JSON.parse(read(art+'report.json').toString());
 assert.equal(report.stage,'M1i-A');assert.equal(report.approval,'pendente');
 assert.equal(report.actions.length,7);
});
test('M1i-A: optional visuals do not modify monster AI, combat or saves',()=>{
 const src=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const exploration=src('../src/exploration.js'),main=src('../src/main.js'),gallery=src('../review.html');
 assert.match(exploration,/new URLSearchParams\(location\.search\).get\('monsters'\)==='m1i'/);
 assert.match(main,/monsters'\)==='m1i'/);
 assert.match(gallery,/id="monsterVariant"/);
 for(const path of ['../src/combat.js','../src/encounters.js','../src/progress.js'])
  assert.doesNotMatch(src(path),/art-m1i/);
});
