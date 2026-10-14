/**
 * M1d -- shared, Phaser-independent, transaction-based RPG state adapter.
 * CLASSIC_KEY IS READ ONLY. Staged saves live in a separate key until release QA.
 * All mutations return new immutable snapshots and commit through a single gate.
 */
import {BATTLE_MONSTERS,encounterKey} from './combat.js';
export const CLASSIC_KEY='peren_carcaca_save_v1';
export const PHASER_KEY='peren_phaser_save_m1d_v1';
export const PHASER_SCHEMA=2;
const MAX_GOLD=1e10, MAX_COUNT=1000000;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const integer=(value,a=0,b=MAX_COUNT)=>Number.isSafeInteger(value)?clamp(value,a,b):a;
const jsonCopy=v=>JSON.parse(JSON.stringify(v));
const safeRecord=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
export const skillLevel=points=>Math.min(100,1+Math.floor(Math.sqrt(Math.max(0,Number(points)||0)*4)));
export function buildCatalogs(data){
 const cat={...data};
 for(const key of ['itens','receitas','magias','monstros','cidades']){
  if(!Array.isArray(data[key])||!data[key].length)throw Error('Catálogo ausente: '+key);
  cat[key+'ById']=Object.fromEntries(data[key].map(x=>[x.id,x]));
 }
 for(const monster of Object.keys(BATTLE_MONSTERS))if(!cat.monstrosById[monster])throw Error('Monstro inexistente: '+monster);
 for(const [id,enemy] of Object.entries(BATTLE_MONSTERS)){
  const raw=cat.monstrosById[id];
  for(const [local,remote] of [['hp','hp'],['attack','ataque'],['defense','defesa'],['xp','xp'],['gold','ouro']])
   if(enemy[local]!==raw[remote])throw Error(`Atributo do monstro ${id} divergente (${local})`);
  if(!cat.itensById[enemy.drop])throw Error('Drop não encontrado: '+enemy.drop);
 }
 return cat;
}
export function newClassicState(){
 return {version:1,city:'portomonte',day:1,actions:3,level:1,exp:0,gold:180,hp:114,mp:68,fatigue:0,reputation:0,
  skills:{alquimia:20,forja:10,encantamento:0,curtume:0,escrita:6,joalheria:0,cozinha:12,combate:14,arcanismo:18,comercio:9,coleta:12},lastLevels:{},
  bag:{'ger-pocao-restauradora':3,'ger-pocao-de-foco':2,'ger-racoes-de-viagem':4,'ing-blue-mountain-flower':2,'ing-mudcrab-chitin':2,'ing-red-mountain-flower':2,'mat-agua-purificada':4,'mat-ferro-bruto':3,'mat-carvao-de-forja':2,'mat-couro-curtido':2,'mat-cristal-de-alma-menor':1,'mat-tinta-runica':1},
  equip:{weapon:'eq-adaga-de-ferrugem',armor:'eq-peitoral-de-ferrugem',relic:null},learned:['mag-raio-de-fogo','mag-armadura-arcana','mag-raio-de-gelo','mag-misseis-magicos'],
  completed:[],currentQuest:null,contractCount:0,battle:null,journal:['Dia 1 · Peren chega a Portomonte.'],achievements:[],flags:{},kills:0,sales:0,crafted:0};
}
export function normalizeClassic(raw,catalog){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==1)throw Error('Save clássico incompatível (esperado version: 1).');
 if(!catalog.cidadesById[raw.city])throw Error('Cidade do save não existe no catálogo.');
 const original=jsonCopy(raw),base=newClassicState();
 const n={...base,...original};
 n.version=1;n.battle=null; // A classic battle cannot be safely resumed in the Phaser renderer.
 n.level=integer(n.level,1,200);n.exp=integer(n.exp,0,MAX_GOLD);n.gold=integer(n.gold,0,MAX_GOLD);
 n.hp=integer(n.hp,0,100000);n.mp=integer(n.mp,0,100000);n.day=integer(n.day,1,100000);
 n.actions=integer(n.actions,0,3);n.fatigue=integer(n.fatigue,0,100);n.kills=integer(n.kills,0,MAX_COUNT);
 n.sales=integer(n.sales,0,MAX_COUNT);n.crafted=integer(n.crafted,0,MAX_COUNT);
 n.skills={...base.skills};for(const [key,value] of Object.entries(safeRecord(raw.skills)))if(key in n.skills)n.skills[key]=Number.isFinite(value)?clamp(value,0,500000):n.skills[key];
 n.lastLevels=safeRecord(n.lastLevels);
 n.bag={};for(const [id,count] of Object.entries(safeRecord(raw.bag)))if(catalog.itensById[id]&&Number.isSafeInteger(count)&&count>0&&count<=MAX_COUNT)n.bag[id]=count;
 n.learned=[...new Set((Array.isArray(raw.learned)?raw.learned:base.learned).filter(id=>catalog.magiasById[id]))];
 n.equip={...base.equip,...safeRecord(raw.equip)};
 for(const key of ['weapon','armor','relic'])if(n.equip[key]&&!catalog.itensById[n.equip[key]])n.equip[key]=null;
 n.journal=Array.isArray(n.journal)?n.journal.slice(0,90).map(x=>String(x).slice(0,250)):[];
 n.flags=safeRecord(n.flags);n.completed=Array.isArray(n.completed)?n.completed:[];
 n.achievements=Array.isArray(n.achievements)?n.achievements:[];
 return n;
}
export function maxClassicHp(s,c){const relic=c.itensById[s.equip?.relic];return 100+s.level*14+Math.floor(skillLevel(s.skills?.combate)*.8)+((relic?.nome||'').toUpperCase().includes('SAÚDE')?15:0)}
export function maxClassicMp(s){return 58+s.level*10+Math.floor(skillLevel(s.skills?.arcanismo)*.5)}
export function weaponStats(s,c){const w=c.itensById[s.equip?.weapon],a=c.itensById[s.equip?.armor],r=c.itensById[s.equip?.relic];return {
 attack:10+s.level*2+Math.floor(skillLevel(s.skills?.combate)*.3)+(w?.ataque||0)+((r?.nivel||0)*2),
 defense:3+Math.floor(s.level/2)+(a?.defesa||0)+(r?.nivel||0)+((r?.nome||'').toUpperCase().includes('PROTEÇÃO')?3:0)
}}
function newEnvelope(raw,c,origin='new'){
 return {schema:PHASER_SCHEMA,revision:0,origin,character:normalizeClassic(raw,c),ledger:{},worlds:{activeSeed:'murin-001'},history:[]};
}
export function stageFromClassic(raw,c){return newEnvelope(raw,c,'classic-import');}
function checkEnvelope(raw,c){
 if(!raw||raw.schema!==PHASER_SCHEMA||!Number.isSafeInteger(raw.revision)||raw.revision<0)throw Error('Arquivo Phaser incompatível.');
 if(!raw.ledger||typeof raw.ledger!=='object'||Array.isArray(raw.ledger))throw Error('Registro de transações inválido.');
 const world=safeRecord(raw.worlds),out={schema:PHASER_SCHEMA,revision:raw.revision,origin:raw.origin||'import',character:normalizeClassic(raw.character,c),ledger:{...raw.ledger},worlds:{...world},history:Array.isArray(raw.history)?raw.history.slice(-80):[]};
 return out;
}
export function toCombatProfile(env,c){const s=env.character,stats=weaponStats(s,c),claims={};
 for(const [key,row] of Object.entries(env.ledger))if(key.startsWith('battle:'))claims[key.slice(7)]=row;
 return {version:1,level:s.level,xp:s.exp,gold:s.gold,hp:Math.min(maxClassicHp(s,c),s.hp),mp:Math.min(maxClassicMp(s),s.mp),
  playerMaxHp:maxClassicHp(s,c),playerMaxMp:maxClassicMp(s),attack:stats.attack,defense:stats.defense,
  potions:s.bag['ger-pocao-restauradora']||0,kills:s.kills,bag:{...s.bag},claims,learned:[...s.learned],encounters:0};
}
export function recoveredIds(env,seed,kind){const prefix=`${kind}:${encodeURIComponent(String(seed))}::`;return Object.keys(env.ledger).filter(k=>k.startsWith(prefix)).map(k=>decodeURIComponent(k.slice(prefix.length)));}
export function inventoryTotal(s){return Object.values(s.bag).reduce((n,c)=>n+c,0)}
function record(s,text){s.journal=[`Dia ${s.day} · ${text}`,...(s.journal||[])].slice(0,90)}
function add(s,id,amount,c){if(!c.itensById[id]||!Number.isSafeInteger(amount)||amount===0)throw Error('Item inválido.');
 const v=(s.bag[id]||0)+amount;if(v<0||v>MAX_COUNT)throw Error('Quantidade indisponível.');
 if(v===0)delete s.bag[id];else s.bag[id]=v;
}
function levelUp(s,c,experience){
 s.exp+=experience;s.skills.combate+=Math.ceil(experience/2);let levels=0;
 while(s.level<200&&s.exp>=s.level*62&&levels<200){s.exp-=s.level*62;s.level++;levels++;
  s.hp=Math.min(maxClassicHp(s,c),s.hp+23);s.mp=Math.min(maxClassicMp(s),s.mp+15);
 }return levels;
}
export function purchasePrice(s,item,city){let k=1.15+(city.perigo*.04);
 if(item.zona===city.id)k*=.78;if(item.nivel>city.perigo)k*=1.5;
 return Math.max(1,Math.ceil(item.valor*k*(1-Math.min(.18,skillLevel(s.skills.comercio)/800))))}
export function salePrice(s,item,city){return Math.max(1,Math.floor(item.valor*(item.zona===city.id?.48:.72)*(1+Math.min(.35,skillLevel(s.skills.comercio)/260))))}
export function craftable(s,recipe,c){const city=c.cidadesById[s.city];return Boolean(recipe&&city?.estacoes?.includes(recipe.estacao)&&skillLevel(s.skills[recipe.pericia])>=recipe.nivel&&recipe.ingredientes.every(x=>(s.bag[x.item]||0)>=x.quantidade));}
const ledgerKey=(category,seed,id)=>`${category}:${encounterKey(seed,id)}`;
/** Returns {next,result,applied}; does not mutate the previous envelope. */
export function applyTransaction(env,command,c){
 const old=checkEnvelope(env,c),s=old.character;
 const type=command?.type;
 let key=null;
 if(type==='collect')key=ledgerKey('collect',command.seed,command.nodeId);
 if(type==='victory')key='battle:'+String(command.battle?.key||'');
 if(key&&old.ledger[key])return {next:env,result:old.ledger[key],applied:false};
 const next=jsonCopy(old),char=next.character;let result={type};
 if(type==='collect'){
  const w=command.world,node=w?.nodes?.find(n=>n.id===command.nodeId);
  if(!node||String(w.seed)!==String(command.seed)||!Number.isInteger(node.count))throw Error('Coleta não corresponde ao mapa.');
  add(char,node.itemId,node.count,c);char.skills.coleta+=node.count*2;
  char.fatigue=Math.min(100,char.fatigue+1);
  result={type,item:node.itemId,quantity:node.count};
  record(char,`Coletou ${node.count}× ${c.itensById[node.itemId].nome}.`);
 }else if(type==='victory'){
  const b=command.battle,mon=c.monstrosById[b?.enemyId];
  if(b?.status!=='won'||!b.key||!mon||!BATTLE_MONSTERS[b.enemyId])throw Error('Vitória inválida.');
  if(!/^.+::.+$/.test(b.key))throw Error('Chave do combate inválida.');
  const reward=BATTLE_MONSTERS[b.enemyId];
  // XP and loot from same canonical monster; never from UI-supplied values.
  char.hp=integer(b.playerHp,0,maxClassicHp(char,c));char.mp=integer(b.playerMp,0,maxClassicMp(char));
  const consumed=integer(b.potions,0,MAX_COUNT),before=char.bag['ger-pocao-restauradora']||0;
  if(consumed>before)throw Error('Poções do combate divergentes.');
  if(consumed===0)delete char.bag['ger-pocao-restauradora'];else char.bag['ger-pocao-restauradora']=consumed;
  add(char,reward.drop,1,c);char.gold+=mon.ouro;char.kills++;
  const levels=levelUp(char,c,mon.xp);char.skills.arcanismo+=4;
  result={type,monster:b.enemyId,gold:mon.ouro,xp:mon.xp,items:{[reward.drop]:1},levels,key:b.key};
  record(char,`Venceu ${mon.nome}: +${mon.ouro} moedas, +${mon.xp} XP.`);
 }else if(type==='escape'){
  const b=command.battle;if(!['fled','lost'].includes(b?.status))throw Error('Retirada inválida.');
  char.hp=b.status==='lost'?Math.max(24,Math.floor(maxClassicHp(char,c)*.5)):integer(b.playerHp,1,maxClassicHp(char,c));
  char.mp=b.status==='lost'?Math.max(12,Math.floor(maxClassicMp(char)*.5)):integer(b.playerMp,0,maxClassicMp(char));
  const remaining=integer(b.potions,0,MAX_COUNT),had=char.bag['ger-pocao-restauradora']||0;
  if(remaining>had)throw Error('Poções divergentes.');
  if(remaining===0)delete char.bag['ger-pocao-restauradora'];else char.bag['ger-pocao-restauradora']=remaining;
  result={type,status:b.status};record(char,b.status==='fled'?'Escapou de uma batalha.':'Foi resgatado após uma derrota.');
 }else if(type==='craft'){
  const rec=c.receitasById[command.id];if(!craftable(char,rec,c))throw Error('Faltam materiais, oficina ou proficiência.');
  if(char.actions<=0)throw Error('Sem ações; termine o dia primeiro.');
  for(const ing of rec.ingredientes)add(char,ing.item,-ing.quantidade,c);
  add(char,rec.resultado,rec.quantidade,c);char.actions--;char.fatigue=Math.min(100,char.fatigue+3);
  char.crafted++;char.skills[rec.pericia]+=7+rec.nivel/3;
  result={type,item:rec.resultado,quantity:rec.quantidade,recipe:rec.id};
  record(char,`Fabricou ${rec.quantidade}× ${c.itensById[rec.resultado].nome}.`);
 }else if(type==='buy'||type==='sell'){
  const item=c.itensById[command.id],city=c.cidadesById[char.city];if(!item)throw Error('Item desconhecido.');
  if(type==='buy'){
   const gold=purchasePrice(char,item,city);if(char.gold<gold)throw Error('Ouro insuficiente.');
   char.gold-=gold;add(char,item.id,1,c);char.skills.comercio+=2+Math.ceil(gold/100);
   result={type,item:item.id,gold,quantity:1};record(char,`Comprou ${item.nome} por ${gold} moedas.`);
  }else{
   if([char.equip?.weapon,char.equip?.armor,char.equip?.relic].includes(item.id))throw Error('Não é permitido vender um item equipado.');
   const gold=salePrice(char,item,city);add(char,item.id,-1,c);
   char.gold+=gold;char.sales++;char.skills.comercio+=4+Math.ceil(gold/70);
   result={type,item:item.id,gold,quantity:1};record(char,`Vendeu ${item.nome} por ${gold} moedas.`);
  }
 }else if(type==='selectSeed'){
  const seed=String(command.seed||'');if(!/^[a-zA-Z0-9_-]{3,60}$/.test(seed))throw Error('Seed inválida.');
  next.worlds.activeSeed=seed;result={type,seed};
 }else if(type==='endDay'){
  char.day++;char.actions=3;char.fatigue=Math.max(0,char.fatigue-26);
  char.hp=Math.min(maxClassicHp(char,c),char.hp+Math.floor(maxClassicHp(char,c)*.32));
  char.mp=Math.min(maxClassicMp(char),char.mp+Math.floor(maxClassicMp(char)*.38));
  result={type,day:char.day};record(char,'Um novo dia amanhece em Portomonte.');
 }else throw Error('Transação desconhecida: '+type);
 if(key)next.ledger[key]=result;
 next.revision++;next.history=[...(next.history||[]),{rev:next.revision,type,description:result.type==='victory'?result.monster:result.item||''}].slice(-80);
 return {next,result,applied:true};
}
/** Storage adapter. Commit verifies latest revision and atomically writes first. */
export function createProgressBridge(storage,c){
 let env;const staged=storage.getItem(PHASER_KEY);
 if(staged){env=checkEnvelope(JSON.parse(staged),c)}
 else{
  const classic=storage.getItem(CLASSIC_KEY);
  env=classic?stageFromClassic(JSON.parse(classic),c):newEnvelope(newClassicState(),c,'new-game');
 }
 const read=()=>jsonCopy(env);
 const sync=()=>{const latest=storage.getItem(PHASER_KEY);
  if(latest){const other=JSON.parse(latest);if(other.revision!==env.revision)throw Error('Progresso mudou em outra aba. Recarregue antes de salvar.');}
  else if(env.revision!==0)throw Error('Save Phaser foi removido por outra aba.');};
 function execute(command){sync();const tx=applyTransaction(env,command,c);if(!tx.applied)return tx;
  storage.setItem(PHASER_KEY,JSON.stringify(tx.next));env=tx.next;return tx;}
 return {
  read,get state(){return env.character},get source(){return env.origin},combatProfile:()=>toCombatProfile(env,c),
  committed:key=>Boolean(env.ledger[key]),collectedIds:seed=>recoveredIds(env,seed,'collect'),
  execute,export:()=>JSON.stringify(env,null,2),
  restore:text=>{const validated=checkEnvelope(JSON.parse(text),c);sync();
   // Treat import as a new revision, so old writes cannot silently overwrite this state.
   validated.revision=env.revision+1;storage.setItem(PHASER_KEY,JSON.stringify(validated));env=validated;return read();},
  finishBattle:b=>execute({type:b.status==='won'?'victory':'escape',battle:b})
 };
}
