/**
 * M1h-F botanicals: source-backed, animated Galho Infectado and Fungo Violeta.
 * All imported images remain untouched in public/art-m1hf/.
 * OGA Forest Tiles: CC0, https://opengameart.org/content/forest-tiles
 * Kenney Mushroom Land: CC0, https://kenney.nl/assets/platformer-art-mushrooms
 * This pass only writes opt-in artwork, not combat rules, data or saves.
 */
import {PNG} from 'pngjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';

const root=new URL('../public/',import.meta.url);
const output=new URL('art-m1hf/monsters/',root);
const forest=PNG.sync.read(await readFile(new URL('art-m1hf/oga-forest/forest_tiles.png',root)));
const mushroomDir=new URL('art-m1hf/kenney-mushrooms/',root);
const mushroom={};
for(const name of ['tallShroom_red','tinyShroom_red','stemShroom','shroomRedMid']){
 mushroom[name]=PNG.sync.read(await readFile(new URL(name+'.png',mushroomDir)));
}
const actions=['idle','walk','alert','attack','hurt','retreat','death'];
const specs=[
 {id:'mob-galho-infectado',name:'Galho Infectado',renderer:renderBranch},
 {id:'mob-fungo-violeta',name:'Fungo Violeta',renderer:renderFungus}
];

function rgba(image,x,y){
 if(x<0||y<0||x>=image.width||y>=image.height)return [0,0,0,0];
 const i=(y*image.width+x)*4;
 return [...image.data.subarray(i,i+4)];
}
function pixel(im,x,y,c){
 x=Math.round(x);y=Math.round(y);
 if(x<0||y<0||x>=im.width||y>=im.height||c[3]<=0)return;
 const k=(y*im.width+x)*4,alpha=c[3]/255,behind=im.data[k+3]/255,total=alpha+behind*(1-alpha);
 if(!total)return;
 for(let i=0;i<3;i++)im.data[k+i]=Math.round((c[i]*alpha+im.data[k+i]*behind*(1-alpha))/total);
 im.data[k+3]=Math.round(total*255);
}
function circle(im,x,y,r,c){
 for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++)
  if(xx*xx+yy*yy<=r*r)pixel(im,x+xx,y+yy,c);
}
function line(im,x0,y0,x1,y1,c,size=1){
 let dx=Math.abs(Math.round(x1)-Math.round(x0)),dy=Math.abs(Math.round(y1)-Math.round(y0));
 const sx=x0<x1?1:-1,sy=y0<y1?1:-1;
 x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
 let error=dx-dy;
 for(;;){
  if(size>1)circle(im,x0,y0,Math.floor(size/2),c);else pixel(im,x0,y0,c);
  if(x0===x1&&y0===y1)break;
  const next=2*error;
  if(next>-dy){error-=dy;x0+=sx}
  if(next<dx){error+=dx;y0+=sy}
 }
}
function ellipse(im,cx,cy,rx,ry,color){
 for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++)
  if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)pixel(im,x,y,color);
}
function polygon(im,points,c){
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 const minX=Math.floor(Math.min(...xs)),maxX=Math.ceil(Math.max(...xs));
 const minY=Math.floor(Math.min(...ys)),maxY=Math.ceil(Math.max(...ys));
 for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
  let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++){
   const a=points[i],b=points[j];
   if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
  }
  if(inside)pixel(im,x,y,c);
 }
}
function shadow(im,cx,cy,radius=22){
 for(let y=-3;y<=3;y++)for(let x=-radius;x<=radius;x++){
  const dist=(x/radius)**2+(y/3)**2;
  if(dist>1||(x+y)%2)continue;
  pixel(im,cx+x,cy+y,[6,13,19,Math.round(65*(1-dist))]);
 }
}
function blit(dest,src,x,y,scale=1) {
 const w=Math.round(src.width*scale),h=Math.round(src.height*scale);
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
  const from=rgba(src,Math.floor(xx/scale),Math.floor(yy/scale));
  if(from[3]>0)pixel(dest,x+xx,y+yy,from);
 }
}
function naturalBranchFragment(dest,cx,cy,tilt,action,t){
 // Crop a living tree, branches and leaves from the 128×128 OGA forest tiles.
 // Ignoring blue-dominant background avoids a visible rectangular source tile.
 const ox=16,oy=0,sw=32,sh=33;
 const dim=action==='death'?.46:action==='hurt'?.83:1;
 for(let y=0;y<sh;y++)for(let x=0;x<sw;x++){
  const [r,g,b,a]=rgba(forest,ox+x,oy+y);
  if(a<60||b>g*1.16&&b>r*1.08)continue;
  const wood=r>g*1.12&&r>b*1.25;
  const lum=(r*.28+g*.58+b*.14)/255;
  const l=Math.max(.15,Math.min(1,lum))*dim;
  const color=wood?[Math.round(44+79*l),Math.round(32+55*l),Math.round(37+33*l),a]:
   [Math.round(28+68*l),Math.round(35+92*l),Math.round(28+55*l),Math.min(250,a)];
  // Nearest placement, slight lean and crown breathing over 4 authentic poses.
  const nx=cx-16+x+Math.round(tilt*(33-y)/40);
  const ny=cy+y+((t+x)%6===0?1:0);
  pixel(dest,nx,ny,color);
 }
}
function renderBranch(action,t){
 const out=new PNG({width:64,height:64});
 const sway=[-1,0,1,0][t],speed=action==='walk'?[0,2,0,-2][t]:0;
 const tilt=action==='retreat'?-4-t:action==='death'?4+t*2:sway+speed;
 const baseY=52+(action==='death'?t*2:0),cx=31+tilt;
 shadow(out,32,54,21);
 const dark=[34,31,31,255],bark=[77,55,48,255],wood=[121,83,56,255],moss=[58,84,59,255];
 // Root-feet are animated, not a static trunk translated between frames.
 for(const side of [-1,1]){
  const footMove=action==='walk'?((t+1)*(side+2))%3-1:action==='retreat'?side*t:0;
  line(out,32,43,32+side*11+footMove,baseY-2,bark,5);
  line(out,32+side*11+footMove,baseY-2,32+side*16+footMove,baseY,wood,3);
  line(out,32+side*11+footMove,baseY-2,32+side*19+footMove,baseY-2,wood,2);
 }
 // Crooked arms and broken claws; pose changes per action and animation frame.
 const lRaise=action==='alert'?-7:action==='hurt'?4:action==='death'?t*4:action==='attack'?-2-t*3:(t%3)-1;
 const rRaise=action==='attack'?-3-t*4:action==='alert'?-8:action==='death'?t*4:2-t;
 line(out,cx-6,31,cx-17,30+lRaise,dark,7);
 line(out,cx-17,30+lRaise,cx-24,18+lRaise,bark,5);
 line(out,cx-24,18+lRaise,cx-28,13+lRaise,wood,2);
 line(out,cx-24,18+lRaise,cx-20,12+lRaise,wood,2);
 line(out,cx+6,31,cx+17,29+rRaise,dark,7);
 line(out,cx+17,29+rRaise,cx+24+(action==='attack'?t*2:0),18+rRaise,bark,5);
 line(out,cx+24+(action==='attack'?t*2:0),18+rRaise,cx+28+(action==='attack'?t*2:0),13+rRaise,wood,2);
 line(out,cx+24+(action==='attack'?t*2:0),18+rRaise,cx+21,10+rRaise,wood,2);
 naturalBranchFragment(out,cx,11+Math.round(tilt/3),tilt,action,t);
 polygon(out,[[cx-7,29],[cx-4,22],[cx+5,21],[cx+9,31],[cx+6,45],[cx,49],[cx-7,43]],dark);
 polygon(out,[[cx-5,28],[cx,24],[cx+4,26],[cx+6,34],[cx+3,43],[cx-4,41]],bark);
 // Bark and heartwood scratches, with invasive crimson sap.
 for(let j=0;j<5;j++){
  const yy=29+j*3;
  line(out,cx-3+(j%2),yy,cx+2-(j%3),yy+2,j===3?[134,41,52,225]:wood,1);
 }
 const eyesY=31+(t===2?1:0);
 for(const dx of [-3,4]){pixel(out,cx+dx,eyesY,[33,5,12,255]);pixel(out,cx+dx,eyesY-1,[184+(t%2)*36,58,67,255]);}
 line(out,cx-1,38,cx+1,40,[156,50,69,230],1);
 for(let i=0;i<3;i++){
  const q=(t*2+i*5)%12;
  pixel(out,cx-12+i*11,33+q,[147,47,65,160]);
 }
 if(action==='alert'){
  for(let j=0;j<4;j++)pixel(out,cx-20+j*13,11-(t+j)%4,[163,58,74,160+j*18]);
 }
 if(action==='attack'){
  line(out,cx+16,19-t*2,cx+26+t*2,15-t*2,[198,62,80,210],1);
  for(let i=0;i<3+t;i++)pixel(out,cx+18+i*3,25-i%4-t,[150,66,71,130]);
 }
 if(action==='hurt'){
  line(out,cx-4,29,cx+2,37,[212,79,89,230],2);
  if(t%2===0)ellipse(out,cx,34,9,8,[192,54,70,55]);
 }
 if(action==='retreat'){
  for(let i=0;i<4;i++)pixel(out,cx+15+i*4,42-i*3+t,[72,96,73,160-i*29]);
 }
 if(action==='death'){
  ellipse(out,cx,45+t*2,11,4,[35,33,36,45+t*8]);
  if(t>=2)for(let j=0;j<4;j++)pixel(out,cx-9+j*6,22-t-j,[164,65,81,155-j*24]);
 }
 return out;
}
function bounds(image){
 let minX=image.width,minY=image.height,maxX=0,maxY=0,found=false;
 for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
  const [r,g,b,a]=rgba(image,x,y);
  if(a<45||(r>247&&g>247&&b>247))continue;
  minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);found=true;
 }
 if(!found)throw Error('Botanical source has no usable pixels: '+image.width+'x'+image.height);
 return {x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
}
const masks=Object.fromEntries(Object.entries(mushroom).map(([k,v])=>[k,bounds(v)]));
function tintedMushroom(dest,kind,cx,top,width,height,{flash=false,decay=1,clip=null}={}){
 const source=mushroom[kind],b=masks[kind];
 const left=Math.round(cx-width/2),w=Math.max(1,Math.round(width)),h=Math.max(1,Math.round(height));
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
  if(clip&&!clip(xx,yy,w,h))continue;
  const sx=b.x+Math.min(b.w-1,Math.floor(xx*b.w/w)),sy=b.y+Math.min(b.h-1,Math.floor(yy*b.h/h));
  const [r,g,blue,a]=rgba(source,sx,sy);
  if(a<60||(r>247&&g>247&&blue>247))continue;
  const cap=r>g*1.22&&r>blue*1.19;
  const luminance=(r*.31+g*.59+blue*.1)/255;
  const light=Math.max(.12,Math.min(1,luminance))*decay;
  const color=cap?[Math.round(42+131*light),Math.round(24+73*light),Math.round(67+155*light),a]:
    [Math.round(44+106*light),Math.round(48+108*light),Math.round(51+104*light),a];
  if(flash&&yy<h*.7){color[0]=Math.min(255,color[0]+70);color[1]=Math.min(255,color[1]+46);}
  pixel(dest,left+xx,top+yy,color);
 }
}
function renderFungus(action,t){
 const out=new PNG({width:64,height:64});
 const walk=action==='walk'?[0,2,0,-2][t]:0,hop=action==='alert'?-t:action==='death'?t*3:[0,-1,0,1][t];
 const cx=32+walk+(action==='retreat'?-t:0),y=17+hop;
 const stretch=action==='alert'?t:action==='attack'?[0,1,3,0][t]:action==='hurt'?-2:0;
 const w=42+stretch,h=35+(action==='attack'?t:0)-(action==='death'?t*2:0);
 shadow(out,32,53,22);
 // A crawling mycelial body is drawn independently underneath the Kenney cap/stalk.
 ellipse(out,cx,42+hop,11,9,[48,55,52,255]);
 ellipse(out,cx-2,37+hop,8,10,[93,105,96,255]);
 for(const side of [-1,1]){
  const pulse=(t+side+3)%4;
  line(out,cx+side*6,42+hop,cx+side*(14+pulse),49+hop+(t%2),[91,99,81,255],4);
  line(out,cx+side*(14+pulse),49+hop+(t%2),cx+side*(21+pulse),51+hop,[133,132,111,255],2);
  line(out,cx+side*8,39+hop,cx+side*(18+pulse),30+hop+(action==='attack'?-t*2:0),[83,92,77,255],3);
 }
 // Preserve original Kenney mushroom silhouette and dots, recolored to bruised violet.
 tintedMushroom(out,'tallShroom_red',cx,y,w,h,{decay:action==='death'?.45:1,flash:action==='hurt'&&t%2===0});
 // The original cap pattern is layered as pixel-sampled texture, cut into an arch.
 tintedMushroom(out,'shroomRedMid',cx,y+6,w-7,9,{
  decay:action==='death'?.48:.83,
  clip:(x,yy,ww,hh)=>((x-ww/2)/(ww/2))**2+((yy-hh*.72)/(hh*.92))**2<1.1
 });
 // Thin gills beneath the cap, fungal face and mycelial barbs.
 for(let i=-4;i<=4;i+=2){
  line(out,cx+i*3,y+19,cx+i*3+Math.sign(i),y+22+(i+t+8)%3,[77,47,93,235]);
 }
 for(let side of [-1,1]){
  pixel(out,cx+side*5,36+hop,[33,15,39,255]);
  pixel(out,cx+side*5,35+hop,[178+(t%2)*43,103,222,255]);
 }
 line(out,cx-2,41+hop,cx+2,41+hop,[95,54,100,255]);
 // Original small mushrooms grow symbiotically from the stalk.
 if(action!=='death'||t<3){
  tintedMushroom(out,'tinyShroom_red',cx-16,37+hop+(t%2),12,13,{decay:.7});
  tintedMushroom(out,'tinyShroom_red',cx+17,38+hop+((t+1)%2),10,11,{decay:.7});
 }
 for(let k=0;k<5;k++){
  const x=cx-14+((k*8+t*(action==='attack'?3:1))%32);
  const sy=y-4-k*3-(action==='alert'?t*2:action==='attack'?t*3:0);
  pixel(out,x,sy,[125+(k%2)*40,73+(t%2)*14,162+(k%3)*14,110+k*21]);
  if((k+t)%3===0)pixel(out,x+1,sy-2,[159,116,196,80]);
 }
 if(action==='attack'){
  for(let i=0;i<3+t*2;i++){
   pixel(out,cx+17+i*4,y+10-i%7,[180,119,224,180-(i%4)*25]);
  }
 }
 if(action==='hurt'&&t%2===0)ellipse(out,cx,y+17,w*.34,5,[242,158,211,65]);
 if(action==='retreat')for(let i=0;i<4;i++)pixel(out,cx+21+i*4,43-i*3,[124,94,145,160-i*24]);
 if(action==='death')for(let i=0;i<5;i++)pixel(out,cx-15+i*7,49+i%3,[120,90,146,130+(t*14)%80]);
 return out;
}
function portrait(sprite,id){
 const out=new PNG({width:160,height:160}),branch=id==='mob-galho-infectado';
 const tint=branch?[20,31,25]:[28,21,39];
 for(let y=0;y<160;y++)for(let x=0;x<160;x++){
  const distance=Math.hypot(x-80,y-80);
  if(distance<69.3){
   const light=y/160;
   pixel(out,x,y,[tint[0]+Math.round(light*8),tint[1]+Math.round(light*6),tint[2]+Math.round(light*12),255]);
  }
  if(distance>67&&distance<70.4)pixel(out,x,y,[158,116,78,255]);
 }
 // Large nearest-neighbour portrait follows exactly the same source-backed art.
 for(let y=7;y<62;y++)for(let x=2;x<62;x++){
  const c=rgba(sprite,x,y);
  if(c[3]===0)continue;
  for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){
   const px=80+(x-32)*2+dx,py=80+(y-33)*2+dy;
   if(Math.hypot(px-80,py-80)<65)pixel(out,px,py,c);
  }
 }
 return out;
}
function paste(target,frame,column,row){
 for(let y=0;y<64;y++)for(let x=0;x<64;x++){
  const c=rgba(frame,x,y);if(c[3])pixel(target,column*64+x,row*64+y,c);
 }
}
const report=JSON.parse(await readFile(new URL('report.json',output),'utf8'));
report.playable=['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'];
report.fallingBackToM1hE=[];
report.botanicals=[];
for(const spec of specs){
 const atlas=new PNG({width:256,height:448});
 const sprites=[];
 const uniqueness=[];
 for(const [row,action] of actions.entries()){
  const images=[];
  for(let frame=0;frame<4;frame++){
   const pose=spec.renderer(action,frame);
   paste(atlas,pose,frame,row);
   images.push(PNG.sync.write(pose).toString('base64'));
   if(action==='idle'&&frame===0)sprites.push(pose);
  }
  uniqueness.push({action,uniqueFrames:new Set(images).size});
 }
 const dir=new URL(spec.id+'/',output);
 await mkdir(dir,{recursive:true});
 await writeFile(new URL('atlas.png',dir),PNG.sync.write(atlas));
 await writeFile(new URL('portrait.png',dir),PNG.sync.write(portrait(sprites[0],spec.id)));
 report.botanicals.push({id:spec.id,method:'source-backed animated sprite',atlas:'256x448',portrait:'160x160',uniqueness});
}
await writeFile(new URL('report.json',output),JSON.stringify(report,null,2)+'\n');
console.log('M1h-F botanical art: Galho Infectado (OGA Forest Tiles) + Fungo Violeta (Kenney Mushroom Land), 28 distinct frames each.');
