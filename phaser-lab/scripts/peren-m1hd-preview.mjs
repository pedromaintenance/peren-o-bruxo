// Build 768×512 visual QA preview. The final PNG is an artifact, not a runtime UI element.
import {PNG} from 'pngjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../public/',import.meta.url);
const read=async(path)=>PNG.sync.read(await readFile(new URL(path,root)));
const out=new PNG({width:768,height:512});
for(let i=0;i<out.data.length;i+=4){out.data[i]=12;out.data[i+1]=25;out.data[i+2]=38;out.data[i+3]=255;}
const composite=(img,sx,sy,sw,sh,dx,dy,scale=1)=>{
 for(let y=0;y<sh;y++)for(let x=0;x<sw;x++){
  const a=((sy+y)*img.width+sx+x)*4,opacity=img.data[a+3]/255;
  if(!opacity)continue;
  for(let yy=0;yy<scale;yy++)for(let xx=0;xx<scale;xx++){
   const rx=dx+x*scale+xx,ry=dy+y*scale+yy;
   if(rx<0||ry<0||rx>=out.width||ry>=out.height)continue;
   const b=(ry*out.width+rx)*4;
   for(let k=0;k<3;k++)out.data[b+k]=Math.round(img.data[a+k]*opacity+out.data[b+k]*(1-opacity));
  }
 }
};
const old=await read('art-m1hc/characters/peren/portrait.png');
const fresh=await read('art-m1hd/characters/peren/portrait.png');
const cast=await read('art-m1hd/characters/peren/portrait-cast.png');
composite(old,0,0,256,256,0,0);
composite(fresh,0,0,256,256,256,0);
composite(cast,0,0,256,256,512,0);
const atlas=await read('art-m1hd/characters/peren/peren-atlas.png');
for(let i=0;i<4;i++)composite(atlas,0,i*64,48,64,192*i,256,4);
await mkdir('screenshots',{recursive:true});
const bytes=PNG.sync.write(out);
await writeFile('screenshots/m1h-d-contact-sheet.png',bytes);
console.log('M1h-D visual contact-sheet: '+out.width+'×'+out.height+', '+bytes.length+' bytes');
if(process.env.PEREN_PREVIEW_B64==='1')console.log('PEREN_PREVIEW_BASE64='+bytes.toString('base64'));
