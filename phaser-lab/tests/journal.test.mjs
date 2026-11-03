import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {journalViewModel,journalMarkdown,JOURNAL_TABS} from '../src/ui-journal.js';
import {buildCatalogs,newClassicState} from '../src/progress.js';
const data={};for(const key of ['itens','receitas','magias','monstros','cidades'])
 data[key]=JSON.parse(readFileSync(new URL('../data/'+key+'.json',import.meta.url)));
const catalogs=buildCatalogs(data);
const sample=()=>({
 schema:2,revision:5,worlds:{activeSeed:'murin-test-01'},
 character:{...newClassicState(),day:3,kills:1,crafted:1,
  journal:['Dia 3 · Venceu Galho Infectado.','Dia 2 · Comprou 1× Água Purificada.','Dia 1 · Peren chega a Portomonte.']},
 history:[
  {rev:1,type:'endDay',description:''},
  {rev:2,type:'collect',description:'ing-hanging-moss'},
  {rev:3,type:'buy',description:'mat-agua-purificada'},
  {rev:4,type:'victory',description:'mob-galho-infectado'},
  {rev:5,type:'craft',description:'ger-pocao-restauradora'}
 ]
});
test('journal derives real names, original revisions, and all categories from save snapshot',()=>{
 const before=JSON.stringify(sample()),env=sample();
 const all=journalViewModel(env,catalogs);
 assert.equal(all.entries.length,5);
 assert.deepEqual(all.entries.map(e=>e.revision),[5,4,3,2,1]);
 assert.equal(all.counts.battle,1);assert.equal(all.counts.gather,1);
 assert.equal(all.counts.trade,1);assert.equal(all.counts.craft,1);assert.equal(all.counts.other,1);
 assert.equal(all.counts.chronicle,3);
 assert.equal(all.entries[0].detail,catalogs.itensById['ger-pocao-restauradora'].nome);
 assert.equal(all.entries[1].detail,catalogs.monstrosById['mob-galho-infectado'].nome);
 assert.equal(all.summary.day,3);assert.equal(all.summary.kills,1);
 assert.equal(JSON.stringify(env),before,'view model mutated state');
});
test('diacritic-insensitive search and category filters yield source-backed entries only',()=>{
 const env=sample();
 assert.equal(journalViewModel(env,catalogs,{category:'trade'}).entries.length,1);
 assert.equal(journalViewModel(env,catalogs,{category:'gather'}).entries[0].rawType,'collect');
 assert.equal(journalViewModel(env,catalogs,{category:'battle'}).entries[0].rawType,'victory');
 assert.equal(journalViewModel(env,catalogs,{category:'all',query:'PURIFICADA'}).entries.length,1);
 assert.equal(journalViewModel(env,catalogs,{category:'chronicle',query:'vEnCeU'}).entries.length,1);
 assert.equal(journalViewModel(env,catalogs,{category:'all',query:'não existe'}).entries.length,0);
 assert.equal(journalViewModel(env,catalogs,{category:'invalid'}).category,'all');
});
test('initial state and 80-operation cap do not create imaginary tasks, dates or past activities',()=>{
 const empty={character:newClassicState(),history:[],worlds:{activeSeed:'murin-001'}};
 const fresh=journalViewModel(empty,catalogs);
 assert.equal(fresh.entries.length,0);assert.equal(fresh.chronicles,1);
 assert.equal(fresh.summary.kills,0);
 const loaded={...sample(),history:Array.from({length:100},(_,i)=>({rev:i+1,type:'endDay',description:''}))};
 const capped=journalViewModel(loaded,catalogs);
 assert.equal(capped.entries.length,80);
 assert.equal(capped.entries[0].revision,100);
 assert.equal(capped.entries[79].revision,21);
 assert.ok(JOURNAL_TABS.length>=6);
});
test('export is complete, local, readable, and does not invent a clock time per event',()=>{
 const env=sample(),before=JSON.stringify(env);
 const md=journalMarkdown(env,catalogs);
 assert.match(md,/^# Diário de Peren/m);
 assert.match(md,/Crônicas do personagem/);
 assert.match(md,/Registro 4 · Vitória/);
 assert.match(md,/Galho Infectado/);
 assert.match(md,/murin-test-01/);
 assert.ok(!md.includes('2026-'));
 assert.equal(JSON.stringify(env),before);
});
test('journal is opt-in preview UI, CSS mobile scoped and contains no network or persistent mutations',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const screen=readFileSync(new URL('../src/ui-journal.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../ui-journal.css',import.meta.url),'utf8');
 for(const id of ['showJournal','journalUI','journalTabs','journalEntries','journalSearch','journalExport','journalClose'])
  assert.ok(html.includes('id="'+id+'"'),'Missing '+id);
 assert.ok(html.includes('id="showJournal"')&&html.includes('hidden'), 'Journal button is preview gated');
 assert.match(main,/M1HF_PREVIEW\s*\?\s*createJournalScreen/);
 assert.match(main,/journal\?\.isOpen\(\)/);
 assert.doesNotMatch(screen,/\blocalStorage\b|\bsessionStorage\b|sendBeacon\(|\bfetch\(|XMLHttpRequest/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/#journalUI\[hidden\]/);
});
