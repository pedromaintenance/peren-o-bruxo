import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newClassicState,buildCatalogs} from '../src/progress.js';
import {inventoryCategory,inventoryViewModel,INVENTORY_TABS} from '../src/ui-inventory.js';

const names=['itens','receitas','magias','monstros','cidades'];
const data=Object.fromEntries(names.map(n=>[n,JSON.parse(readFileSync(new URL('../data/'+n+'.json',import.meta.url)))]));
const catalogs=buildCatalogs(data);

test('M1g-B reads real bag, levels and exactly three existing equipment slots',()=>{
 const s=newClassicState(),snapshot=JSON.stringify(s);
 const vm=inventoryViewModel(s,catalogs);
 assert.equal(vm.character.gold,s.gold);
 assert.equal(vm.character.quantity,Object.values(s.bag).reduce((a,b)=>a+b,0));
 assert.equal(vm.character.types,Object.keys(s.bag).length);
 assert.equal(vm.equip.length,3);
 assert.deepEqual(vm.equip.map(x=>x.key),['weapon','armor','relic']);
 assert.equal(vm.equip[0].id,'eq-adaga-de-ferrugem');
 assert.equal(vm.equip[1].id,'eq-peitoral-de-ferrugem');
 assert.equal(vm.equip[2].id,null);
 assert.ok(vm.items.some(x=>x.id==='ing-blue-mountain-flower'&&x.amount===2));
 assert.equal(JSON.stringify(s),snapshot,'view model must never mutate RPG character state');
});
test('M1g-B category tabs and search use canonical IDs and visible labels',()=>{
 const s=newClassicState();
 const equip=inventoryViewModel(s,catalogs,{category:'equipment'});
 assert.equal(equip.filtered.every(i=>i.category==='equipment'),true);
 const herbs=inventoryViewModel(s,catalogs,{category:'ingredient'});
 assert.ok(herbs.filtered.length>=3);
 assert.equal(herbs.filtered.every(i=>i.category==='ingredient'),true);
 const consumables=inventoryViewModel(s,catalogs,{category:'consumable'});
 assert.ok(consumables.filtered.some(x=>x.id==='ger-pocao-restauradora'));
 const query=inventoryViewModel(s,catalogs,{query:'montanha'});
 assert.ok(query.filtered.some(x=>x.id==='ing-blue-mountain-flower'));
 const accented=inventoryViewModel(s,catalogs,{query:'POCAO'});
 assert.ok(accented.filtered.some(x=>x.id==='ger-pocao-restauradora'));
 const empty=inventoryViewModel(s,catalogs,{query:'inexistente-xyz'});
 assert.equal(empty.selected,null);assert.equal(empty.filtered.length,0);
 assert.deepEqual(INVENTORY_TABS.map(x=>x.id),['all','equipment','consumable','ingredient','quest','other']);
});
test('M1g-B shows equipped item only when truly equipped, never creates missing slots',()=>{
 const s=newClassicState();
 s.bag['eq-adaga-de-ferrugem']=1;
 let vm=inventoryViewModel(s,catalogs,{category:'equipment',selectedId:'eq-adaga-de-ferrugem'});
 assert.equal(vm.selected.equipped,true);
 s.equip.weapon=null;
 vm=inventoryViewModel(s,catalogs,{category:'equipment',selectedId:'eq-adaga-de-ferrugem'});
 assert.equal(vm.selected.equipped,false);
 assert.equal(vm.equip[0].name,'Vazio');
 const canonical=catalogs.itensById['eq-adaga-de-ferrugem'];
 assert.equal(inventoryCategory(canonical),'equipment');
});
test('M1g-B browser structure is separate from selling and preserves independent saves',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/ui-inventory.js',import.meta.url),'utf8');
 for(const id of ['inventoryUI','invGrid','invTabs','invEquipment','invClose','invSearch','invSprite'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/ui-inventory\.css/);
 assert.match(main,/createInventoryScreen/);
 assert.match(main,/if\(inventory\.isOpen\(\)\)/);
 assert.match(main,/showInventory','bag'/);
 assert.doesNotMatch(ui,/bridge\.execute|setItem\(|removeItem\(|localStorage|sessionStorage/);
});
