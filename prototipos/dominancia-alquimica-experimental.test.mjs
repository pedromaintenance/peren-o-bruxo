// Rodar em checkout: node --test prototipos/dominancia-alquimica-experimental.test.mjs
// Não integra o runtime. Hipóteses não são fórmula canônica de potência.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {investigateDominance,presentDominance,HYPOTHESES} from './dominancia-alquimica-experimental.mjs';
const data=JSON.parse(readFileSync(fileURLToPath(new URL('../data/curadoria_ingredientes.json',import.meta.url)),'utf8'));
const trio=['ing-mudcrab-chitin','ing-river-betty','ing-bear-claws'];
const tie=['ing-mudcrab-chitin','ing-troll-fat'];
const impure=['ing-daedra-heart','ing-dragon-s-tongue','ing-jarrin-root','ing-butterfly-wing'];
test('3 hipóteses de ordenação estão explícitas',()=>{
 assert.deepEqual(Object.keys(HYPOTHESES),['soma_fontes','duas_maiores','fonte_maxima']);
});
test('No trio real, soma favorece Força mas duas maiores favorece Constituição',()=>{
 const x=investigateDominance(data,trio);
 assert.deepEqual(x.effects.map(e=>e.id),['aumentar_constituicao','aumentar_forca']);
 assert.deepEqual(x.effects.find(e=>e.id==='aumentar_forca').origens.map(x=>x.intensidade).sort(),[2,2,2]);
 assert.deepEqual(x.effects.find(e=>e.id==='aumentar_constituicao').origens.map(x=>x.intensidade).sort(),[2,3]);
 assert.deepEqual(x.rankings.soma_fontes.dominantes,['aumentar_forca']);
 assert.deepEqual(x.rankings.duas_maiores.dominantes,['aumentar_constituicao']);
 assert.equal(x.acordoEntreHipoteses,false);
});
test('A+B+C e C+B+A geram exatamente os mesmos índices',()=>{
 const a=investigateDominance(data,trio);
 const b=investigateDominance(data,[...trio].reverse());
 assert.deepEqual(a,b);
});
test('Par real produz empate no modelo fonte máxima, não no de soma',()=>{
 const x=investigateDominance(data,tie);
 assert.equal(x.rankings.fonte_maxima.empate,true);
 assert.deepEqual(x.rankings.fonte_maxima.dominantes,['aumentar_forca','resistencia_veneno']);
 assert.deepEqual(x.rankings.soma_fontes.dominantes,['aumentar_forca']);
});
test('Empate não vira uma decisão arbitrária de UI',()=>{
 const x=investigateDominance(data,tie);
 const p=presentDominance(x,'fonte_maxima',['aumentar_forca','resistencia_veneno']);
 assert.equal(p.status,'empate');assert.equal(p.nomeDefinitivoAprovado,false);
 assert.deepEqual(p.visibleDominants,['aumentar_forca','resistencia_veneno']);
});
test('Efeito de topo ainda não conhecido não vaza',()=>{
 const x=investigateDominance(data,trio);
 const p=presentDominance(x,'duas_maiores',['aumentar_forca']);
 assert.equal(p.status,'indeterminado_para_personagem');
 assert.deepEqual(p.visibleDominants,[]);
});
test('Conhecimento de ambos revela o dominante da hipótese sem dizer que é fórmula aprovada',()=>{
 const x=investigateDominance(data,trio);
 const p=presentDominance(x,'duas_maiores',['aumentar_constituicao','aumentar_forca']);
 assert.equal(p.status,'dominante_unico');assert.deepEqual(p.visibleDominants,['aumentar_constituicao']);
 assert.equal(p.nomeDefinitivoAprovado,false);
});
test('Duplicar mesmo ingrediente não duplica fonte',()=>{
 assert.throws(()=>investigateDominance(data,['ing-mudcrab-chitin','ing-mudcrab-chitin']),/repetido/);
});
test('Somente efeitos com ao menos duas fontes entram na avaliação',()=>{
 const x=investigateDominance(data,impure);
 assert.deepEqual(x.effects.map(x=>x.id),['aumentar_carisma','diminuir_forca']);
});
test('Nenhuma hipótese remove a incompatibilidade ou altera os ingredientes da curadoria',()=>{
 const before=JSON.stringify(data);
 const x=investigateDominance(data,impure);
 assert.equal(x.effects.length,2);
 for(const e of x.effects)assert.ok(e.origens.length>=2);
 assert.equal(JSON.stringify(data),before);
});
test('Mistura sem efeitos compartilhados não inventa produto',()=>{
 const x=investigateDominance(data,['ing-felsaad-tern-feathers','ing-charred-skeever-hide']);
 assert.equal(x.effects.length,0);
 assert.deepEqual(x.rankings.soma_fontes.dominantes,[]);
 assert.equal(presentDominance(x,'soma_fontes',[]).status,'sem_efeitos');
});
test('Índice de soma considera três fontes, duas maiores e máximo são alternativas independentes',()=>{
 const x=investigateDominance(data,trio);
 const f=x.effects.find(x=>x.id==='aumentar_forca');
 assert.deepEqual(f.indices,{soma_fontes:6,duas_maiores:4,fonte_maxima:2});
});
test('Modelo não define potência final, duração, custo ou bônus',()=>{
 const x=investigateDominance(data,trio);
 assert.equal(x.nota.includes('Não são potência final'),true);
 assert.equal(x.effects.some(e=>'potencia' in e||'duracao' in e),false);
});
test('Ordem dos atributos na curadoria não altera a comparação',()=>{
 const clone=JSON.parse(JSON.stringify(data));
 for(const item of Object.values(clone.itens))item.atributos.reverse();
 const a=investigateDominance(data,trio),b=investigateDominance(clone,trio);
 assert.deepEqual(a,b);
});
test('Outros modos ou dados inválidos falham explicitamente',()=>{
 assert.throws(()=>investigateDominance(data,['desconhecido','ing-mudcrab-chitin']),/ausente/);
 assert.throws(()=>investigateDominance(data,['ing-mudcrab-chitin']),/2 a 4/);
 assert.throws(()=>presentDominance(investigateDominance(data,trio),'uma-regra-inventada',[]),/Hipótese não calculada/);
});
