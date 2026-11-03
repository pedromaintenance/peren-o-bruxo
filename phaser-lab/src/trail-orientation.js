/**
 * M1h-F.10 — Non-mechanical trail signs. Uses only the deterministic
 * walkable road tiles (5/6) already created by buildForest().
 * Not a pathfinder: the suggested bearing is qualitative; obstacles and
 * creature threats still require exploration.
 */
import {TILE} from './world.js';
const mid=tile=>(tile+.5)*TILE;
export function trailOrientation(world,px,py){
 if(!world?.ground||!world?.exit||!world?.bridge||
    !Number.isFinite(px)||!Number.isFinite(py))return null;
 const exit={x:mid(world.exit.x),y:mid(world.exit.y)};
 if(Math.hypot(exit.x-px,exit.y-py)<40){
  return {phase:'exit',label:'RETORNO À VISTA',hint:'Marco de Portomonte alcançado · use o botão PORTOMONTE'};
 }
 let closest=null,smallest=Infinity;
 for(let y=0;y<world.ground.length;y++){
  for(let x=0;x<world.ground[y].length;x++){
   const tile=world.ground[y][x];
   if((tile!==5&&tile!==6)||world.blocked?.has(`${x},${y}`))continue;
   const dx=mid(x)-px,dy=mid(y)-py,dist=dx*dx+dy*dy;
   if(dist<smallest){smallest=dist;closest={x,y,dx,dy};}
  }
 }
 if(!closest)return null;
 // Distance to the nearest actual walkable trail cell; no invisible radar.
 if(smallest>(TILE*1.55)**2){
  const north=Math.abs(closest.dy)>=Math.abs(closest.dx)*.65;
  const dir=north?(closest.dy<0?'ao norte':'ao sul'):(closest.dx<0?'a oeste':'a leste');
  return {phase:'lost',label:'FORA DA TRILHA',
   hint:`Vestígios do caminho ${dir} · orientação aproximada`};
 }
 const bridge=world.bridge.x;
 if(Math.abs(px-mid(bridge))<=TILE*3.5){
  return {phase:'bridge',label:'PONTE DE MÜRIN',
   hint:'A trilha cruza o rio por esta passagem'};
 }
 if(px<mid(bridge)){
  return {phase:'west',label:'TRILHA DE MÜRIN',
   hint:'A ponte fica adiante, seguindo a estrada a leste'};
 }
 return {phase:'east',label:'RETORNO A PORTOMONTE',
  hint:'A saída fica mais a leste, seguindo a trilha'};
}
