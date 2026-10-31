/**
 * M1h-A art candidate. Non-destructive PNG recolour of the full real M1e atlas.
 * Original silhouette, 128 frames, animation timing, alpha and base files stay intact.
 * These are comparison assets, NOT canon/release-approved art.
 */
import {PNG} from 'pngjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';

const lab=resolve(import.meta.dirname,'..');
const input=join(lab,'public/art/characters/peren');
const output=join(lab,'public/art-m1h/characters/peren');
await mkdir(output,{recursive:true});
const from={
  '302c48':'242a35', // charcoal cloth
  '44405f':'3a424e',
  '615477':'5a626d',
  '24283f':'202a30', // coat
  '394260':'3f5057',
  'bd895a':'a68c67', // restrained antique gold
  'e2b879':'c8b28a',
  '22233a':'323a44', // old headwear subdued, not approved as canon
  '49405d':'697986',
  '844655':'43515a',
  '8f434d':'48525d',
  'b35f63':'77838b',
  '27242f':'adb6c1', // silver hair
  'a8a4b6':'e1e2dc',
  '302734':'b3b7bc', // silver beard
  '1b1b2d':'1c222b',
  '10121d':'10171e',
  '1a1b28':'161d25',
  '77635a':'776d68',
  '985e53':'a17872',
  'b8a0ff':'a8d6f0',
  'aa64ff':'6aa9d2',
  'e4c4ff':'c8e9f7',
  '6e57bd':'4e749a'
};
const lookup=new Map(Object.entries(from));
const files=['peren-atlas.png','portrait.png','portrait-cast.png','portrait-hurt.png'];
const report=[];
for(const filename of files){
 const original=PNG.sync.read(await readFile(join(input,filename)));
 const copy=new PNG({width:original.width,height:original.height});
 let recolored=0,opaque=0;
 for(let y=0;y<original.height;y++)for(let x=0;x<original.width;x++){
  const i=(y*original.width+x)*4,a=original.data[i+3];
  copy.data[i+3]=a;
  if(!a){copy.data[i]=copy.data[i+1]=copy.data[i+2]=0;continue;}
  opaque++;
  const key=[original.data[i],original.data[i+1],original.data[i+2]].map(n=>n.toString(16).padStart(2,'0')).join('');
  const replacement=lookup.get(key);
  if(replacement){
   copy.data[i]=parseInt(replacement.slice(0,2),16);
   copy.data[i+1]=parseInt(replacement.slice(2,4),16);
   copy.data[i+2]=parseInt(replacement.slice(4,6),16);
   recolored++;
  }else{
   copy.data[i]=original.data[i];
   copy.data[i+1]=original.data[i+1];
   copy.data[i+2]=original.data[i+2];
  }
 }
 if(filename==='peren-atlas.png'&&(original.width!==1536||original.height!==256))
  throw Error('Atlas incompatível: esperado 1536×256 (128 quadros 48×64): '+original.width+'×'+original.height);
 if(!recolored)throw Error('Paleta não encontrou cores na origem: '+filename);
 await writeFile(join(output,filename),PNG.sync.write(copy,{colorType:6}));
 report.push({filename,width:original.width,height:original.height,opaque,recolored,recoloredPercent:Math.round(100*recolored/opaque)});
}
await writeFile(join(output,'report.json'),JSON.stringify({
 stage:'M1h-A',status:'em_producao',approval:'pendente',
 goal:'cabelo e barba prateados; traje grafite; realces ouro envelhecido; magia azul-aciano',
 base:'M1e 128 quadros / 32 clips de animação',sources:files,palette:from,report
},null,2)+'\n');
console.log('M1h-A: '+report.map(r=>r.filename+' '+r.width+'×'+r.height+' '+r.recoloredPercent+'% recolorido').join('; '));
