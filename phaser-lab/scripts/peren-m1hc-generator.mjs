/**
 * M1h-C — hand-directed pixel refinements on top of M1h-B.
 *
 * Separate optional candidate. Fixes overexposed "helmet hair", overly smooth
 * beard and youthful/cheerful portrait expression. All edits are constrained
 * to the head region; body/staff and the 128 animation frames are preserved.
 *
 * No RNG: repeated builds are byte-for-byte deterministic.
 */
import {PNG} from 'pngjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const input=join(root,'public/art-m1hb/characters/peren');
const output=join(root,'public/art-m1hc/characters/peren');
await mkdir(output,{recursive:true});

const P={
  coal:'#242c36',outline:'#171d29',iron:'#3c4754',
  smoke:'#63707c',silverShadow:'#82909a',silverMid:'#a7b2b9',
  silver:'#c8d0d0',pearl:'#e1e4df',glint:'#f3f0e6',
  ash:'#7c858a',beardShade:'#8997a2',beardMid:'#b4bfc4',
  skin:'#cf9879',skinShadow:'#98665b',wrinkle:'#a16e62',
  eye:'#252b35',iris:'#667e83',scar:'#8b6e6c'
};
const RGB=Object.fromEntries(Object.entries(P).map(([name,hex])=>[name,
  [1,3,5].map(index=>parseInt(hex.slice(index,index+2),16))]));
const ORIGINAL_HAIR=new Set(['c0c8ce','e5e9e8','f3f1e8','c3c7c8','758390','171d29']);
const rHex=(im,x,y)=>{if(x<0||y<0||x>=im.width||y>=im.height)return '';
 const i=(Math.floor(y)*im.width+Math.floor(x))*4;
 return [0,1,2].map(k=>im.data[i+k].toString(16).padStart(2,'0')).join('');
};
function point(im,x,y,color){
 x=Math.round(x);y=Math.round(y);
 if(x<0||y<0||x>=im.width||y>=im.height)return;
 const j=(y*im.width+x)*4,a=im.data[j+3];
 // Never resurrect transparent halo/background pixels by accident.
 if(!a)return;
 const rgb=RGB[color];if(!rgb)throw Error('Unknown palette token '+color);
 for(let i=0;i<3;i++)im.data[j+i]=rgb[i];
}
function line(im,x1,y1,x2,y2,color,canPaint=()=>true){
 const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
 for(let n=0;n<=steps;n++){
  const t=steps?n/steps:0,x=Math.round(x1+(x2-x1)*t),y=Math.round(y1+(y2-y1)*t);
  if(canPaint(x,y))point(im,x,y,color);
 }
}
function block(im,x,y,w,h,color,canPaint=()=>true){
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)
  if(canPaint(xx,yy))point(im,xx,yy,color);
}
function hairMask(img,x,y,{small=false}={}){
 const code=rHex(img,x,y);
 if(!ORIGINAL_HAIR.has(code))return false;
 if(code==='171d29')return false; // Keep outer silhouette/ink outlines.
 return true;
}
function refineSprite(img,ox,oy,direction,action,frame){
 const bob=['walk','run'].includes(action)?[0,-1,0,1][frame]:action==='hurt'?[0,0,1,1][frame]:0;
 const at=(x,y)=>[ox+x,oy+y+bob];
 const q=(x,y,c,mask=false)=>{
  const [X,Y]=at(x,y);
  if(!mask||hairMask(img,X,Y,{small:true}))point(img,X,Y,c);
 };
 const stroke=(x,y,x2,y2,c,mask=false)=>{
  const [X,Y]=at(x,y),[U,V]=at(x2,y2);
  line(img,X,Y,U,V,c,mask?(px,py)=>hairMask(img,px,py,{small:true}):undefined);
 };
 // Replace only a fraction of broad uniform pale regions. Tight, directional
 // strands distinguish a swept haircut from a solid white helmet at 2× size.
 if(direction==='down'){
  stroke(17,14,21,11,'silverShadow',true);
  stroke(19,15,25,12,'silverMid',true);
  stroke(25,12,30,11,'ash',true);
  stroke(26,14,32,15,'pearl',true);
  q(16,18,'ash',true);q(32,18,'silverShadow',true);
  // Wrinkled, stern eyes: no grin. Two little crow's feet and a mouth line.
  q(18,24,'wrinkle');q(30,24,'wrinkle');
  q(19,25,'skinShadow');q(29,25,'skinShadow');
  stroke(22,28,26,28,'coal');
  // Beard texture and a pointed split-tip, not a flat triangular block.
  stroke(19,30,22,34,'silverMid',true);
  stroke(28,30,25,35,'beardShade',true);
  stroke(23,34,23,37,'pearl',true);
  q(20,34,'ash',true);q(28,34,'ash',true);
 }else if(direction==='up'){
  stroke(18,13,21,20,'silverShadow',true);
  stroke(25,11,28,19,'ash',true);
  stroke(31,15,30,23,'pearl',true);
  stroke(17,24,21,27,'silverMid',true);
  q(23,28,'silverShadow',true);q(27,27,'pearl',true);
 }else{
  // Left/right are true mirrored head silhouettes from the previous pass.
  const flip=direction==='left';
  const X=x=>flip?47-x:x;
  stroke(X(16),15,X(22),11,'silverShadow',true);
  stroke(X(20),17,X(28),13,'silverMid',true);
  stroke(X(26),12,X(31),14,'ash',true);
  stroke(X(18),22,X(19),26,'silverShadow',true);
  q(X(32),24,'wrinkle');q(X(30),25,'skinShadow');
  stroke(X(22),30,X(26),35,'silverMid',true);
  stroke(X(29),32,X(25),37,'beardShade',true);
 }
 if(action==='cast'&&frame===3){
  // Small restrained glow on a silver lock; spell itself is unchanged.
  q(direction==='left'?19:28,15,'pearl',true);
 }
}
function refinePortrait(img,kind){
 if(img.width!==256||img.height!==256)throw Error('M1h-C requires 256×256 portraits');
 const inHair=(x,y)=>x>=67&&x<=190&&y>=33&&y<=115&&hairMask(img,x,y);
 const inBeard=(x,y)=>x>=82&&x<=179&&y>=147&&y<=216&&hairMask(img,x,y);
 // Shade the root and crown with an uneven, gently curved mass of silver.
 // Restrict the edit to existing drawn hair pixels: no extra cap/hat outline.
 for(let y=38;y<113;y++)for(let x=66;x<190;x++){
  if(!inHair(x,y))continue;
  const code=rHex(img,x,y);
  // Shaded hair in broad clumps, NOT per-pixel noise: miniature pixel art
  // needs readable silver locks rather than diagonal crosshatching.
  const leftLock=100+(70-y)*0.55;
  const centreLock=134+(70-y)*0.35;
  const rightLock=164+(70-y)*0.22;
  if(y>76&&x<99)point(img,x,y,'silverShadow');
  else if(y<62&&x>153)point(img,x,y,'silverMid');
  else if(y>54&&y<93&&Math.abs(x-leftLock)<5)point(img,x,y,'silverMid');
  else if(y>48&&y<90&&Math.abs(x-centreLock)<5)point(img,x,y,'silver');
  else if(y>56&&y<90&&Math.abs(x-rightLock)<4)point(img,x,y,'silverShadow');
  else if(code==='f3f1e8'&&y>70)point(img,x,y,'pearl');
  else if(code==='e5e9e8'&&y>96)point(img,x,y,'silverMid');
 }
 // Six asymmetric swept locks. Use existing hair as a per-pixel stencil so
 // long strokes cannot paint over brows, face, halo or empty background.
 const locks=[
  [83,76,106,51,'silverShadow'],[96,83,120,50,'silverMid'],
  [113,83,141,51,'ash'],[132,80,157,53,'silverMid'],
  [150,83,171,69,'silverShadow'],[94,99,115,72,'silverShadow'],
  [125,71,142,57,'pearl'],[145,69,161,59,'pearl'],
  [83,88,94,71,'pearl']
 ];
 for(const [x,y,u,v,c] of locks)line(img,x,y,u,v,c,inHair);
 // Break up monotonous beard triangles; the locks taper toward the jaw.
 for(let y=151;y<215;y++)for(let x=88;x<175;x++){
  if(!inBeard(x,y))continue;
  const code=rHex(img,x,y);
  // Volume is built from a few long lock groups rather than dithering.
  if(y>168&&y<195&&x<110)point(img,x,y,'beardShade');
  else if(y>168&&y<194&&x>151)point(img,x,y,'silverMid');
  else if(y>188&&x>=114&&x<139&&code==='e5e9e8')point(img,x,y,'beardMid');
  else if(y>175&&x>138&&x<151&&code==='c3c7c8')point(img,x,y,'silver');
 }
 const beardLocks=[
  [101,156,113,184,'pearl'],[113,165,121,202,'beardShade'],
  [145,161,134,206,'pearl'],[157,155,145,188,'beardShade'],
  [94,168,106,190,'silverMid'],[168,162,157,181,'silverMid'],
  [127,183,126,208,'pearl'],[134,180,132,202,'silverShadow']
 ];
 for(const [x,y,u,v,c] of beardLocks)line(img,x,y,u,v,c,inBeard);
 // Small facial-age accents. Keep them within skin (forehead/eye corner).
 const inFace=(x,y)=>{
  const c=rHex(img,x,y);
  return x>91&&x<172&&y>100&&y<156&&
    ['cf9879','efbb90','98665b','a16e62'].includes(c);
 };
 for(const [x,y,u,v] of [
  [109,106,121,105],[137,105,149,107],
  [94,126,101,129],[157,126,164,129],
  [101,139,108,141],[151,141,158,137]
 ])line(img,x,y,u,v,'wrinkle',inFace);
 // Softer central eye sockets and narrow, un-smiling mouth.
 line(img,109,118,122,119,'skinShadow',inFace);
 line(img,141,118,153,118,'skinShadow',inFace);
 // Eliminate the residual white "smile" left by the polygonal M1h-B lips.
 // Flat skin shade, stern small mouth, moustache tapering into the beard.
 block(img,117,151,29,9,'skinShadow',(x,y)=>rHex(img,x,y)!=='');
 block(img,120,152,23,3,'skin',(x,y)=>rHex(img,x,y)!=='');
 line(img,122,156,140,156,'coal');
 line(img,119,158,141,158,'beardShade');
 line(img,122,160,138,160,'beardMid');
 // A few isolated silver sideburn flecks; no fake hat brim.
 block(img,90,119,2,5,'silverMid',inBeard);
 block(img,166,119,2,5,'silverMid',inBeard);
 if(kind==='cast'){
  // Keep the B magic halo and spell flash. Add one glint in the hair only.
  line(img,160,57,169,62,'pearl',inHair);
 }else if(kind==='hurt'){
  line(img,148,129,152,132,'skinShadow',inFace);
 }
}
const old=PNG.sync.read(await readFile(join(input,'peren-atlas.png')));
if(old.width!==1536||old.height!==256)throw Error('Unexpected source size '+old.width+'×'+old.height);
const next=PNG.sync.read(await readFile(join(input,'peren-atlas.png')));
const dirs=['down','left','right','up'];
const actions=['idle','walk','run','interact','gather','hurt','cast','attack'];
for(let dir=0;dir<4;dir++)for(let action=0;action<8;action++)for(let frame=0;frame<4;frame++)
 refineSprite(next,(action*4+frame)*48,dir*64,dirs[dir],actions[action],frame);
await writeFile(join(output,'peren-atlas.png'),PNG.sync.write(next));
const report=[{file:'peren-atlas.png',width:next.width,height:next.height,frames:128}];
for(const fname of ['portrait.png','portrait-cast.png','portrait-hurt.png']){
 const img=PNG.sync.read(await readFile(join(input,fname)));
 refinePortrait(img,fname.includes('cast')?'cast':fname.includes('hurt')?'hurt':'neutral');
 await writeFile(join(output,fname),PNG.sync.write(img));
 report.push({file:fname,width:img.width,height:img.height});
}
await writeFile(join(output,'report.json'),JSON.stringify({
 stage:'M1h-C',state:'em_producao',approval:'pendente',base:'M1h-B',
 notes:'Subtle age lines, stern mouth, layered silver strands and articulated beard; non-destructive candidate',
 originalVariantsPreserved:['M1e','M1h-A','M1h-B'],report
},null,2)+'\n');
console.log('M1h-C: 128 hair/beard/facial refinements and 3 portraits generated; prior variants untouched.');
