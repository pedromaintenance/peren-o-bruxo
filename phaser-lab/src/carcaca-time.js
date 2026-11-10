/**
 * Calendário oficial da Carcaça — base erisiana/discordianista.
 * 5 estações × 73 dias, semana de 5 dias. Em anos bissextos
 * o Dia de São Tib está fora da semana e da contagem das estações.
 * A numeração EC é independente da numeração discordianista YOLD.
 * Não há conversão canônica estabelecida entre EC e ano gregoriano.
 */
export const EPOCH_EC=922;
export const MINUTES_PER_DAY=1440;
export const START_MINUTE=8*60;
export const SEASONS=Object.freeze([
 {id:'chaos',name:'Caos',erisian:'Chaos',starts:'1º de janeiro'},
 {id:'discord',name:'Discórdia',erisian:'Discord',starts:'15 de março'},
 {id:'confusion',name:'Confusão',erisian:'Confusion',starts:'27 de maio'},
 {id:'bureaucracy',name:'Burocracia',erisian:'Bureaucracy',starts:'8 de agosto'},
 {id:'aftermath',name:'Consequência',erisian:'The Aftermath',starts:'20 de outubro'}
]);
export const WEEKDAYS=Object.freeze(['Sweet','Boom','Pungent','Prickle','Setting Orange']);
export const WORLD_HISTORY=Object.freeze([
 {id:'invasao-abismo-983',year:983,month:1,day:1,title:'A Invasão do Abismo',
  description:'Demônios invadem a Carcaça a partir do Abismo. O Templo das Sombras é destruído.',
  flags:['abismo_invadido_por_demonios','templo_das_sombras_destruido']},
 {id:'gualapolis-984',year:984,month:1,day:1,title:'O Golpe de Gualápolis',
  description:'Gualápolis é tomada pelo golpe do Senhor do Rio.',
  flags:['gualapolis_tomada_pelo_senhor_do_rio']},
 {id:'crepusculo-999',year:999,month:1,day:1,title:'O Templo do Crepúsculo',
  description:'O Templo do Crepúsculo é construído.',
  flags:['templo_do_crepusculo_construido']}
]);
export const INITIAL_HISTORY=Object.freeze([
 {id:'voragar-e-dragoes-mortos',year:922,title:'A Queda dos Dragões',description:'Voragar e seus Dragões estão mortos.'},
 {id:'rayquaza-desaparecido',year:922,title:'O Desaparecimento de Rayquaza',description:'Rayquaza desapareceu misteriosamente.'}
]);
export function isLeapEC(year){
 return Number.isSafeInteger(year)&&year>0&&year%4===0&&(year%100!==0||year%400===0);
}
export function daysInEC(year){return isLeapEC(year)?366:365}
export function newWorldClock(){return {year:EPOCH_EC,day:1,minute:START_MINUTE,dimension:'carcaca'};}
export function normalizeWorldClock(raw){
 const c=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const year=Number.isSafeInteger(c.year)&&c.year>=EPOCH_EC&&c.year<=100000?c.year:EPOCH_EC;
 const day=Number.isSafeInteger(c.day)&&c.day>=1&&c.day<=daysInEC(year)?c.day:1;
 const minute=Number.isSafeInteger(c.minute)&&c.minute>=0&&c.minute<MINUTES_PER_DAY?c.minute:START_MINUTE;
 const dimension=typeof c.dimension==='string'&&/^[a-z0-9_-]{2,60}$/.test(c.dimension)?c.dimension:'carcaca';
 return {year,day,minute,dimension};
}
/**
 * Erisian day index excludes Saint Tib's Day. This calendar uses
 * the 4/100/400 leap convention against EC numbers as a provisional rule;
 * EC has no anchored Gregorian year.
 */
export function erisianDate(input){
 const c=normalizeWorldClock(input),stTib=isLeapEC(c.year)&&c.day===60;
 const ordinal=c.day-(isLeapEC(c.year)&&c.day>60?1:0);
 const seasonIndex=Math.min(4,Math.floor((ordinal-1)/73));
 const season=SEASONS[seasonIndex];
 const seasonDay=stTib?null:(ordinal-1)%73+1;
 const weekday=stTib?null:WEEKDAYS[(ordinal-1)%5];
 const hours=String(Math.floor(c.minute/60)).padStart(2,'0'),mins=String(c.minute%60).padStart(2,'0');
 return {year:c.year,dayOfYear:c.day,seasonIndex:stTib?null:seasonIndex,season:stTib?null:season,
  seasonDay,weekday,saintTib:stTib,time:hours+':'+mins,
  label:stTib?('Dia de São Tib · '+c.year+' EC · '+hours+':'+mins):
   (seasonDay+' de '+season.name+' · '+weekday+' · '+c.year+' EC · '+hours+':'+mins)};
}
export function absoluteDay(input){
 const c=normalizeWorldClock(input);
 const n=c.year-1;
 const leapDays=Math.floor(n/4)-Math.floor(n/100)+Math.floor(n/400);
 return n*365+leapDays+c.day-1;
}
export function clockPosition(input){const c=normalizeWorldClock(input);return absoluteDay(c)*MINUTES_PER_DAY+c.minute;}
export function crossedWorldEvents(before,after){
 const from=clockPosition(before),to=clockPosition(after);
 if(to<=from)return [];
 return WORLD_HISTORY.filter(e=>{
  const mark=clockPosition({year:e.year,day:1,minute:0,dimension:'carcaca'});
  return from<mark&&to>=mark;
 });
}
export function advanceWorldClock(current,minutes){
 const original=normalizeWorldClock(current);
 if(!Number.isSafeInteger(minutes)||minutes<0||minutes>100*366*MINUTES_PER_DAY)
  throw Error('Avanço temporal inválido (até 100 anos por operação).');
 // Other dimensions exist outside world time; no clock, hunger, age or
 // historical event may progress there.
 if(original.dimension!=='carcaca'||minutes===0)return {clock:original,elapsed:0,events:[]};
 let {year,day,minute}=original,remaining=minutes;
 while(remaining>0){
  const untilYearEnd=(daysInEC(year)-day+1)*MINUTES_PER_DAY-minute;
  if(remaining<untilYearEnd){
   const total=(day-1)*MINUTES_PER_DAY+minute+remaining;
   day=Math.floor(total/MINUTES_PER_DAY)+1;minute=total%MINUTES_PER_DAY;remaining=0;
  }else{
   remaining-=untilYearEnd;year++;day=1;minute=0;
  }
 }
 const clock={year,day,minute,dimension:'carcaca'};
 return {clock,elapsed:minutes,events:crossedWorldEvents(original,clock)};
}
export function minutesUntil(clock,{hour=8}={}){
 const c=normalizeWorldClock(clock);
 const goal=hour*60;
 return c.minute<goal?goal-c.minute:MINUTES_PER_DAY-c.minute+goal;
}
