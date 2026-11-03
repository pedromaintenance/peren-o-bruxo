/** Pure deterministic forest generation. No Phaser or browser API required. */
export const TILE = 32;
export const WIDTH = 48;
export const HEIGHT = 36;
export const HERBS = Object.freeze([
  {id:'ing-nirnroot',name:'Raiz Velada',sprite:'herb'},
  {id:'ing-hanging-moss',name:'Musgo Suspenso',sprite:'herb'},
  {id:'ing-imp-stool',name:'Cogumelo do Imp',sprite:'mushroom'},
  {id:'ing-glowing-mushroom',name:'Cogumelo Luminescente',sprite:'mushroom'},
  {id:'ing-emperor-parasol-moss',name:'Musgo Parassol de Eldroth',sprite:'herb'}
]);
export function hashSeed(value) {
  let h=2166136261;
  for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}
  return h>>>0 || 0x9e3779b9;
}
export function rngFor(seed){
  let n=hashSeed(seed);
  return ()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return (n>>>0)/4294967296};
}
const k=(x,y)=>`${x},${y}`;
export function neighbors(x,y){return [[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>a>=0&&a<WIDTH&&b>=0&&b<HEIGHT)}
export function reachableCells(world,from=world.entry){
  const visited=new Set([k(from.x,from.y)]),queue=[[from.x,from.y]];
  while(queue.length){const [x,y]=queue.shift();for(const [nx,ny] of neighbors(x,y)){const id=k(nx,ny);if(!visited.has(id)&&!world.blocked.has(id)){visited.add(id);queue.push([nx,ny])}}}
  return visited;
}
export function buildForest(seed='murin-001') {
  const random=rngFor(seed), rInt=(a,b)=>a+Math.floor(random()*(b-a+1));
  const pathY=Array.from({length:WIDTH},(_,x)=>Math.round(HEIGHT/2 + Math.sin(x*.24+1.2)*2.6));
  const bridgeY=pathY[24];
  const entry={x:3,y:pathY[3]},exit={x:WIDTH-4,y:pathY[WIDTH-4]};
  const ground=[],blocked=new Set(),obstacles=[],nodes=[];
  const isPath=(x,y)=>Math.abs(y-pathY[x])<=1;
  // A river cuts the forest, crossed by a deliberate, broad bridge on the trail.
  for(let y=0;y<HEIGHT;y++){const row=[];for(let x=0;x<WIDTH;x++){
    const riverX=24+Math.round(Math.sin(y*.23)*.75);
    const water=Math.abs(x-riverX)<=1 && !isPath(x,y) && !(Math.abs(y-bridgeY)<=1 && x>=22&&x<=26);
    const p=isPath(x,y),v=random();
    const tile=water?7:(p?(v<.5?5:6):v<.14?3:v<.31?2:v<.58?1:0);
    row.push(tile);if(water)blocked.add(k(x,y));
  }ground.push(row)}
  const prohibited=(x,y)=>isPath(x,y)||x<2||x>WIDTH-3||y<2||y>HEIGHT-3||Math.abs(x-entry.x)<3&&Math.abs(y-entry.y)<3||Math.abs(x-exit.x)<3&&Math.abs(y-exit.y)<3;
  for(let t=0;t<240;t++){
    const x=rInt(1,WIDTH-2),y=rInt(1,HEIGHT-2);if(prohibited(x,y)||blocked.has(k(x,y)))continue;
    const kind=random()<.82?'tree':'stone';
    obstacles.push({id:`${kind}-${x}-${y}`,x,y,kind,variant:rInt(0,2)});
    blocked.add(k(x,y));
  }
  // Remove accidental disconnected pockets from resource placement by checking BFS.
  const reachable=reachableCells({blocked,entry});
  for(let tries=0;tries<900&&nodes.length<33;tries++){
    const x=rInt(2,WIDTH-3),y=rInt(2,HEIGHT-3);
    const key=k(x,y);
    if(!reachable.has(key)||blocked.has(key)||isPath(x,y)||nodes.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<3)||Math.abs(x-entry.x)+Math.abs(y-entry.y)<4)continue;
    const ing=HERBS[rInt(0,HERBS.length-1)];
    nodes.push({id:`resource-${x}-${y}`,x,y,itemId:ing.id,name:ing.name,sprite:ing.sprite,count:rInt(1,3)});
  }
  return {seed:String(seed),ground,blocked,obstacles,nodes,entry,exit,bridge:{x:24,y:bridgeY},width:WIDTH,height:HEIGHT};
}
export function nearestResource(world,px,py,collected=new Set(),range=57){
  let best=null,min=range;
  for(const n of world.nodes){if(collected.has(n.id))continue;const dist=Math.hypot((n.x+.5)*TILE-px,(n.y+.5)*TILE-py);if(dist<min){best=n;min=dist}}
  return best;
}
export function validExit(world){return reachableCells(world).has(k(world.exit.x,world.exit.y))}