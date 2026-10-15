/**
 * M1h-E — character-identity reset: the veteran's FACE, not another palette pass.
 *
 * Only the three 256x256 portraits are redrawn. This candidate deliberately
 * copies the fully-tested M1h-D atlas byte-for-byte (all 128 animations);
 * replacing the animated character is a separate art-acceptance decision.
 * No new headwear, weapons, equipment, game actions, saves or statuses.
 */
import {PNG} from 'pngjs';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const previous=join(root,'public/art-m1hd/characters/peren');
const target=join(root,'public/art-m1he/characters/peren');
await mkdir(target,{recursive:true});
const P={
 ink:'#171d29',deep:'#252d38',slate:'#394552',crease:'#815a54',
 temple:'#805d57',shadow:'#a27164',mid:'#c28b70',
 skin:'#d39b7a',skinLight:'#e6ad87',high:'#efbf95',
 silverDark:'#677680',silverShade:'#8d9ba6',silverMid:'#acb9c2',
 beard:'#c9d1d2',silver:'#e5e8e3',glint:'#f2efe6',
 iris:'#637d89',magic:'#9bcee9'
};
const RGB=Object.fromEntries(Object.entries(P).map(([key,value])=>
 [key,[1,3,5].map(n=>parseInt(value.slice(n,n+2),16))]));
function paint(im,x,y,color,mask=()=>true){
 x=Math.round(x);y=Math.round(y);
 if(x<0||y<0||x>=im.width||y>=im.height||!mask(x,y))return;
 const i=(y*im.width+x)*4;
 // Never change silhouette/alpha: do not paint previously transparent pixels.
 if(!im.data[i+3])return;
 const c=RGB[color];if(!c)throw Error('Unknown paint '+color);
 for(let k=0;k<3;k++)im.data[i+k]=c[k];
}
function box(im,x,y,w,h,color,mask){
 for(let v=y;v<y+h;v++)for(let u=x;u<x+w;u++)paint(im,u,v,color,mask);
}
function line(im,x1,y1,x2,y2,color,mask){
 const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
 for(let j=0;j<=n;j++){
  const t=n?j/n:0;
  paint(im,Math.round(x1+(x2-x1)*t),Math.round(y1+(y2-y1)*t),color,mask);
 }
}
function poly(im,points,color,mask){
 const min=Math.floor(Math.min(...points.map(p=>p[1])));
 const max=Math.ceil(Math.max(...points.map(p=>p[1])));
 for(let y=min;y<=max;y++){
  let hits=[];
  for(let i=0;i<points.length;i++){
   const [x1,y1]=points[i],[x2,y2]=points[(i+1)%points.length];
   if((y1<=y&&y<y2)||(y2<=y&&y<y1))
    hits.push(x1+(y-y1)*(x2-x1)/(y2-y1));
  }
  hits.sort((a,b)=>a-b);
  for(let i=0;i+1<hits.length;i+=2)
   for(let x=Math.ceil(hits[i]);x<=Math.floor(hits[i+1]);x++)
    paint(im,x,y,color,mask);
 }
}
function redraw(im,kind){
 if(im.width!==256||im.height!==256)
  throw Error('Portrait format changed: '+im.width+'x'+im.height);
 const focus=(x,y)=>x>=88&&x<=176&&y>=103&&y<=207;
 // Remove old bright smile, thin beard gap and unfinished facial paint.
 // Preserve the original silver haircut, charcoal cloak, staff and halo.
 poly(im,[[97,132],[116,136],[143,134],[163,131],[174,155],
  [172,178],[158,203],[139,206],[129,216],[111,202],[93,183],
  [90,156]],'deep',focus);
 // Broad aged beard with shaped dark jaw and taper: layered volumes, not
 // a uniform pale U or pixels that resemble teeth.
 poly(im,[[94,140],[105,153],[113,167],[129,171],[145,165],[157,149],
  [170,137],[172,161],[163,185],[151,200],[135,205],[128,217],
  [118,205],[102,196],[93,176]],'silverDark',focus);
 poly(im,[[96,146],[108,162],[115,175],[130,184],[143,173],[160,157],
  [168,145],[164,177],[149,194],[138,198],[127,211],[117,197],
  [105,188],[97,172]],'silverShade',focus);
 poly(im,[[103,149],[114,169],[124,177],[137,176],[155,159],
  [162,154],[159,177],[144,188],[131,203],[117,190],[109,173]],
  'silverMid',focus);
 poly(im,[[111,156],[122,175],[132,179],[143,171],[154,156],
  [151,176],[140,186],[129,201],[119,184]],'beard',focus);
 // Longer, narrower, gaunter face: shade is pushed into temples and
 // hollow cheekbones; eyes are deep-set under a pronounced brow ridge.
 poly(im,[[105,107],[119,99],[141,99],[156,107],[164,120],
  [161,144],[149,161],[138,166],[121,165],[108,157],
  [99,140],[99,121]],'temple',focus);
 poly(im,[[111,107],[122,101],[141,102],[151,107],[158,120],
  [155,140],[144,156],[132,161],[121,159],[109,147],
  [104,129]],'shadow',focus);
 poly(im,[[116,109],[123,104],[139,105],[148,110],[153,120],
  [151,135],[141,149],[128,156],[118,149],[110,136],[110,119]],
  'skin',focus);
 poly(im,[[123,111],[140,111],[145,119],[142,133],[133,145],
  [121,141],[116,133],[117,118]],'skinLight',focus);
 poly(im,[[126,114],[136,111],[140,116],[135,124],[125,125]],
  'high',focus);
 // Furrowed, heavy eyelids and knitted brows. Low-glint eyes avoid
 // youthful/cartoonish large pupils.
 poly(im,[[105,116],[113,111],[123,113],[125,118],
  [119,120],[109,120]],'deep',focus);
 poly(im,[[140,117],[144,112],[153,111],[159,116],
  [156,120],[143,120]],'deep',focus);
 line(im,108,120,122,121,'ink',focus);
 line(im,142,121,156,120,'ink',focus);
 box(im,114,122,5,2,'iris',focus);
 box(im,146,122,5,2,'iris',focus);
 box(im,116,122,2,2,'ink',focus);
 box(im,148,122,2,2,'ink',focus);
 // Sunken under-eyes and age lines; shadows are short and asymmetric.
 line(im,106,126,121,128,'crease',focus);
 line(im,143,127,157,125,'crease',focus);
 line(im,103,130,110,132,'shadow',focus);
 line(im,153,131,161,129,'shadow',focus);
 line(im,105,134,111,136,'crease',focus);
 line(im,152,136,158,133,'crease',focus);
 // Long nose, bridge highlight and imperfect nostrils.
 line(im,130,122,127,140,'shadow',focus);
 line(im,136,126,140,140,'mid',focus);
 poly(im,[[124,143],[129,138],[140,144],[138,151],
  [126,151]],'skin',focus);
 box(im,125,147,4,2,'temple',focus);
 box(im,136,146,4,2,'temple',focus);
 box(im,131,144,3,2,'high',focus);
 // Tapered, downturned moustache. Barely-visible mouth split: NO exposed
 // bright crescent underneath and no smiling corners.
 poly(im,[[108,151],[118,147],[126,151],[129,157],
  [123,160],[115,157]],'silverDark',focus);
 poly(im,[[137,156],[143,150],[153,148],[160,152],
  [153,157],[142,160]],'silverDark',focus);
 poly(im,[[114,151],[120,150],[126,155],[122,158],
  [116,156]],'silverMid',focus);
 poly(im,[[141,155],[149,150],[155,152],[151,156],
  [145,157]],'silverMid',focus);
 line(im,124,161,139,161,'ink',focus);
 box(im,122,160,2,2,'temple',focus);
 box(im,140,160,2,2,'temple',focus);
 line(im,127,164,136,164,'silverDark',focus);
 // Beard fibres grouped into tapered locks that continue below the lip.
 const locks=[
  [110,160,118,183,'beard'],[115,166,127,196,'silverMid'],
  [123,170,128,204,'silver'],[140,170,132,199,'silver'],
  [151,166,142,189,'beard'],[161,159,151,180,'silverMid'],
  [105,159,109,179,'silverDark'],[136,176,136,193,'silverShade'],
  [119,183,124,200,'silverDark'],[148,180,141,193,'silverShade']
 ];
 for(const [x,y,x2,y2,c] of locks)line(im,x,y,x2,y2,c,focus);
 line(im,126,202,129,208,'glint',focus);
 // Mode changes deliberately affect expression without changing identity.
 if(kind==='cast'){
  line(im,108,114,122,117,'ink',focus);
  line(im,144,116,156,113,'ink',focus);
  line(im,128,113,131,119,'crease',focus);
  box(im,148,121,2,2,'magic',focus);
 }else if(kind==='hurt'){
  line(im,107,114,121,115,'ink',focus);
  line(im,142,115,155,113,'ink',focus);
  line(im,126,161,137,162,'ink',focus);
  line(im,103,138,111,140,'crease',focus);
 }
}
const files=['portrait.png','portrait-cast.png','portrait-hurt.png'];
for(const file of files){
 const im=PNG.sync.read(await readFile(join(previous,file)));
 redraw(im,file.includes('cast')?'cast':file.includes('hurt')?'hurt':'neutral');
 await writeFile(join(target,file),PNG.sync.write(im));
}
// Atlas is intentionally unmodified. The entire old 32-clip animation set
// remains identical; no claims about redesigned in-game frames.
await copyFile(join(previous,'peren-atlas.png'),join(target,'peren-atlas.png'));
const report={
 stage:'M1h-E',status:'candidato',approval:'pendente',
 goal:'New angular veteran face, expressive brows, recessed eyes, long nose, closed mouth and tapered beard',
 method:'portrait-focused structural redraw; no extra sprite recoloring',
 previousVariantsPreserved:['M1e','M1h-A','M1h-B','M1h-C','M1h-D'],
 changedFiles:files,
 atlas:{preserved:true,frames:128,width:1536,height:256},
 portrait:{width:256,height:256,identity:'elderly silver-haired and silver-bearded warlock, no pointed hat'}
};
await writeFile(join(target,'report.json'),JSON.stringify(report,null,2)+'\n');
console.log('M1h-E: three new veteran faces; original 128 animated frames copied unchanged.');
