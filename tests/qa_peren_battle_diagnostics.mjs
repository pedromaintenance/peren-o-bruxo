import test from "node:test";
import assert from "node:assert/strict";
import {CONTRACT,diagnoseBattleArt} from "../phaser-demo-m1hf/battle-art-runtime-v84.mjs";

const names=[CONTRACT.idle.file,CONTRACT.infernal.file,CONTRACT.void.file,CONTRACT.summon.file,...CONTRACT.portraits];
const valid={schema:"peren-battle-art-v84",verified:true,version:"8.4.0",files:names.map(path=>({path,sha256:"a".repeat(64)}))};
const ok=()=>({ok:true,status:200,json:async()=>valid});
test("diagnostic identifies absent manifest instead of silent old sprite",async()=>{
 const d=await diagnoseBattleArt(async()=>({ok:false,status:404}));
 assert.equal(d.ready,false);
 assert.equal(d.code,"manifest-not-found");
 assert.equal(d.status,404);
 assert.deepEqual(d.missing,names);
});
test("diagnostic distinguishes missing PNGs from healthy package",async()=>{
 const fetcher=async(uri,options)=>{
  if(!options?.method)return ok();
  return {ok:!uri.endsWith("void.png"),status:uri.endsWith("void.png")?404:200};
 };
 const d=await diagnoseBattleArt(fetcher);
 assert.equal(d.ready,false);
 assert.equal(d.code,"png-missing");
 assert.deepEqual(d.missing,["void.png"]);
 assert.equal(d.checks.length,8);
});
test("diagnostic recognizes an installed package without touching the BattleScene",async()=>{
 const d=await diagnoseBattleArt(async()=>ok());
 assert.equal(d.ready,true);
 assert.equal(d.code,"assets-present");
 assert.deepEqual(d.missing,[]);
 assert.equal(d.version,"8.4.0");
});
test("diagnostic refuses malformed manifests and reports connection errors",async()=>{
 const bad=await diagnoseBattleArt(async()=>({ok:true,json:async()=>({schema:"bogus",verified:true,files:[]})}));
 assert.equal(bad.code,"manifest-invalid-schema-or-hashes");
 const net=await diagnoseBattleArt(async()=>{throw new Error("offline")});
 assert.equal(net.code,"manifest-network-error");
 const json=await diagnoseBattleArt(async()=>({ok:true,json:async()=>{throw new SyntaxError("corrupt")}}));
 assert.equal(json.code,"manifest-invalid-json");
});
