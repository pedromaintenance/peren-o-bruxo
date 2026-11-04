// Rodar localmente: node --test prototipos/experimento-classificador-sinergias.test.mjs
// Testes experimentais isolados, não importados pelo Phaser.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {classifyAlchemyEffects,recordComboObservation} from './experimento-classificador-sinergias.mjs';
const catalog=JSON.parse(readFileSync(fileURLToPath(new URL('../data/catalogo-combos-alquimicos.json',import.meta.url)),'utf8'));
const fada=['aumentar_carisma','aumentar_ilusao'];
const impurity=['aumentar_carisma','diminuir_forca'];
const synthetic={
 ...catalog,
 sinergias:[...catalog.sinergias,{id:'qa-efeitos-ilusao-magia',nome:'Combo B — SOMENTE QA',
  estado:'aprovado',efeitos_necessarios:['aumentar_ilusao','aumentar_magia']}]
};
test('Poção da Fada aprovada, quando efeitos são conhecidos',()=>{
 const x=classifyAlchemyEffects(fada,catalog,fada);
 assert.equal(x.presentation.kind,'combo');
 assert.equal(x.presentation.label,'Poção da Fada');
 assert.deepEqual(x.internal.matchedComboIds,['combo-pocao-da-fada']);
});
test('o motor pode conhecer a assinatura, mas a UX não revela efeito oculto',()=>{
 const x=classifyAlchemyEffects(fada,catalog,['aumentar_carisma']);
 assert.deepEqual(x.internal.matchedComboIds,['combo-pocao-da-fada']);
 assert.deepEqual(x.presentation.recognizedCombos,[]);
 assert.equal(x.presentation.hasHiddenEffects,true);
 assert.notEqual(x.presentation.label,'Poção da Fada');
});
test('Incompatibilidade aprovada tem precedência sem apagar efeitos',()=>{
 const x=classifyAlchemyEffects(impurity,catalog,impurity);
 assert.equal(x.presentation.kind,'impuro');
 assert.deepEqual(x.internal.activeEffectIds,['aumentar_carisma','diminuir_forca']);
 assert.deepEqual(x.internal.incompatibilityIds,['incompat-aumentar-carisma-diminuir-forca']);
});
test('Mistura compatível e não sinérgica permanece comum',()=>{
 const fx=['aumentar_forca','resistencia_eletricidade'];
 const x=classifyAlchemyEffects(fx,catalog,fx);
 assert.equal(x.presentation.kind,'comum');
 assert.equal(x.internal.impure,false);
 assert.deepEqual(x.internal.matchedComboIds,[]);
});
test('Candidatos editoriais não participam de classificação',()=>{
 const fx=['voar','velocidade'];
 const x=classifyAlchemyEffects(fx,catalog,fx);
 assert.deepEqual(x.internal.matchedComboIds,[]);
 assert.equal(x.presentation.kind,'comum');
});
test('Efeitos extras preservam identidade de um combo aprovado',()=>{
 const fx=[...fada,'aumentar_magia'];
 const x=classifyAlchemyEffects(fx,catalog,fx);
 assert.equal(x.presentation.label,'Poção da Fada');
 assert.deepEqual(x.internal.activeEffectIds,[...fx].sort());
});
test('Multissinergia sintética reconhece todas as assinaturas, sem escolher título arbitrário',()=>{
 const fx=[...fada,'aumentar_magia'];
 const x=classifyAlchemyEffects(fx,synthetic,fx);
 assert.equal(x.presentation.kind,'multissinergia');
 assert.equal(x.presentation.label,'Sinergias múltiplas reconhecidas');
 assert.deepEqual(x.internal.matchedComboIds,['combo-pocao-da-fada','qa-efeitos-ilusao-magia']);
});
test('Ordem dos efeitos e do catálogo não altera a classificação',()=>{
 const fx=[...fada,'aumentar_magia'];
 const other={...synthetic,sinergias:[...synthetic.sinergias].reverse()};
 const a=classifyAlchemyEffects(fx,synthetic,fx);
 const b=classifyAlchemyEffects(fx.reverse(),other,fx);
 assert.deepEqual(a,b);
});
test('Impuro com sinergias sintéticas continua Impuro',()=>{
 const fx=[...fada,'aumentar_magia','diminuir_forca'];
 const x=classifyAlchemyEffects(fx,synthetic,fx);
 assert.equal(x.presentation.kind,'impuro');
 assert.equal(x.internal.impure,true);
 assert.equal(x.internal.matchedComboIds.length,2);
 assert.equal(x.internal.activeEffectIds.length,4);
});
test('Uma incompatibilidade oculta pode rotular Impuro sem revelar o nome do efeito',()=>{
 const x=classifyAlchemyEffects(impurity,catalog,['aumentar_carisma']);
 assert.equal(x.presentation.kind,'impuro');
 assert.equal(x.presentation.knownIncompatibilityIds.length,0);
 assert.deepEqual(x.presentation.visibleEffectIds,['aumentar_carisma']);
});
test('Aprende sinergia observada em Impuro, mas não registra produção compatível',()=>{
 const x=classifyAlchemyEffects([...fada,'diminuir_forca'],catalog,[...fada,'diminuir_forca']);
 const o=recordComboObservation(null,x,'tx-impuro');
 assert.deepEqual(o.newlyRecognized,['combo-pocao-da-fada']);
 assert.deepEqual(o.firstCompatible,[]);
 assert.equal(o.state.knownCombos['combo-pocao-da-fada'].firstRecognizedInImpure,true);
 assert.equal(o.state.knownCombos['combo-pocao-da-fada'].compatiblePreparations,0);
});
test('Primeira fabricação sem conflito é marco diferente do primeiro reconhecimento',()=>{
 const x=classifyAlchemyEffects([...fada,'diminuir_forca'],catalog,[...fada,'diminuir_forca']);
 const y=classifyAlchemyEffects(fada,catalog,fada);
 const a=recordComboObservation(null,x,'tx-impuro');
 const b=recordComboObservation(a.state,y,'tx-puro');
 assert.deepEqual(b.newlyRecognized,[]);
 assert.deepEqual(b.firstCompatible,['combo-pocao-da-fada']);
 assert.equal(b.state.knownCombos['combo-pocao-da-fada'].observations,2);
 assert.equal(b.state.knownCombos['combo-pocao-da-fada'].compatiblePreparations,1);
});
test('A mesma transação não duplica descoberta nem preparação',()=>{
 const x=classifyAlchemyEffects(fada,catalog,fada);
 const a=recordComboObservation(null,x,'tx-1');
 const b=recordComboObservation(a.state,x,'tx-1');
 assert.equal(b.duplicate,true);
 assert.equal(b.state.knownCombos['combo-pocao-da-fada'].observations,1);
});
test('Não aprender sinergia antes de identificar todos os efeitos da assinatura',()=>{
 const x=classifyAlchemyEffects(fada,catalog,['aumentar_carisma']);
 const o=recordComboObservation(null,x,'tx-não-identificou');
 assert.deepEqual(o.newlyRecognized,[]);
 assert.equal(Object.keys(o.state.knownCombos).length,0);
});
test('Duas assinaturas reconhecidas geram duas fichas, um evento transacional',()=>{
 const fx=[...fada,'aumentar_magia'];
 const x=classifyAlchemyEffects(fx,synthetic,fx);
 const o=recordComboObservation(null,x,'tx-combo-duplo');
 assert.deepEqual(o.newlyRecognized,['combo-pocao-da-fada','qa-efeitos-ilusao-magia']);
 assert.deepEqual(Object.keys(o.state.processedTransactions),['tx-combo-duplo']);
 assert.equal(Object.keys(o.state.knownCombos).length,2);
});
