/**
 * M1h-F: licensed external pixel artwork adapted for the first playable Mürin creature.
 * Sources: Kenney Platformer Art Extended Enemies (CC0), original PNGs in public/art-m1hf/.
 * This file generates artwork ONLY; encounter logic, combat and save data remain untouched.
 */
import {PNG} from 'pngjs';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';

const publicRoot=new URL('../public/',import.meta.url);
const originals=new URL('art-m1he/monsters/',publicRoot);
const output=new URL('art-m1hf/monsters/',publicRoot);
const kenney=new URL('art-m1hf/kenney-platformer-spider/',publicRoot);
const id='mob-ettercap';
const actions=['idle','walk','alert','attack','hurt','retreat','death'];
const sources=['spider.png','spider_walk1.png','spider_walk2.png','spider_hit.png','spider_dead.png'];
const poses=Object.fromEntries(await Promise.all(sources.map(async name=>[name,PNG.sync.read(await readFile(new URL(name,kenney)))])));

function pixel(canvas,x,y,r,g,b,a=255) {
  x=Math.round(x);y=Math.round(y);
  if(x<0||y<0||x>=canvas.width||y>=canvas.height||a<=0)return;
  const i=(y*canvas.width+x)*4,previous=canvas.data[i+3]/255,front=a/255;
  const alpha=front+previous*(1-front);
  if(alpha<=0)return;
  for(const [j,value] of [r,g,b].entries()){
    canvas.data[i+j]=Math.round((value*front+canvas.data[i+j]*previous*(1-front))/alpha);
  }
  canvas.data[i+3]=Math.round(alpha*255);
}
function line(canvas,x0,y0,x1,y1,color){
  x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
  const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;
  let err=dx+dy;
  while(true){
    pixel(canvas,x0,y0,...color);
    if(x0===x1&&y0===y1)break;
    const e=2*err;
    if(e>=dy){err+=dy;x0+=sx}
    if(e<=dx){err+=dx;y0+=sy}
  }
}
function shadow(canvas,cx,cy,w=21,opacity=55){
  for(let y=-3;y<=3;y++)for(let x=-w;x<=w;x++){
    if((x*x)/(w*w)+(y*y)/9>1)continue;
    if((x+y)%2===0)pixel(canvas,cx+x,cy+y,12,12,20,Math.round(opacity*(1-Math.abs(x)/w)));
  }
}
function drawSpider(canvas,image,cx,baseY,{width=37,height=36,alpha=255,flash=false}={}){
  const factor=Math.min(width/image.width,height/image.height);
  const w=Math.max(1,Math.round(image.width*factor)),h=Math.max(1,Math.round(image.height*factor));
  const ox=Math.round(cx-w/2),oy=Math.round(baseY-h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const sx=Math.min(image.width-1,Math.floor(x*image.width/w));
    const sy=Math.min(image.height-1,Math.floor(y*image.height/h));
    const i=(sy*image.width+sx)*4,a=image.data[i+3];
    if(a<40)continue;
    const lum=(image.data[i]*.2126+image.data[i+1]*.7152+image.data[i+2]*.0722)/255;
    const tone=Math.max(.08,Math.min(1,lum*1.5));
    // Ochre Kenney geometry becomes bruised chitin in the Mürin palette.
    const red=flash?Math.round(108+tone*120):Math.round(30+tone*88);
    const green=flash?Math.round(43+tone*76):Math.round(27+tone*65);
    const blue=flash?Math.round(58+tone*83):Math.round(36+tone*78);
    pixel(canvas,ox+x,oy+y,red,green,blue,Math.round(a*alpha/255));
  }
  return {x:ox,y:oy,w,h};
}
function drawEyes(canvas,cx,cy,frame,action){
  const glow=action==='alert'||action==='attack'?230:action==='death'?70:177;
  const step=frame%2?1:0;
  for(const [dx,dy] of [[-6,0],[-2,-2],[2,-2],[6,0]]){
    pixel(canvas,cx+dx,cy+dy,48,14,23,220);
    pixel(canvas,cx+dx,cy+dy-1,glow,40+step*30,36+step*13,235);
  }
  pixel(canvas,cx-2,cy+1,211,132,70,255);
  pixel(canvas,cx+2,cy+1,211,132,70,255);
}
function decorate(canvas,action,frame,cx,baseY){
  const t=frame;
  if(action==='alert'){
    for(const x of [-15,15])line(canvas,cx+x,baseY-25-t%2,cx+x+(x<0?-3:3),baseY-32-t%2,[133,76,77,180]);
    pixel(canvas,cx-10,baseY-38+t%2,174,49,57,210);
    pixel(canvas,cx+11,baseY-38+(t+1)%2,174,49,57,210);
  }
  if(action==='attack'){
    const reach=[0,3,9,5][t];
    line(canvas,cx-16,baseY-19,cx-19-reach,baseY-29+Math.floor(t/2),[161,96,91,240]);
    line(canvas,cx+16,baseY-19,cx+19+reach,baseY-29+Math.floor(t/2),[161,96,91,240]);
    if(t>1)for(let p=0;p<t+2;p++)pixel(canvas,cx-8+p*3,baseY-9-t,174,174,161,130);
  }
  if(action==='hurt'){
    for(let s=0;s<4;s++){
      const x=cx-18+(s*11+t*3)%37,y=baseY-32+(s*5+t*2)%21;
      pixel(canvas,x,y,189,62,73,190);
    }
  }
  if(action==='retreat'){
    for(let s=0;s<4;s++)pixel(canvas,cx+15+s*4,baseY-12-s*3+t%2,74,84,85,120-s*20);
  }
  if(action==='death'){
    for(let s=0;s<6;s++){
      const x=cx-19+s*7;
      line(canvas,x,baseY-5,x+((s+t)%2?4:-4),baseY-11-t,[105,112,111,Math.max(45,140-t*28)]);
    }
  }
  if(action==='idle'||action==='walk'){
    for(let j=0;j<3;j++){
      const xx=cx-14+j*13,yy=baseY-8-(t+j)%4;
      pixel(canvas,xx,yy,107,73,77,60+j*18);
    }
  }
}
function etchedChitin(canvas,cx,baseY,t,action){
  // A cracked dorsal plate and long hooked limbs break the flat platformer silhouette.
  // Keep detail sparse at native 64px, readable as dark fantasy rather than visual noise.
  const y=baseY-20;
  const ridge=[135,105,112,210],crack=[43,32,43,230],scar=[159,63,83,225];
  line(canvas,cx-10,y+4,cx-6,y-1,ridge);
  line(canvas,cx+10,y+4,cx+6,y-1,ridge);
  line(canvas,cx-4,y+2,cx+3,y+4,crack);
  line(canvas,cx+3,y+4,cx+7,y+1,crack);
  line(canvas,cx-8,y+8,cx-3,y+6,crack);
  line(canvas,cx+8,y+8,cx+3,y+6,crack);
  for(const offset of [-4,0,4]){
    pixel(canvas,cx+offset,y+7,offset===0?scar[0]:112,offset===0?scar[1]:58,offset===0?scar[2]:72,230);
  }
  if(action!=='death'){
    // Jointed forelimbs curve inward and terminate in dark sickles.
    for(const side of [-1,1]){
      const bend=(action==='attack'?t*2:action==='alert'?2:t%2);
      line(canvas,cx+side*13,y+3,cx+side*(18+bend),y-5,[98,79,88,225]);
      line(canvas,cx+side*(18+bend),y-5,cx+side*(22+bend),y-13,[142,103,100,230]);
      line(canvas,cx+side*(22+bend),y-13,cx+side*(19+bend),y-17,[185,139,116,200]);
    }
    // Mandibles mark the creature as something more than an ordinary spider.
    line(canvas,cx-4,y+9,cx-2,y+14,[173,143,126,235]);
    line(canvas,cx+4,y+9,cx+2,y+14,[173,143,126,235]);
    pixel(canvas,cx,y+12,181,66+(t%2)*24,68,190);
  }
}
function frameFor(action,t) {
  const names={
    idle:['spider.png','spider_walk1.png','spider.png','spider_walk2.png'],
    walk:['spider_walk1.png','spider_walk2.png','spider.png','spider_walk1.png'],
    alert:['spider.png','spider_walk2.png','spider_walk1.png','spider_walk2.png'],
    attack:['spider.png','spider_walk1.png','spider_walk2.png','spider.png'],
    hurt:['spider_hit.png','spider.png','spider_hit.png','spider_walk2.png'],
    retreat:['spider_walk2.png','spider_walk1.png','spider_walk2.png','spider.png'],
    death:['spider.png','spider_hit.png','spider_dead.png','spider_dead.png']
  };
  const image=poses[names[action][t]],spr=new PNG({width:64,height:64});
  const dx=action==='retreat'?[-1,-3,-5,-7][t]:action==='attack'?[0,-2,-1,2][t]:0;
  const dy=action==='walk'?[0,1,0,-1][t]:action==='death'?[0,1,4,7][t]:[0,0,-1,1][t];
  const cy=48+dy,cx=32+dx;
  shadow(spr,32,52,21,55);
  drawSpider(spr,image,cx,cy,{alpha:action==='death'?[255,220,185,130][t]:255,flash:action==='hurt'&&t%2===0});
  if(action!=='death')drawEyes(spr,cx,cy-19,t,action);
  decorate(spr,action,t,cx,cy);
  etchedChitin(spr,cx,cy,t,action);
  return spr;
}
function paste(out,src,x0,y0){
  for(let y=0;y<src.height;y++)for(let x=0;x<src.width;x++){
    const i=(y*src.width+x)*4;
    if(src.data[i+3])pixel(out,x0+x,y0+y,src.data[i],src.data[i+1],src.data[i+2],src.data[i+3]);
  }
}
function portrait(){
  const out=new PNG({width:160,height:160});
  for(let y=0;y<160;y++)for(let x=0;x<160;x++){
    const radius=Math.hypot(x-80,y-80);
    if(radius<70)pixel(out,x,y,16+Math.round(y*.065),27+Math.round(y*.042),31+Math.round(y*.055),255);
    if(radius>67.6&&radius<70.7)pixel(out,x,y,151,112,72,255);
    if(radius>63.7&&radius<64.6&&(x+y)%3===0)pixel(out,x,y,89,66,53,200);
  }
  drawSpider(out,poses['spider.png'],80,121,{width:112,height:103});
  drawEyes(out,80,81,0,'alert');
  // Portrait keeps the original Kenney pose; atlas-only carapace details are scaled by animation.
  return out;
}
await mkdir(output,{recursive:true});
for(const fallback of ['mob-galho-infectado','mob-fungo-violeta']){
  const dest=new URL(fallback+'/',output);
  await mkdir(dest,{recursive:true});
  for(const filename of ['atlas.png','portrait.png']){
    await copyFile(new URL(fallback+'/'+filename,originals),new URL(filename,dest));
  }
}
const atlas=new PNG({width:256,height:448});
const uniqueness=[];
for(const [row,action] of actions.entries()){
  const clips=[];
  for(let t=0;t<4;t++){
    const spr=frameFor(action,t);
    paste(atlas,spr,t*64,row*64);
    clips.push(PNG.sync.write(spr));
  }
  uniqueness.push({action,uniqueFrames:new Set(clips.map(b=>b.toString('base64'))).size});
}
const ettercap=new URL(id+'/',output);
await mkdir(ettercap,{recursive:true});
await writeFile(new URL('atlas.png',ettercap),PNG.sync.write(atlas));
await writeFile(new URL('portrait.png',ettercap),PNG.sync.write(portrait()));
await writeFile(new URL('report.json',output),JSON.stringify({
  stage:'M1h-F',candidate:true,approval:'pending visual review',license:'Kenney CC0',
  source:'https://kenney.nl/assets/platformer-art-extended-enemies',
  playable:['mob-ettercap'],fallingBackToM1hE:['mob-galho-infectado','mob-fungo-violeta'],
  format:{frameWidth:64,frameHeight:64,rows:7,columns:4},uniqueness
},null,2)+'\n');
console.log('M1h-F: Kenney CC0 spider adapted to Ettercap, 7 actions x 4 frames; other Mürin creatures retain M1h-E.');
