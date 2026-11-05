// Em checkout: node --test prototipos/validar-taxonomia-efeitos.test.mjs
// Testa qualidade editorial e integridade da PROPOSTA, não implementação de efeitos no Phaser.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const load = p => JSON.parse(readFileSync(fileURLToPath(new URL(p,import.meta.url)),'utf8'));
const cat=load('../data/curadoria_ingredientes.json');
const tax=load('../data/taxonomia-efeitos-alquimicos-proposta.json');
const sig=load('../data/catalogo-combos-alquimicos.json');
const mapped=new Map();
for(const [ingredientId,item] of Object.entries(cat.itens))for(const a of item.atributos){
 if(!mapped.has(a.id))mapped.set(a.id,{names:new Set(),sources:new Set(),levels:new Set()});
 mapped.get(a.id).names.add(a.nome);mapped.get(a.id).sources.add(ingredientId);mapped.get(a.id).levels.add(a.intensidade);
}
const entries=tax.efeitos, byId=new Map(entries.map(x=>[x.id,x]));
test('Cobertura é exatamente dos 53 IDs reais, sem duplicação',()=>{
 assert.equal(entries.length,53);assert.equal(mapped.size,53);assert.equal(byId.size,53);
 assert.deepEqual([...byId.keys()].sort(),[...mapped.keys()].sort());
});
test('Fonte registra exatamente 111 ingredientes, SHA e 53 efeitos',()=>{
 assert.equal(tax.fonte.ingredientes,Object.keys(cat.itens).length);
 assert.equal(tax.fonte.efeitos,mapped.size);
 assert.match(tax.fonte.blob_sha,/^[a-f0-9]{40}$/);
});
test('Há 11 grupos, que somam 53 e cada item pertence a um grupo',()=>{
 assert.equal(Object.keys(tax.grupos).length,11);
 assert.equal(Object.values(tax.grupos).reduce((n,x)=>n+x.total,0),53);
 for(const [name,g] of Object.entries(tax.grupos))assert.equal(entries.filter(x=>x.classificacao_proposta.grupo_semantico===name).length,g.total);
});
test('Fontes, intensidades e nomes de origem correspondem integralmente à curadoria',()=>{
 for(const row of entries){
  const m=mapped.get(row.id);
  assert.equal(row.fontes_distintas,m.sources.size);
  assert.deepEqual(row.intensidades_de_origem,[...m.levels].sort());
  assert.deepEqual([row.nome_curadoria,...row.nomes_alternativos].sort(),[...m.names].sort());
 }
});
test('Preserva as variações históricas sem renomear os IDs',()=>{
 assert.deepEqual(byId.get('voar').nomes_alternativos.length,1);
 assert.deepEqual(byId.get('curar_doenca').nomes_alternativos.length,1);
});
test('Todos os 53 possuem proposta, alertas e perguntas de mecânica pendentes',()=>{
 for(const row of entries){
  assert.equal(row.classificacao_proposta.estado,'proposta_nao_aprovada');
  assert.ok(row.classificacao_proposta.grupo_semantico);
  assert.ok(row.classificacao_proposta.processo);
  assert.ok(row.classificacao_proposta.alerta.length>=20);
  for(const [key,value] of Object.entries(row.mecanica_pendente))assert.equal(value,null,key+': '+row.id);
 }
});
test('Nenhuma potência, duração, fórmula de stacking ou alvo foi aprovada por preenchimento',()=>{
 for(const row of entries){
  assert.ok(row.classificacao_proposta.alvo_hipotetico);
  assert.ok(row.classificacao_proposta.temporalidade_hipotetica);
  assert.ok(!('potencia_final' in row));
  assert.equal(row.mecanica_pendente.duracao,null);
  assert.equal(row.mecanica_pendente.unidade_potencia,null);
 }
});
test('Vampirismo mantém exceção canônica da transformação gradual',()=>{
 const v=byId.get('vampirismo');
 assert.equal(v.classificacao_proposta.grupo_semantico,'transformacao');
 assert.ok(v.classificacao_proposta.alerta.includes('transformar'));
 assert.ok(v.evidencias.some(e=>e.categoria==='decisao_canonica'&&e.arquivo==='docs/auditoria-alquimia-peren.md'));
});
test('Dano à Magia não é Diminuir Magia',()=>{
 assert.equal(byId.get('dano_magia').classificacao_proposta.grupo_semantico,'recurso_atual');
 assert.equal(byId.get('diminuir_magia').classificacao_proposta.grupo_semantico,'capacidade_e_defesa');
 assert.ok(byId.get('diminuir_magia').classificacao_proposta.alerta.includes('Dano à Magia'));
});
test('Restaurar recurso não equivale a regenerar',()=>{
 for(const resource of ['saude','magia']){
  assert.equal(byId.get('restaurar_'+resource).classificacao_proposta.grupo_semantico,'recurso_atual');
  assert.equal(byId.get('regenerar_'+resource).classificacao_proposta.grupo_semantico,'fluxo_de_recurso');
 }
});
test('Doença não se transforma em Dano à Saúde por inferência',()=>{
 assert.equal(byId.get('infligir_doenca').classificacao_proposta.grupo_semantico,'doenca');
 assert.ok(byId.get('infligir_doenca').classificacao_proposta.alerta.includes('Dano à Saúde'));
});
test('Velocidade não é Destreza, visão não é percepção geral',()=>{
 assert.notEqual(byId.get('velocidade').classificacao_proposta.grupo_semantico,byId.get('aumentar_destreza').classificacao_proposta.grupo_semantico);
 assert.notEqual(byId.get('visao_a_distancia').classificacao_proposta.grupo_semantico,byId.get('aumentar_percepcao').classificacao_proposta.grupo_semantico);
});
test('Aprovações existentes no catálogo de combos não são promovidas a novos efeitos',()=>{
 assert.equal(sig.sinergias.filter(x=>x.estado==='nome_e_sinergia_aprovados').length,1);
 assert.deepEqual(sig.sinergias.find(x=>x.id==='combo-pocao-da-fada').efeitos_necessarios,['aumentar_carisma','aumentar_ilusao']);
 assert.ok(entries.every(x=>!x.id.startsWith('combo-')));
 assert.ok(sig.candidatos_sinergia.every(x=>x.estado==='proposto_nao_aprovado'));
});
test('Não incluir Stamina ou normalizar efeito de resistência como doença',()=>{
 assert.equal([...mapped.keys()].filter(x=>x.includes('stamina')).length,0);
 assert.equal(byId.get('resistencia_veneno').classificacao_proposta.grupo_semantico,'resistencia');
 assert.equal(byId.get('curar_doenca').classificacao_proposta.grupo_semantico,'doenca');
});
test('Efeitos de transformação, condições e doença têm atenção distinta',()=>{
 assert.equal(byId.get('paralisia').classificacao_proposta.grupo_semantico,'estado_comportamental');
 assert.equal(byId.get('vampirismo').classificacao_proposta.grupo_semantico,'transformacao');
 assert.equal(byId.get('curar_doenca').classificacao_proposta.grupo_semantico,'doenca');
});
test('Todos os efeitos têm ao menos duas fontes distintas, sem efeitos isolados',()=>{
 assert.ok(entries.every(x=>x.fontes_distintas>=2));
});
test('A taxonomia não contamina o JSON de ingredientes com efeitos novos',()=>{
 assert.deepEqual(Object.keys(cat).sort(),['itens','politica','receitas_a_revisar_por_insumo','regras_alquimia','renomeacoes_textuais','schema'].sort());
 assert.equal(Object.keys(cat.itens).length,111);
});
