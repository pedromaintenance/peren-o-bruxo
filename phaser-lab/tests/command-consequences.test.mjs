import test from 'node:test';
import assert from 'node:assert/strict';
import {commandConsequences} from '../src/command-consequences.js';
const state=(patch={})=>({status:'active',busy:false,hp:60,maxHp:114,mp:8,maxMp:68,potions:2,...patch});
test('M1h-F.13 descriptions match defend, potion, flee and real spells',()=>{
 assert.match(commandConsequences('defend',state()).text,/4 PM.*52%/);
 assert.match(commandConsequences('potion',state()).text,/até 36 PV/);
 assert.match(commandConsequences('flee',state()).text,/imediatamente.*sem XP ou saque/);
 assert.match(commandConsequences('spell:mag-raio-de-gelo',state()).text,/3 PM.*impede a reação/);
 assert.match(commandConsequences('spell:mag-raio-de-fogo',state()).text,/queimadura.*3 PV/);
 assert.match(commandConsequences('spell:mag-misseis-magicos',state()).text,/7 PM.*sem efeito adicional/);
});
test('M1h-F.13 reports true unavailable reasons and contextual healing',()=>{
 assert.equal(commandConsequences('spell:mag-misseis-magicos',state({mp:3}),['mag-misseis-magicos']).status,'unavailable');
 assert.match(commandConsequences('spell:mag-misseis-magicos',state({mp:3}),['mag-misseis-magicos']).text,/precisa de 7 PM/);
 assert.match(commandConsequences('spell:mag-raio-de-gelo',state(),[]).text,/não aprendida/);
 assert.match(commandConsequences('potion',state({potions:0})).text,/Sem poções restantes/);
 assert.match(commandConsequences('potion',state({hp:109})).text,/até 5 PV/);
 assert.match(commandConsequences('potion',state({hp:114})).text,/até 0 PV/);
 assert.equal(commandConsequences('attack',state({busy:true})).status,'unavailable');
 assert.equal(commandConsequences('attack',state({status:'won'})).status,'unavailable');
});
test('M1h-F.13 does not modify combat state or learned repertoire',()=>{
 const s=state(),learned=['mag-raio-de-gelo'],before=JSON.stringify({s,learned});
 for(const action of ['attack','defend','potion','flee','spell:mag-raio-de-gelo','spell:mag-misseis-magicos','nonsense'])
  commandConsequences(action,s,learned);
 assert.equal(JSON.stringify({s,learned}),before);
 assert.equal(commandConsequences('nonsense',s).status,'unknown');
});
