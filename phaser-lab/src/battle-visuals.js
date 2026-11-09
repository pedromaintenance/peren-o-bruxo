/**
 * Identidade visual de cada arena da pré-alfa.
 * Renderiza cenários autorais simples usando Graphics, sem substituir arte aprovada.
 * Não modifica combate, criaturas, inventário nem transações.
 */
import {hashSeed,rngFor} from './world.js';

export const PEREN_BATTLE_ART=Object.freeze({
 idle:{key:'peren-battler-idle',file:'battle/runtime-v84/idle.png',width:560,height:821,frames:4,fps:4},
 fire:{key:'peren-battler-fire',file:'characters/peren/battler/casting/peren-casting-fire.png',width:512,height:682,frames:4,fps:5},
 ice:{key:'peren-battler-ice',file:'characters/peren/battler/casting/peren-casting-ice.png',width:512,height:682,frames:4,fps:5},
 neutral:{key:'peren-battler-neutral',file:'characters/peren/battler/casting/peren-casting.png',width:512,height:682,frames:4,fps:5}
});
export const BATTLE_ART_FILES=Object.freeze(Object.values(PEREN_BATTLE_ART));
export function casterForAction(action){
 if(action==='spell:mag-raio-de-fogo')return PEREN_BATTLE_ART.fire;
 if(action==='spell:mag-raio-de-gelo')return PEREN_BATTLE_ART.ice;
 return action?.startsWith('spell:')?PEREN_BATTLE_ART.neutral:null;
}
export const colorNumber=hex=>Number.parseInt(String(hex).replace('#',''),16);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function battleAreaBounds(width,height,top=height*.18,bottom=height*.73){
 const w=Math.max(240,width),h=Math.max(300,height);
 if(bottom-top<Math.min(115,h*.2)){top=h*.18;bottom=h*.73}
 return {w,h,top,bottom,height:bottom-top,ground:bottom-11,compact:w<=620};
}
export function measuredBattleArea(scene){
 const {width:w,height:h}=scene.scale;
 let top=h*.18,bottom=h*.73;
 const canvas=scene.game?.canvas?.getBoundingClientRect?.();
 const header=typeof document!=='undefined'?document.getElementById('battleHeader')?.getBoundingClientRect?.():null;
 const panel=typeof document!=='undefined'?document.getElementById('battlePanel')?.getBoundingClientRect?.():null;
 if(canvas?.height&&header&&panel){
  const ratio=h/canvas.height;
  top=(header.bottom-canvas.top)*ratio+7;
  bottom=(panel.top-canvas.top)*ratio-6;
 }
 return battleAreaBounds(w,h,top,bottom);
}
export function regionBattleSignature(region){
 return String(region?.id||'murin')+':'+String(region?.kind||'forest')+':'+String(region?.colors?.join('-')||'');
}
/**
 * Backdrop is genuinely different per biome (landforms, vegetation, shore,
 * ruins, cliff architecture); it is not a tinted copy of Mürin.
 */
export function createRegionBattleBackdrop(scene,region,seed='murin-001'){
 const {w,h,ground}=battleAreaBounds(scene.scale.width,scene.scale.height);
 const kind=region?.kind||'forest';
 const col=region?.colors||['#18312a','#234833','#345347','#47594a','#556c58','#756d57','#9aa594','#274c65'];
 const g=scene.add.graphics().setDepth(-8);
 const rnd=rngFor('arena:'+seed+':'+kind);
 const dark=colorNumber(col[0]),middle=colorNumber(col[2]),light=colorNumber(col[6]),bright=colorNumber(col[5]);
 const water=colorNumber(col[7]),back=colorNumber(col[3]);
 g.fillStyle(dark).fillRect(0,0,w,h);
 // Bands of sky and atmospheric haze.
 for(let i=0;i<16;i++){
  const y=Math.floor(i*h*.048);
  g.fillStyle(i%3===0?back:i%3===1?dark:middle,clamp(.07+(i/16)*.33,.07,.42));
  g.fillRect(0,y,w,Math.ceil(h*.052));
 }
 const horizon=ground-h*.19;
 // Scattered light sources are deterministic for each expedition.
 for(let i=0;i<17;i++){
  const x=rnd()*w,y=h*.16+rnd()*h*.25;
  g.fillStyle(light,(kind==='blight'||kind==='abyss'||kind==='ruins')?.18:.09)
   .fillCircle(x,y,1+rnd()*2);
 }
 const line=(color,width,a,x1,y1,x2,y2)=>g.lineStyle(width,color,a).lineBetween(x1,y1,x2,y2);
 const tri=(color,a,x1,y1,x2,y2,x3,y3)=>g.fillStyle(color,a).fillTriangle(x1,y1,x2,y2,x3,y3);
 const tree=(x,baseline,size=1,pine=false)=>{
  const height=(68+Math.round(rnd()*36))*size;
  const trunk=8*size;
  g.fillStyle(back,.85).fillRect(x-trunk/2,baseline-height*.6,trunk,height*.62);
  if(pine){
   for(let k=0;k<3;k++)tri(dark,.98,x,baseline-height*(1-k*.16),x-20*size*(1+k*.07),baseline-height*(.37-k*.1),x+20*size*(1+k*.07),baseline-height*(.37-k*.1));
  }else{
   g.fillStyle(dark,.96).fillEllipse(x,baseline-height*.62,70*size,62*size);
   g.fillStyle(middle,.42).fillEllipse(x-8*size,baseline-height*.75,29*size,17*size);
  }
 };
 const rock=(x,baseline,size=1)=>{
  tri(dark,.95,x-38*size,baseline,x-4*size,baseline-65*size,x+47*size,baseline);
  tri(middle,.7,x-6*size,baseline-58*size,x+47*size,baseline,x+6*size,baseline);
 };
 const column=(x,baseline,size=1)=>{
  const tall=72*size;
  g.fillStyle(dark).fillRect(x-10*size,baseline-tall,20*size,tall);
  g.fillStyle(light,.35).fillRect(x-8*size,baseline-tall,3*size,tall);
  g.fillStyle(back).fillRect(x-14*size,baseline-tall,28*size,10*size);
  g.fillStyle(back).fillRect(x-15*size,baseline-8*size,30*size,8*size);
 };
 const cactus=(x,baseline,size=1)=>{
  line(dark,8*size,1,x,baseline,x,baseline-65*size);
  line(dark,6*size,1,x,baseline-32*size,x-17*size,baseline-32*size);
  line(dark,6*size,1,x-17*size,baseline-32*size,x-17*size,baseline-51*size);
  line(dark,5*size,1,x,baseline-23*size,x+17*size,baseline-23*size);
  line(dark,5*size,1,x+17*size,baseline-23*size,x+17*size,baseline-42*size);
 };
 // Horizontals separate distant silhouettes from active battlers.
 if(['coast','river'].includes(kind)){
  g.fillStyle(water,.83).fillRect(0,horizon,w,ground-horizon+45);
  g.fillStyle(light,.2).fillRect(0,horizon,w,2);
  for(let i=0;i<30;i++){
   const x=rnd()*w,y=horizon+10+rnd()*(ground-horizon);
   line(light,1,.2+rnd()*.2,x,y,x+8+rnd()*29,y);
  }
  if(kind==='coast'){
   for(let i=0;i<8;i++)rock(i*w/7,ground-10,.5+rnd()*.6);
   tri(dark,.93,0,ground,0,horizon+15,w*.2,ground);
  }else{
   for(let i=0;i<6;i++)tree(i*w/5,ground-20,.53+rnd()*.25);
   for(let i=0;i<3;i++)column(i*w/2,ground-12,.45);
  }
 } else if(kind==='mountain'){
  for(let i=-1;i<6;i++){
   const x=i*w/4;
   tri(back,.87,x-w*.22,ground,x+10,ground-h*.36,x+w*.34,ground);
   tri(light,.5,x-18,ground-h*.31,x+10,ground-h*.36,x+43,ground-h*.25);
  }
  for(let i=0;i<11;i++)rock(rnd()*w,ground-10,.5+rnd()*.6);
 } else if(kind==='dry'){
  for(let i=0;i<3;i++)g.fillStyle(i%2?middle:back,.92).fillEllipse(w*.2+i*w*.35,ground+20-i*6,w*.86,h*.21);
  for(let i=0;i<8;i++)cactus(rnd()*w,ground-12,.3+rnd()*.45);
  for(let i=0;i<9;i++)rock(rnd()*w,ground-9,.2+rnd()*.33);
 } else if(['bone','ruins','abyss'].includes(kind)){
  if(kind==='abyss'){
   g.fillStyle(0x06060e,.8).fillEllipse(w*.52,horizon+11,w*.48,h*.23);
   g.lineStyle(3,water,.7).strokeEllipse(w*.52,horizon+11,w*.48,h*.23);
  }
  for(let i=0;i<10;i++){
   const x=i*w/9,sz=.48+rnd()*.7;
   if(kind==='ruins')column(x,ground-9,sz);
   else if(kind==='bone'){
    rock(x,ground-8,sz);
    if(i%3===1)line(light,5,.5,x,ground-12,x+16,ground-95*sz);
   }else rock(x,ground-10,sz*1.7);
  }
 } else {
  const pine=kind==='pine'||kind==='blight';
  for(let i=0;i<18;i++)tree((i-.5)*w/16,ground-10,.45+rnd()*.73,pine);
  if(kind==='blight')for(let i=0;i<9;i++)line(water,2,.65,rnd()*w,ground-25,rnd()*w,horizon+20);
 }
 // Ground stripe and battler shadows; do not hide lower UI behind artwork.
 g.fillStyle(dark,.89).fillRect(0,ground,w,h-ground);
 g.fillStyle(bright,.24).fillRect(0,ground,w,3);
 for(let i=0;i<30;i++){
  const x=rnd()*w,y=ground+6+rnd()*Math.max(2,h-ground-8);
  line(light,1,.15,x,y,x+5+rnd()*11,y);
 }
 return g;
}
