// Após checkout: node --test prototipos/recursos-alquimicos-experimental.test.mjs
// As magnitudes de teste NÃO são potencia, duração ou custo aprovados.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {RESOURCE_EFFECTS,simulateImmediate,simulateCapacity,simulateRegeneration} from './recursos-alquimicos-experimental.mjs';
const state={saude:{current:60,max:100,baseRate:2},magia:{current:30,max:80,baseRate:1}};
const instant=(effectId,magnitude)=>({effectId,magnitude});
test('Registro de estudo contém os 10 IDs atuais e separa 4 processos',()=>{
 assert.equal(Object.keys(RESOURCE_EFFECTS).length,10);
 assert.equal(RESOURCE_EFFECTS.dano_magia.process,'damage_current');
 assert.equal(RESOURCE_EFFECTS.diminuir_magia.process,'unresolved_maximum_or_efficacy');
 assert.equal(RESOURCE_EFFECTS.regenerar_magia.process,'increase_regeneration_hypothesis');
});
test('Dano de Saúde atinge valor atual e preserva máximo e taxa',()=>{
 const s=simulateImmediate(state,[instant('dano_saude',25)]).state;
 assert.deepEqual(s.saude,{current:35,max:100,baseRate:2});
});
test('Dano à Magia afeta apenas MP atual',()=>{
 const s=simulateImmediate(state,[instant('dano_magia',8)]).state;
 assert.equal(s.magia.current,22);assert.deepEqual(s.saude,state.saude);
});
test('Dano não permite valor atual negativo',()=>{
 const s=simulateImmediate(state,[instant('dano_saude',500)]).state;
 assert.equal(s.saude.current,0);
});
test('Restaurar Saúde respeita máximo e computa excesso sem criar HP',()=>{
 const o=simulateImmediate(state,[instant('restaurar_saude',100)]);
 assert.equal(o.state.saude.current,100);assert.equal(o.changes[0].applied,40);assert.equal(o.changes[0].wasted,60);
});
test('Restaurar Magia não muda capacidade, taxa nem PV',()=>{
 const s=simulateImmediate(state,[instant('restaurar_magia',18)]).state;
 assert.equal(s.magia.current,48);assert.equal(s.magia.max,80);assert.equal(s.magia.baseRate,1);assert.deepEqual(s.saude,state.saude);
});
test('Regeneração não pode ser usada como cura instantânea neste estudo',()=>{
 assert.throws(()=>simulateImmediate(state,[instant('regenerar_saude',5)]),/não imediato/);
});
test('Ordem de dano e cura muda resultado ao aproximar limite de PV',()=>{
 const hi={...state,saude:{current:95,max:100,baseRate:0}};
 const damage=instant('dano_saude',40),heal=instant('restaurar_saude',40);
 assert.equal(simulateImmediate(hi,[heal,damage],'ordered_as_provided').state.saude.current,60);
 assert.equal(simulateImmediate(hi,[damage,heal],'ordered_as_provided').state.saude.current,95);
 assert.equal(simulateImmediate(hi,[heal,damage],'damage_before_restore').state.saude.current,95);
 assert.equal(simulateImmediate(hi,[heal,damage],'restore_before_damage').state.saude.current,60);
});
test('Hipótese simultânea de saldo líquido é independente da ordem',()=>{
 const hi={...state,saude:{current:95,max:100,baseRate:0}};
 const events=[instant('dano_saude',40),instant('restaurar_saude',40)];
 assert.equal(simulateImmediate(hi,events,'net_by_resource').state.saude.current,95);
 assert.deepEqual(simulateImmediate(hi,events,'net_by_resource'),simulateImmediate(hi,events.reverse(),'net_by_resource'));
});
test('Aumentar máximo com política preservar atual não cura gratuitamente',()=>{
 const o=simulateCapacity(state,instant('aumentar_saude',30),'preserve_current');
 assert.deepEqual(o.state.saude,{current:60,max:130,baseRate:2});
});
test('Aumentar máximo preservando déficit também aumenta atual: decisão aberta',()=>{
 const o=simulateCapacity(state,instant('aumentar_saude',30),'preserve_deficit');
 assert.equal(o.state.saude.current,90);assert.equal(o.state.saude.max,130);
});
test('Aumentar máximo preservando proporção exige arredondamento, ainda aberto',()=>{
 const o=simulateCapacity(state,instant('aumentar_saude',30),'preserve_ratio');
 assert.equal(o.state.saude.current,78);assert.equal(o.state.saude.max,130);
});
test('Diminuir Magia por eficácia arcana permanece explicitamente indefinido',()=>{
 const o=simulateCapacity(state,instant('diminuir_magia',18),'efficacy_only_unresolved');
 assert.equal(o.applied,false);assert.deepEqual(o.state,state);assert.match(o.unresolved,/Eficácia arcana/);
});
test('Diminuir máximo por hipótese preserva atual ou déficit de modo diferente',()=>{
 const hi={...state,magia:{current:70,max:80,baseRate:1}};
 const a=simulateCapacity(hi,instant('diminuir_magia',40),'preserve_current').state;
 const b=simulateCapacity(hi,instant('diminuir_magia',40),'preserve_deficit').state;
 assert.deepEqual([a.magia.current,a.magia.max],[40,40]);
 assert.deepEqual([b.magia.current,b.magia.max],[30,40]);
});
test('Aumentar Magia não implica restauração do MP atual por padrão',()=>{
 const x=simulateCapacity(state,instant('aumentar_magia',20),'preserve_current').state;
 assert.equal(x.magia.max,100);assert.equal(x.magia.current,30);
});
test('Diminuição maior que o máximo não cria capacidade negativa',()=>{
 const x=simulateCapacity(state,instant('diminuir_magia',300),'preserve_current').state;
 assert.deepEqual([x.magia.max,x.magia.current],[0,0]);
});
test('Regenerar Saúde soma somente ao longo dos ticks de demonstração',()=>{
 const o=simulateRegeneration(state,[instant('regenerar_saude',3)],3);
 assert.equal(o.effectiveRate.saude,5);
 assert.deepEqual(o.snapshots.map(x=>x.after.saude.current),[65,70,75]);
 assert.equal(o.state.saude.max,100);
});
test('Regeneração respeita o teto do recurso',()=>{
 const near={...state,saude:{current:98,max:100,baseRate:2}};
 const o=simulateRegeneration(near,[instant('regenerar_saude',8)],4);
 assert.deepEqual(o.snapshots.map(x=>x.after.saude.current),[100,100,100,100]);
});
test('Diminuir Regeneração de Magia altera taxa, não MP atual ou máximo',()=>{
 const o=simulateRegeneration(state,[instant('diminuir_regeneracao_magia',4)],3);
 assert.equal(o.deltaRate.magia,-4);assert.equal(o.effectiveRate.magia,0);
 assert.equal(o.state.magia.current,30);assert.equal(o.state.magia.max,80);
});
test('Regenerar Magia e Diminuir Regeneração coexistem sem virar dano',()=>{
 const o=simulateRegeneration(state,[instant('regenerar_magia',4),instant('diminuir_regeneracao_magia',2)],2);
 assert.equal(o.effectiveRate.magia,3);assert.equal(o.state.magia.current,36);assert.equal(o.state.saude.current,64);
});
test('Sem ticks nenhum recurso muda, mas taxa hipotética está identificada',()=>{
 const o=simulateRegeneration(state,[instant('regenerar_magia',9)],0);
 assert.equal(o.snapshots.length,0);assert.deepEqual(o.state,state);assert.equal(o.effectiveRate.magia,10);
});
test('Não aceita magnitudes negativas, NaN ou tick fracionário',()=>{
 assert.throws(()=>simulateImmediate(state,[instant('dano_saude',-1)]),/não negativo/);
 assert.throws(()=>simulateCapacity(state,instant('aumentar_saude',NaN)),/não negativo/);
 assert.throws(()=>simulateRegeneration(state,[],1.5),/Ticks/);
});
test('Estados inválidos são rejeitados em vez de criados silenciosamente',()=>{
 assert.throws(()=>simulateImmediate({saude:{current:101,max:100,baseRate:2},magia:state.magia},[]),/excede/);
 assert.throws(()=>simulateCapacity({saude:{current:0,max:-1,baseRate:0},magia:state.magia},instant('aumentar_saude',1)),/não negativo/);
});
test('Simuladores não mutam o estado de entrada',()=>{
 const before=JSON.stringify(state);
 simulateImmediate(state,[instant('restaurar_saude',80)]);
 simulateCapacity(state,instant('aumentar_saude',5));
 simulateRegeneration(state,[instant('regenerar_saude',2)],4);
 assert.equal(JSON.stringify(state),before);
});
test('Não inventa Stamina ou outros recursos fora de Saúde e Magia',()=>{
 const o=simulateImmediate(state,[instant('dano_magia',5)]);
 assert.deepEqual(Object.keys(o.state).sort(),['magia','saude']);
});
test('Não aceita efeitos estranhos ou nomes de itens como operadores',()=>{
 assert.throws(()=>simulateImmediate(state,[instant('voar',2)]),/não imediato/);
 assert.throws(()=>simulateRegeneration(state,[instant('restaurar_magia',10)],1),/[Nn]ão é efeito de taxa/);
});
test('Compatibilidade legada exige migração explícita: Regenerate era imediato no clássico',()=>{
 const code=readFileSync(fileURLToPath(new URL('../game.js',import.meta.url)),'utf8');
 assert.match(code,/x==='Regenerate Health'/);
 assert.match(code,/x==='Regenerate Magicka'/);
 assert.match(code,/S\.hp=Math\.min\(maxhp\(\),S\.hp\+/);
 assert.match(code,/S\.mp=Math\.min\(maxmp\(\),S\.mp\+/);
});

test('Restaurar PV a partir de zero aguarda regra de revivificação',()=>{
 const defeated={...state,saude:{current:0,max:100,baseRate:2}};
 assert.throws(()=>simulateImmediate(defeated,[instant('restaurar_saude',10)]),/recurso|revivificação/);
 assert.equal(simulateImmediate(defeated,[instant('dano_saude',10)]).state.saude.current,0);
});
test('Saldo simultâneo não pode ressuscitar por acidente',()=>{
 const defeated={...state,saude:{current:0,max:100,baseRate:0}};
 assert.throws(()=>simulateImmediate(defeated,[instant('restaurar_saude',10)],'net_by_resource'),/revivificação/);
});
test('Política de capacidade que concede PV desde zero exige autorização',()=>{
 const defeated={...state,saude:{current:0,max:100,baseRate:0}};
 assert.equal(simulateCapacity(defeated,instant('aumentar_saude',30),'preserve_current').state.saude.current,0);
 assert.throws(()=>simulateCapacity(defeated,instant('aumentar_saude',30),'preserve_deficit'),/revivificação/);
});
test('Regenerar Saúde desde PV zero não é ressurreição implícita',()=>{
 const defeated={...state,saude:{current:0,max:100,baseRate:2}};
 assert.throws(()=>simulateRegeneration(defeated,[instant('regenerar_saude',3)],1),/revivificação/);
});
