import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createDiagnosticLog,buildDiagnosticReport} from '../src/diagnostics.js';
test('M1h-F diagnostic log is bounded and does not leak live array mutations',()=>{
 const log=createDiagnosticLog({limit:3,clock:()=> '2026-10-15T22:00:00-03:00'});
 for(let i=0;i<6;i++)log.record('battle',String(i));
 const snapshot=log.snapshot();
 assert.equal(snapshot.length,3);
 assert.deepEqual(snapshot.map(v=>v.message),['3','4','5']);
 snapshot[0].message='tampered';
 assert.equal(log.snapshot()[0].message,'3');
});
test('M1h-F voluntary report whitelists metadata and never exports user save or URL query',()=>{
 const canary='SECRET_CANARY_DO_NOT_EXPORT';
 const save={schema:2,revision:12,origin:'m1hf-preview',
  character:{version:1,day:6,level:4,kills:2,bag:{secret:canary},learned:[canary],journal:[canary]},
  ledger:{[canary]:{secret:canary}},worlds:{activeSeed:canary}};
 const report=buildDiagnosticReport({
  version:'abc123',generatedAt:'2026-10-15T22:00:00-03:00',pathname:'/peren-o-bruxo/phaser-demo-m1hf/',
  viewport:{width:390,height:844},online:false,save,
  scene:{explorationActive:true,battleActive:false},battle:{status:'won',round:3,monster:'Ettercap',busy:false},
  events:[{at:'t0',type:'combat',message:'ending'}],search:'?seed='+canary
 });
 assert.equal(report.format,'peren-m1hf-diagnostic-v1');
 assert.equal(report.progress.revision,12);
 assert.equal(report.progress.day,6);
 assert.equal(report.battle.status,'won');
 assert.equal(report.lastEvents.length,1);
 const str=JSON.stringify(report);
 for(const secret of [canary,'ledger','journal','learned','"bag"','activeSeed','search','localStorage'])
  assert.ok(!str.includes(secret),'Sensitive or unintended field: '+secret);
});
test('M1h-F diagnostic UI is preview-only and does not send data over network',()=>{
 const preparer=readFileSync(new URL('../scripts/prepare-demo.mjs',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(preparer,/if\\(isolated\\)/);
 assert.match(preparer,/m1hfDiagCopy/);
 assert.match(preparer,/m1hfDiagSave/);
 assert.match(main,/if\\(M1HF_PREVIEW\\)/);
 assert.match(main,/buildDiagnosticReport\\(/);
 assert.doesNotMatch(main,/sendBeacon\\(|fetch\\(.*diagnos|XMLHttpRequest.*diagnos/);
});
