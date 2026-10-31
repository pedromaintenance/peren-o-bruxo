/**
 * M1h-F.9 — voluntary gathering feedback. Same radius and source as collect().
 * Presentation only: no save access or extra gather action.
 */
import {nearestResource} from './world.js';
export function harvestProximity(world,px,py,collected=new Set(),gathering=false){
 if(!world||!Number.isFinite(px)||!Number.isFinite(py)||gathering)return null;
 const node=nearestResource(world,px,py,collected);
 if(!node)return null;
 return {nodeId:node.id,name:String(node.name||'Ingrediente'),count:Math.max(1,Math.floor(node.count||1))};
}
