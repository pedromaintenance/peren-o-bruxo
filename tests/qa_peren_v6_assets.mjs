import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {
 PEREN_SCENE_PORTRAITS, scenePortrait, scenePortraitSrc,
 queuePerenScenePortraits, fitScenePortrait
} from '../phaser-demo-m1hf/scene-portraits.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const get=p=>JSON.parse(readFileSync(resolve(root,p),'utf8'));
const base='phaser-demo-m1hf/';
const idle=get(base+'art/characters/peren/battler/v6/manifest.json');
const portraits=get(base+'art/characters/peren/scenes/portraits/manifest.json');
const vfx=get(base+'art/battle/peren-void-rift/manifest.json');
const isPng=b=>b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
const checkIfInstalled=(relative,w,h)=>{
 const abs=resolve(root,base+relative);
 if(!existsSync(abs))return false;
 const data=readFileSync(abs);
 assert.ok(isPng(data),relative+' is not PNG');
 assert.equal(data.readUInt32BE(16),w,relative+' width');
 assert.equal(data.readUInt32BE(20),h,relative+' height');
 return true;
};
test('v6 idle maps exact four-frame 1916×821 source and does not replace exploration',()=>{
 assert.deepEqual(idle.originalSize,[1916,821]);
 assert.deepEqual(idle.frameSize,[479,821]);
 assert.equal(idle.frames.length,4);
 assert.equal(idle.fps,4);
 assert.equal(idle.repeat,true);
 assert.ok(['binary-pending','complete'].includes(idle.importStatus));
 const master='art/characters/peren/battler/v6/'+idle.master;
 if(checkIfInstalled(master,1916,821)){
  assert.equal(createHash('sha256').update(readFileSync(resolve(root,base+master))).digest('hex'),idle.sourceSha256);
 }
 for(const name of idle.frames)checkIfInstalled('art/characters/peren/battler/v6/'+name,479,821);
});
test('scene portraits provide four unique stable entries and opt-in loading',()=>{
 assert.deepEqual(portraits.frameSize,[362,1086]);
 assert.equal(portraits.portraits.length,4);
 assert.equal(PEREN_SCENE_PORTRAITS.length,4);
 assert.equal(new Set(portraits.portraits.map(x=>x.id)).size,4);
 assert.equal(queuePerenScenePortraits(null),0);
 assert.equal(scenePortrait('bogus'),null);
 assert.equal(scenePortraitSrc('bogus'),null);
 assert.equal(scenePortraitSrc('peren.scene.orbe'),'./art/characters/peren/scenes/portraits/portrait_03.png');
 const loaded=[];
 assert.equal(queuePerenScenePortraits({load:{image:(...args)=>loaded.push(args)}},{assetsInstalled:true}),4);
 assert.deepEqual(loaded.map(x=>x[0]),portraits.portraits.map(x=>x.id));
 assert.ok(fitScenePortrait(320,700,10).width<=300);
 assert.ok(fitScenePortrait(320,700,10).height<=680);
 for(const p of portraits.portraits)checkIfInstalled('art/characters/peren/scenes/portraits/'+p.file,362,1086);
});
test('Void Rift storyboard is registered, but not published as a transparent effect',()=>{
 assert.equal(vfx.frames.length,8);
 assert.deepEqual(vfx.spriteSize,[543,362]);
 assert.equal(vfx.publicRuntimeEnabled,false);
 assert.equal(vfx.compositingStatus,'requires-art-cleanup');
 assert.ok(vfx.blockingIssues.some(s=>s.includes('green')));
 for(const p of vfx.frames)checkIfInstalled('art/battle/peren-void-rift/'+p.file,543,362);
});
