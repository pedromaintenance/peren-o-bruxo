/**
 * M1h-D / Peren: stern portrait and expressive microfaces.
 * Deterministic, non-destructive fifth candidate. C remains byte-identical.
 * No new animations, headgear, mechanics or damage to the existing alpha.
 */
import {PNG} from 'pngjs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const base=resolve(import.meta.dirname,'..');
const source=join(base,'public/art-m1hc/characters/peren');
const target=join(base,'public/art-m1hd/characters/peren');
await mkdir(target,{recursive:true});
const colors={
 ink:'#171d29',brow:'#30333d',eye:'#252b35',iris:'#6b8387',
 skin:'#cf9879',lit:'#efbb90',shadow:'#98665b',wrinkle:'#a16e62',
 beard:'#b4bfc4',silver:'#e1e4df',lowlight:'#8997a2',deep:'#66747f',
 mana:'#a2d4ee'
};
const rgb=Object.fromEntries(Object.entries(colors).map(([key,hex])=>
 [key,[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16))]));
function paint(im,x,y,color,guard=()=>true){
 x=Math.round(x);y=Math.round(y);
 if(x<0||y<0||x>=im.width||y>=im.height||!guard(x,y))return;
 const offset=(y*im.width+x)*4;if(im.data[offset+3]===0)return;
 const c=rgb[color];if(!c)throw Error('Missing color '+color);
 for(let i=0;i<3;i++)im.data[offset+i]=c[i];
}
function segment(im,x1,y1,x2,y2,color,guard){
 const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
 for(let k=0;k<=steps;k++){
  const t=steps===0?0:k/steps;
  paint(im,Math.round(x1+(x2-x1)*t),Math.round(y1+(y2-y1)*t),color,guard);
 }
}
function rectangle(im,x,y,w,h,color,guard){
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)paint(im,xx,yy,color,guard);
}
function polygon(im,vertices,color,guard){
 let low=Math.floor(Math.min(...vertices.map(p=>p[1])));
 let high=Math.ceil(Math.max(...vertices.map(p=>p[1])));
 for(let y=low;y<=high;y++){
  const intersections=[];
  for(let n=0;n<vertices.length;n++){
   const [x1,y1]=vertices[n],[x2,y2]=vertices[(n+1)%vertices.length];
   if((y1<=y&&y2>y)||(y2<=y&&y1>y))
    intersections.push(x1+(y-y1)*(x2-x1)/(y2-y1));
  }
  intersections.sort((a,b)=>a-b);
  for(let i=0;i+1<intersections.length;i+=2)
   for(let x=Math.ceil(intersections[i]);x<=Math.floor(intersections[i+1]);x++)
    paint(im,x,y,color,guard);
 }
}
const skinColors=new Set(['cf9879','efbb90','98665b','a16e62']);
function colorAt(im,x,y){
 if(x<0||y<0||x>=im.width||y>=im.height)return '';
 const i=(Math.round(y)*im.width+Math.round(x))*4;
 return Array.from(im.data.subarray(i,i+3)).map(v=>v.toString(16).padStart(2,'0')).join('');
}
function portrait(im,mode){
 if(im.width!==256||im.height!==256)throw Error('Portrait geometry changed');
 // Explicitly redraw the centre of the face; a flat white crescent beneath
 // the old moustache looked like a broad, cheerful grin at 2x scale.
 const face=(x,y)=>x>=91&&x<=169&&y>=108&&y<=168;
 const cheek=(x,y)=>face(x,y)&&skinColors.has(colorAt(im,x,y));
 polygon(im,[[110,144],[116,137],[126,136],[143,137],[151,143],
  [153,150],[148,164],[114,165],[107,154]],'shadow',face);
 polygon(im,[[115,144],[124,140],[143,141],[149,146],[146,156],
  [138,158],[120,158],[114,152]],'skin',face);
 // Nasolabial folds, lowered eyebrows and deep-set eyes suggest experience,
 // without adding scars or another character's identifying features.
 segment(im,96,125,103,133,'wrinkle',cheek);
 segment(im,159,125,163,132,'wrinkle',cheek);
 segment(im,105,116,121,115,'brow',(x,y)=>x>=99&&x<=124&&y<123);
 segment(im,141,115,157,116,'brow',(x,y)=>x>=137&&x<=159&&y<123);
 segment(im,106,121,119,121,'eye',(x,y)=>x>103&&x<123);
 segment(im,144,120,156,121,'eye',(x,y)=>x>140&&x<158);
 rectangle(im,109,122,3,2,'iris');
 rectangle(im,147,122,3,2,'iris');
 // The nose is distinct from mouth: a short bridge and shadowed nostrils.
 segment(im,129,128,126,143,'shadow',face);
 rectangle(im,126,146,10,2,'lit',face);
 rectangle(im,125,148,4,2,'shadow',face);
 rectangle(im,133,148,4,2,'shadow',face);
 // Reduce the inherited bright crescent, which looked like a toothy grin.
 // Darken ONLY existing near-mouth pale beard pixels, keeping the cheek skin.
 const pale=new Set(['e1e4df','f3f0e6','c8d0d0','b4bfc4']);
 for(let y=157;y<=166;y++)for(let x=108;x<=154;x++){
  if(pale.has(colorAt(im,x,y)))paint(im,x,y,y<161?'beard':'lowlight',face);
 }
 // A moustache is two narrow locks separated under the nose, not a wide
 // horizontal band. The tufts fall down into the beard, never curve upward.
 polygon(im,[[110,151],[119,150],[125,154],[123,158],[116,156]],'lowlight',face);
 polygon(im,[[140,154],[146,150],[153,151],[148,156],[140,158]],'lowlight',face);
 segment(im,115,152,119,154,'beard',face);
 segment(im,147,152,144,154,'beard',face);
 // A short, level, unsmiling mouth. Dark moustache roots above and silver
 // beard locks BELOW the lip prevent the appearance of exposed teeth.
 segment(im,125,157,138,157,'ink',face);
 paint(im,123,157,'shadow',face);paint(im,140,157,'shadow',face);
 segment(im,124,160,139,160,'shadow',face);
 segment(im,119,164,126,166,'beard',face);
 segment(im,139,166,146,164,'beard',face);
 // A couple of age strokes below the eyes; only on existing skin.
 segment(im,103,130,110,132,'wrinkle',cheek);
 segment(im,148,131,155,130,'wrinkle',cheek);
 if(mode==='cast'){
  // Concentration lowers the brows; aura remains unchanged.
  segment(im,106,115,119,117,'ink',face);
  segment(im,143,117,155,115,'ink',face);
  paint(im,151,122,'mana',face);
 }else if(mode==='hurt'){
  // Tension and one asymmetrical fold, no invented facial wound.
  segment(im,104,113,119,115,'brow',face);
  segment(im,143,115,157,112,'brow',face);
  segment(im,120,161,138,162,'ink',face);
 }
}
function sprite(im,ox,oy,dir,action,frame){
 const bob=['walk','run'].includes(action)?[0,-1,0,1][frame]:action==='hurt'?[0,0,1,1][frame]:0;
 const dot=(x,y,c)=>paint(im,ox+x,oy+y+bob,c);
 const seg=(x1,y1,x2,y2,c)=>segment(im,ox+x1,oy+y1+bob,ox+x2,oy+y2+bob,c);
 if(dir==='down'){
  // Long, flat mouth under the nose, with silver whiskers instead of teeth.
  seg(21,28,27,28,'ink');
  dot(20,27,'lowlight');dot(28,27,'lowlight');
  dot(22,30,'beard');dot(26,30,'beard');
  // Heavier eyebrows and crow's feet remain legible at 48×64.
  seg(19,21,22,21,'brow');
  seg(26,21,29,21,'brow');
  dot(18,24,'wrinkle');dot(30,24,'wrinkle');
  if(action==='cast')dot(20,23,'iris');
  if(action==='hurt')dot(20,25,'shadow');
 }else if(dir==='left'||dir==='right'){
  const mirror=x=>dir==='left'?47-x:x;
  seg(mirror(29),27,mirror(33),28,'ink');
  dot(mirror(30),29,'lowlight');
  dot(mirror(32),24,'wrinkle');
  if(action==='cast')dot(mirror(29),23,'iris');
  if(action==='hurt')dot(mirror(30),24,'shadow');
 }else{
  // No face should appear in back view, so only minimal silver nape shading.
  dot(20,24,'lowlight');dot(29,24,'beard');
 }
}
const atlas=PNG.sync.read(await readFile(join(source,'peren-atlas.png')));
if(atlas.width!==1536||atlas.height!==256)throw Error('128-frame atlas contract broken');
const variant=PNG.sync.read(await readFile(join(source,'peren-atlas.png')));
const actions=['idle','walk','run','interact','gather','hurt','cast','attack'];
const directions=['down','left','right','up'];
for(let d=0;d<4;d++)for(let a=0;a<8;a++)for(let f=0;f<4;f++)
 sprite(variant,(a*4+f)*48,d*64,directions[d],actions[a],f);
await writeFile(join(target,'peren-atlas.png'),PNG.sync.write(variant));
const files=['portrait.png','portrait-cast.png','portrait-hurt.png'];
for(const file of files){
 const im=PNG.sync.read(await readFile(join(source,file)));
 const mode=file.includes('cast')?'cast':file.includes('hurt')?'hurt':'neutral';
 portrait(im,mode);
 await writeFile(join(target,file),PNG.sync.write(im));
}
const report={stage:'M1h-D',status:'em_producao',approval:'pendente',base:'M1h-C',
 focus:'severe brows, compressed mouth, silver moustache, age lines',atlas:{width:1536,height:256,frames:128},
 portraits:files,unchanged:['M1e','M1h-A','M1h-B','M1h-C','gameplay','saves']};
await writeFile(join(target,'report.json'),JSON.stringify(report,null,2)+'\n');
console.log('M1h-D: 128 expressive microfaces + 3 severe portraits, all previous versions untouched.');
