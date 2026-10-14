import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {workshopViewModel} from '../src/ui-workshop.js';
import {newClassicState,buildCatalogs,stageFromClassic,applyTransaction,craftable} from '../src/progress.js';
const data=Object.fromEntries(['itens','receitas','magias','monstros','cidades'].map(n=>[n,JSON.parse(readFileSync(new URL('../data/'+n+'.json',import.meta.url)))]));
const catalogs=buildCatalogs(data);
test('M1g-C lista as receitas reais apenas das estacoes cadastradas na cidade',()=>{
  const s=newClassicState(),copy=JSON.stringify(s);
  const model=workshopViewModel(s,catalogs,{limit:5000});
  const city=catalogs.cidadesById[s.city];
  assert.equal(model.city,city.nome);
  assert.ok(model.total>0);
  assert.deepEqual(model.stations.slice(1).map(x=>x.id),city.estacoes);
  assert.ok(model.recipes.every(r=>city.estacoes.includes(r.station)));
  assert.equal(model.recipes.length,model.total);
  assert.equal(JSON.stringify(s),copy);
});
test('M1g-C mostra contagens reais, skill e lote fixo de cada receita',()=>{
  const s=newClassicState(),model=workshopViewModel(s,catalogs);
  const rec=model.selected,source=catalogs.receitasById[rec.id];
  assert.equal(rec.resultName,catalogs.itensById[source.resultado].nome);
  assert.equal(rec.outputCount,source.quantidade);
  assert.equal(rec.requirements.length,source.ingredientes.length);
  for(const part of rec.requirements){
    const catalog=source.ingredientes.find(i=>i.item===part.id);
    assert.equal(part.need,catalog.quantidade);
    assert.equal(part.have,s.bag[part.id]||0);
  }
  assert.equal(rec.eligible,craftable(s,source,catalogs)&&s.actions>0);
});
test('M1g-C filtro, busca e indisponibilidade não inserem itens ou transações',()=>{
  const s=newClassicState();const copy=JSON.stringify(s);
  const all=workshopViewModel(s,catalogs,{limit:4000});
  const station=all.stations.at(1).id;
  const filtered=workshopViewModel(s,catalogs,{station,limit:4000});
  assert.ok(filtered.recipes.length>0);
  assert.ok(filtered.recipes.every(x=>x.station===station));
  const selected=filtered.recipes[0];
  const search=workshopViewModel(s,catalogs,{station,search:selected.name});
  assert.ok(search.recipes.some(x=>x.id===selected.id));
  const empty=workshopViewModel(s,catalogs,{search:'receita-impossivel-123'});
  assert.equal(empty.selected,null);
  const noActions=workshopViewModel({...s,actions:0},catalogs);
  assert.ok(noActions.recipes.every(r=>!r.eligible));
  assert.equal(JSON.stringify(s),copy);
});
test('M1g-C confirmação produz apenas quantidade canonica e consome uma ação',()=>{
  const s=newClassicState();
  const rec=workshopViewModel(s,catalogs,{limit:4000}).recipes.find(r=>r.eligible);
  assert.ok(rec,'Nenhuma receita inicial fabricável no catálogo da cidade');
  const env=stageFromClassic(s,catalogs);
  const tx=applyTransaction(env,{type:'craft',id:rec.id},catalogs);
  assert.equal(tx.applied,true);
  assert.equal(tx.next.character.crafted,s.crafted+1);
  assert.equal(tx.next.character.actions,s.actions-1);
  assert.equal(tx.next.character.bag[rec.resultId],(s.bag[rec.resultId]||0)+rec.outputCount);
  for(const part of rec.requirements)assert.equal(tx.next.character.bag[part.id]||0,(s.bag[part.id]||0)-part.need);
  assert.equal(env.character.crafted,s.crafted,'estado antigo permanece imutável');
});
test('M1g-C separa interface de regras, respeita catalogo e não altera save clássico',()=>{
  const code=readFileSync(new URL('../src/ui-workshop.js',import.meta.url),'utf8');
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
  for(const id of ['craftUI','craftStations','craftSearch','craftList','craftIngredients','craftMake','craftFeedback'])assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(html,/ui-workshop\.css/);
  assert.match(main,/createWorkshopScreen/);
  assert.match(code,/bridge\.execute\(\{type:'craft',id:current\.id\}\)/);
  assert.doesNotMatch(code,/localStorage|sessionStorage|\.setItem\(|\.removeItem\(/);
  assert.match(code,/busy=true/);
});
