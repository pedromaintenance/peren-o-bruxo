/** Copies artwork and classic environment references into the standalone Phaser bundle. */
import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
const here=resolve(fileURLToPath(new URL('.',import.meta.url)));
const lab=resolve(here,'..');
const source=resolve(lab,'..','phaser','assets');
const dest=join(lab,'public','art');
for(const path of ['characters/peren','regions/floresta-murin','monsters/mob-galho-infectado','monsters/mob-fungo-violeta','monsters/mob-ettercap','vfx','battle']) {
  await mkdir(join(dest,path),{recursive:true});
  await cp(join(source,path),join(dest,path),{recursive:true,force:true});
}
// The classic Peren already ships these self-contained ambience paintings.
const classic=resolve(lab,'..','assets');
const town=join(dest,'regions','portomonte');
await mkdir(town,{recursive:true});
for(const file of ['visao-carcaca.webp']){
  await cp(join(classic,file),join(town,file),{force:true});
}

// M0: data/ is the ONE canonical catalog. Copy into the Phaser build
// without modifying source data, running recipe generation or changing the
// classic PWA. Legacy recipes remain legacy until dynamic alchemy is approved.
const canonicalData=resolve(lab,'..','data');
const packagedData=join(lab,'public','data');
await mkdir(packagedData,{recursive:true});
for(const name of [
  'itens','receitas','magias','monstros','cidades',
  'curadoria_ingredientes','expedicoes','missoes','reliquias_dnd','manifesto_dados'
]){
  await cp(join(canonicalData,name+'.json'),join(packagedData,name+'.json'),{force:true});
}
console.log('Catálogos oficiais da raiz copiados sem mutação para o build Phaser.');

console.log('Sprites M1e e cenários de referência clássicos sincronizados para o Phaser');
// Preserve exact frame IDs while adapting the canonical 16×8 copy for legacy 32×4 consumers.
await import('./normalize-peren-atlas.mjs');

// The M1h variants and M1he/M1hf monster art are HISTORICAL preview artifacts.
// The generators predate the approved v5 canonical atlas/palette and must NOT
// automatically re-colour or redraw current Peren. Copy published candidates
// unchanged, keeping the modern canonical base under public/art/.
const archivedPreview=resolve(lab,'..','phaser-demo-m1hf');
for(const variant of ['art-m1h','art-m1hb','art-m1hc','art-m1hd','art-m1he','art-m1hf']){
  await cp(join(archivedPreview,variant),join(lab,'public',variant),{recursive:true,force:true});
}
console.log('Variantes antigas importadas como arquivo visual imutável; geradores obsoletos desativados.');
