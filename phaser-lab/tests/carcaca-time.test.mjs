import test from 'node:test';
import assert from 'node:assert/strict';
import {EPOCH_EC,SEASONS,WEEKDAYS,WORLD_HISTORY,INITIAL_HISTORY,newWorldClock,
 isLeapEC,daysInEC,erisianDate,advanceWorldClock,clockPosition} from '../src/carcaca-time.js';
test('calendário Carcaça 922 EC: cinco estações e cinco dias, sem conversão gregoriana implícita',()=>{
 assert.equal(EPOCH_EC,922);assert.equal(SEASONS.length,5);assert.equal(WEEKDAYS.length,5);
 assert.deepEqual(WEEKDAYS,['Sweet','Boom','Pungent','Prickle','Setting Orange']);
 const first=erisianDate(newWorldClock());
 assert.equal(first.season.name,'Caos');assert.equal(first.seasonDay,1);
 assert.equal(first.weekday,'Sweet');assert.equal(first.year,922);assert.equal(first.time,'08:00');
 assert.equal(daysInEC(922),365);
 for(let i=0;i<5;i++){
  const t=advanceWorldClock(newWorldClock(),i*73*1440);
  assert.equal(erisianDate(t.clock).season.id,SEASONS[i].id);
  assert.equal(erisianDate(t.clock).seasonDay,1);
 }
});
test('semana e estações são 365 dias; São Tib é extratemporal à semana',()=>{
 const feb28={year:924,day:59,minute:690,dimension:'carcaca'};
 assert.equal(isLeapEC(924),true);
 const tib=advanceWorldClock(feb28,1440).clock,next=advanceWorldClock(tib,1440).clock;
 assert.equal(tib.day,60);assert.equal(erisianDate(tib).saintTib,true);
 assert.equal(erisianDate(tib).weekday,null);
 assert.equal(erisianDate(next).seasonDay,60);
 assert.equal(erisianDate(next).weekday,WEEKDAYS[4]);
 assert.equal(isLeapEC(1000),false);assert.equal(isLeapEC(1200),true);
 const end=advanceWorldClock({year:924,day:366,minute:1439,dimension:'carcaca'},1).clock;
 assert.deepEqual(end,{year:925,day:1,minute:0,dimension:'carcaca'});
});
test('eventos de 983, 984 e 999 EC atravessam saltos, exatamente uma vez',()=>{
 const start=newWorldClock();
 const huge=advanceWorldClock(start,80*366*1440);
 assert.deepEqual(huge.events.map(e=>e.year),[983,984,999]);
 assert.equal(WORLD_HISTORY[0].flags.includes('templo_das_sombras_destruido'),true);
 assert.ok(INITIAL_HISTORY.some(x=>x.description.includes('Rayquaza')));
 assert.equal(advanceWorldClock(huge.clock,60).events.length,0);
 assert.equal(start.year,922,'pure clock must not mutate input');
 assert.ok(clockPosition(huge.clock)>clockPosition(start));
});
test('Shadowfell e outras dimensões não avançam relógio nem geram eventos',()=>{
 const frozen={...newWorldClock(),dimension:'shadowfell'};
 const tx=advanceWorldClock(frozen,80*366*1440);
 assert.deepEqual(tx.clock,frozen);assert.equal(tx.elapsed,0);assert.deepEqual(tx.events,[]);
 assert.deepEqual(advanceWorldClock({...frozen,dimension:'outra_dimensao'},60).clock.dimension,'outra_dimensao');
 assert.throws(()=>advanceWorldClock(frozen,-1),/inválido/);
});
