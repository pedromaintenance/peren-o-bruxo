import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {runInNewContext} from "node:vm";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const bundle=readFileSync(resolve(root,"phaser-demo-m1hf/assets/game-B5Gp97dd.js"),"utf8");
const html=readFileSync(resolve(root,"phaser-demo-m1hf/peren-arte.html"),"utf8");
const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");

test("compiled Phaser loads injured texture and registers 4 wound walk clips",()=>{
 assert.match(bundle,/this\.load\.spritesheet\("peren-wounded",Xi\+"peren-wounded-atlas\.png"/);
 assert.match(bundle,/peren-wounded-\$\{X\}-walk/);
 assert.match(bundle,/generateFrameNumbers\("peren-wounded",\{start:Y\*32\+4,end:Y\*32\+7\}\)/);
 assert.match(bundle,/frameRate:1000\/230,repeat:-1/);
 assert.match(bundle,/frameRate:\{idle:3,walk:1000\/180,run:12/);
});
test("wound visuals depend on actual max HP, change on healing, and do not alter gameplay speeds",()=>{
 const match=bundle.match(/playState\(X\)\{const Y=this\.registry\.get\("combatProfile"\)[\s\S]*?this\.player\.anims\.play\(p,!0\)\)\}/);
 assert.ok(match,"missing wound-aware player animation");
 const script=match[0].replace(/^playState/,"function playState")+"; playState";
 const fn=runInNewContext(script,{ce:()=>({hp:114,level:1,playerMaxHp:114}),le:l=>114+(l-1)*23});
 let profile={hp:114,level:1,playerMaxHp:114};const played=[];
 const hero={direction:"down",currentAnimation:"",registry:{get:k=>k==="combatProfile"?profile:null},player:{anims:{play:(key)=>played.push(key)}}};
 fn.call(hero,"walk");
 assert.equal(played.at(-1),"peren-down-walk");
 profile={hp:57,level:1,playerMaxHp:114};
 fn.call(hero,"walk");assert.equal(played.at(-1),"peren-wounded-down-walk");
 for(const dir of ["left","right","up"]){hero.direction=dir;fn.call(hero,"walk");assert.equal(played.at(-1),"peren-wounded-"+dir+"-walk");}
 // 58 PV is strictly above the 50% threshold.
 profile={hp:58,level:1,playerMaxHp:114};fn.call(hero,"walk");
 assert.equal(played.at(-1),"peren-up-walk");
 // Critical case: equipment modifies max health beyond level formula.
 profile={hp:62,level:1,playerMaxHp:130};fn.call(hero,"walk");
 assert.equal(played.at(-1),"peren-wounded-up-walk");
 fn.call(hero,"idle");assert.equal(played.at(-1),"peren-up-idle");
 fn.call(hero,"cast");assert.equal(played.at(-1),"peren-up-cast");
 fn.call(hero,"run");assert.equal(played.at(-1),"peren-wounded-up-walk");
 profile={hp:100,level:1,playerMaxHp:130};fn.call(hero,"run");
 assert.equal(played.at(-1),"peren-up-run");
 assert.doesNotMatch(match[0],/setVelocity|setMaxVelocity|setDrag|damage|gold/);
});
test("gallery compares normal and wounded; offline precache includes both all art variants",()=>{
 assert.match(html,/id="condition"/);
 assert.match(html,/value="wounded"/);
 assert.match(html,/official-v4\/peren-wounded-atlas\.png/);
 assert.match(html,/condition\.value==="wounded"\?230:180/);
 const arr=JSON.parse(sw.match(/const FILES=(\[[^\n]+\]);/)[1]);
 for(const p of [
 "./art/characters/peren/peren-atlas.png",
 "./art/characters/peren/peren-wounded-atlas.png",
 "./art/characters/peren/official-v4/peren-wounded-atlas.png",
 "./art/characters/peren/official-v4/peren-ferido-3x4-original-160x190.png",
 "./art/characters/peren/official-v4/runtime-provenance.json",
 ...["art-m1h","art-m1hb","art-m1hc","art-m1hd"].map(x=>`./${x}/characters/peren/peren-wounded-atlas.png`)
 ])assert.ok(arr.includes(p),"missing from PWA "+p);
 assert.match(sw,/preview-herb-v5-20261021/);
});
