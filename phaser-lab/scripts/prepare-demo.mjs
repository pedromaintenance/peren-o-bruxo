// Build an offline, scoped demo of Peren Phaser without replacing the classic game.
import {readdir,readFile,writeFile,mkdir,copyFile,stat} from 'node:fs/promises';
import {resolve,join,relative,sep} from 'node:path';

const lab=resolve(import.meta.dirname,'..');
const dist=join(lab,'dist'),root=resolve(lab,'..');
async function list(dir){
  const result=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);
    if(entry.isDirectory())result.push(...await list(path));
    else if(entry.isFile())result.push(relative(dist,path).split(sep).join('/'));
  }
  return result;
}
const isolated=process.env.PEREN_M1HF_PAGES_PREVIEW==='1';
const pagePath=isolated?'phaser-demo-m1hf':'phaser-demo';
let html=await readFile(join(dist,'index.html'),'utf8');
if(!html.includes('DEMONSTRAÇÃO PHASER M1d'))throw Error('Missing preview banner');
if(isolated){
  // Explicit experimental-label banner inside the city hub; all assets stay relative.
  html=html.replace('Exportar backup Phaser','Baixar backup do teste M1h-F');
  html=html.replace('Restaurar backup Phaser','Restaurar backup do teste M1h-F');
  html=html.replace('DEMONSTRAÇÃO PHASER M1d · seu save clássico não será modificado.',
    'PRÉVIA M1h-F · 3 criaturas CC0 · save de teste independente e sem importação do clássico.');
  html=html.replace('<footer class="m1g-footer">',
    '<footer class="m1g-footer"><div class="m1hf-diagnostic-controls" aria-label="Ferramentas de testes"><span>PRÉVIA M1h-F · RELATAR FALHA</span><button type="button" id="m1hfDiagCopy">Copiar diagnóstico</button><button type="button" id="m1hfDiagSave">Baixar diagnóstico</button><small id="m1hfDiagStatus" role="status">Sem envio automático: nenhum save ou inventário é exportado.</small></div><a id="m1hfPreviewNote" href="./review.html?art=m1hf">🧪 REVISÃO M1h-F · VER SPRITES ANIMADOS</a><a id="m1hfCompareLink" href="./compare.html">⚖ COMPARAR M1h-E × M1h-F</a><a id="m1hfPlaytestLink" href="./teste.html">📋 TESTE NO CELULAR · RELATÓRIO</a>');
  html=html.replace('<small class="battle-note">',
    '<button id="m1hfDiagCopyBattle" type="button" class="m1hf-battle-diag">Copiar diagnóstico técnico</button><small id="m1hfDiagBattleStatus" role="status"></small><small class="battle-note">');
  html=html.replace('</head>',
    `<style>.m1hf-diagnostic-controls{display:flex;gap:7px;align-items:center;flex-wrap:wrap;width:100%;padding:10px;border:1px solid #8b744f;background:#0e2029;color:#dcc6a3}.m1hf-diagnostic-controls span{font-weight:700}.m1hf-diagnostic-controls button,.m1hf-battle-diag{cursor:pointer;padding:8px 11px;border:1px solid #bfa475;border-radius:4px;background:#1c3544;color:#f5dca8}.m1hf-diagnostic-controls small{width:100%;font-size:11px;overflow-wrap:anywhere}.m1hf-battle-diag{display:block;margin:10px 0 5px}#m1hfDiagBattleStatus{display:block;color:#e4c993;font-size:11px}</style></head>`);
  html=html.replace('</head>','<meta name="robots" content="noindex,nofollow"><meta name="description" content="Prévia experimental M1h-F do jogo Peren, o Bruxo"></head>');
}
await mkdir(join(dist,'icons'),{recursive:true});
for(const size of [192,512]){
  await copyFile(join(root,'icons','icon-'+size+'.png'),join(dist,'icons','icon-'+size+'.png'));
}
const manifest={
  id:'./',name:isolated?'Peren, o Bruxo — Teste M1h-F':'Peren, o Bruxo — Demonstração Phaser',
  short_name:isolated?'Peren M1h-F':'Peren Phaser',
  description:isolated?'Prévia visual experimental do bestiário CC0 de Mürin. Save separado do Phaser estável.':'Exploração, combate e crafting da Floresta de Mürin. Save de testes isolado.',
  start_url:'./',scope:'./',display:'standalone',orientation:'any',
  background_color:'#0c151b',theme_color:'#172b29',
  icons:[192,512].map(size=>({src:'./icons/icon-'+size+'.png',sizes:size+'x'+size,type:'image/png'}))
};
await writeFile(join(dist,'manifest.webmanifest'),JSON.stringify(manifest,null,2)+'\n');
await writeFile(join(dist,'.nojekyll'),'');
html=html.replace(/<\/head>/i,'<link rel="manifest" href="./manifest.webmanifest"></head>');
html=html.replace(/<\/body>/i,`<script>if('serviceWorker' in navigator && location.pathname.includes('/${pagePath}/')){addEventListener('load',()=>navigator.serviceWorker.register('./demo-sw.js',{scope:'./'}).catch(err=>console.warn('Cache offline indisponível:',err)))}</script></body>`);
await writeFile(join(dist,'index.html'),html);
if(isolated)await copyFile(join(lab,'teste.html'),join(dist,'teste.html'));
const all=await list(dist);
if(!all.some(p=>p.startsWith('assets/')&&p.endsWith('.js')))throw Error('Missing compiled JS bundle');
for(const n of ['itens','receitas','magias','monstros','cidades']){
  if(!all.includes('data/'+n+'.json'))throw Error('Missing catalog '+n);
}
const precache=['./',...all.filter(p=>p!=='demo-sw.js'&&p!=='.nojekyll').map(p=>'./'+p)];
const build=(process.env.GITHUB_SHA||'local').slice(0,12);
// A service worker sharing an origin must NOT purge another application's caches.
const cachePrefix=isolated?'peren-phaser-m1hf-preview-':'peren-phaser-demo-';
const worker=[
 'const CACHE='+JSON.stringify(cachePrefix+build)+';',
 'const CACHE_PREFIX='+JSON.stringify(cachePrefix)+';',
 'const FILES='+JSON.stringify(precache)+';',
 "self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()))});",
 "self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});",
 "self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url),scope=new URL('./',self.location.href);if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;event.respondWith((async()=>{if(req.mode==='navigate'){try{const fresh=await fetch(req);if(fresh.ok)return fresh}catch{}const cachedPage=await caches.match(req,{ignoreSearch:true});if(cachedPage)return cachedPage;const page=url.pathname.slice(scope.pathname.length);if(page===''||page==='index.html')return await caches.match('./index.html')||Response.error();return Response.error()}const cached=await caches.match(req);if(cached)return cached;try{const response=await fetch(req);if(response.ok){const cache=await caches.open(CACHE);await cache.put(req,response.clone())}return response}catch{return Response.error()}})())});"
].join('\n\n');
await writeFile(join(dist,'demo-sw.js'),worker+'\n');
const built=await list(dist);
const total=(await Promise.all(built.map(async p=>(await stat(join(dist,p))).size))).reduce((a,b)=>a+b,0);
console.log((isolated?'Pages M1h-F isolada':'Demo Phaser')+': '+built.length+' arquivos, '+Math.round(total/1024)+' KiB, cache '+cachePrefix+build+', base relativa OK');
