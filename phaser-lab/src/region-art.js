/**
 * Texturas temporárias procedurais: piso e silhuetas 100% gerados no Phaser.
 * Nenhum sprite oficial é alterado. As regiões têm materiais e silhuetas próprios
 * até a aprovação dos futuros pacotes autorais de pixel art.
 */
import {rngFor} from './world.js';
const n=hex=>Number.parseInt(hex.slice(1),16);
const GROUND_W=32;
export const regionGroundKey=(region,tile)=>'region-ground-'+region.id+'-'+tile;
export const regionObstacleKey=(region,kind)=>'region-obstacle-'+region.id+'-'+kind;
function strokes(graph,seed,region,tile){
 const rnd=rngFor(seed),ink=n(region.colors[tile===7?5:1]);
 for(let i=0;i<7;i++){
  const x=Math.floor(rnd()*29),y=Math.floor(rnd()*29);
  graph.fillStyle(ink,.11+rnd()*.18).fillRect(x,y,1+Math.floor(rnd()*3),1+Math.floor(rnd()*2));
 }
 if(tile===7){
  const highlight=n(region.colors[5]);
  graph.lineStyle(1,highlight,.3);
  for(let j=0;j<3;j++)graph.lineBetween(2+j*9,6+j*8,9+j*9,6+j*8);
 } else if(tile===5||tile===6){
  graph.lineStyle(1,n(region.colors[4]),.28);
  graph.lineBetween(2,9,12,10);graph.lineBetween(18,23,28,22);
 } else if(tile===3||tile===2){
  graph.lineStyle(1,ink,.28);
  graph.lineBetween(5,25,8,20);graph.lineBetween(21,9,24,5);
 }
 if(region.kind==='ruins'||region.kind==='bone'){
  graph.lineStyle(1,n(region.colors[6]),.23);
  graph.lineBetween(2,1,9,7);graph.lineBetween(9,7,6,14);
 }
 if(region.kind==='mountain'){
  graph.fillStyle(0xf4f7f7,.22).fillRect(20,5,7,2).fillRect(12,25,4,1);
 }
 if(region.kind==='dry'){
  graph.lineStyle(1,0x503b25,.23);graph.lineBetween(8,16,12,18);graph.lineBetween(12,18,14,15);
 }
}
function monument(g,kind,region){
 const dark=n(region.colors[0]),shade=n(region.colors[3]),bright=n(region.colors[6]),accent=n(region.colors[5]);
 g.fillStyle(0x080c11,.25).fillEllipse(24,53,34,10);
 if(kind==='tree'){
  g.fillStyle(dark,1).fillRect(21,30,7,24);
  g.fillStyle(shade,1).fillTriangle(24,1,6,39,42,39);
  g.fillStyle(dark,1).fillTriangle(24,9,7,45,41,45);
  g.fillStyle(accent,.32).fillTriangle(21,9,13,29,20,24);
 } else if(kind==='cactus'){
  g.fillStyle(0x274c38,1).fillRoundedRect(20,12,9,42,4);
  g.fillRect(9,27,14,8).fillRect(9,22,6,9);
  g.fillRect(26,36,12,8).fillRect(33,25,5,17);
  g.fillStyle(0x72a171,.65).fillRect(22,16,2,32);
 } else if(kind==='bone'){
  g.lineStyle(7,bright,.96).lineBetween(12,48,32,10);
  g.lineStyle(3,shade,.86).lineBetween(12,47,33,11);
  g.fillStyle(bright,1).fillCircle(9,48,6).fillCircle(15,49,5).fillCircle(30,10,6).fillCircle(36,12,5);
 } else if(kind==='ruin'){
  g.fillStyle(dark,1).fillRect(8,42,33,10);
  g.fillStyle(shade,1).fillRect(12,16,8,30).fillRect(29,22,8,24);
  g.fillStyle(bright,.78).fillRect(10,13,12,6).fillRect(27,19,12,6);
  g.lineStyle(1,dark,.9).lineBetween(17,15,16,31);
 } else if(kind==='spire'){
  g.fillStyle(dark,1).fillTriangle(23,4,4,52,44,52);
  g.fillStyle(shade,1).fillTriangle(23,7,23,50,40,50);
  g.lineStyle(2,bright,.42).lineBetween(22,9,17,45);
 } else if(kind==='crystal'){
  g.fillStyle(shade,1).fillTriangle(22,2,7,46,37,46);
  g.fillStyle(bright,.72).fillTriangle(22,4,22,47,36,45);
  g.fillStyle(accent,.82).fillTriangle(10,28,3,50,20,49);
  g.lineStyle(1,0xf5e7d9,.68).lineBetween(22,5,22,46);
 } else if(kind==='coral'){
  g.lineStyle(7,0xa44d5c,1).lineBetween(23,53,22,14);
  g.lineStyle(5,0xe6a383,1).lineBetween(22,35,9,24);
  g.lineStyle(5,0xcf7280,1).lineBetween(23,29,37,13);
  g.fillStyle(0xeab4a1,1).fillCircle(9,23,4).fillCircle(37,13,4).fillCircle(22,13,4);
 } else if(kind==='driftwood'){
  g.lineStyle(9,0x746149,1).lineBetween(6,49,41,33);
  g.lineStyle(4,0xbba080,1).lineBetween(9,45,37,32);
  g.lineStyle(4,0x746149,1).lineBetween(23,39,20,23);
 } else {
  g.fillStyle(dark,1).fillPoints([{x:4,y:48},{x:11,y:26},{x:28,y:18},{x:42,y:39},{x:37,y:51}],true);
  g.fillStyle(shade,1).fillTriangle(15,28,26,18,34,39);
  g.lineStyle(2,bright,.45).lineBetween(9,46,16,30);
 }
}
export function installRegionTextures(scene,region){
 if(region.id==='murin')return;
 for(let tile=0;tile<8;tile++){
  const id=regionGroundKey(region,tile);
  if(scene.textures.exists(id))continue;
  const g=scene.make.graphics({x:0,y:0},false);
  g.fillStyle(n(region.colors[tile]),1).fillRect(0,0,GROUND_W,GROUND_W);
  strokes(g,region.id+'-'+tile,region,tile);
  g.generateTexture(id,GROUND_W,GROUND_W);
  g.destroy();
 }
 for(const kind of new Set([...region.obstacles,'stone'])){
  const id=regionObstacleKey(region,kind);
  if(scene.textures.exists(id))continue;
  const g=scene.make.graphics({x:0,y:0},false);
  monument(g,kind,region);
  g.generateTexture(id,48,64);
  g.destroy();
 }
}
