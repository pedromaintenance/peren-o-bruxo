import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildCatalogs,newClassicState} from '../src/progress.js';
import {SPELLS,newBattle} from '../src/combat.js';
import {ratio,actionDetails,expeditionViewModel,battleViewModel} from '../src/ui-adventure.js';
const data=Object.fromEntries(['itens','receitas','magias','monstros','cidades'].map(key=>[key,JSON.parse(readFileSync(new URL('../data/'+key+'.json',import.meta.url)))]));
const catalogs=buildCatalogs(data);

test('M1g-E HUD usa PV PM nivel ouro e clima do save canônico sem mutação',()=>{
 const state=newClassicState(),prior=JSON.stringify(state);
 const vm=expeditionViewModel(state,catalogs,{collected:{a:2,b:1},weather:'neblina',threat:'Galhos próximos',atExit:true,status:'Coletou 2 ervas'});
 assert.equal(vm.location,'Floresta de Mürin');
 assert.equal(vm.hp,state.hp);assert.equal(vm.mp,state.mp);
 assert.equal(vm.hpPercent,ratio(state.hp,vm.maxHp));
 assert.equal(vm.mpPercent,ratio(state.mp,vm.maxMp));
 assert.equal(vm.gathered,3);
 assert.equal(vm.weather,'neblina');
 assert.equal(vm.threat,'Galhos próximos');
 assert.equal(vm.canReturn,true);
 assert.equal(JSON.stringify(state),prior);
});
test('M1g-E percentuais são limitados e valores de combate são derivados do estado real',()=>{
 assert.equal(ratio(150,100),100);assert.equal(ratio(-5,100),0);
 assert.equal(ratio(1,0),0);assert.equal(ratio(35,140),25);
 const raw={status:'active',round:3,monster:'Galho Infectado',enemyHp:12,enemyMaxHp:24,hp:57,maxHp:114,mp:34,maxMp:68,potions:2,busy:true,level:1,log:['Primeiro turno','Ataque bloqueado']};
 const vm=battleViewModel(raw);
 assert.equal(vm.enemyPercent,50);assert.equal(vm.hpPercent,50);assert.equal(vm.mpPercent,50);
 assert.equal(vm.log,'Primeiro turno · Ataque bloqueado');assert.equal(vm.busy,true);
 assert.equal(vm.finished,false);
 assert.equal(battleViewModel({...raw,status:'fled'}).finished,true);
 assert.equal(battleViewModel(null),null);
});
test('M1g-E menu usa exatamente os três IDs de magia do motor',()=>{
 for(const spell of SPELLS){
  const description=actionDetails('spell:'+spell.id);
  assert.ok(description.includes(spell.name));
  assert.ok(description.includes(spell.mana+' PM'));
 }
 assert.match(actionDetails('flee'),/sem receber saque/);
 assert.match(actionDetails('potion'),/poção restauradora/);
 assert.match(actionDetails('spell:desconhecido'),/desconhecida/);
});
test('M1g-E apresenta controles funcionais sem substituir regras nem criar botões falsos',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/ui-adventure.js',import.meta.url),'utf8');
 for(const id of ['hudHp','hudMp','hudHpFill','hudMpFill','hudGold','hudLevel','beastPortrait',
   'beastName','beastDescription','observeBeast','retreatBeast','battleEnemyFill','battleHpFill','battleMpFill',
   'battleCommands','battleJournal','battleFinish','battleCommandHint']){
  assert.match(html,new RegExp('id="'+id+'"'));
 }
 assert.match(html,/ui-adventure\.css/);
 for(const cmd of ['attack','defend','potion','flee',...SPELLS.map(s=>'spell:'+s.id)])
  assert.ok(html.includes('data-battle="'+cmd+'"'));
 assert.match(main,/expeditionViewModel\(/);assert.match(main,/battleViewModel\(/);
 assert.match(main,/fillGauge\(/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|bridge\.execute/);
});
