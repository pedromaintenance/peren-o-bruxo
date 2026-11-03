/** M1h-E: non-destructive monster lighting pass. Existing silhouettes, alpha and frames remain unchanged. */
import {PNG} from 'pngjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../public/',import.meta.url);
const specs={
 'mob-galho-infectado':{shadow:[40,50,38],light:[151,169,116]},
 'mob-fungo-violeta':{shadow:[46,30,65],light:[159,114,191]},
 'mob-ettercap':{shadow:[37,38,51],light:[145,139,152]}
};
const report=[];
for(const [id,palette] of Object.entries(specs)){
 const source=new URL('art/monsters/'+id+'/',root);
 const target=new URL('art-m1he/monsters/'+id+'/',root);
 await mkdir(target,{recursive:true});
 for(const file of ['atlas.png','portrait.png']){
  const before=PNG.sync.read(await readFile(new URL(file,source)));
  if(file==='atlas.png'&&(before.width!==256||before.height!==448))throw Error(id+': atlas inesperado; exige 4 quadros de 64×64 por 7 ações');
  const after=PNG.sync.read(await readFile(new URL(file,source)));
  let changed=0,opaque=0;
  for(let y=0;y<after.height;y++)for(let x=0;x<after.width;x++){
   const i=(y*after.width+x)*4,a=after.data[i+3];
   if(!a)continue;
   opaque++;
   const frameX=file==='atlas.png'?x%64:x*64/after.width;
   const frameY=file==='atlas.png'?y%64:y*64/after.height;
   // Directional chiaroscuro, with a restrained species-specific color cast.
   const light=Math.max(0,Math.min(1,.55+.32*(.52-frameX/64)+.18*(.55-frameY/64)));
   const old=[after.data[i],after.data[i+1],after.data[i+2]];
   const lum=(old[0]*.2126+old[1]*.7152+old[2]*.0722)/255;
   const strength=0.13+(1-lum)*.075;
   for(let k=0;k<3;k++){
    const tone=palette.shadow[k]*(1-light)+palette.light[k]*light;
    after.data[i+k]=Math.max(0,Math.min(255,Math.round(old[k]*(1-strength)+tone*strength)));
   }
   if(old.some((c,k)=>after.data[i+k]!==c))changed++;
  }
  await writeFile(new URL(file,target),PNG.sync.write(after));
  report.push({id,file,width:after.width,height:after.height,opaque,changed});
 }
}
await writeFile(new URL('art-m1he/monsters/report.json',root),JSON.stringify({stage:'M1h-E',candidate:true,approval:'pendente',technique:'non-destructive localized chiaroscuro',report},null,2)+'\n');
console.log('M1h-E: 3 monster atlas and 3 portraits generated (candidate lighting pass)');
