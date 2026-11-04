// Rodar após checkout: node --test prototipos/estudo-fontes-adicionais.test.mjs
// Estudo de projeto, NÃO teste de fórmula canônica de potência ou de Phaser.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {examineMixture,compareAdditionalSource,examineSequence} from './estudo-fontes-adicionais.mjs';
const cur=JSON.parse(readFileSync(fileURLToPath(new URL('../data/curadoria_ingredientes.json',import.meta.url)),'utf8'));
const cats=JSON.parse(readFileSync(fileURLToPath(new URL('../data/catalogo-combos-alquimicos.json',import.meta.url)),'utf8'));
const p=['ing-mudcrab-chitin','ing-river-betty'];
const g='ing-bear-claws',ch='ing-large-antlers',a='ing-fly-amanita',m='ing-powdered-mammoth-tusk';
const eff=(x,id)=>x.effects.find(y=>y.id===id);
test('O par básico ativa somente Aumentar Força (II+II)',()=>{
 const x=examineMixture(cur,cats,p);
 assert.deepEqual(x.effects.map(e=>e.id),['aumentar_forca']);
 assert.deepEqual(eff(x,'aumentar_forca').originIndex,{twoStrongest:4,otherSources:0,allSources:4});
});
test('Terceira fonte Garras ativa Constituição sem apagar Força',()=>{
 const q=examineMixture(cur,cats,[...p,g]);
 assert.deepEqual(q.effects.map(e=>e.id),['aumentar_constituicao','aumentar_forca']);
 assert.equal(eff(q,'aumentar_forca').sourceCount,3);
 assert.equal(eff(q,'aumentar_forca').originIndex.twoStrongest,4);
 assert.equal(eff(q,'aumentar_forca').originIndex.otherSources,2);
 assert.deepEqual(eff(q,'aumentar_constituicao').origins.map(s=>s.intensity),[3,2]);
});
test('Quarta fonte Chifres reforça dois efeitos sem ativar outro',()=>{
 const pre=examineMixture(cur,cats,[...p,g]),post=examineMixture(cur,cats,[...p,g,ch]);
 const d=compareAdditionalSource(pre,post);
 assert.deepEqual(d.newlyActivated,[]);
 assert.deepEqual(d.removed,[]);
 assert.deepEqual(d.reinforcements.map(x=>[x.effectId,x.coreDelta,x.nonCoreDelta]),
   [['aumentar_constituicao',0,2],['aumentar_forca',0,2]]);
 assert.equal(eff(post,'aumentar_forca').sourceCount,4);
});
test('Quarta Amanita ativa Diminuir Sabedoria, não rotulada automaticamente Impuro',()=>{
 const pre=examineMixture(cur,cats,[...p,g]),post=examineMixture(cur,cats,[...p,g,a]);
 const d=compareAdditionalSource(pre,post);
 assert.deepEqual(d.newlyActivated,['diminuir_sabedoria']);
 assert.deepEqual(eff(post,'diminuir_sabedoria').origins.map(x=>x.intensity),[2,1]);
 assert.equal(post.classification.impure,false);
});
test('Fonte mais forte Pó de Presa de Mamute altera o núcleo de Força',()=>{
 const pre=examineMixture(cur,cats,[...p,g]),post=examineMixture(cur,cats,[...p,g,m]);
 const delta=compareAdditionalSource(pre,post).reinforcements.find(e=>e.effectId==='aumentar_forca');
 assert.equal(delta.coreDelta,1);
 assert.equal(delta.nonCoreDelta,2);
 assert.equal(delta.fullIndexDelta,3);
 assert.equal(eff(post,'aumentar_forca').originIndex.twoStrongest,5);
 assert.equal(eff(post,'aumentar_constituicao').originIndex.twoStrongest,5);
});
test('Adição não cria bônus no efeito se ingrediente não contém sua propriedade',()=>{
 const pre=examineMixture(cur,cats,[...p,g]);
 const post=examineMixture(cur,cats,[...p,g,'ing-frost-salts']);
 const before=eff(pre,'aumentar_forca'),after=eff(post,'aumentar_forca');
 assert.deepEqual(after.originIndex,before.originIndex);
});
test('A classificação Impuro só aparece ao ativar incompatibilidade aprovada',()=>{
 const ids=['ing-daedra-heart','ing-dragon-s-tongue','ing-jarrin-root','ing-butterfly-wing'];
 const seq=examineSequence(cur,cats,ids);
 assert.equal(seq[0].mixture.classification.impure,false);
 assert.equal(seq[1].mixture.classification.impure,false);
 assert.equal(seq[2].mixture.classification.impure,true);
 assert.deepEqual(seq[2].marginal.newlyActivated,['diminuir_forca']);
 assert.deepEqual(seq[2].marginal.addedIncompatibilityIds,['incompat-aumentar-carisma-diminuir-forca']);
});
test('Combo Fada é reconhecido após segunda fonte de Ilusão',()=>{
 const seq=examineSequence(cur,cats,['ing-daedra-heart','ing-dragon-s-tongue','ing-scaly-pholiota']);
 assert.deepEqual(seq[1].marginal.newlyActivated,['aumentar_ilusao']);
 assert.deepEqual(seq[1].marginal.addedApprovedSynergies,['combo-pocao-da-fada']);
 assert.equal(seq[1].mixture.classification.impure,false);
});
test('Não existe ativação retroativa sem duas fontes',()=>{
 const x=examineMixture(cur,cats,['ing-daedra-heart','ing-dragon-s-tongue']);
 assert.equal(x.effects.some(x=>x.id==='aumentar_ilusao'),false);
});
test('Adicionar fonte não faz efeito ativo desaparecer',()=>{
 const seq=examineSequence(cur,cats,[...p,g,a]);
 for(let i=1;i<seq.length;i++)assert.deepEqual(seq[i].marginal.removed,[]);
});
test('A ordem integral é irrelevante no resultado final',()=>{
 const a=examineMixture(cur,cats,[...p,g,ch]),b=examineMixture(cur,cats,[ch,g,...p.slice().reverse()]);
 assert.deepEqual(a,b);
});
test('A sequência de adição depende da ordem, mas estado final não',()=>{
 const a=examineSequence(cur,cats,[...p,g,a]),b=examineSequence(cur,cats,[...p,a,g]);
 assert.notDeepEqual(a.map(x=>x.marginal),b.map(x=>x.marginal));
 assert.deepEqual(a.at(-1).mixture,b.at(-1).mixture);
});
test('O estudo não cria potência, duração, qualidade ou efeitos novos',()=>{
 const before=JSON.stringify(cur),cc=JSON.stringify(cats);
 const x=examineMixture(cur,cats,[...p,g,ch]);
 assert.equal(JSON.stringify(cur),before);
 assert.equal(JSON.stringify(cats),cc);
 for(const row of x.effects)for(const key of ['potencia','duracao','qualidade','purificacao','bonus'])assert.equal(key in row,false);
});
test('Ignorar sinergias ainda não aprovadas',()=>{
 const x=examineMixture(cur,cats,['ing-blue-dartwing','ing-felsaad-tern-feathers','ing-hawk-feathers']);
 assert.deepEqual(x.classification.approvedSynergyIds,[]);
});
test('Ingrediente duplicado e quinto tipo não são tratados como suporte extra',()=>{
 assert.throws(()=>examineMixture(cur,cats,[...p,p[0]]),/distintos/);
 assert.throws(()=>examineMixture(cur,cats,[...p,g,a,ch]),/2 a 4/);
 assert.throws(()=>examineSequence(cur,cats,[...p,g,p[0]]),/duplicada/);
});
test('IDs de ingredientes inexistentes falham explicitamente',()=>{
 assert.throws(()=>examineMixture(cur,cats,[...p,'ing-nao-existe']),/não existe/);
});
