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
console.log('Sprites M1e e cenários de referência clássicos sincronizados para o Phaser');
// M1h is opt-in: derive comparison files from M1e source without overwriting it.
await import('./peren-m1h-generator.mjs');
// M1h-B derives a third, optional head/silhouette candidate. Never overwrite M1e/M1h-A.
await import('./peren-m1hb-generator.mjs');
// M1h-C is an optional refinement, generated last; never overwrite earlier art.
await import('./peren-m1hc-generator.mjs');
// M1h-D builds the optional severe-expression candidate after M1h-C.
await import('./peren-m1hd-generator.mjs');

// M1h-E optional monster art, generated after legacy source synchronization.
await import('./murin-m1he-generator.mjs');
