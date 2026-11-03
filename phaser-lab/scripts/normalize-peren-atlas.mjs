/**
 * M0 — normalizar somente a CÓPIA temporária do atlas para os antigos
 * geradores M1h (32 colunas x 4 linhas). Não modifica a arte canônica,
 * os 128 IDs/quadros, a geometria RGBA nem o bundle publicado.
 */
import {PNG} from 'pngjs';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const lab=resolve(import.meta.dirname,'..');
const file=join(lab,'public','art','characters','peren','peren-atlas.png');
const source=PNG.sync.read(await readFile(file));
const FW=48,FH=64,FRAMES=128;
const OLD=[1536,256],CURRENT=[768,512];
if(source.width===OLD[0]&&source.height===OLD[1]){
 console.log('Atlas 32×4 já compatível com os geradores M1h.');
}else if(source.width===CURRENT[0]&&source.height===CURRENT[1]){
 const output=new PNG({width:OLD[0],height:OLD[1]});
 const fromCols=source.width/FW,toCols=output.width/FW;
 for(let f=0;f<FRAMES;f++){
  const sx=(f%fromCols)*FW,sy=Math.floor(f/fromCols)*FH;
  const dx=(f%toCols)*FW,dy=Math.floor(f/toCols)*FH;
  for(let y=0;y<FH;y++){
   const start=((sy+y)*source.width+sx)*4, dest=((dy+y)*output.width+dx)*4;
   source.data.copy(output.data,dest,start,start+FW*4);
  }
 }
 await writeFile(file,PNG.sync.write(output,{colorType:6}));
 console.log('Atlas da CÓPIA Phaser rearranjado 16×8 → 32×4 (128 quadros RGBA, sem perdas).');
}else throw Error('Atlas canônico inesperado: '+source.width+'×'+source.height);
