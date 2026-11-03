/**
 * M1h-F.13 — Read-only contextual consequences of actual combat.js actions.
 * No RNG roll, save writes, estimated victory chance, or future-hit prediction.
 */
import {SPELLS} from './combat.js';

const effects=Object.freeze({
 attack:{title:'ATAQUE FÍSICO',note:'Causa dano físico variável. Se a criatura resistir, poderá contra-atacar.'},
 defend:{title:'POSTURA DEFENSIVA',note:'Recupera até 4 PM. Reduz aproximadamente 52% do próximo ataque desta rodada; o inimigo ainda pode reagir.'},
 potion:{title:'POÇÃO RESTAURADORA',note:'Consome 1 poção, recupera até 36 PV. A criatura pode contra-atacar nesta rodada.'},
 flee:{title:'RETIRADA',note:'Encerra o encontro imediatamente, sem XP ou saque. A ameaça continua na floresta.'},
 'mag-raio-de-fogo':{title:'RAIO DE FOGO',note:'Inflige dano mágico e aplica queimadura: 3 PV nesta rodada e até 3 PV na próxima, se a criatura sobreviver. Pode haver contra-ataque.'},
 'mag-raio-de-gelo':{title:'RAIO DE GELO',note:'Inflige dano mágico e impede a reação do inimigo nesta rodada, se ele sobreviver.'},
 'mag-misseis-magicos':{title:'MÍSSEIS MÁGICOS',note:'Inflige dano arcano sem efeito adicional. Se a criatura sobreviver, poderá contra-atacar.'}
});
export function commandConsequences(action,state,learned){
 const key=String(action||'');
 const spell=key.startsWith('spell:')?SPELLS.find(x=>x.id===key.slice(6)):null;
 const rule=effects[spell?.id||key];
 if(!rule)return {status:'unknown',title:'AÇÃO DESCONHECIDA',text:'Esta ação não está disponível.'};
 const active=state?.status==='active';
 const mana=Number.isFinite(state?.mp)?state.mp:0;
 const potions=Number.isFinite(state?.potions)?state.potions:0;
 const hp=Number.isFinite(state?.hp)?state.hp:0;
 const maxHp=Number.isFinite(state?.maxHp)?state.maxHp:hp;
 const readable=spell?`${rule.title} · ${spell.mana} PM. ${rule.note}`:rule.title+' · '+rule.note;
 let reason='';
 if(!active)reason='Inicie um combate para usar este comando.';
 else if(state.busy)reason='Aguarde a conclusão da ação atual.';
 else if(spell&&Array.isArray(learned)&&!learned.includes(spell.id))reason='Magia ainda não aprendida.';
 else if(spell&&mana<spell.mana)reason=`Mana insuficiente: precisa de ${spell.mana} PM, tem ${mana}.`;
 else if(key==='potion'&&potions<1)reason='Sem poções restantes.';
 let detail=readable;
 if(key==='defend'&&active)detail+=` PM atuais: ${mana}.`;
 if(key==='potion'&&active)detail+=` Vida recuperável: até ${Math.max(0,Math.min(36,maxHp-hp))} PV · ${potions} poção(ões).`;
 return {status:reason?'unavailable':'ready',title:rule.title,text:reason?`${rule.title} · INDISPONÍVEL: ${reason} ${rule.note}`:detail};
}
