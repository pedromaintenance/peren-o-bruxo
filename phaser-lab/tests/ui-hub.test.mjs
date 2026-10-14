import test from 'node:test';
import assert from 'node:assert/strict';
import {hubViewModel,applyHubViewModel} from '../src/ui-hub.js';
import {buildCatalogs,newClassicState} from '../src/progress.js';
import {readFileSync} from 'node:fs';
const data={};for(const key of ['itens','receitas','magias','monstros','cidades'])data[key]=JSON.parse(readFileSync(new URL('../data/'+key+'.json',import.meta.url)));
const catalogs=buildCatalogs(data);
test('Portomonte view reads real level, HP/MP maxima and EXP progression',()=>{
 const s=newClassicState(),vm=hubViewModel(s,catalogs);
 assert.equal(vm.day,'Dia 1');assert.equal(vm.gold,'180');
 assert.equal(vm.hp,'114 / 114');assert.equal(vm.mp,'68 / 68');
 assert.equal(vm.xp,'0 / 62');assert.equal(vm.xpPct,0);
 assert.equal(vm.origin,'Portomonte');
 assert.match(vm.bag,/itens na bolsa/);
});
test('View constrains gauges and labels saves truthfully',()=>{
 const s={...newClassicState(),hp:99999,mp:9999,exp:999,gold:12345};
 const vm=hubViewModel(s,catalogs,'classic-import');
 assert.equal(vm.hpPct,100);assert.equal(vm.mpPct,100);assert.equal(vm.xpPct,100);
 assert.equal(vm.gold,'12.345');assert.match(vm.source,/Cópia importada/);
});
test('DOM binder updates only visible fields and never touches storage',()=>{
 const records={};const doc={getElementById(id){return records[id]??(records[id]={style:{},textContent:''});}};
 const vm=hubViewModel(newClassicState(),catalogs);
 applyHubViewModel(doc,vm);
 assert.equal(records.hubGold.textContent,'180');
 assert.equal(records.hubHpFill.style.width,'100%');
 assert.equal(records.hubOriginCity.textContent,'Origem do save: Portomonte');
});
test('M1g layout keeps legacy behavior hooks wired to buttons',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const buttons=['goForest','resetForest','showCraft','showShop','showInventory','openBagHub','endDayBtn','exportProgress'];
 for(const id of buttons)assert.match(html,new RegExp('id="'+id+'"[^>]*>'));
 for(const id of ['hubPanel','hubTitle','cityMeta','combatWallet','progressSource','hubStatus'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/ui-theme\.css/);assert.match(html,/ui-portomonte\.css/);
});
