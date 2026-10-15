// M1h-E: visual side-by-side portrait and face zooms (no CSS/UI mockups).
import {PNG} from 'pngjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../public/',import.meta.url);
const load=async p=>PNG.sync.read(await readFile(new URL(p,root)));
const w=1024,h=768,canvas=new PNG({width:w,height:h});
for(let i=0;i<canvas.data.length;i+=4){
 canvas.data[i]=12;canvas.data[i+1]=23;canvas.data[i+2]=34;canvas.data[i+3]=255;
}
function draw(src,sx,sy,sw,sh,x,y,k=1){
 for(let by=0;by<sh;by++)for(let bx=0;bx<sw;bx++){
  const i=((sy+by)*src.width+sx+bx)*4;
  const a=src.data[i+3]/255;if(!a)continue;
  for(let dy=0;dy<k;dy++)for(let dx=0;dx<k;dx++){
   const px=x+bx*k+dx,py=y+by*k+dy;
   if(px<0||px>=w||py<0||py>=h)continue;
   const j=(py*w+px)*4;
   for(let c=0;c<3;c++)
    canvas.data[j+c]=Math.round(src.data[i+c]*a+canvas.data[j+c]*(1-a));
  }
 }
}
const prior=await load('art-m1hd/characters/peren/portrait.png');
const current=await load('art-m1he/characters/peren/portrait.png');
const cast=await load('art-m1he/characters/peren/portrait-cast.png');
const hurt=await load('art-m1he/characters/peren/portrait-hurt.png');
const ports=[prior,current,cast,hurt];
ports.forEach((im,i)=>{
 draw(im,0,0,256,256,i*256,0,1);
 // A 128×128 (face + moustache) enlargement at 2× shows pixel decisions.
 draw(im,65,90,128,128,i*256,256,2);
});
const atlas=await load('art-m1he/characters/peren/peren-atlas.png');
for(let i=0;i<4;i++)draw(atlas,0,64*i,48,64,32+i*256,512,4);
await mkdir('screenshots',{recursive:true});
const bytes=PNG.sync.write(canvas);
await writeFile('screenshots/m1h-e-portrait-study.png',bytes);
console.log('M1h-E: 1024x768 face study, four portraits and four atlas directions; '+bytes.length+' PNG bytes');
if(process.env.PEREN_PREVIEW_B64==='1')
 console.log('PEREN_PREVIEW_BASE64='+bytes.toString('base64'));
