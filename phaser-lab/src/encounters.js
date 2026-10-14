/** M1b monster perception and movement. Pure JS: Phaser only renders snapshots. */
import {TILE, WIDTH, HEIGHT, rngFor, reachableCells} from './world.js';
export const MURIN_BEASTS=Object.freeze([
 {id:'mob-galho-infectado',name:'Galho Infectado',behavior:'sentinela',sight:5,speed:47,alertness:0.8},
 {id:'mob-fungo-violeta',name:'Fungo Violeta',behavior:'esporo',sight:4,speed:35,alertness:0.7},
 {id:'mob-ettercap',name:'Ettercap',behavior:'cacador',sight:7,speed:78,alertness:1.2}
]);
const coords=(x,y)=>`${x},${y}`;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const MURIN_BEAST_IDS=MURIN_BEASTS.map(x=>x.id);
export function environmentAt(world,x,y){
  const gx=Math.floor(x/TILE),gy=Math.floor(y/TILE);
  const tile=world.ground?.[gy]?.[gx];
  return {tile,wet:tile===7||tile===3,cover:tile===2||tile===3,
    walkable: gx>=0&&gy>=0&&gx<WIDTH&&gy<HEIGHT&&!world.blocked.has(coords(gx,gy))};
}
export function worldWeather(seed){return rngFor('weather:'+seed)()>.72?'neblina':'sereno'}
// Avoid placing enemies on resource nodes, exits, spawn, water or inaccessible pockets.
export function spawnMurinCreatures(world){
  const rand=rngFor('creatures:'+world.seed),seen=reachableCells(world),occupied=new Set();
  const beasts=[];const pool=[0,1,2,0,1,2];
  const pathY=Array.from({length:WIDTH},(_,x)=>Math.round(HEIGHT/2+Math.sin(x*.24+1.2)*2.6));
  for(let j=0;j<pool.length;j++){
    const species=MURIN_BEASTS[pool[j]];let chosen=null;
    for(let k=0;k<500;k++){
      const x=7+Math.floor(rand()*(WIDTH-14)),dy=3+Math.floor(rand()*4),y=pathY[x]+(rand()<.5?-dy:dy);
      const key=coords(x,y);
      if(y<3||y>HEIGHT-4||!seen.has(key)||occupied.has(key)||world.blocked.has(key))continue;
      if(dist({x,y},world.entry)<7||dist({x,y},world.exit)<6)continue;
      if(world.nodes.some(n=>dist({x,y},n)<2))continue;
      const tooClose=beasts.some(b=>dist({x,y},b.spawn)<5);
      if(tooClose)continue;
      chosen={x,y};break;
    }
    if(!chosen)throw Error('Mürin: falha ao localizar ponto acessível de criatura');
    occupied.add(coords(chosen.x,chosen.y));
    beasts.push({instanceId:`beast-${j}-${chosen.x}-${chosen.y}`,type:species.id,name:species.name,
      behavior:species.behavior,sight:species.sight,speed:species.speed,spawn:chosen,
      x:(chosen.x+.5)*TILE,y:(chosen.y+.5)*TILE,
      state:'patrulha',lastSeen:null,target:null,cooldown:0,patrolIndex:0});
  }
  return beasts;
}
// Bresenham-like sampling: blocked terrain obscures vision but does not constrain pixels to grid.
export function hasSight(world,a,b){
  const n=Math.ceil(dist(a,b)/10);
  if(n===0)return true;
  for(let i=1;i<n;i++){
    const t=i/n,xx=Math.floor((a.x+(b.x-a.x)*t)/TILE),yy=Math.floor((a.y+(b.y-a.y)*t)/TILE);
    if(world.blocked.has(coords(xx,yy)))return false;
  }
  return true;
}
export function canDetect(world,monster,player,{sprint=false,weather='sereno'}={}){
  const tile=environmentAt(world,player.x,player.y);
  const modifier=(sprint?1.5:0)+(weather==='neblina'?-1.5:0)+(tile.cover?-1.4:0);
  const range=(monster.sight+modifier)*TILE;
  const distance=dist(monster,player);
  if(distance>range)return false;
  return distance<TILE*1.2 || hasSight(world,monster,player);
}
const cellWalkable=(world,x,y)=>x>=1&&y>=1&&x<WIDTH-1&&y<HEIGHT-1&&!world.blocked.has(coords(x,y));
function targetNear(world,beast,step){
  const center=beast.spawn;
  const dx=[3,0,-3,0,2,-2][(step+beast.patrolIndex)%6],dy=[0,3,0,-3,2,-2][(step+beast.patrolIndex)%6];
  const x=center.x+dx,y=center.y+dy;
  return cellWalkable(world,x,y)?{x:(x+.5)*TILE,y:(y+.5)*TILE}: {x:(center.x+.5)*TILE,y:(center.y+.5)*TILE};
}
// Returns intention, never awards experience or kills. The combat transaction belongs to M1c.
export function monsterDecision(world,monster,player,dt,{sprint=false,weather='sereno',time=0}={}){
  const detected=canDetect(world,monster,player,{sprint,weather});
  const distance=dist(monster,player);
  const next={...monster,cooldown:Math.max(0,(monster.cooldown||0)-dt)};
  if(next.cooldown>0){next.state='retirada';next.target={x:(monster.spawn.x+.5)*TILE,y:(monster.spawn.y+.5)*TILE};return {next,encounter:false,detected:false};}
  if(detected){next.state='perseguicao';next.lastSeen={x:player.x,y:player.y};next.target={...next.lastSeen};}
  else if(next.state==='perseguicao' && next.lastSeen){next.state='investigacao';next.target=next.lastSeen;}
  else if(next.state==='investigacao' && next.target && dist(next,next.target)<TILE){next.state='patrulha';next.lastSeen=null;}
  if(next.state==='patrulha'){
    if(!next.target||dist(next,next.target)<TILE*.65){next.patrolIndex=(next.patrolIndex+1)%6;next.target=targetNear(world,next,Math.floor(time/6000));}
  }
  const encounter=detected&&distance<TILE*.92;
  return {next,encounter,detected};
}
export function safeRetreat(world,player,enemy,otherEnemies=[]){
  // Choose the nearest reachable dry spot that is at least five tiles away from the enemy.
  const reachable=reachableCells(world);let result=null,best=Infinity;
  for(const key of reachable){const [x,y]=key.split(',').map(Number);const pos={x:(x+.5)*TILE,y:(y+.5)*TILE};
    if([enemy,...otherEnemies].some(e=>dist(pos,e)<TILE*5))continue;
    const val=dist(pos,player)+Math.abs(x-world.entry.x)*.01;
    if(val<best){best=val;result=pos;}
  }
  return result || {x:(world.entry.x+.5)*TILE,y:(world.entry.y+.5)*TILE};
}