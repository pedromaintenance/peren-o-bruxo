import test from 'node:test';
import assert from 'node:assert/strict';
import {PNG} from 'pngjs';
import {readFileSync} from 'node:fs';

const source=PNG.sync.read(readFileSync(new URL('../../phaser/assets/characters/peren/peren-atlas.png',import.meta.url)));
const runtime=PNG.sync.read(readFileSync(new URL('../public/art/characters/peren/peren-atlas.png',import.meta.url)));
test('atlas oficial 16×8 é rearranjado para 32×4 sem alterar um único pixel dos 128 quadros',()=>{
 const FW=48,FH=64,FRAMES=128;
 assert.equal(source.width*source.height,1536*256);
 assert.deepEqual([runtime.width,runtime.height],[1536,256]);
 assert.equal(source.width%FW,0);
 assert.equal(runtime.width%FW,0);
 for(let frame=0;frame<FRAMES;frame++){
  const sx=(frame%(source.width/FW))*FW,sy=Math.floor(frame/(source.width/FW))*FH;
  const dx=(frame%(runtime.width/FW))*FW,dy=Math.floor(frame/(runtime.width/FW))*FH;
  for(let y=0;y<FH;y++){
   const s=((sy+y)*source.width+sx)*4;
   const d=((dy+y)*runtime.width+dx)*4;
   assert.deepEqual(runtime.data.subarray(d,d+FW*4),source.data.subarray(s,s+FW*4),'frame '+frame+' row '+y);
  }
 }
});
