// Reproduzir após checkout: node --test prototipos/aplicacao-contextual-alquimia.test.mjs
// Testes do MODELO DE PESQUISA, não do Phaser. Os valores são fictícios de QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectUse,commitUse,changeContextWithoutUse,exampleFixture,researchPolicy,IMMEDIATE_IDS} from './aplicacao-contextual-alquimia.mjs';
const c=(txId,context='combat',prepId='qa-pocao-dupla',targetId='peren',action='drink')=>({txId,context,prepId,targetId,action});
test('IDs imediatos limitados a dano e restauração; nada de duração implícita',()=>{
 assert.deepEqual(Object.keys(IMMEDIATE_IDS).sort(),['dano_magia','dano_saude','restaurar_magia','restaurar_saude']);
});
test('Simulador só funciona sob política marcada como QA e não aprovada',()=>{
 assert.equal(inspectUse(exampleFixture(),c('a'),{}).code,'missing_review_policy');
 assert.equal(inspectUse(exampleFixture(),c('a'),researchPolicy({approved:true})).success,false);
});
test('Prévia válida não consome frasco nem ação',()=>{
 const env=exampleFixture(),before=JSON.stringify(env);
 const p=inspectUse(env,c('a'),researchPolicy());
 assert.equal(p.code,'ready');assert.equal(JSON.stringify(env),before);
});
test('Uma aplicação válida consome exatamente 1 frasco e custo de QA explicitamente informado',()=>{
 const env=exampleFixture(),x=commitUse(env,c('a'),researchPolicy());
 assert.equal(x.applied,true);assert.equal(x.next.bag['qa-pocao-dupla'],1);
 assert.equal(x.next.actions,2);
 assert.equal(x.next.actors.peren.hp,90);assert.equal(x.next.actors.peren.mp,37);
 assert.equal(env.bag['qa-pocao-dupla'],2);assert.equal(env.actions,3);
});
test('Repetição da mesma transação devolve recibo sem outro consumo',()=>{
 const x=commitUse(exampleFixture(),c('same'),researchPolicy());
 const y=commitUse(x.next,c('same'),researchPolicy());
 assert.equal(y.applied,false);assert.equal(y.receipt.code,'qa_applied');assert.equal(y.next,x.next);
});
test('Colisão de idempotência com outro alvo é rejeitada sem efeito',()=>{
 const x=commitUse(exampleFixture(),c('same'),researchPolicy());
 const y=commitUse(x.next,c('same','combat','qa-pocao-dupla','foe'),researchPolicy());
 assert.equal(y.applied,false);assert.equal(y.receipt.code,'transaction_id_collision');
});
test('Transações distintas são permitidas e debitarão duas unidades quando houver estoque',()=>{
 const x=commitUse(exampleFixture(),c('a'),researchPolicy());
 const y=commitUse(x.next,c('b'),researchPolicy());
 assert.equal(y.applied,true);assert.equal(y.next.bag['qa-pocao-dupla'],0);assert.equal(y.next.actions,1);
});
test('Terceiro uso sem estoque não consome ação nem modifica PV',()=>{
 const x=commitUse(exampleFixture(),c('a'),researchPolicy());
 const y=commitUse(x.next,c('b'),researchPolicy());
 const z=commitUse(y.next,c('c'),researchPolicy());
 assert.equal(z.applied,false);assert.equal(z.receipt.code,'no_stock');assert.equal(z.next,y.next);
});
test('Exploração não transforma poção de cura em combate',()=>{
 const x=commitUse(exampleFixture(),c('expl','exploration'),researchPolicy());
 assert.equal(x.applied,true);assert.equal(x.receipt.context,'exploration');
});
test('Descanso não ativa o preparo automaticamente',()=>{
 const env=exampleFixture();
 const out=changeContextWithoutUse(env,'rest');
 assert.equal(out.applied,false);assert.equal(out.next,env);
 assert.equal(out.next.bag['qa-pocao-dupla'],2);
});
test('Uso durante descanso está bloqueado sem aprovação de decisão explícita',()=>{
 const o=commitUse(exampleFixture(),c('rest','rest'),researchPolicy());
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'rest_is_not_automatic_use');
});
test('Mesmo com descanso deliberado, não há uso sem permissão/contexto específicos',()=>{
 const p=researchPolicy({allowDeliberateUseAtRest:true});
 assert.equal(inspectUse(exampleFixture(),c('rest','rest'),p).code,'target_or_action_unresolved');
});
test('Administração em inimigo não é permitida por padrão',()=>{
 const o=commitUse(exampleFixture(),c('enemy','combat','qa-pocao-dupla','foe','administer'),researchPolicy());
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'family_route_unresolved');
});
test('Mesmo com permissão-alvo, inimigo exige decisão de resistência ou consentimento',()=>{
 const p=researchPolicy({permits:{"combat:administer:other_actor":true},familyActionPermissions:{"pocao:administer":true}});
 const o=commitUse(exampleFixture(),c('enemy','combat','qa-pocao-dupla','foe','administer'),p);
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'resistance_or_consent_unresolved');
});
test('Alvo externo só é exercitado com todas as liberações marcadas como QA',()=>{
 const p=researchPolicy({permits:{"combat:administer:other_actor":true},familyActionPermissions:{"pocao:administer":true},hostileResistanceQaResolved:true});
 const o=commitUse(exampleFixture(),c('enemy','combat','qa-pocao-dupla','foe','administer'),p);
 assert.equal(o.applied,true);assert.equal(o.next.actors.foe.hp,55);
 assert.equal(o.next.actors.foe.mp,10);
});
test('Bálsamo/equipamento não é tratado como poção de beber',()=>{
 const o=commitUse(exampleFixture(),c('item','exploration','qa-pocao-dupla','peren','apply_to_item'),researchPolicy());
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'object_application_unresolved');
});
test('Tônico de regeneração não é falsamente convertido em cura imediata',()=>{
 const o=commitUse(exampleFixture(),c('regen','exploration','qa-tonico-regenerador'),researchPolicy());
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'family_application_unresolved');
});
test('Mesmo se a família for Poção, regeneração continua bloqueada sem tempo aprovado',()=>{
 const env=exampleFixture();env.preparations['qa-tonico-regenerador'].family='pocao';
 const o=commitUse(env,c('regen','exploration','qa-tonico-regenerador'),researchPolicy());
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'effect_semantics_unresolved');
});
test('Consumível clássico não é convertido silenciosamente ao novo mecanismo',()=>{
 const x=commitUse(exampleFixture(),c('old','combat','ger-pocao-restauradora'),researchPolicy());
 assert.equal(x.applied,false);assert.equal(x.receipt.code,'legacy_semantics_unresolved');
});
test('Mistura com efeito oculto aplica todos, mas recibo mostra somente conhecido',()=>{
 const env=exampleFixture();env.preparations['qa-pocao-oculta'].family='pocao';
 const out=commitUse(env,c('hidden','combat','qa-pocao-oculta'),researchPolicy());
 assert.equal(out.applied,true);assert.equal(out.next.actors.peren.hp,90);
 assert.equal(out.next.actors.peren.mp,17);
 assert.deepEqual(out.receipt.visibleEffectIds,['restaurar_saude']);
 assert.equal(JSON.stringify(out.receipt).includes('dano_magia'),false);
});
test('Falha de estoque não revela propriedades ocultas',()=>{
 const env=exampleFixture();env.bag['qa-pocao-oculta']=0;
 const p=inspectUse(env,c('stock','combat','qa-pocao-oculta'),researchPolicy());
 assert.equal(p.success,false);assert.equal(JSON.stringify(p).includes('dano_magia'),false);
});
test('Custo de ação indefinido impede consumo, mesmo se efeito for válido',()=>{
 const p=researchPolicy({actionCost:undefined});
 const o=commitUse(exampleFixture(),c('cost'),p);
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'action_cost_undefined');
});
test('Ações insuficientes impedem consumo de inventário',()=>{
 const env=exampleFixture();env.actions=0;
 const o=commitUse(env,c('exhaust'),researchPolicy());
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'insufficient_qa_actions');
});
test('Resolução de efeitos não especificada impede uso',()=>{
 const o=commitUse(exampleFixture(),c('order'),researchPolicy({resolution:undefined}));
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'resolution_undefined');
});
test('Faltou potência aprovada: bloquear, não inferir intensidade de ingrediente',()=>{
 const o=commitUse(exampleFixture(),c('power'),researchPolicy({magnitudes:{restaurar_saude:20}}));
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'effect_magnitude_unapproved');
});
test('Efeito adicional não implementado bloqueia todo lote sem descarte parcial',()=>{
 const env=exampleFixture();env.preparations['qa-pocao-dupla'].effectIds.push('aumentar_saude');
 const snapshot=JSON.stringify(env);
 const x=commitUse(env,c('unsupported'),researchPolicy());
 assert.equal(x.applied,false);assert.equal(x.receipt.code,'effect_semantics_unresolved');
 assert.equal(JSON.stringify(env),snapshot);
});
test('PV zero não recebe restauração/ressurreição implícita',()=>{
 const env=exampleFixture();env.actors.peren.hp=0;
 const x=commitUse(env,c('dead'),researchPolicy());
 assert.equal(x.applied,false);assert.equal(x.receipt.code,'revival_unresolved');
 assert.equal(x.next,env);
});
test('Quantidade e custo nunca são consumidos em falhas consecutivas',()=>{
 const env=exampleFixture(),p=researchPolicy({actionCost:undefined}),command=c('f');
 for(let i=0;i<3;i++){
  const r=commitUse(env,command,p);assert.equal(r.applied,false);assert.equal(r.next,env);
 }
 assert.equal(env.bag['qa-pocao-dupla'],2);assert.equal(env.actions,3);
});
test('Resistência não pode ser ignorada por simples mudança de contexto',()=>{
 const p=researchPolicy({permits:{"exploration:administer:other_actor":true},familyActionPermissions:{"pocao:administer":true}});
 const out=commitUse(exampleFixture(),c('herb','exploration','qa-pocao-dupla','foe','administer'),p);
 assert.equal(out.applied,false);assert.equal(out.receipt.code,'resistance_or_consent_unresolved');
});
test('IDs de transação diferentes não se confundem com ordem dos efeitos',()=>{
 const env=exampleFixture();
 const a=commitUse(env,c('one'),researchPolicy());
 const b=commitUse(env,c('two'),researchPolicy());
 assert.equal(a.applied,true);assert.equal(b.applied,true);assert.equal(a.next.actors.peren.hp,b.next.actors.peren.hp);
});
test('A transação rejeita custo negativo, magias desconhecidas e falha de conhecimento',()=>{
 const env=exampleFixture();
 assert.equal(inspectUse(env,c('a'),researchPolicy({actionCost:-1})).code,'action_cost_undefined');
 env.preparations['qa-pocao-dupla'].knownEffectIds=['inventado'];
 assert.equal(inspectUse(env,c('b'),researchPolicy()).code,'invalid_character_knowledge');
});
test('Não há uso por movimento de contexto para combate ou exploração',()=>{
 const a=exampleFixture();
 const x=changeContextWithoutUse(a,'exploration');
 const y=changeContextWithoutUse(x.next,'combat');
 assert.equal(y.next,a);assert.equal(y.applied,false);
});
test('Alvo inexistente bloqueia sem aplicar em Peren como fallback',()=>{
 const o=commitUse(exampleFixture(),c('target','combat','qa-pocao-dupla','missing'),researchPolicy());
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'missing_target');
});
test('Veneno não pode ser bebido por autorização genérica de poção',()=>{
 const env=exampleFixture();env.preparations['qa-pocao-dupla'].family='veneno';
 const o=commitUse(env,c('venom'),researchPolicy());
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'family_route_unresolved');
});
test('Veneno administrado não funciona sem via e resistência específicas',()=>{
 const env=exampleFixture();env.preparations['qa-pocao-dupla'].family='veneno';
 const p=researchPolicy({permits:{"combat:administer:other_actor":true},
  familyActionPermissions:{"veneno:administer":true}});
 const o=commitUse(env,c('venom2','combat','qa-pocao-dupla','foe','administer'),p);
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'resistance_or_consent_unresolved');
});
test('Poção em alvo externo não é liberada só por autorizar resistência',()=>{
 const p=researchPolicy({hostileResistanceQaResolved:true});
 const o=commitUse(exampleFixture(),c('enemy3','combat','qa-pocao-dupla','foe','administer'),p);
 assert.equal(o.applied,false);assert.equal(o.receipt.code,'family_route_unresolved');
});
test('Recibo não altera metadados de incompatibilidade (não modelados)',()=>{
 const x=commitUse(exampleFixture(),c('none'),researchPolicy());
 assert.equal(x.applied,true);
 assert.equal('purified' in x.receipt,false);
 assert.equal('bonus' in x.receipt,false);
 assert.equal('potency' in x.receipt,false);
});
