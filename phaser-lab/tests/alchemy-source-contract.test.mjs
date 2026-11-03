import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=(path)=>readFileSync(new URL(path,import.meta.url));
const json=(path)=>JSON.parse(read(path).toString('utf8'));
const cur=json('../../data/curadoria_ingredientes.json');
const rows=Object.entries(cur.itens);
const effects=new Map();
for(const [id,item] of rows){
 for(const effect of item.atributos||[]){
  const set=effects.get(effect.id)||new Set();set.add(id);effects.set(effect.id,set);
 }
}
const fingerprint=path=>createHash('sha256').update(read(path)).digest('hex');
function common(a,b){
 if(a===b)throw Error('Ingredientes precisam ter IDs distintos');
 const aa=cur.itens[a]?.atributos,bb=cur.itens[b]?.atributos;
 if(!aa||!bb)throw Error('Ingrediente ausente');
 return aa.filter(x=>bb.some(y=>y.id===x.id)).map(x=>x.id).sort();
}
test('curadoria canônica preserva quantidades e conectividade aprovadas',()=>{
 assert.ok(rows.length>=111);
 assert.equal(effects.size,53);
 assert.equal([...effects].filter(([,ids])=>ids.size<2).length,0);
 for(const [id,item] of rows){
  assert.ok(item.atributos.length>=3,id);
  assert.equal(new Set(item.atributos.map(a=>a.id)).size,item.atributos.length,id);
  for(const a of item.atributos){
   assert.ok(Number.isInteger(a.intensidade)&&a.intensidade>=1&&a.intensidade<=3,id+':'+a.id);
   assert.ok(!/stamina/i.test(a.id),id+': '+a.id);
  }
 }
});
test('nove parceiros aprovados não desaparecem do JSON canônico',()=>{
 const decisions=[
  ['ing-garlic','curar_doenca',2],['ing-skeever-tail','infligir_doenca',2],
  ['ing-eye-of-sabre-cat','visao_a_distancia',2],['ing-blue-dartwing','velocidade',2],
  ['ing-fly-amanita','diminuir_sabedoria',2],['ing-briar-heart','vampirismo',2],
  ['ing-namira-s-rot','diminuir_carisma',2],['ing-taproot','aumentar_inteligencia',2],
  ['ing-hagraven-claw','diminuir_magia',2]
 ];
 for(const [id,effect,intensidade] of decisions)
  assert.ok(cur.itens[id]?.atributos.some(a=>a.id===effect&&a.intensidade===intensidade),id+':'+effect);
});
test('interseção é comutativa, por efeito e com ingredientes distintos',()=>{
 const a='ing-felsaad-tern-feathers',b='ing-garlic';
 assert.deepEqual(common(a,b),common(b,a));
 assert.deepEqual(common(a,b),['aumentar_constituicao','curar_doenca']);
 assert.deepEqual(common('ing-vampire-dust','ing-briar-heart'),['vampirismo']);
 assert.throws(()=>common(a,a));
});
test('sync de build Phaser usa JSONs exatos da raiz e não gera receitas',()=>{
 for(const name of ['curadoria_ingredientes','itens','receitas','magias','monstros','cidades','expedicoes','missoes','reliquias_dnd','manifesto_dados'])
  assert.equal(fingerprint('../../data/'+name+'.json'),fingerprint('../public/data/'+name+'.json'),name);
});
