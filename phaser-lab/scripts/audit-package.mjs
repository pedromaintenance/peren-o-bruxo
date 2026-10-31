// Post-build quality gate for the *isolated* Phaser PWA.
import {readFile,readdir,stat,mkdir,writeFile} from 'node:fs/promises';
import {join,resolve,sep,relative} from 'node:path';
import assert from 'node:assert/strict';

const base=resolve(import.meta.dirname,'../dist');
const list=async dir=>{
 let paths=[];
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const path=join(dir,entry.name);
  if(entry.isDirectory())paths.push(...await list(path));
  else if(entry.isFile())paths.push(relative(base,path).split(sep).join('/'));
 }
 return paths;
};
const paths=await list(base);
const html=await readFile(join(base,'index.html'),'utf8');
const worker=await readFile(join(base,'demo-sw.js'),'utf8');
const manifest=JSON.parse(await readFile(join(base,'manifest.webmanifest'),'utf8'));
const sizes=await Promise.all(paths.map(async name=>({path:name,bytes:(await stat(join(base,name))).size})));
const sum=items=>items.reduce((total,row)=>total+row.bytes,0);
const scripts=sizes.filter(row=>row.path.startsWith('assets/')&&row.path.endsWith('.js'));
const styles=sizes.filter(row=>row.path.startsWith('assets/')&&row.path.endsWith('.css'));
const assets=sizes.filter(row=>!row.path.startsWith('assets/'));
assert.equal(manifest.scope,'./');
assert.equal(manifest.start_url,'./');
assert.equal(manifest.display,'standalone');
assert.equal(manifest.orientation,'any','PWA deve permitir portrait e landscape');
assert.match(html,/rel="manifest" href="\.\/manifest\.webmanifest"/);
assert.match(html,/location\.pathname\.includes\('\/phaser-demo\/'\)/,
 'SW nunca deve assumir controle do jogo clássico fora da demo');
assert.match(worker,/event\.request\.method|req\.method!==/);
for(const required of ['data/itens.json','data/receitas.json','data/magias.json',
 'data/monstros.json','data/cidades.json','art/characters/peren/portrait.png',
 'art/battle/murin-battle.webp','scenes/portomonte-market.svg',
 'scenes/portomonte-workshop.svg','icons/icon-192.png','icons/icon-512.png']){
 assert.ok(paths.includes(required),'Faltou arquivo offline do jogo: '+required);
 const marker='./'+required;
 assert.ok(worker.includes(marker),'Precache não inclui '+marker);
}
assert.ok(scripts.length>0&&styles.length>0);
assert.ok(sum(scripts)<10*1024*1024,'Bundle JS excede 10 MiB; auditar dependências');
assert.ok(sum(styles)<300*1024,'Stylesheets excedem 300 KiB');
assert.ok(sum(sizes)<80*1024*1024,'PWA excede 80 MiB; revisar cache offline');
assert.ok(html.includes('DEMONSTRAÇÃO PHASER M1d'),'Identificador de demo isolada ausente');
await mkdir('screenshots',{recursive:true});
const report={
 version:'M1g-F',artApproval:'PENDENTE',generatedAt:new Date().toISOString(),
 totalFiles:paths.length,totalBytes:sum(sizes),jsBytes:sum(scripts),cssBytes:sum(styles),
 otherBytes:sum(assets),largest:sizes.sort((a,b)=>b.bytes-a.bytes).slice(0,12),
 precacheCount:(worker.match(/"\.\//g)||[]).length,scope:manifest.scope,
 orientation:manifest.orientation,
 security:{isolatedSave:true,serviceWorkerOnlyWithinDemo:true,readOnlyClassicSave:true}
};
await writeFile('screenshots/m1g-f-package.json',JSON.stringify(report,null,2)+'\n');
console.log('M1g-F PWA: '+report.totalFiles+' arquivos, '+Math.round(report.totalBytes/1024)+' KiB, JS '+Math.round(report.jsBytes/1024)+' KiB, CSS '+Math.round(report.cssBytes/1024)+' KiB');
