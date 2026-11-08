/**
 * Pré-alfa: atlas de regiões da Carcaça e expedições procedurais.
 * Determinismo por seed; sem Phaser, DOM, storage ou consulta externa.
 * A floresta original permanece a implementação canônica de Mürin.
 */
import {buildForest,rngFor,reachableCells,validExit,WIDTH,HEIGHT,TILE} from './world.js';
import {MURIN_BEASTS,spawnMurinCreatures} from './encounters.js';

const herb=(id,name,sprite='herb')=>Object.freeze({id,name,sprite});
export const REGIONS=Object.freeze([
 {id:'murin',name:'Floresta de Mürin',city:'portomonte',subtitle:'Mata úmida · primeiras incursões',kind:'forest',danger:1,obstacles:['tree','stone'],density:240,
  colors:['#234633','#2f583a','#325b4b','#2b5149','#3c5d39','#695b3e','#716443','#23516a'],resources:[
   herb('ing-nirnroot','Raiz Velada'),herb('ing-hanging-moss','Musgo Pendente'),
   herb('ing-imp-stool','Fungo de Diabrete','mushroom'),herb('ing-glowing-mushroom','Cogumelo Luminescente','mushroom'),
   herb('ing-emperor-parasol-moss','Musgo Parassol')]},
 {id:'costa-sul',name:'Costa Sul',city:'portomonte',subtitle:'Praias, recifes e o Mar de Sangue',kind:'coast',danger:1,obstacles:['coral','stone','driftwood'],density:135,water:'river',
  colors:['#bda876','#d2bd86','#9eab89','#829b9b','#cab783','#d5c18c','#dbc88f','#71303d'],resources:[
   herb('ing-felsaad-tern-feathers','Pena de Gaivota'),herb('ing-mudcrab-chitin','Carapaça de Caranguejo'),
   herb('ing-salt-pile','Sal do Sangue'),herb('ing-river-betty','Betta do Rio')]},
 {id:'caatinga',name:'Caatinga do Além Sul',city:'alem-sul',subtitle:'Sertão espinhoso e estradas de saqueadores',kind:'dry',danger:2,obstacles:['cactus','stone','bone'],density:155,
  colors:['#a27a49','#b68e54','#80764d','#736d53','#94744d','#c5a36e','#d1aa6b','#704c31'],resources:[
   herb('ing-red-mountain-flower','Flor Vermelha'),herb('ing-nightshade','Beladona'),
   herb('ing-deathbell','Sino da Morte'),herb('ing-charred-skeever-hide','Couro de Rato')]},
 {id:'thargrid',name:'Montanhas de Thargrid',city:'thargrid',subtitle:'Escarpas frias e minas dos clãs livres',kind:'mountain',danger:2,obstacles:['spire','crystal','stone'],density:200,
  colors:['#66717a','#78848a','#586c72','#53636e','#73818a','#9b9b92','#adb0ab','#2b5468'],resources:[
   herb('ing-hawk-feathers','Penas de Falcão'),herb('ing-snowberries','Bagas da Neve'),
   herb('ing-ice-wraith-teeth','Dentes de Espectro Gelado'),herb('ing-frost-mirriam','Mirra da Geada')]},
 {id:'ironwood',name:'Bosques de Ironwood',city:'ironwood',subtitle:'Refúgio clandestino de druidas e patrulheiros',kind:'pine',danger:2,obstacles:['tree','tree','stone'],density:275,
  colors:['#1c4034','#244e3a','#245449','#304d42','#346044','#665b44','#776348','#244f5a'],resources:[
   herb('ing-blue-mountain-flower','Flor Azul da Montanha'),herb('ing-butterfly-wing','Asa de Borboleta'),
   herb('ing-hanging-moss','Musgo Pendente'),herb('ing-white-cap','Chapéu Branco','mushroom')]},
 {id:'garganta',name:'Garganta de Golzdov',city:'garganta',subtitle:'Crânio fóssil, escavações e ruínas yokai',kind:'bone',danger:3,obstacles:['bone','ruin','spire'],density:205,
  colors:['#827f71','#989385','#77786d','#6b766d','#9b9282','#bbb19a','#c7b9a4','#3c5c67'],resources:[
   herb('ing-charred-skeever-hide','Couro de Rato'),herb('ing-dwarven-oil','Óleo de Autômato'),
   herb('ing-spider-egg','Ovo de Aranha'),herb('ing-glowing-mushroom','Cogumelo Luminescente','mushroom')]},
 {id:'drakport',name:'Margens de Drakport',city:'drakport',subtitle:'Rio Ancestral, portos tributados e ocupação',kind:'river',danger:3,obstacles:['ruin','stone','driftwood'],density:170,water:'river',
  colors:['#4b554b','#60634c','#4a685b','#3e5f5f','#6b6a52','#89785d','#928063','#3a586d'],resources:[
   herb('ing-river-betty','Betta do Rio'),herb('ing-hanging-moss','Musgo Pendente'),
   herb('ing-mudcrab-chitin','Carapaça de Caranguejo'),herb('ing-nightshade','Beladona')]},
 {id:'eldroth',name:'Floresta de Eldroth',city:'eldroth',subtitle:'Escuridão viva sob a Rainha da Noite',kind:'blight',danger:4,obstacles:['tree','bone','crystal'],density:270,
  colors:['#242c39','#303449','#3a3a52','#343549','#414057','#645263','#725c6a','#492b50'],resources:[
   herb('ing-nightshade','Beladona'),herb('ing-deathbell','Sino da Morte'),
   herb('ing-emperor-parasol-moss','Musgo Parassol'),herb('ing-glowing-mushroom','Cogumelo Luminescente','mushroom')]},
 {id:'vandar',name:'Ruínas de Vandar',city:'eldroth',subtitle:'Alvenaria morta e o domínio de Blackthorn',kind:'ruins',danger:4,obstacles:['ruin','bone','stone'],density:220,
  colors:['#4f5261','#626271','#515466','#454b5c','#646479','#85827d','#949080','#36435c'],resources:[
   herb('ing-vampire-dust','Pó de Vampiro'),herb('ing-deathbell','Sino da Morte'),
   herb('ing-spider-egg','Ovo de Aranha'),herb('ing-nightshade','Beladona')]},
 {id:'boca-abismo',name:'Boca do Abismo',city:'boca-abismo',subtitle:'Rocha negra, foz ancestral e guerra demoníaca',kind:'abyss',danger:5,obstacles:['spire','crystal','bone'],density:180,water:'river',
  colors:['#383842','#48424a','#463b50','#42374b','#4a4655','#776671','#827078','#6f263b'],resources:[
   herb('ing-vampire-dust','Pó de Vampiro'),herb('ing-jarrin-root','Raiz Botulínica'),
   herb('ing-glowing-mushroom','Cogumelo Luminescente','mushroom'),herb('ing-river-betty','Betta do Rio')]}
].map(region=>Object.freeze({...region,resources:Object.freeze(region.resources)})));
export const REGION_BY_ID=Object.freeze(Object.fromEntries(REGIONS.map(region=>[region.id,region])));
export function regionFromSeed(seed){
 const value=String(seed||'');
 return REGIONS.find(r=>value===r.id||value.startsWith(r.id+'-'))||REGION_BY_ID.murin;
}
const key=(x,y)=>x+','+y;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const randint=(rand,a,b)=>a+Math.floor(rand()*(b-a+1));
const protectedPoint=(x,y,p)=>Math.abs(x-p.x)<=3&&Math.abs(y-p.y)<=3;
export function expeditionSeed(regionId,nonce){
 if(!REGION_BY_ID[regionId])throw Error('Região não cadastrada');
 const suffix=String(nonce).replace(/[^a-zA-Z0-9_-]/g,'').slice(-38)||'001';
 return regionId+'-'+suffix;
}
/** Para a floresta antiga, mantém as coordenadas e os IDs dos recursos. */
export function buildExpedition(seed='murin-001'){
 const region=regionFromSeed(seed);
 if(region.id==='murin')return {...buildForest(seed),regionId:region.id,region};
 const rand=rngFor('world:'+seed),path=[],ground=[],blocked=new Set(),obstacles=[],nodes=[];
 let y=randint(rand,14,21);
 for(let x=0;x<WIDTH;x++){
  if(x>0)y=Math.max(7,Math.min(HEIGHT-8,y+(rand()<.24?-1:rand()<.55?1:0)));
  path.push(y);
 }
 const entry={x:3,y:path[3]},exit={x:WIDTH-4,y:path[WIDTH-4]},bridge={x:24,y:path[24]};
 const isPath=(x,z)=>Math.abs(z-path[x])<=1;
 const riverPhase=rand()*Math.PI*2;
 for(let z=0;z<HEIGHT;z++){
  const row=[];
  for(let x=0;x<WIDTH;x++){
   const bend=24+Math.round(Math.sin(z*.20+riverPhase)*1.25);
   const flow=region.water==='river'&&Math.abs(x-bend)<=2&&!isPath(x,z);
   const wet=region.water!=='river'&&region.kind!=='dry'&&rand()<.018&&!isPath(x,z);
   const p=isPath(x,z),r=rand();
   const tile=flow||wet?7:p?(r<.48?5:6):r<.08?4:r<.23?3:r<.43?2:r<.65?1:0;
   row.push(tile);
   if(flow||wet)blocked.add(key(x,z));
  }
  ground.push(row);
 }
 function allowed(x,z){return x>1&&x<WIDTH-2&&z>1&&z<HEIGHT-2&&!isPath(x,z)&&!blocked.has(key(x,z))&&!protectedPoint(x,z,entry)&&!protectedPoint(x,z,exit);}
 const occupied=new Set();
 for(let n=0;n<region.density;n++){
  const x=randint(rand,2,WIDTH-3),z=randint(rand,2,HEIGHT-3),id=key(x,z);
  if(!allowed(x,z)||occupied.has(id))continue;
  const kind=region.obstacles[randint(rand,0,region.obstacles.length-1)];
  obstacles.push({id:kind+'-'+x+'-'+z,x,y:z,kind,variant:randint(rand,0,2)});
  blocked.add(id);occupied.add(id);
 }
 const reachable=reachableCells({blocked,entry});
 const desired=region.danger<=2?34:region.danger<=4?30:27;
 for(let tries=0;tries<1600&&nodes.length<desired;tries++){
  const x=randint(rand,2,WIDTH-3),z=randint(rand,2,HEIGHT-3),id=key(x,z);
  if(!reachable.has(id)||blocked.has(id)||isPath(x,z)||protectedPoint(x,z,entry)||
    nodes.some(n=>Math.abs(n.x-x)+Math.abs(n.y-z)<3))continue;
  const ingredient=region.resources[randint(rand,0,region.resources.length-1)];
  nodes.push({id:'resource-'+x+'-'+z,x,y:z,itemId:ingredient.id,name:ingredient.name,sprite:ingredient.sprite,count:randint(rand,1,region.danger>3?2:3)});
 }
 return {seed:String(seed),regionId:region.id,region,pathY:path,ground,blocked,obstacles,nodes,entry,exit,bridge,width:WIDTH,height:HEIGHT};
}

/** Encounter identity and positions are deterministic; original sprites are temporary regional fauna. */
export function spawnRegionalCreatures(world){
 if(world.regionId==='murin')return spawnMurinCreatures(world);
 const r=rngFor('beasts:'+world.seed),reachable=reachableCells(world),beasts=[];
 const count=Math.min(8,3+world.region.danger);
 const speciesIndex=world.region.kind==='dry'?[0,0,2,1,0,2,1,0]:
   world.region.kind==='mountain'?[2,1,2,0,1,2,0,2]:
   world.region.kind==='coast'?[1,2,0,1,2,0,1,2]:[0,1,2,0,2,1,0,2];
 for(let i=0;i<count;i++){
  const template=MURIN_BEASTS[speciesIndex[i]];
  for(let tries=0;tries<750;tries++){
   const x=randint(r,7,WIDTH-8),y=randint(r,3,HEIGHT-4),pos={x,y},id=key(x,y);
   if(!reachable.has(id)||world.blocked.has(id)||distance(pos,world.entry)<7||distance(pos,world.exit)<6||
      world.nodes.some(n=>distance(pos,n)<2)||beasts.some(b=>distance(pos,b.spawn)<5))continue;
   beasts.push({instanceId:'beast-'+i+'-'+x+'-'+y,type:template.id,name:template.name,
    behavior:template.behavior,sight:template.sight,speed:template.speed,spawn:pos,
    x:(x+.5)*TILE,y:(y+.5)*TILE,state:'patrulha',lastSeen:null,target:null,cooldown:0,patrolIndex:0});
   break;
  }
 }
 return beasts;
}
export function verifyExpedition(world){
 return validExit(world)&&world.nodes.every(n=>reachableCells(world).has(key(n.x,n.y)));
}
