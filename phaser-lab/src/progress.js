/**
 * M1d -- shared, Phaser-independent, transaction-based RPG state adapter.
 * Nenhum save clássico é lido ou migrado. Saves Phaser usam chave própria.
 * All mutations return new immutable snapshots and commit through a single gate.
 */
import {BATTLE_MONSTERS,encounterKey} from './combat.js';
import {resolveAlchemyPair,nextStudyEffect,discoverShared,effectFamily} from './alchemy.js';
import {reconcileBattlePreparations,applyExplorationPreparation} from './prepared-use.js';
import {REGION_BY_ID} from './regions.js';
import {EPOCH_EC,newWorldClock,normalizeWorldClock,advanceWorldClock,erisianDate,WORLD_HISTORY,initialWorldFlags,clockPosition,daysInEC} from './carcaca-time.js';
import {newSurvival,normalizeSurvival,advanceSurvival,eatMeal,canAct,survivalSummary} from './survival.js';
// The GitHub Pages M1h-F playtest runs in the same origin as the classic game.
// Use a private staging key and disable classic-save import for that BUILD only.
// import.meta.env is provided by Vite; Node tests use the stable defaults.
export const M1HF_PREVIEW=import.meta.env?.VITE_PEREN_M1HF_PREVIEW!=='0';
export const CLASSIC_KEY='peren_carcaca_save_v1';
// Pré-alfa: esta feature usa chave nova, sem migrar, sobrescrever ou apagar saves anteriores.
export const PHASER_KEY=M1HF_PREVIEW?'peren_phaser_save_m1hf_worlds_prealpha_v2':'peren_phaser_save_worlds_prealpha_v2';
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
 if(data.curadoria_ingredientes?.itens)cat.curadoria_ingredientes=data.curadoria_ingredientes;
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
 return {version:1,city:'portomonte',day:1,actions:3,level:1,exp:0,gold:180,hp:114,mp:68,fatigue:0,reputation:0,survival:newSurvival(),
  skills:{alquimia:20,forja:10,encantamento:0,curtume:0,escrita:6,joalheria:0,cozinha:12,combate:14,arcanismo:18,comercio:9,coleta:12},lastLevels:{},
  bag:{'ger-pocao-restauradora':3,'ger-pocao-de-foco':2,'ger-racoes-de-viagem':4,'ing-blue-mountain-flower':2,'ing-mudcrab-chitin':2,'ing-red-mountain-flower':2,'ing-butterfly-wing':2,'ing-white-cap':2,'mat-agua-purificada':4,'mat-ferro-bruto':3,'mat-carvao-de-forja':2,'mat-couro-curtido':2,'mat-cristal-de-alma-menor':1,'mat-tinta-runica':1},
  equip:{weapon:'eq-adaga-de-ferrugem',armor:'eq-peitoral-de-ferrugem',relic:null},learned:['mag-raio-de-fogo','mag-armadura-arcana','mag-raio-de-gelo','mag-misseis-magicos'],
  alchemy:{known:{},preparations:[],failed:0},
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
 // Legacy 'actions' remains only for decoding old saves; no daily cap exists.
 n.actions=integer(n.actions,0,3);n.fatigue=integer(n.fatigue,0,100);
 n.survival=normalizeSurvival(raw.survival,n.fatigue);n.kills=integer(n.kills,0,MAX_COUNT);
 n.sales=integer(n.sales,0,MAX_COUNT);n.crafted=integer(n.crafted,0,MAX_COUNT);
 n.skills={...base.skills};for(const [key,value] of Object.entries(safeRecord(raw.skills)))if(key in n.skills)n.skills[key]=Number.isFinite(value)?clamp(value,0,500000):n.skills[key];
 n.lastLevels=safeRecord(n.lastLevels);
 n.bag={};for(const [id,count] of Object.entries(safeRecord(raw.bag)))if(catalog.itensById[id]&&Number.isSafeInteger(count)&&count>0&&count<=MAX_COUNT)n.bag[id]=count;
 n.learned=[...new Set((Array.isArray(raw.learned)?raw.learned:base.learned).filter(id=>catalog.magiasById[id]))];
 n.equip={...base.equip,...safeRecord(raw.equip)};
 for(const key of ['weapon','armor','relic'])if(n.equip[key]&&!catalog.itensById[n.equip[key]])n.equip[key]=null;
 n.journal=Array.isArray(n.journal)?n.journal.slice(0,90).map(x=>String(x).slice(0,250)):[];
 n.flags=safeRecord(n.flags);n.completed=Array.isArray(n.completed)?n.completed:[];
 // Save Phaser-only: discoverable knowledge remains private to the character.
 // The curator's ingredient definitions are never modified by player actions.
 const rawAlchemy=safeRecord(n.alchemy),rawKnown=safeRecord(rawAlchemy.known);
 const curated=catalog.curadoria_ingredientes?.itens||{};
 const known={};
 for(const [id,arr] of Object.entries(rawKnown)){
  if(!curated[id]||!Array.isArray(arr))continue;
  const accepted=new Set(curated[id].atributos.map(a=>a.id));
  const effects=[...new Set(arr.filter(a=>typeof a==='string'&&accepted.has(a)))].sort();
  if(effects.length)known[id]=effects;
 }
 n.alchemy={known,preparations:Array.isArray(rawAlchemy.preparations)?
  rawAlchemy.preparations.slice(-400).filter(p=>p&&typeof p.id==='string'&&Array.isArray(p.effects)&&Array.isArray(p.ingredients)):[],
  failed:integer(rawAlchemy.failed,0,MAX_COUNT)};
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
 return {schema:PHASER_SCHEMA,revision:0,origin,character:normalizeClassic(raw,c),ledger:{},worlds:{activeSeed:'murin-001',clock:newWorldClock(),historicalFlags:initialWorldFlags(),eventLog:[]},history:[]};
}
export function stageFromClassic(raw,c){return newEnvelope(raw,c,'classic-import');}
/** Validate imported v2 backup in-memory, without writing localStorage. */
export function validatePhaserBackup(text,catalogs){return checkEnvelope(JSON.parse(text),catalogs)}
function checkEnvelope(raw,c){
 if(!raw||raw.schema!==PHASER_SCHEMA||!Number.isSafeInteger(raw.revision)||raw.revision<0)throw Error('Arquivo Phaser incompatível.');
 if(!raw.ledger||typeof raw.ledger!=='object'||Array.isArray(raw.ledger))throw Error('Registro de transações inválido.');
 const world=safeRecord(raw.worlds),out={schema:PHASER_SCHEMA,revision:raw.revision,origin:raw.origin||'import',character:normalizeClassic(raw.character,c),ledger:{...raw.ledger},worlds:{...world},history:Array.isArray(raw.history)?raw.history.slice(-80):[]};
 // Non-destructive migration of pre-calendar Phaser saves: preserve the
 // elapsed legacy day count, never read or modify the classic edition.
 if(!world.clock){
   const daysPassed=Math.max(0,out.character.day-1);
   out.worlds.clock=advanceWorldClock(newWorldClock(),Math.min(daysPassed,100*366)*1440).clock;
 }else out.worlds.clock=normalizeWorldClock(world.clock);
 out.worlds.historicalFlags={...initialWorldFlags(),...safeRecord(world.historicalFlags)};
 out.worlds.eventLog=Array.isArray(world.eventLog)?world.eventLog.filter(e=>typeof e==='string').slice(-40):[];
 for(const event of WORLD_HISTORY)if(out.worlds.clock.year>=event.year){
  for(const flag of event.flags)out.worlds.historicalFlags[flag]=true;
  if(!out.worlds.eventLog.includes(event.id))out.worlds.eventLog.push(event.id);
 }
 out.worlds.eventLog=out.worlds.eventLog.slice(-40);
 return out;
}
export function toCombatProfile(env,c){const s=env.character,stats=weaponStats(s,c),claims={};
 for(const [key,row] of Object.entries(env.ledger))if(key.startsWith('battle:'))claims[key.slice(7)]=row;
 return {version:1,level:s.level,xp:s.exp,gold:s.gold,hp:Math.min(maxClassicHp(s,c),s.hp),mp:Math.min(maxClassicMp(s),s.mp),
  playerMaxHp:maxClassicHp(s,c),playerMaxMp:maxClassicMp(s),attack:stats.attack,defense:stats.defense,
  potions:s.bag['ger-pocao-restauradora']||0,preparations:jsonCopy(s.alchemy.preparations),kills:s.kills,bag:{...s.bag},claims,learned:[...s.learned],encounters:0};
}
export function recoveredIds(env,seed,kind){const prefix=`${kind}:${encodeURIComponent(String(seed))}::`;return Object.keys(env.ledger).filter(k=>k.startsWith(prefix)).map(k=>decodeURIComponent(k.slice(prefix.length)));}
export function inventoryTotal(s){return Object.values(s.bag).reduce((n,c)=>n+c,0)}
function record(s,text){s.journal=[`Dia ${s.day} · ${text}`,...(s.journal||[])].slice(0,90)}
const COST_MINUTES=Object.freeze({collect:12,victory:8,escape:8,usePreparation:2,studyIngredient:90,brewPair:50,craft:90,buy:8,sell:8,selectSeed:0,selectRegion:180,eat:10,sleep:480,passTime:0});
export function actionMinutes(type,command={}){
 if(type==='victory'||type==='escape')return Math.min(240,Math.max(8,(command.battle?.round||1)*2));
 if(type==='buy'||type==='sell')return 8+Math.max(0,(command.quantity||1)-1)*2;
 if(type==='craft')return Math.max(30,90+Math.floor((command.recipeLevel||0)*3));
 if(type==='selectRegion')return 120+(REGION_BY_ID[command.regionId]?.danger||1)*60;
 if(type==='sleep')return (command.hours||8)*60;
 if(type==='passTime')return command.minutes;
 return COST_MINUTES[type]??0;
}
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
/**
 * Price quote for a single atomic batch; reproduces N individual trades,
 * including commerce skill increments, without mutating the input state.
 * No vendor-specific stock is assumed by this game rule.
 */
export function tradeQuote(state,item,city,type,quantity=1){
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>99)throw Error('Quantidade inválida (1 a 99).');
 if(!item||!city||!['buy','sell'].includes(type))throw Error('Negociação inválida.');
 if(type==='sell'&&[state.equip?.weapon,state.equip?.armor,state.equip?.relic].includes(item.id))throw Error('Não é permitido vender um item equipado.');
 let gold=state.gold,owned=state.bag[item.id]||0,points=state.skills.comercio,total=0;
 for(let i=0;i<quantity;i++){
  const simulated={...state,skills:{...state.skills,comercio:points}};
  const price=type==='buy'?purchasePrice(simulated,item,city):salePrice(simulated,item,city);
  if(type==='buy'){
   if(gold<price)throw Error('Ouro insuficiente.');
   gold-=price;owned++;points+=2+Math.ceil(price/100);
  }else{
   if(owned<1)throw Error('Quantidade indisponível.');
   owned--;gold+=price;points+=4+Math.ceil(price/70);
  }
  if(gold>MAX_GOLD||owned>MAX_COUNT)throw Error('Limite de inventário ou ouro excedido.');
  total+=price;
 }
 return {type,item:item.id,quantity,gold:total,commercePoints:points};
}
export function craftable(s,recipe,c){const city=c.cidadesById[s.city];return Boolean(recipe&&city?.estacoes?.includes(recipe.estacao)&&skillLevel(s.skills[recipe.pericia])>=recipe.nivel&&recipe.ingredientes.every(x=>(s.bag[x.item]||0)>=x.quantidade));}
const ledgerKey=(category,seed,id)=>`${category}:${encounterKey(seed,id)}`;
/** Returns {next,result,applied}; does not mutate the previous envelope. */
export function applyTransaction(env,command,c){
 const old=checkEnvelope(env,c),s=old.character;
 const type=command?.type;
 let key=null;
 if(type==='collect')key=ledgerKey('collect',command.seed,command.nodeId);
 if(type==='usePreparation'){
  if(typeof command.id!=='string'||!/^preparo-[a-zA-Z0-9_-]{1,70}$/.test(command.id))
   throw Error('Identidade de preparado inválida.');
  key='prepared-use:'+command.id;
 }
 if(type==='victory'||type==='escape')key=command.battle?.key?'battle:'+String(command.battle.key):null;
 if(key&&old.ledger[key])return {next:env,result:old.ledger[key],applied:false};
 const next=jsonCopy(old),char=next.character;let result={type};
 if(!canAct(char.survival))throw Error('Peren morreu. Nenhuma ação é permitida sem uma mecânica de ressurreição.');
 if(type==='collect'){
  const w=command.world,node=w?.nodes?.find(n=>n.id===command.nodeId);
  if(!node||String(w.seed)!==String(command.seed)||!Number.isInteger(node.count))throw Error('Coleta não corresponde ao mapa.');
  add(char,node.itemId,node.count,c);char.skills.coleta+=node.count*2;
  result={type,item:node.itemId,quantity:node.count};
  record(char,`Coletou ${node.count}× ${c.itensById[node.itemId].nome}.`);
 }else if(type==='victory'){
  const b=command.battle,mon=c.monstrosById[b?.enemyId];
  if(b?.status!=='won'||!b.key||!mon||!BATTLE_MONSTERS[b.enemyId])throw Error('Vitória inválida.');
  if(!/^.+::.+$/.test(b.key))throw Error('Chave do combate inválida.');
  const reward=BATTLE_MONSTERS[b.enemyId];
  // XP and loot from same canonical monster; never from UI-supplied values.
  char.hp=integer(b.playerHp,0,maxClassicHp(char,c));char.mp=integer(b.playerMp,0,maxClassicMp(char));
  char.alchemy.preparations=reconcileBattlePreparations(char.alchemy.preparations,b.preparations||[]);
  const consumed=integer(b.potions,0,MAX_COUNT),before=char.bag['ger-pocao-restauradora']||0;
  if(consumed>before)throw Error('Poções do combate divergentes.');
  if(consumed===0)delete char.bag['ger-pocao-restauradora'];else char.bag['ger-pocao-restauradora']=consumed;
  add(char,reward.drop,1,c);char.gold+=mon.ouro;char.kills++;
  const levels=levelUp(char,c,mon.xp);char.skills.arcanismo+=4;
  result={type,monster:b.enemyId,gold:mon.ouro,xp:mon.xp,items:{[reward.drop]:1},levels,key:b.key};
  record(char,`Venceu ${mon.nome}: +${mon.ouro} moedas, +${mon.xp} XP.`);
 }else if(type==='escape'){
  const b=command.battle;if(!['fled','lost'].includes(b?.status))throw Error('Retirada inválida.');
  char.alchemy.preparations=reconcileBattlePreparations(char.alchemy.preparations,b.preparations||[]);
  char.hp=b.status==='lost'?Math.max(24,Math.floor(maxClassicHp(char,c)*.5)):integer(b.playerHp,1,maxClassicHp(char,c));
  char.mp=b.status==='lost'?Math.max(12,Math.floor(maxClassicMp(char)*.5)):integer(b.playerMp,0,maxClassicMp(char));
  const remaining=integer(b.potions,0,MAX_COUNT),had=char.bag['ger-pocao-restauradora']||0;
  if(remaining>had)throw Error('Poções divergentes.');
  if(remaining===0)delete char.bag['ger-pocao-restauradora'];else char.bag['ger-pocao-restauradora']=remaining;
  result={type,status:b.status,key:b.key||null};record(char,b.status==='fled'?'Escapou de uma batalha.':'Foi resgatado após uma derrota.');
 }else if(type==='usePreparation'){
  if(command.context!=='exploration')throw Error('Uso fora de combate exige contexto de exploração.');
  const evaluated=applyExplorationPreparation(char,command.id,maxClassicHp(char,c),maxClassicMp(char));
  if(evaluated.error)throw Error(evaluated.error);
  // A transação inteira (frascos, PV, PM, recibo) é gravada em uma revisão.
  char.hp=evaluated.character.hp;char.mp=evaluated.character.mp;
  char.alchemy=evaluated.character.alchemy;
  result={type,id:command.id,quantityConsumed:1,cost:{dailyActions:0},message:evaluated.publicMessage};
  record(char,evaluated.publicMessage);
 }else if(type==='studyIngredient'){
  if(!c.curadoria_ingredientes||!c.cidadesById[char.city]?.estacoes?.includes('alquimia'))
   throw Error('Estudo alquímico exige uma bancada e a curadoria canônica.');
  const id=String(command.id||'');
  if((char.bag[id]||0)<1)throw Error('Ingrediente não está na mochila.');
  const effect=nextStudyEffect(c.curadoria_ingredientes,char.alchemy.known,id);
  if(!effect)throw Error('Todos os efeitos desse ingrediente já foram estudados.');
  char.alchemy.known={...char.alchemy.known,
    [id]:[...new Set([...(char.alchemy.known[id]||[]),effect.id])].sort()};
  char.skills.alquimia+=2;
  result={type,ingredient:id,effect:{id:effect.id,nome:effect.nome},cost:{dailyActions:0,items:0}};
  record(char,`Estudou ${c.curadoria_ingredientes.itens[id].nome} e descobriu ${effect.nome}.`);
 }else if(type==='brewPair'){
  if(!c.curadoria_ingredientes||!c.cidadesById[char.city]?.estacoes?.includes('alquimia'))
   throw Error('A mistura exige uma bancada alquímica e a curadoria canônica.');
  const mix=resolveAlchemyPair(c.curadoria_ingredientes,command.ingredients);
  for(const id of mix.ingredientIds)if((char.bag[id]||0)<1)throw Error('Ingredientes insuficientes.');
  // Experimentar é permitido sem estudar. O resultado vem exclusivamente
  // dos atributos canônicos, nunca de efeitos sugeridos pelo cliente/UI.
  for(const id of mix.ingredientIds)add(char,id,-1,c);
  // Consumir ingredientes e tempo, nunca ações diárias.
  char.skills.alquimia+=mix.valid?7:1;
  if(mix.valid){
    char.alchemy.known=discoverShared(char.alchemy.known,mix.ingredientIds,mix.effects);
    const focus=typeof command.focusEffect==='string'?mix.effects.find(e=>e.id===command.focusEffect):null;
    const family=focus?.familia||mix.effects[0].familia;
    const prep={id:'preparo-'+String(next.revision+1),family,
      ingredients:mix.ingredientIds,effects:mix.effects,createdDay:char.day};
    char.alchemy.preparations=[...char.alchemy.preparations,prep].slice(-400);
    char.crafted++;
    result={type,valid:true,preparation:prep,cost:{dailyActions:0,items:2}};
    record(char,`Preparou uma mistura de ${mix.effects.map(e=>e.nome).join(', ')}.`);
  }else{
    char.alchemy.failed++;
    result={type,valid:false,ingredients:mix.ingredientIds,cost:{dailyActions:0,items:2}};
    record(char,'Experimentou dois ingredientes incompatíveis; mistura fracassada.');
  }
 }else if(type==='craft'){
  const rec=c.receitasById[command.id];if(!craftable(char,rec,c))throw Error('Faltam materiais, oficina ou proficiência.');
  for(const ing of rec.ingredientes)add(char,ing.item,-ing.quantidade,c);
  add(char,rec.resultado,rec.quantidade,c);
  char.crafted++;char.skills[rec.pericia]+=7+rec.nivel/3;
  result={type,item:rec.resultado,quantity:rec.quantidade,recipe:rec.id};
  record(char,`Fabricou ${rec.quantidade}× ${c.itensById[rec.resultado].nome}.`);
 }else if(type==='buy'||type==='sell'){
  const item=c.itensById[command.id],city=c.cidadesById[char.city];
  if(!item)throw Error('Item desconhecido.');
  // Default quantity=1 preserves all old commands/backups. Multi-item trades
  // follow exactly the same unit prices/skills as N sequential transactions,
  // but commit only once after all validations succeed.
  const quantity=command.quantity===undefined?1:command.quantity;
  const quote=tradeQuote(char,item,city,type,quantity);
  add(char,item.id,type==='buy'?quantity:-quantity,c);
  char.gold+=type==='buy'?-quote.gold:quote.gold;
  char.skills.comercio=quote.commercePoints;
  if(type==='sell')char.sales+=quantity;
  result={type,item:item.id,gold:quote.gold,quantity};
  record(char,`${type==='buy'?'Comprou':'Vendeu'} ${quantity}× ${item.nome} por ${quote.gold} moedas.`);
 }else if(type==='selectSeed'){
  const seed=String(command.seed||'');if(!/^[a-zA-Z0-9_-]{3,60}$/.test(seed))throw Error('Seed inválida.');
  next.worlds.activeSeed=seed;result={type,seed};
 }else if(type==='selectRegion'){
   const region=REGION_BY_ID[String(command.regionId||'')],seed=String(command.seed||'');
   if(!region||!c.cidadesById[region.city])throw Error('Região não cadastrada na Carcaça.');
   if(!/^[a-zA-Z0-9_-]{3,60}$/.test(seed)||!seed.startsWith(region.id+'-'))throw Error('Seed incompatível com a região.');
   // Travel is one atomic commit: location, map and diary; no invented travel cost.
   char.city=region.city;next.worlds.activeSeed=seed;
   result={type,regionId:region.id,city:region.city,seed,cost:{dailyActions:0,gold:0}};
   record(char,'Viajou para '+region.name+'.');
  }else if(type==='eat'){
  const id=String(command.id||'ger-racoes-de-viagem');
  if(id!=='ger-racoes-de-viagem')throw Error('Esta versão só permite comer rações de viagem.');
  if((char.bag[id]||0)<1)throw Error('Sem rações. Compre provisões em um mercado.');
  char.survival=eatMeal(char.survival);
  add(char,id,-1,c);
  result={type,item:id,quantityConsumed:1,hunger:char.survival.hunger};
  record(char,'Comeu uma ração de viagem.');
 }else if(type==='sleep'||type==='endDay'){
  const hours=type==='endDay'?8:command.hours??8;
  if(!Number.isSafeInteger(hours)||hours<1||hours>12)throw Error('O sono deve durar de 1 a 12 horas.');
  if(next.worlds.clock.dimension!=='carcaca')throw Error('Não é possível dormir sem passagem de tempo nesta dimensão.');
  result={type:'sleep',hours,cost:{dailyActions:0}};
  record(char,'Dormiu durante '+hours+' horas.');
 }else if(type==='passTime'){
  if(!Number.isSafeInteger(command.minutes)||command.minutes<1||command.minutes>60)
   throw Error('Pulso do relógio inválido (1 a 60 minutos).');
  result={type,minutes:command.minutes};
 }else throw Error('Transação desconhecida: '+type);
 const duration=result.type==='sleep'?result.hours*60:
  actionMinutes(type,type==='craft'?{...command,recipeLevel:c.receitasById[command.id]?.nivel}:command);
 if(duration>0){
  const moved=advanceWorldClock(next.worlds.clock,duration);
  next.worlds.clock=moved.clock;
  if(moved.elapsed){
   const biology=advanceSurvival(char.survival,moved.elapsed,{sleeping:result.type==='sleep',hp:char.hp,maximumHp:maxClassicHp(char,c)});
   char.survival=biology.survival;char.hp=biology.hp;
   char.fatigue=Math.round(100-char.survival.rest);
   char.day=Math.floor(clockPosition(moved.clock)/1440)-Math.floor(clockPosition(newWorldClock())/1440)+1;
   if(result.type==='sleep'&&char.survival.alive){
    char.hp=Math.min(maxClassicHp(char,c),char.hp+Math.ceil(maxClassicHp(char,c)*.04*result.hours));
    char.mp=Math.min(maxClassicMp(char),char.mp+Math.ceil(maxClassicMp(char)*.06*result.hours));
   }
   if(!char.survival.alive){char.flags={...char.flags,peren_morto:true};record(char,'Peren morreu de '+(char.survival.causeOfDeath||'causas desconhecidas')+'.');}
   for(const event of moved.events)if(!next.worlds.eventLog.includes(event.id)){
    next.worlds.eventLog.push(event.id);
    for(const flag of event.flags)next.worlds.historicalFlags[flag]=true;
    record(char,'MARCO HISTÓRICO '+event.year+' EC — '+event.description);
   }
   next.worlds.eventLog=next.worlds.eventLog.slice(-40);
  }
 }
 result.cost={...result.cost,dailyActions:0,minutes:next.worlds.clock.dimension==='carcaca'?duration:0};
 result.date=erisianDate(next.worlds.clock).label;
 if(key)next.ledger[key]=result;
 next.revision++;next.history=[...(next.history||[]),{rev:next.revision,type,description:result.type==='victory'?result.monster:result.item||''}].slice(-80);
 return {next,result,applied:true};
}
/** Storage adapter. Commit verifies latest revision and atomically writes first. */
export function createProgressBridge(storage,c){
 let env;const staged=storage.getItem(PHASER_KEY);
 if(staged){env=checkEnvelope(JSON.parse(staged),c)}
 else{
  // Pré-alfa: nunca importar automaticamente progresso da edição clássica.
  // Dados e regras podem ser reaproveitados, mas o save é exclusivamente Phaser.
  env=newEnvelope(newClassicState(),c,M1HF_PREVIEW?'m1hf-preview':'new-game');
 }
 const read=()=>jsonCopy(env);
 const sync=()=>{const latest=storage.getItem(PHASER_KEY);
  if(latest){const other=JSON.parse(latest);if(other.revision!==env.revision)throw Error('Progresso mudou em outra aba. Recarregue antes de salvar.');}
  else if(env.revision!==0)throw Error('Save Phaser foi removido por outra aba.');};
 function execute(command){sync();const tx=applyTransaction(env,command,c);if(!tx.applied)return tx;
  storage.setItem(PHASER_KEY,JSON.stringify(tx.next));env=tx.next;return tx;}
 return {
  read,get state(){return env.character},get clock(){return {...env.worlds.clock}},get historicalFlags(){return {...env.worlds.historicalFlags}},get historicalEvents(){return [...env.worlds.eventLog]},get source(){return env.origin},combatProfile:()=>toCombatProfile(env,c),
  committed:key=>Boolean(env.ledger[key]),collectedIds:seed=>recoveredIds(env,seed,'collect'),
  execute,export:()=>JSON.stringify(env,null,2),
  restore:text=>{const validated=checkEnvelope(JSON.parse(text),c);sync();
   // Treat import as a new revision, so old writes cannot silently overwrite this state.
   validated.revision=env.revision+1;storage.setItem(PHASER_KEY,JSON.stringify(validated));env=validated;return read();},
  finishBattle:b=>execute({type:b.status==='won'?'victory':'escape',battle:b})
 };
}
