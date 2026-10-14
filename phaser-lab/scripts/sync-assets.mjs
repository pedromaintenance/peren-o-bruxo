/** Copies only M1a art into local Vite public files before build and dev. */
import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
const here=resolve(fileURLToPath(new URL('.',import.meta.url)));
const lab=resolve(here,'..');
const source=resolve(lab,'..','phaser','assets');
const dest=join(lab,'public','art');
for(const path of ['characters/peren','regions/floresta-murin']) {
  await mkdir(join(dest,path),{recursive:true});
  await cp(join(source,path),join(dest,path),{recursive:true,force:true});
}
console.log('Assets autorais M1a sincronizados de phaser/assets -> public/art');