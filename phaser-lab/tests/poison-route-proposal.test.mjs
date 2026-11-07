import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolveAlchemyPair} from '../src/alchemy.js';
import {inspectPoisonRoute,poisonCandidateEvidence,POISON_ROUTES} from '../src/poison-route-proposal.js';
const local=new URL('../data/curadoria_ingredientes.json',import.meta.url);
const source=new URL('../../data/curadoria_ingredientes.json',import.meta.url);
const curated=JSON.parse(readFileSync(existsSync(local)?local:source,'utf8'));
const pair=resolveAlchemyPair(curated,['ing-nightshade','ing-deathbell']);
const venom={id:'preparo-qa-veneno',family:'veneno',ingredients:pair.ingredientIds,effects:pair.effects};
const attempt={route:'thrown_flask',context:'combat',targetKind:'enemy',targetId:'mob-galho-infectado'};
test('Beladona + Sino da Morte têm apenas Dano à Saúde como efeito compartilhado canônico',()=>{
 assert.equal(pair.valid,true);
 assert.deepEqual(pair.effects.map(x=>x.id),['dano_saude']);
 assert.equal(pair.effects[0].familia,'veneno');
});
test('As três vias de Veneno são distintas e nenhuma é automaticamente aprovada',()=>{
 assert.deepEqual(Object.keys(POISON_ROUTES).sort(),['administered','thrown_flask','weapon_coating']);
 for(const route of Object.keys(POISON_ROUTES)){
  const def=POISON_ROUTES[route];
  assert.ok(def.openDecisions.length>=4);
 }
});
test('Arremessar frasco contra inimigo identifica lacunas, não concede dano/consumo',()=>{
 const input=JSON.stringify(venom);
 const out=inspectPoisonRoute(venom,attempt);
 assert.equal(out.ready,false);
 assert.equal(out.status,'awaiting_authorial_rules');
 assert.ok(out.missing.includes('resistencia_do_alvo'));
 assert.equal(JSON.stringify(out).includes('dano_saude'),false);
 assert.equal(JSON.stringify(venom),input);
});
test('Lançamento de Veneno em exploração precisa de semântica específica',()=>{
 const out=inspectPoisonRoute(venom,{...attempt,context:'exploration'});
 assert.equal(out.status,'unsupported_context');
});
test('Impregnação na arma não é bebida nem ataque de contato automático',()=>{
 const out=inspectPoisonRoute(venom,{route:'weapon_coating',context:'exploration',targetKind:'weapon',targetId:'eq-adaga-de-ferrugem'});
 assert.equal(out.ready,false);
 assert.ok(out.missing.includes('cargas_por_acerto'));
 assert.ok(out.missing.includes('uso_concorrente_com_balsamos'));
});
test('Impregnação não aceita criatura como arma',()=>{
 const out=inspectPoisonRoute(venom,{route:'weapon_coating',context:'combat',targetKind:'enemy',targetId:'mob-galho-infectado'});
 assert.equal(out.status,'invalid_target');
});
test('Administração deliberada ainda exige consentimento/percepção',()=>{
 const out=inspectPoisonRoute(venom,{route:'administered',context:'combat',targetKind:'enemy',targetId:'mob-galho-infectado'});
 assert.ok(out.missing.includes('consentimento_e_percepcao'));
 assert.equal(out.ready,false);
});
test('Poção restauradora não pode entrar no executor de Venenos',()=>{
 const rest={...venom,family:'pocao'};
 assert.equal(inspectPoisonRoute(rest,attempt).status,'invalid_preparation');
});
test('Mistura de Veneno com efeito positivo não pode perder efeito silenciosamente',()=>{
 const mixed={...venom,effects:[...venom.effects,{id:'aumentar_magia'}]};
 const out=inspectPoisonRoute(mixed,attempt);
 assert.equal(out.status,'mixed_semantics');
 assert.deepEqual(out.missing,['resolver_todos_os_efeitos']);
});
test('Sem alvo, nenhuma via deve gastar frasco',()=>{
 assert.equal(inspectPoisonRoute(venom,{...attempt,targetId:''}).status,'invalid_target');
});
test('Via desconhecida não executa por fallback de Poção',()=>{
 assert.equal(inspectPoisonRoute(venom,{...attempt,route:'drink'}).status,'undefined_route');
});
test('Prova interna de efeitos nunca é devolvida pela prévia pública',()=>{
 const a=poisonCandidateEvidence(venom),b=inspectPoisonRoute(venom,attempt);
 assert.deepEqual(a,['dano_saude']);
 assert.equal(JSON.stringify(b).includes('dano_saude'),false);
});
