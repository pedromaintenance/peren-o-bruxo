import {PNG} from 'pngjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const base=new URL('../public/',import.meta.url),read=async p=>PNG.sync.read(await readFile(new URL(p,base)));
const image=new PNG({width:960,height:670});
for(let i=0;i<image.data.length;i+=4){image.data[i]=9;image.data[i+1]=22;image.data[i+2]=28;image.data[i+3]=255;}
function copy(im,sx,sy,w,h,dx,dy,scale=1){
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const off=((sy+y)*im.width+sx+x)*4,a=im.data[off+3]/255;
  if(!a)continue;
  for(let vy=0;vy<scale;vy++)for(let vx=0;vx<scale;vx++){
   const xx=dx+x*scale+vx,yy=dy+y*scale+vy;
   if(xx<0||yy<0||xx>=image.width||yy>=image.height)continue;
   const k=(yy*image.width+xx)*4;
   for(let c=0;c<3;c++)image.data[k+c]=Math.round(im.data[off+c]*a+image.data[k+c]*(1-a));
  }
 }
}
const a=await read('art/monsters/mob-galho-infectado/portrait.png');
const b=await read('art-m1i/monsters/mob-galho-infectado/portrait.png');
copy(a,0,0,160,160,80,12,2);
copy(b,0,0,160,160,560,12,2);
const old=await read('art/monsters/mob-galho-infectado/atlas.png');
const modern=await read('art-m1i/monsters/mob-galho-infectado/atlas.png');
for(let act=0;act<7;act++){
 copy(old,2*64,act*64,64,64,35+act*128,355,2);
 copy(modern,2*64,act*64,64,64,35+act*128,510,2);
}
await mkdir('screenshots',{recursive:true});
const data=PNG.sync.write(image);
await writeFile('screenshots/m1i-a-galho-contact-sheet.png',data);
console.log('M1i-A 960×670: two portraits + seven M1e and seven M1i-A action frames');
if(process.env.PEREN_PREVIEW_B64==='1')
 console.log('PEREN_PREVIEW_BASE64='+data.toString('base64'));
