import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {recoverPreviewSave} from '../src/save-recovery.js';
import {buildCatalogs,createProgressBridge,validatePhaserBackup,PHASER_SCHEMA} from '../src/progress.js';
const data={};for(const key of ['itens','receitas','magias','monstros','cidades'])
 data[key]=JSON.parse(readFileSync(new URL('../data/'+key+'.json',import.meta.url)));
const catalogs=buildCatalogs(data);
const KEY='peren_phaser_save_m1hf_preview_v1';
class FakeStore{
 constructor(entries={}){this.map=new Map(Object.entries(entries));this.fail=false}
 getItem(k){return this.map.get(k)??null}
 setItem(k,value){if(this.fail)throw Error('QuotaExceededError');this.map.set(k,String(value))}
 removeItem(k){if(this.fail)throw Error('Storage blocked');this.map.delete(k)}
}
const validate=text=>validatePhaserBackup(text,catalogs);
test('rescue cannot reset or restore without both download and explicit confirmation',()=>{
 const broken='not-json!';const storage=new FakeStore({[KEY]:broken});
 const opts={storage,key:KEY,expectedRaw:broken,validate};
 for(const [downloaded,confirmed] of [[false,false],[false,true],[true,false]]){
  assert.throws(()=>recoverPreviewSave({...opts,action:'reset',downloaded,confirmed}),/Baixe|cancelada/);
  assert.equal(storage.getItem(KEY),broken);
 }
 for(const key of ['peren_carcaca_save_v1','peren_phaser_save_m1d_v1'])
  assert.throws(()=>recoverPreviewSave({...opts,key,action:'reset',downloaded:true,confirmed:true}),/Chave/);
});
test('invalid and oversized v2 backups preserve existing damaged save',()=>{
 const raw='{"schema":2,';const storage=new FakeStore({[KEY]:raw});
 for(const backupText of ['{bad','{"schema":1}','x'.repeat(2_000_005)]){
  assert.throws(()=>recoverPreviewSave({storage,key:KEY,expectedRaw:raw,action:'restore',backupText,downloaded:true,confirmed:true,validate}));
  assert.equal(storage.getItem(KEY),raw);
 }
});
test('valid backup restores exactly the preview key and increments revision',()=>{
 const source=new FakeStore(),bridge=createProgressBridge(source,catalogs);
 bridge.execute({type:'endDay'});const backupText=bridge.export();
 const raw='[broken';
 const storage=new FakeStore({[KEY]:raw,peren_carcaca_save_v1:'CLASSIC',peren_phaser_save_m1d_v1:'STABLE'});
 const result=recoverPreviewSave({storage,key:KEY,expectedRaw:raw,action:'restore',backupText,downloaded:true,confirmed:true,validate});
 const saved=JSON.parse(storage.getItem(KEY));
 assert.equal(result.action,'restore');assert.equal(saved.schema,PHASER_SCHEMA);
 assert.equal(saved.character.day,2);assert.equal(result.revision,2);
 assert.equal(storage.getItem('peren_carcaca_save_v1'),'CLASSIC');
 assert.equal(storage.getItem('peren_phaser_save_m1d_v1'),'STABLE');
});
test('changes from another tab or storage errors cannot overwrite the damaged payload',()=>{
 const raw='broken';const storage=new FakeStore({[KEY]:raw});
 storage.setItem(KEY,'NEWER');
 assert.throws(()=>recoverPreviewSave({storage,key:KEY,expectedRaw:raw,action:'reset',downloaded:true,confirmed:true,validate}),/outra aba/);
 assert.equal(storage.getItem(KEY),'NEWER');
 storage.setItem(KEY,raw);storage.fail=true;
 assert.throws(()=>recoverPreviewSave({storage,key:KEY,expectedRaw:raw,action:'reset',downloaded:true,confirmed:true,validate}),/Storage blocked/);
 assert.equal(storage.getItem(KEY),raw);
});
test('isolated reset removes only preview key after deliberate confirmation',()=>{
 const raw='BROKEN';
 const storage=new FakeStore({[KEY]:raw,peren_carcaca_save_v1:'CANARY1',peren_phaser_save_m1d_v1:'CANARY2'});
 const done=recoverPreviewSave({storage,key:KEY,expectedRaw:raw,action:'reset',downloaded:true,confirmed:true,validate});
 assert.equal(done.action,'reset');assert.equal(storage.getItem(KEY),null);
 assert.equal(storage.getItem('peren_carcaca_save_v1'),'CANARY1');
 assert.equal(storage.getItem('peren_phaser_save_m1d_v1'),'CANARY2');
});
test('recovery is opt-in and local-only, without a background network or save reset',()=>{
 const source=readFileSync(new URL('../src/save-recovery.js',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.doesNotMatch(source,/\bfetch\s*\(|sendBeacon|XMLHttpRequest/);
 assert.match(source,/if\(!confirmAction\(message\)\)/);
 assert.match(source,/button\.addEventListener\('click'/);
 assert.match(main,/if\(!M1HF_PREVIEW\)throw error/);
 assert.match(main,/showPreviewSaveRecovery/);
});
