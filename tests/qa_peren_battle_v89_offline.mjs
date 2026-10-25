import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {CONTRACT,assetAvailability,checkInstalledAssets,diagnoseBattleArt} from "../phaser-demo-m1hf/battle-art-runtime-v90.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const sw=readFileSync(resolve(root,"phaser-demo-m1hf/demo-sw.js"),"utf8");
const list=JSON.parse(sw.match(/const FILES=(\[[^\n]+\]);/)[1]);
const names=[CONTRACT.idle.file,CONTRACT.infernal.file,CONTRACT.void.file,CONTRACT.summon.file,...CONTRACT.portraits];
const manifest={schema:"peren-battle-art-v90",verified:true,version:"8.4.0",files:names.map(path=>({path,sha256:"a".repeat(64)}))};
const manifestOnly=async(url,{method}={})=>{
 if(method==="HEAD")throw new Error("airplane mode");
 return {ok:true,json:async()=>manifest};
};
test("v8.9 precache contains manifest and ALL 8 real PNG paths",()=>{
 assert.match(sw,/fire-burst-v13-20261025/);
 for(const file of ["battle-asset-pack-v90.json",...names]){
  assert.ok(list.includes("./art/battle/runtime-v84/"+file),"missing offline art "+file);
 }
 assert.equal(new Set(list).size,list.length);
});
test("offline CacheStorage fallback boots battler when network HEAD is unavailable",async()=>{
 const cached={match:async(url)=>({ok:url!=="./art/battle/runtime-v84/missing.png",status:200})};
 assert.deepEqual(await assetAvailability("idle.png",manifestOnly,cached),{ok:true,source:"cache",status:200});
 assert.equal(await checkInstalledAssets(manifestOnly,cached),true);
 const report=await diagnoseBattleArt(manifestOnly,cached);
 assert.equal(report.code,"cached-assets-present");
 assert.equal(report.ready,true);
 assert.deepEqual(report.missing,[]);
 assert.equal(report.checks.length,8);
});
test("offline fails closed without one required cached PNG",async()=>{
 const absent={match:async(url)=>url.endsWith("void.png")?null:{ok:true,status:200}};
 assert.equal(await checkInstalledAssets(manifestOnly,absent),false);
 const report=await diagnoseBattleArt(manifestOnly,absent);
 assert.equal(report.code,"png-missing");
 assert.deepEqual(report.missing,["void.png"]);
});
test("online HEAD works without cached assets; CacheStorage exceptions do not crash gameplay",async()=>{
 const online=async(url,{method}={})=>method==="HEAD"?{ok:true,status:200}:{ok:true,json:async()=>manifest};
 assert.equal(await checkInstalledAssets(online,null),true);
 const broken={match:async()=>{throw Error("CacheStorage unavailable")}};
 assert.equal(await checkInstalledAssets(manifestOnly,broken),false);
});
