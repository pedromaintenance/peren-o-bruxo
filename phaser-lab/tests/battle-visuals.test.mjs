import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {REGIONS,REGION_BY_ID} from '../src/regions.js';
import {PEREN_BATTLE_ART,BATTLE_ART_FILES,casterForAction,battleAreaBounds,
 regionBattleSignature,createRegionBattleBackdrop} from '../src/battle-visuals.js';
const expected={
 'battle/runtime-v84/idle.png':'f597da9909787090ac48e1291ca692295a323dc4461638e773073dd1715543d4',
 'characters/peren/battler/casting/peren-casting.png':'4030589eb19c30b18af16657463b551ee58811d471996d1de55cd06504446538',
 'characters/peren/battler/casting/peren-casting-fire.png':'5264a9f2332341c98e4f76b7867e36e146822414ad64ca37ff559ce47f34fdc7',
 'characters/peren/battler/casting/peren-casting-ice.png':'2d39f3d6cea6d198ba3d49eec265cc7f9453c8c40132a9829e01857f428c9064'
};
test('all official battler PNGs copied pixel-perfect from canonical archive',()=>{
 assert.equal(BATTLE_ART_FILES.length,4);
 for(const a of BATTLE_ART_FILES){
  const file=new URL('../public/art/'+a.file,import.meta.url);
  assert.ok(existsSync(file),'Missing battle image '+a.file);
  const digest=createHash('sha256').update(readFileSync(file)).digest('hex');
  assert.equal(digest,expected[a.file],a.file+' altered official source bytes');
  assert.equal(a.frames,4);
 }
 assert.equal(PEREN_BATTLE_ART.idle.width,560);
 assert.equal(PEREN_BATTLE_ART.idle.height,821);
});
test('spell animations use authored caster instead of overworld 48x64 sprite',()=>{
 assert.equal(casterForAction('spell:mag-raio-de-fogo').key,PEREN_BATTLE_ART.fire.key);
 assert.equal(casterForAction('spell:mag-raio-de-gelo').key,PEREN_BATTLE_ART.ice.key);
 assert.equal(casterForAction('spell:mag-misseis-magicos').key,PEREN_BATTLE_ART.neutral.key);
 assert.equal(casterForAction('attack'),null);
 assert.equal(casterForAction('potion'),null);
});
test('all ten regions have distinct semantic and graphical battleground contracts',()=>{
 assert.equal(REGIONS.length,10);
 assert.equal(new Set(REGIONS.map(regionBattleSignature)).size,10);
 assert.ok(new Set(REGIONS.map(r=>r.kind)).size>=9);
 for(const region of REGIONS){
  assert.ok(region.name.length>3);
  assert.equal(region.colors.length,8);
  assert.equal(REGION_BY_ID[region.id],region);
 }
});
test('responsive battle slot stays between header and buttons',()=>{
 const phone=battleAreaBounds(390,844,146,500);
 assert.equal(phone.compact,true);
 assert.equal(phone.ground,489);
 const desktop=battleAreaBounds(1280,800,120,680);
 assert.equal(desktop.compact,false);
 assert.equal(desktop.ground,669);
 const fallback=battleAreaBounds(390,844,500,510);
 assert.ok(fallback.height>100);
});
test('procedural battleground Graphics uses distinct silhouettes and remains in scene',()=>{
 const log=[];
 class Graphics {
  constructor(){this.active=true;}
  setDepth(){return this;}
  fillStyle(...args){log.push(['fillStyle',...args]);return this;}
  fillRect(...args){log.push(['fillRect',...args]);return this;}
  fillCircle(...args){log.push(['fillCircle',...args]);return this;}
  lineStyle(...args){log.push(['lineStyle',...args]);return this;}
  lineBetween(...args){log.push(['lineBetween',...args]);return this;}
  fillTriangle(...args){log.push(['fillTriangle',...args]);return this;}
  fillEllipse(...args){log.push(['fillEllipse',...args]);return this;}
  strokeEllipse(...args){log.push(['strokeEllipse',...args]);return this;}
 }
 const scene={scale:{width:390,height:844},add:{graphics:()=>new Graphics()}};
 const shapes=new Set();
 for(const region of REGIONS){
  log.length=0;
  const backdrop=createRegionBattleBackdrop(scene,region,region.id+'-qa');
  assert.equal(backdrop.active,true);
  assert.ok(log.filter(x=>x[0]==='fillRect').length>=8);
  assert.ok(log.length>=45,region.id+' had no detailed scenery');
  shapes.add(log.filter(x=>x[0]!=='fillStyle').map(x=>x[0]).join(','));
 }
 assert.ok(shapes.size>=5,'Distinct geographic silhouettes were not drawn');
});
