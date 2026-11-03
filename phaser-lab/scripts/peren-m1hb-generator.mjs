/**
 * M1h-B: draw canonical un-hatted heads into a *third* non-destructive art variant.
 * Production source: M1h-A PNGs, which remain byte-for-byte intact.
 * Retains 4×8×4 original animations, cell dimensions, body pose and staff frames.
 * No algorithm may write to public/art or public/art-m1h.
 */
import {PNG} from 'pngjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const from=join(root,'public/art-m1h/characters/peren');
const to=join(root,'public/art-m1hb/characters/peren');
await mkdir(to,{recursive:true});
const C={
 edge:'#171d29',deep:'#303942',shadow:'#617384',hair:'#c0c8ce',silver:'#e5e9e8',
 shine:'#f3f1e8',skin:'#cf9879',skinLight:'#efbb90',skinShadow:'#98665b',
 beard:'#c3c7c8',beardShadow:'#758390',cloak:'#303d4c',scar:'#8b6e6c',arcane:'#9ed1f2'
};
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
function pixel(img,x,y,color,alpha=255){
 x=Math.round(x);y=Math.round(y);
 if(x<0||y<0||x>=img.width||y>=img.height)return;
 const [r,g,b]=hex(color),i=(y*img.width+x)*4;
 img.data[i]=r;img.data[i+1]=g;img.data[i+2]=b;img.data[i+3]=alpha;
}
function rect(img,x,y,w,h,color,alpha=255){
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)pixel(img,xx,yy,color,alpha);
}
function polygon(img,points,color,alpha=255){
 const ys=points.map(p=>p[1]),lo=Math.floor(Math.min(...ys)),hi=Math.ceil(Math.max(...ys));
 for(let y=lo;y<=hi;y++){
  const hit=[];
  for(let i=0;i<points.length;i++){
   const [x1,y1]=points[i],[x2,y2]=points[(i+1)%points.length];
   if((y1<=y&&y2>y)||(y2<=y&&y1>y))hit.push(x1+(y-y1)*(x2-x1)/(y2-y1));
  }
  hit.sort((a,b)=>a-b);
  for(let i=0;i+1<hit.length;i+=2)for(let x=Math.ceil(hit[i]);x<=Math.floor(hit[i+1]);x++)pixel(img,x,y,color,alpha);
 }
}
function drawCell(image,px,py,direction,action,frame){
 // Head bob complements existing walking/running body frame cycle.
 const moving=['walk','run'].includes(action);
 const bob=moving?[0,-1,0,1][frame]:action==='hurt'?[0,0,1,1][frame]:0;
 const sign=direction==='left'?-1:direction==='right'?1:0;
 const hairShade=C.beardShadow;
 // Remove the old pointed hat and face. Leave extreme sides (staff / hand art) untouched.
 // Only head square 8..37 y7..31 in the *local* cell is covered.
 // Above the shoulders the old character has no non-head body elements here.
 for(let y=5;y<31;y++)for(let x=9;x<=37;x++){
  // Preserve staff at extreme edges, magical crystal and shaft hues.
  const i=((py+y)*image.width+px+x)*4;
  const v=[image.data[i],image.data[i+1],image.data[i+2]];
  const magical=v[2]>v[0]*1.24&&v[2]>v[1]*1.12&&v[2]>140;
  if(magical&&x>=35)continue;
  image.data[i]=image.data[i+1]=image.data[i+2]=image.data[i+3]=0;
 }
 const r=(x,y,w,h,c)=>rect(image,px+x,py+y+bob,w,h,c);
 const p=(pts,c)=>polygon(image,pts.map(([x,y])=>[px+x,py+y+bob]),c);
 if(direction==='up'){
  // Back view: jagged, unmistakably silver hair, no facial pixels or headwear.
  p([[16,9],[21,7],[25,9],[30,7],[35,11],[34,18],[37,20],[34,28],[32,30],[17,31],[14,27],[12,20],[14,15]],C.edge);
  p([[17,10],[22,9],[25,12],[30,9],[33,12],[32,19],[35,23],[30,27],[19,28],[16,24],[15,18]],C.hair);
  p([[17,11],[22,10],[24,13],[23,20],[18,24],[16,19]],C.silver);
  p([[24,10],[30,9],[33,13],[30,16],[27,15]],C.shine);
  p([[26,18],[30,16],[33,20],[30,27],[24,29],[23,23]],C.beardShadow);
  r(17,28,14,5,C.cloak);
  r(19,28,10,2,C.beardShadow);
 }else if(direction==='down'){
  // Front: weathered face, sideburns and substantial silver beard.
  p([[14,13],[17,9],[22,8],[25,10],[30,8],[34,11],[35,18],[32,25],[33,31],[28,35],[18,34],[14,29],[13,22]],C.edge);
  p([[18,18],[30,18],[31,27],[28,31],[20,31],[17,26]],C.skinShadow);
  p([[19,17],[29,17],[30,26],[27,30],[21,30],[18,25]],C.skin);
  r(20,21,8,4,C.skinLight);
  r(19,23,2,3,C.skinLight);
  r(27,23,2,3,C.skinShadow);
  // Strong brow, separated eyes, angular nose and set jaw.
  r(19,21,4,1,C.deep);r(26,21,3,1,C.deep);
  r(20,23,2,1,C.edge);r(27,23,2,1,C.edge);
  r(24,24,2,3,C.skinShadow);r(24,27,2,1,C.skinLight);
  r(22,28,5,1,C.deep);
  // Beard has its own silhouette; not a bright replacement of the old hat.
  p([[16,25],[19,27],[20,31],[23,33],[26,32],[30,26],[33,28],[32,34],
    [29,38],[25,37],[23,40],[20,37],[16,35]],C.edge);
  p([[17,26],[20,28],[21,33],[24,35],[27,34],[31,28],[31,33],[28,36],[24,38],[19,35]],C.beardShadow);
  p([[18,27],[19,31],[22,35],[24,37],[26,34],[29,32],[30,27],[27,30],[24,31],[22,29]],C.beard);
  r(18,29,2,4,C.silver);r(28,29,2,3,C.silver);
  r(23,35,2,3,C.hair);
  r(19,28,5,1,C.silver);r(26,28,4,1,C.silver);
  // Distinct swept, layered hair locks, no pointed hat.
  p([[13,18],[15,12],[19,10],[22,8],[24,10],[28,8],[33,11],[35,17],
    [32,19],[29,17],[25,19],[19,17],[17,22],[14,23]],C.edge);
  p([[15,17],[18,11],[23,10],[25,12],[28,10],[32,12],[33,16],[30,17],
    [27,15],[23,18],[19,16],[16,20]],C.hair);
  p([[16,16],[20,11],[23,11],[24,13],[21,14],[19,18]],C.shine);
  p([[25,12],[29,10],[33,13],[31,15],[28,14],[25,16]],C.silver);
  r(14,20,2,5,C.beardShadow);r(33,20,2,5,C.hair);
 }else{
  // Profiles expose ear, sideburn and a swept-back hairstyle.
  const mirror=(x)=>sign===-1?47-x:x;
  const pp=(pts,col)=>p(pts.map(([x,y])=>[mirror(x),y]),col);
  const rr=(x,y,w,h,col)=>r(sign===-1?48-x-w:x,y,w,h,col);
  pp([[14,10],[21,7],[28,9],[32,13],[35,19],[32,24],[33,30],
      [27,36],[19,35],[15,29],[15,23],[13,20]],C.edge);
  pp([[19,16],[31,16],[34,20],[32,27],[28,31],[20,30],[17,24]],C.skinShadow);
  pp([[19,18],[31,18],[32,23],[29,29],[20,28],[18,24]],C.skin);
  rr(29,22,4,5,C.skinLight);
  rr(31,26,2,2,C.skinShadow);
  rr(27,22,3,1,C.deep);rr(29,24,2,1,C.edge);
  // Nose and expressive beard point in facing direction.
  pp([[20,25],[23,27],[28,28],[34,29],[33,33],[30,36],[24,39],
      [19,36],[16,31]],C.edge);
  pp([[20,27],[25,30],[31,30],[31,34],[26,37],[21,35],[18,31]],C.beardShadow);
  pp([[21,28],[24,32],[29,32],[30,34],[26,36],[22,34]],C.beard);
  rr(31,30,3,2,C.silver);rr(23,34,3,3,C.silver);
  pp([[12,19],[15,13],[19,10],[23,8],[27,10],[31,9],[34,13],
      [35,17],[29,18],[26,16],[21,20],[16,23]],C.edge);
  pp([[14,18],[17,13],[22,10],[26,11],[28,13],[33,12],
      [33,16],[28,16],[25,15],[21,18],[17,21]],C.hair);
  pp([[15,18],[20,12],[23,11],[26,13],[22,15],[19,19]],C.shine);
  pp([[26,12],[30,11],[33,14],[30,16]],C.silver);
  rr(14,22,3,7,C.beardShadow);
 }
 // Subtle posture variants, no additional weapons or spell mechanics.
 if(action==='hurt'&&frame>=1){
  r(22+sign*2,24,2,1,C.scar);
 }
 if(action==='cast'&&frame>=2){
  r(35,11,2,2,C.arcane);
 }
}
const original=PNG.sync.read(await readFile(join(from,'peren-atlas.png')));
if(original.width!==1536||original.height!==256)throw Error('M1h-B exige atlas 1536×256; ordem de frames incompatível.');
const atlas=PNG.sync.read(await readFile(join(from,'peren-atlas.png')));
const directions=['down','left','right','up'],actions=['idle','walk','run','interact','gather','hurt','cast','attack'];
for(let di=0;di<4;di++)for(let ai=0;ai<8;ai++)for(let frame=0;frame<4;frame++){
 drawCell(atlas,(ai*4+frame)*48,di*64,directions[di],actions[ai],frame);
}
await writeFile(join(to,'peren-atlas.png'),PNG.sync.write(atlas));
function portrait(img,kind){
 const w=img.width,h=img.height;
 if(w!==256||h!==256)throw Error('Retrato incompatível com composição canônica: '+w+'×'+h);
 // Retire the former brim/crown colors while retaining the halo and staff.
 const oldColors=new Set(['323a44','697986','43515a','48525d','1c222b','303942','161d25']);
 for(let y=18;y<112;y++)for(let x=48;x<208;x++){
  const i=(y*w+x)*4,key=[img.data[i],img.data[i+1],img.data[i+2]].map(v=>v.toString(16).padStart(2,'0')).join('');
  // fill hat shades with dark aura; pixels outside hat remain untouched.
  if(oldColors.has(key)){pixel(img,x,y,'#101521',img.data[i+3]);}
 }
 // Angular silhouette built at original pixel resolution, never a scaled 48×64.
 polygon(img,[[68,99],[72,59],[89,43],[110,37],[129,42],[144,35],[168,43],
   [186,62],[189,114],[181,161],[168,190],[140,206],[104,199],[79,175]],C.edge);
 polygon(img,[[84,100],[92,71],[111,61],[137,62],[157,70],[172,92],[170,145],
   [158,167],[128,178],[101,161],[88,132]],C.skinShadow);
 polygon(img,[[93,104],[107,83],[147,81],[167,104],[165,137],[153,160],
   [128,171],[106,155],[94,134]],C.skin);
 polygon(img,[[104,95],[125,88],[145,94],[159,109],[155,137],[138,153],
   [114,143],[103,126]],C.skinLight);
 // Pronounced aging lines, brow and dark stern eyes.
 rect(img,102,111,23,5,C.deep);rect(img,139,110,20,5,C.deep);
 rect(img,105,121,13,5,C.edge);rect(img,143,120,13,5,C.edge);
 rect(img,109,121,4,4,C.silver);rect(img,147,121,4,4,C.silver);
 rect(img,99,129,13,2,C.skinShadow);rect(img,149,129,12,2,C.skinShadow);
 polygon(img,[[128,120],[123,143],[130,151],[139,146]],C.skinShadow);
 rect(img,125,146,11,4,C.skinLight);
 rect(img,117,154,30,3,C.deep);
 // Full beard with jagged ends, unmistakable in 64×64 previews.
 polygon(img,[[83,136],[94,144],[102,161],[117,165],[135,169],
   [152,163],[163,138],[178,137],[180,161],[172,186],[157,204],
   [139,212],[127,226],[113,214],[96,208],[85,185],[81,166]],C.edge);
 polygon(img,[[88,139],[99,151],[105,171],[126,180],[148,174],[165,148],
   [174,148],[172,179],[155,198],[138,204],[127,219],[115,205],[100,199],[89,179]],C.beardShadow);
 polygon(img,[[91,144],[102,155],[109,172],[129,183],[150,171],
   [168,146],[169,174],[151,195],[138,199],[127,212],[118,199],[102,190]],C.beard);
 polygon(img,[[103,154],[117,162],[128,164],[138,162],[151,151],[143,172],
   [128,180],[113,174]],C.silver);
 rect(img,99,150,18,4,C.silver);rect(img,141,149,18,4,C.silver);
 polygon(img,[[117,183],[127,190],[137,184],[134,205],[127,217],[120,201]],C.silver);
 polygon(img,[[91,153],[104,171],[105,189],[91,171]],C.hair);
 polygon(img,[[162,154],[167,166],[154,189],[157,168]],C.silver);
 // Layered asymmetrical silver hair with side part and flyaway tufts.
 polygon(img,[[70,103],[66,84],[75,63],[87,54],[93,39],[112,41],
   [120,33],[137,42],[149,35],[171,46],[181,57],[187,83],
   [176,104],[166,96],[158,100],[144,91],[128,105],[106,100],
   [94,115],[80,118]],C.edge);
 polygon(img,[[73,99],[74,76],[89,57],[98,45],[114,48],[124,39],
   [136,49],[150,43],[169,54],[179,80],[170,93],[157,90],
   [146,83],[127,95],[112,91],[96,105],[82,108]],C.hair);
 polygon(img,[[78,92],[81,74],[98,51],[116,50],[120,55],[108,64],[99,83],[83,98]],C.shine);
 polygon(img,[[120,52],[135,44],[151,49],[150,59],[130,67],[111,89],[99,93]],C.silver);
 polygon(img,[[157,50],[169,57],[179,78],[172,89],[163,77],[153,71]],C.shine);
 polygon(img,[[85,107],[92,100],[99,94],[100,114],[92,133],[82,129]],C.beardShadow);
 polygon(img,[[165,94],[178,91],[182,110],[176,140],[168,136]],C.hair);
 // Hair accents remain cool-silver, no brim, crown, buckles or pointed hat.
 for(let n=0;n<9;n++){
  const x=92+8*n, y=54+((n*7)%18);
  rect(img,x,y,3,2,n%3?C.silver:C.shine);
 }
 if(kind==='cast'){
  polygon(img,[[181,65],[190,52],[196,67],[190,81],[182,81]],C.arcane);
  rect(img,184,60,3,5,C.shine);
 }else if(kind==='hurt'){
  polygon(img,[[143,128],[150,136],[147,144],[140,136]],C.scar);
 }
}
const report=[{file:'peren-atlas.png',width:atlas.width,height:atlas.height,frames:128}];
for(const type of ['portrait.png','portrait-cast.png','portrait-hurt.png']){
 const img=PNG.sync.read(await readFile(join(from,type)));
 portrait(img,type.includes('cast')?'cast':type.includes('hurt')?'hurt':'normal');
 await writeFile(join(to,type),PNG.sync.write(img));
 report.push({file:type,width:img.width,height:img.height});
}
await writeFile(join(to,'report.json'),JSON.stringify({
 stage:'M1h-B',candidate:true,approval:'pendente',parent:'M1h-A',canonical:'older silver-haired silver-bearded hatless warlock',
 changes:'128 head-silhouette frames + 3 portraits; original body and animations retained',
 report
},null,2)+'\n');
console.log('M1h-B: 128 cabeças redesenhadas sem chapéu + 3 retratos; imagens M1e/M1h-A preservadas.');
