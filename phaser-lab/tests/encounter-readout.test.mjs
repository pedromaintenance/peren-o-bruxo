import test from 'node:test';
import assert from 'node:assert/strict';
import {encounterReadout} from '../src/encounter-readout.js';
import {MURIN_BEASTS} from '../src/encounters.js';

test('M1h-F.11: precombat clues derive from actual forest monster base stats',()=>{
 const forms=MURIN_BEASTS.map(m=>encounterReadout({type:m.id,behavior:m.behavior},{level:1,hp:114,mp:68,potions:3}));
 assert.match(forms[0].behavior,/Sentinela.*intermediária.*cadenciado/);
 assert.match(forms[1].behavior,/Errante de esporos.*curto alcance.*lento/);
 assert.match(forms[2].behavior,/Caçador.*longo alcance.*veloz/);
 assert.ok(forms.every(x=>x.tactic.includes('Cobertura')));
 assert.ok(forms.every(x=>!('reward' in x)&&!('odds' in x)));
});
test('M1h-F.11: actual supplies, changing severity and input immutability',()=>{
 const p={level:3,playerMaxHp:160,playerMaxMp:98,hp:42,mp:13,potions:2};
 const original=JSON.stringify(p);
 const c=encounterReadout({type:MURIN_BEASTS[2].id},p);
 assert.equal(c.vitality,'FERIDO GRAVEMENTE');assert.equal(c.state,'danger');
 assert.equal(c.supplies,'PV 42/160 · PM 13/98 · Poções 2');
 assert.equal(JSON.stringify(p),original);
 const moderate=encounterReadout({}, {...p,hp:90});
 assert.equal(moderate.vitality,'FERIDO');assert.equal(moderate.state,'warning');
 const sound=encounterReadout({}, {...p,hp:135});
 assert.equal(sound.state,'neutral');
});
test('M1h-F.11: unknown creature, missing profile, invalid supplies safely degrade',()=>{
 const u=encounterReadout({type:'unknown'},{});
 assert.match(u.behavior,/Ameaça desconhecida/);
 assert.match(u.behavior,/percepção desconhecida/);
 assert.equal(u.supplies,'PV 114/114 · PM 68/68 · Poções 0');
 const t=encounterReadout(null,{level:1,hp:-12,mp:Infinity,potions:-9});
 assert.equal(t.state,'danger');assert.match(t.supplies,/PV 0\/114/);
 assert.match(t.supplies,/Poções 0/);
});
