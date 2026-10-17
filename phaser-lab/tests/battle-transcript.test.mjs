import test from 'node:test';
import assert from 'node:assert/strict';
import {createBattleTranscript} from '../src/battle-transcript.js';

test('registra eventos reais sem duplicar avisos durante animacao',()=>{
 const ledger=createBattleTranscript();
 const s={key:'murin:A',round:1,status:'active',log:['As sombras de Mürin se fecham.']};
 const original=structuredClone(s);
 ledger.observe(s);ledger.observe({...s,busy:true});
 assert.deepEqual(ledger.snapshot().entries.map(e=>e.text),s.log);
 ledger.observe({...s,round:2,log:['A criatura ataca: 3 PV.','A criatura recebe 11 de dano.',s.log[0]]});
 ledger.observe({...s,round:2,busy:true,log:['A criatura ataca: 3 PV.','A criatura recebe 11 de dano.',s.log[0]]});
 assert.deepEqual(ledger.snapshot().entries.map(e=>e.text),['A criatura ataca: 3 PV.','A criatura recebe 11 de dano.',s.log[0]]);
 assert.deepEqual(s,original);
});
test('limita, isola chaves e protege retornos contra mutacao',()=>{
 const l=createBattleTranscript(2);
 l.observe({key:'A',round:1,log:['inicio']});
 l.observe({key:'A',round:2,log:['golpe','inicio']});
 assert.deepEqual(l.snapshot().entries.map(e=>e.text),['golpe','inicio']);
 l.observe({key:'B',round:1,log:['outro']});
 const copy=l.snapshot();copy.entries[0].text='falso';
 assert.deepEqual(l.snapshot().entries.map(e=>e.text),['outro']);
 l.reset();assert.deepEqual(l.snapshot(),{key:null,entries:[]});
});
test('sem registro nao inventa acontecimentos',()=>{
 const l=createBattleTranscript();
 assert.deepEqual(l.observe({key:'A',round:1,log:[]}).entries,[]);
 assert.deepEqual(l.observe({key:'A',round:2,log:['evento']}).entries.map(e=>e.text),['evento']);
});
