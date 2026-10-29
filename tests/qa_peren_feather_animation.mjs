import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const ROOT=resolve(fileURLToPath(new URL('../',import.meta.url)));
const read=p=>readFileSync(resolve(ROOT,p));
const sha256=p=>createHash('sha256').update(p).digest('hex');
const metadata=JSON.parse(read('assets/icons/pena-gaivota-animation.json'));
test('Pena de Gaivota uses genuine animated transparent WebP',()=>{
  const webp=read('assets/icons/pena-gaivota.webp');
  assert.equal(webp.toString('ascii',0,4),'RIFF');
  assert.equal(webp.toString('ascii',8,12),'WEBP');
  assert.equal(webp.toString('ascii',12,16),'VP8X');
  assert.ok((webp[20]&2)!==0,'WebP animation flag missing');
  assert.ok((webp[20]&16)!==0,'WebP alpha flag missing');
  assert.equal(webp.toString('latin1').match(/ANMF/g)?.length,8);
  assert.equal(sha256(webp),metadata.outputSha256);
  assert.deepEqual(metadata.outputDimensions,[160,160]);
  assert.deepEqual(metadata.timeline,[0,1,2,3,4,3,2,1]);
});
test('only Pena de Gaivota gets its dedicated inventory icon',()=>{
  const game=read('game.js').toString();
  const lab=read('laboratorio-itens/app.js').toString();
  assert.match(game,/if\(n\.includes\('pena de gaivota'\)\)return 'pena-gaivota'/);
  assert.match(lab,/if\(n\.includes\('pena de gaivota'\)\)return 'pena-gaivota'/);
  assert.match(game,/assets\/icons\/\$\{iconAsset\(it\)\}\.webp/);
});
test('root PWA preloads the new icon under a new cache version',()=>{
  const sw=read('sw.js').toString();
  assert.match(sw,/feather-gaivota-v1/);
  assert.match(sw,/'pena-gaivota'/);
  assert.match(sw,/cache\.addAll\(FILES\)/);
});