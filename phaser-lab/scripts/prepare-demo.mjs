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
let html=await readFile(join(dist,'index.html'),'utf8');
if(!html.includes('DEMONSTRAÇÃO PHASER M1d'))throw Error('Missing preview banner');
await mkdir(join(dist,'icons'),{recursive:true});
for(const size of [192,512]){
  await copyFile(join(root,'icons','icon-'+size+'.png'),join(dist,'icons','icon-'+size+'.png'));
}
const manifest={
  id:'./',name:'Peren, o Bruxo — Demonstração Phaser',
  short_name:'Peren Phaser',
  description:'Exploração, combate e crafting da Floresta de Mürin. Save de testes isolado.',
  start_url:'./',scope:'./',display:'standalone',orientation:'portrait',
  background_color:'#0c151b',theme_color:'#172b29',
  icons:[192,512].map(size=>({src:'./icons/icon-'+size+'.png',sizes:size+'x'+size,type:'image/png'}))
};
await writeFile(join(dist,'manifest.webmanifest'),JSON.stringify(manifest,null,2)+'\n');
await writeFile(join(dist,'.nojekyll'),'');
html=html.replace(/<\/head>/i,'<link rel="manifest" href="./manifest.webmanifest"></head>');
html=html.replace(/<\/body>/i,"<script>if('serviceWorker' in navigator && location.pathname.includes('/phaser-demo/')){addEventListener('load',()=>navigator.serviceWorker.register('./demo-sw.js',{scope:'./'}).catch(err=>console.warn('Cache offline indisponível:',err)))}</script></body>");
await writeFile(join(dist,'index.html'),html);
const all=await list(dist);
if(!all.some(p=>p.startsWith('assets/')&&p.endsWith('.js')))throw Error('Missing compiled JS bundle');
for(const n of ['itens','receitas','magias','monstros','cidades']){
  if(!all.includes('data/'+n+'.json'))throw Error('Missing catalog '+n);
}
const precache=['./',...all.filter(p=>p!=='demo-sw.js'&&p!=='.nojekyll').map(p=>'./'+p)];
const build=(process.env.GITHUB_SHA||'local').slice(0,12);
const worker=[
 'const CACHE='+JSON.stringify('peren-phaser-demo-'+build)+';',
 'const FILES='+JSON.stringify(precache)+';',
 "self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()))});",
 "self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('peren-phaser-demo-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});",
 "self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url),scope=new URL('./',self.location.href);if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;event.respondWith((async()=>{if(req.mode==='navigate'){try{const fresh=await fetch(req);if(fresh.ok)return fresh}catch{}return await caches.match('./index.html')||Response.error()}const cached=await caches.match(req);if(cached)return cached;try{const response=await fetch(req);if(response.ok){const cache=await caches.open(CACHE);await cache.put(req,response.clone())}return response}catch{return Response.error()}})())});"
].join('\n\n');
await writeFile(join(dist,'demo-sw.js'),worker+'\n');
const built=await list(dist);
const total=(await Promise.all(built.map(async p=>(await stat(join(dist,p))).size))).reduce((a,b)=>a+b,0);
console.log('Demo Phaser: '+built.length+' arquivos, '+Math.round(total/1024)+' KiB, cache '+build+', base relativa OK');
