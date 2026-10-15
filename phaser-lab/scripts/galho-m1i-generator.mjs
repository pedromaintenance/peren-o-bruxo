/**
 * M1i-A: Galho Infectado — independent, original pixel-art concept in-game.
 * 28 frames 64x64: idle, walk, alert, attack, hurt, retreat, death.
 * No new monster, AI, attacks, stats or loot. Default M1e is unchanged.
 */
import {PNG} from 'pngjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const out=join(root,'public/art-m1i/monsters/mob-galho-infectado');
await mkdir(out,{recursive:true});
const C={
 ink:'#101718',void:'#172124',bark:'#302b27',barkDark:'#43372f',
 barkMid:'#5d4939',barkLight:'#8a6850',bone:'#b99c71',
 rot:'#4c4c33',moss:'#364e3d',mossLit:'#638363',
 mossDark:'#25392c',vein:'#782f3f',resin:'#ae4059',
 light:'#e27680',eye:'#f8aa7e',spark:'#f8dfb5',
 root:'#272b25',rootLight:'#675b45'
};
const rgba=c=>[1,3,5].map(i=>parseInt(C[c].slice(i,i+2),16));
function painter(img,originX=0,originY=0,scale=1){
 const set=(x,y,c,alpha=255)=>{
  x=Math.round(originX+x*scale);y=Math.round(originY+y*scale);
  const size=Math.max(1,Math.round(scale));
  const [r,g,b]=rgba(c);
  for(let j=0;j<size;j++)for(let i=0;i<size;i++){
   const xx=x+i,yy=y+j;
   if(xx<0||yy<0||xx>=img.width||yy>=img.height)continue;
   const k=(yy*img.width+xx)*4;
   img.data[k]=r;img.data[k+1]=g;img.data[k+2]=b;img.data[k+3]=alpha;
  }
 };
 const rect=(x,y,w,h,c,a=255)=>{
  for(let j=0;j<h;j++)for(let i=0;i<w;i++)set(x+i,y+j,c,a);
 };
 const line=(x1,y1,x2,y2,c,width=1)=>{
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))*2));
  for(let s=0;s<=steps;s++){
   const t=s/steps,x=Math.round(x1+(x2-x1)*t),y=Math.round(y1+(y2-y1)*t);
   rect(x-Math.floor(width/2),y-Math.floor(width/2),width,width,c);
  }
 };
 const polygon=(pts,c)=>{
  const lo=Math.floor(Math.min(...pts.map(p=>p[1]))),hi=Math.ceil(Math.max(...pts.map(p=>p[1])));
  for(let y=lo;y<=hi;y++){
   const hits=[];
   for(let i=0;i<pts.length;i++){
    const [x1,y1]=pts[i],[x2,y2]=pts[(i+1)%pts.length];
    if((y1<=y&&y2>y)||(y2<=y&&y1>y))hits.push(x1+(y-y1)*(x2-x1)/(y2-y1));
   }
   hits.sort((a,b)=>a-b);
   for(let i=0;i+1<hits.length;i+=2)
    for(let x=Math.ceil(hits[i]);x<=Math.floor(hits[i+1]);x++)set(x,y,c);
  }
 };
 const ellipse=(cx,cy,rx,ry,c,alpha=255)=>{
  for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){
   if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)set(x,y,c,alpha);
  }
 };
 return {set,rect,line,polygon,ellipse};
}
const ACTIONS=['idle','walk','alert','attack','hurt','retreat','death'];
function galho(p,action='idle',frame=0,{portrait=false}={}){
 const {set,rect,line,polygon:poly,ellipse}=p;
 const phase=frame%4,bob=action==='walk'?[0,-2,0,1][phase]:action==='idle'?[0,-1,0,0][phase]:0;
 const alert=action==='alert'?phase:0;
 const strike=action==='attack'?[0,2,7,3][phase]:0;
 const stumble=action==='hurt'?[0,2,0,1][phase]:0;
 const retreat=action==='retreat'?[0,-1,-2,-3][phase]:0;
 const collapse=action==='death'?[0,3,8,13][phase]:0;
 const drawY=y=>y+bob+collapse+stumble;
 const py=(points)=>points.map(([x,y])=>[x+retreat,y+bob+collapse+stumble]);
 const pp=(points,color)=>poly(py(points),color);
 const ll=(x,y,a,b,c,w=1)=>line(x+retreat,drawY(y),a+retreat,drawY(b),c,w);
 const rr=(x,y,w,h,c)=>rect(x+retreat,drawY(y),w,h,c);
 const ee=(x,y,rx,ry,c)=>ellipse(x+retreat,drawY(y),rx,ry,c);
 // Ground-bound torn roots: the monster's old trunk is hollow and mobile.
 pp([[29,36],[35,36],[34,51],[41,58],[36,61],[31,55],[27,62],[23,60],[28,50]],'ink');
 pp([[30,37],[34,36],[33,52],[38,59],[34,59],[31,54],[28,59],[26,59],[29,49]],'barkDark');
 ll(30,49,28,57,'barkLight');ll(33,52,36,59,'rootLight');
 pp([[26,55],[20,57],[16,60],[21,60],[24,58],[25,61],[28,61],[30,57]],'root');
 pp([[36,53],[43,58],[48,59],[45,61],[39,59],[38,62],[34,60]],'root');
 // Two antler-like broken boughs — irregular, split silhouette, not a cute tree.
 ll(28,32,15,22-strike,'ink',5);
 ll(15,22-strike,11,13-strike,'ink',4);
 ll(16,22-strike,7,19-strike,'ink',3);
 ll(23,25,20,11,'ink',4);
 ll(20,13,24,8,'ink',3);
 ll(37,29,47,17+strike,'ink',5);
 ll(46,18+strike,52,10+strike,'ink',4);
 ll(43,21+strike,55,20+strike,'ink',3);
 ll(38,27,41,10,'ink',4);
 ll(41,11,37,7,'ink',3);
 ll(28,32,15,22-strike,'barkMid',3);
 ll(15,22-strike,11,13-strike,'barkLight',2);
 ll(23,24,20,11,'barkMid',2);
 ll(37,29,47,17+strike,'barkMid',3);
 ll(47,17+strike,52,10+strike,'barkLight',2);
 ll(41,21,41,10,'barkDark',2);
 // Moss/rot on branch forks, with fragmented, disease-like areas.
 for(const [x,y,s] of [[11,15,4],[17,20,5],[21,14,4],[42,14,4],[48,15,5],[51,21,4],[38,10,4]]){
  if((frame+Math.floor(x/9))%4===2&&action==='death')continue;
  ee(x,y+bob+collapse, s,Math.max(2,Math.floor(s/2)),'mossDark');
  rr(x-s+1,y-1,s*2-3,2,'moss');
  rect(x+retreat,y+bob+collapse-2,2,1,'mossLit');
 }
 // Gnarled shoulder plates below the antlers.
 pp([[17,28],[21,23],[28,25],[30,33],[26,40],[20,38],[16,35]],'ink');
 pp([[40,27],[44,24],[48,29],[47,36],[40,41],[35,36]],'ink');
 pp([[18,30],[22,26],[27,28],[28,34],[23,37],[18,34]],'mossDark');
 pp([[40,28],[44,27],[46,31],[44,35],[39,38],[37,34]],'mossDark');
 pp([[20,28],[25,27],[26,31],[22,32]],'mossLit');
 pp([[40,29],[43,28],[45,30],[41,32]],'mossLit');
 // Hollow stump chest, planked bark, thin resin seams.
 pp([[27,23],[35,22],[40,30],[41,42],[35,51],[27,49],[23,40],[24,30]],'ink');
 pp([[28,25],[34,24],[38,30],[39,41],[34,49],[28,47],[25,40],[26,30]],'barkDark');
 pp([[29,27],[33,26],[36,30],[36,44],[32,46],[28,43],[27,36]],'barkMid');
 pp([[30,29],[34,30],[34,41],[31,43],[29,39]],'bark');
 ll(29,33,27,44,'barkLight');
 ll(35,29,38,40,'barkLight');
 rr(25,39,3,5,'rot');
 rr(36,34,2,7,'moss');
 // Central void and split-heart fungal corruption (not an invented combat status).
 pp([[27,31],[32,29],[37,33],[36,40],[32,45],[28,41]],'void');
 pp([[29,31],[33,30],[35,35],[33,41],[30,40]],'vein');
 ll(31,33,33,39,'resin',2);
 rr(30,37,2,2,'light');
 // A skull-like knot above the heart, eyes are recessed glowing amber.
 pp([[26,24],[29,20],[36,21],[40,25],[37,30],[28,29]],'ink');
 pp([[27,24],[30,22],[35,22],[38,25],[36,28],[29,28]],'barkMid');
 // Corruption eyes emerge when threatened, otherwise faint in trunk void.
 const alive=action!=='death'||phase<2;
 if(alive){
  rr(29,25,3,2,'eye');rr(35,25,3,2,'eye');
  rr(30,25,1,1,'spark');rr(36,25,1,1,'spark');
  rr(32,27,2,1,'vein');
 }
 if(action==='alert'||action==='attack'){
  rr(27,31,2+alert,2,'resin');
  rr(37,36,2,2,'resin');
 }
 if(action==='hurt'){
  rr(29,31,6,2,'light');ll(29,31,35,35,'resin');
 }
 // Fragmented stippled spores — non-mechanical, visible only in active frames.
 if(action==='alert'||action==='attack'||(action==='idle'&&frame===2)){
  for(const [x,y] of [[13,10],[50,8],[48,27],[17,35],[42,43],[24,18]]){
   if((x+frame)%3!==0)rr(x+retreat,drawY(y),2,2,'resin');
  }
 }
 if(action==='death'){
  if(phase>=2){
   // Fade eyes; collapsed wood grows dark, no fake extra combat action.
   pp([[27,25],[38,25],[35,28],[27,29]],'barkDark');
   rr(27,40,10,3,'rot');
  }
 }
}
const atlas=new PNG({width:256,height:448});
for(let a=0;a<7;a++)for(let f=0;f<4;f++)
 galho(painter(atlas,64*f,64*a),ACTIONS[a],f);
await writeFile(join(out,'atlas.png'),PNG.sync.write(atlas,{colorType:6}));
// Portrait retains a circular antique-gold occult frame, but depicts the
// creature at 2×, emphasizing rot, root claws and glowing resin.
const portrait=new PNG({width:160,height:160});
const q=painter(portrait);
const {ellipse,line,rect}=q;
ellipse(80,78,75,74,'ink',190);
ellipse(80,78,72,71,'barkLight',225);
ellipse(80,78,68,67,'void',255);
ellipse(80,78,63,62,'mossDark',240);
for(let i=0;i<12;i++){
 const t=(Math.PI*2*i)/12;
 const x=80+72*Math.cos(t),y=78+70*Math.sin(t);
 rect(Math.round(x)-2,Math.round(y)-2,4,4,i%3===0?'bone':'barkMid');
}
galho(painter(portrait,0,5,2.25),'alert',2,{portrait:true});
for(const [x,y] of [[32,42],[118,31],[41,116],[130,96],[77,19]]){
 rect(x,y,3,3,'resin');rect(x+1,y,1,1,'light');
}
await writeFile(join(out,'portrait.png'),PNG.sync.write(portrait,{colorType:6}));
const report={stage:'M1i-A',id:'mob-galho-infectado',status:'em_producao',approval:'pendente',
 frameWidth:64,frameHeight:64,columns:4,rows:7,
 actions:ACTIONS,files:['atlas.png','portrait.png'],
 design:'fungal rot within gnarled, split-bough living wood, crimson resin, amber eyes and broken roots',
 contract:'Existing monster IDs, AI, stats, rewards, animation names and classic art untouched'};
await writeFile(join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
console.log('M1i-A: Galho Infectado — 28 new 64×64 animated frames + 160×160 portrait; original retained.');
