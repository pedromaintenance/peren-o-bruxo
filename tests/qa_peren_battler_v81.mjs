import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
 CONTRACT,CINEMATIC_ACTIONS,getAnimationPlan,validateAssetMarker,
 checkInstalledAssets,playVisualSequence,installOnBattleScene,bootstrapBattleArt
} from '../phaser-demo-m1hf/battle-art-runtime-v81.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const marker={schema:'peren-battle-art-v81',verified:true,
 files:['idle.png','summon.png',...CONTRACT.portraits].map(path=>({path,sha256:'a'.repeat(64)}))};

test('v8.1 only enables restored 560px idle and approved summon',()=>{
 assert.equal(CONTRACT.idle.width,560);
 assert.equal(CONTRACT.idle.height,821);
 assert.equal(CONTRACT.idle.fps,4);
 assert.equal(CONTRACT.summon.frames,8);
 assert.equal(CONTRACT.summon.durations.reduce((a,b)=>a+b,0),2380);
 assert.deepEqual(Object.keys(CINEMATIC_ACTIONS),[]);
 assert.equal(getAnimationPlan('spell:mag-raio-de-fogo'),null);
 assert.equal(getAnimationPlan('spell:mag-misseis-magicos'),null);
 assert.equal(getAnimationPlan('spell:mag-summon-greater-demon'),null);
});
test('needs deploy of 6 verified PNGs; broken marker fails open without exceptions',async()=>{
 assert.equal(validateAssetMarker(marker),true);
 assert.equal(validateAssetMarker({...marker,files:marker.files.slice(1)}),false);
 assert.equal(validateAssetMarker({...marker,schema:'peren-battle-art-v8'}),false);
 assert.equal(validateAssetMarker({...marker,verified:false}),false);
 assert.equal(await checkInstalledAssets(async()=>({ok:false})),false);
 assert.equal(await checkInstalledAssets(async()=>({ok:true,json:async()=>marker})),true);
 const disabled=await bootstrapBattleArt({windowRef:{},doc:{},fetcher:async()=>({ok:false})});
 assert.deepEqual(disabled,{enabled:false,reason:'binary-assets-not-deployed'});
});
test('preload only allowed battlers, not pending Infernal and Void Rift',()=>{
 const loaded=[];
 const scene={preload(){return 'previous'},create(){return null},animatePlayer(){return Promise.resolve()},takeTurn(){return true},load:{spritesheet:(...args)=>loaded.push(args)}};
 assert.equal(installOnBattleScene(scene,{doc:{}}),true);
 assert.equal(scene.preload(),'previous');
 assert.deepEqual(loaded.map(x=>x[0]),['peren-v81-idle','peren-v81-summon']);
 assert.deepEqual(loaded.map(x=>x[2].endFrame),[3,7]);
 assert.equal(installOnBattleScene(scene,{doc:{}}),false);
});
test('existing battle game loads the new optional module, never replaces gameplay logic',()=>{
 const html=read('phaser-demo-m1hf/index.html');
 const sw=read('phaser-demo-m1hf/demo-sw.js');
 assert.match(html,/src="\.\/battle-art-runtime-v81\.mjs"/);
 assert.match(sw,/battle-art-runtime-v81\.mjs/);
 assert.match(sw,/battler-v81-20261022/);
 assert.doesNotMatch(read('phaser-demo-m1hf/battle-art-runtime-v81.mjs'),/localStorage|sessionStorage|\.finishBattle\(/);
});
test('one shot still restores idle after eight original summon timings',async()=>{
 const shown=[],durations=[],visible=[];
 const sprite={active:true,setOrigin(){return this},setDepth(){return this},setScale(){return this},setFrame(n){shown.push(n)},destroy(){this.active=false}};
 const hero={visible:true,active:true,setVisible(v){visible.push(v);this.visible=v}};
 const events={once(){},off(){}},queue=[];
 const scene={textures:{exists:()=>true},scale:{width:390,height:844},
 add:{sprite:()=>sprite},events,
 time:{delayedCall:(ms,fn)=>{durations.push(ms);queue.push(fn);return{remove(){}}}}};
 const task=playVisualSequence(scene,'summon',{base:{sprite:hero}});
 for(let i=0;i<8;i++)queue[i]();
 assert.deepEqual(await task,{played:true,reason:'complete'});
 assert.deepEqual(shown,[0,1,2,3,4,5,6,7]);
 assert.deepEqual(durations,CONTRACT.summon.durations);
 assert.deepEqual(visible,[false,true]);
});
