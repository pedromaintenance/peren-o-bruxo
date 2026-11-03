import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { avaliarMistura, auditarCatalogo } from '../ferramentas/alquimia-experimental.mjs';

const catalogo = JSON.parse(readFileSync(
  new URL('../data/curadoria_ingredientes.json', import.meta.url), 'utf8'
));
const efeitos = mistura => mistura.efeitos.map(e => e.id).sort();
const misturar = (...ids) => avaliarMistura(catalogo, ids);

test('curadoria preserva mínimos, intensidade e conectividade', () => {
  const relatorio = auditarCatalogo(catalogo);
  assert.deepEqual(relatorio.erros, []);
  assert.equal(relatorio.contagens.ingredientes, 111);
  assert.equal(relatorio.contagens.efeitos, 53);
  assert.equal(relatorio.contagens.efeitosIsolados, 0);
  assert.equal(relatorio.contagens.atributosPorIngrediente[3], 101);
  assert.equal(relatorio.contagens.atributosPorIngrediente[4], 10);
  assert.deepEqual(relatorio.nomesDuplicados[0]?.ids, [
    'ing-pine-thrush-egg', 'ing-rock-warbler-egg'
  ]);
});

test('ordem não altera mistura de dois efeitos', () => {
  const a = misturar('ing-glow-dust', 'ing-glowing-mushroom');
  const b = misturar('ing-glowing-mushroom', 'ing-glow-dust');
  assert.deepEqual(a, b);
  assert.equal(a.estado, 'preparacao');
  assert.deepEqual(efeitos(a), ['aumentar_destruicao', 'resistencia_eletricidade']);
  assert.equal(a.efeitos[0].fontes.length, 2);
});

test('vampirismo tem duas fontes distintas e respeita o catálogo', () => {
  const resultado = misturar('ing-vampire-dust', 'ing-briar-heart');
  assert.ok(efeitos(resultado).includes('vampirismo'));
  assert.deepEqual(resultado.efeitos.find(x => x.id === 'vampirismo').fontes
    .map(f => f.intensidade).sort(), [2, 3]);
});

test('mesmo tipo repetido não constitui duas fontes', () => {
  const resultado = misturar('ing-vampire-dust', 'ing-vampire-dust');
  assert.equal(resultado.estado, 'falha');
  assert.equal(resultado.motivo, 'fontes_distintas_insuficientes');
  assert.deepEqual(resultado.efeitos, []);
});

test('três ingredientes ativam efeitos por pares diferentes', () => {
  const resultado = misturar('ing-namira-s-rot', 'ing-luna-moth-wing', 'ing-charred-skeever-hide');
  assert.deepEqual(efeitos(resultado), ['dano_magia', 'diminuir_carisma', 'regenerar_saude']);
  for (const e of resultado.efeitos) assert.equal(e.fontes.length, 2);
  assert.deepEqual(resultado, misturar(
    'ing-charred-skeever-hide', 'ing-namira-s-rot', 'ing-luna-moth-wing'
  ));
});

test('repetir um tipo numa mistura não altera fontes nem efeitos', () => {
  assert.deepEqual(
    misturar('ing-glow-dust', 'ing-glowing-mushroom', 'ing-glow-dust'),
    misturar('ing-glow-dust', 'ing-glowing-mushroom')
  );
});

test('par sem interseção falha sem criar consumível', () => {
  const ids = Object.keys(catalogo.itens);
  let semIntersecao;
  for (let i = 0; i < ids.length && !semIntersecao; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const resultado = misturar(ids[i], ids[j]);
      if (!resultado.efeitos.length) { semIntersecao = resultado; break; }
    }
  }
  assert.ok(semIntersecao, 'esperada ao menos uma combinação sem efeitos comuns');
  assert.equal(semIntersecao.estado, 'falha');
  assert.equal(semIntersecao.motivo, 'sem_efeitos_compartilhados');
});

test('IDs desconhecidos ou entradas malformadas são recusados', () => {
  assert.throws(() => misturar('ingrediente-inexistente', 'ing-vampire-dust'), RangeError);
  assert.throws(() => avaliarMistura(catalogo, []), TypeError);
  assert.throws(() => avaliarMistura({}, ['a', 'b']), TypeError);
});

test('avaliar mistura é puro e não calcula potência não aprovada', () => {
  const antes = JSON.stringify(catalogo);
  const resultado = misturar('ing-glow-dust', 'ing-glowing-mushroom');
  assert.equal(JSON.stringify(catalogo), antes);
  for (const efeito of resultado.efeitos) {
    assert.equal(Object.hasOwn(efeito, 'potencia'), false);
    assert.equal(Object.hasOwn(efeito, 'duracao'), false);
  }
});

test('auditoria acusa catalogação inválida sem reparar silenciosamente', () => {
  const relatorio = auditarCatalogo({ itens: {
    'ing-teste': { nome: 'Teste', atributos: [
      { id: 'stamina', nome: 'Stamina', intensidade: 5 }
    ] }
  } });
  assert.ok(relatorio.erros.some(e => e.includes('Menos de três')));
  assert.ok(relatorio.erros.some(e => e.includes('Stamina proibida')));
  assert.ok(relatorio.erros.some(e => e.includes('Intensidade fora')));
});
