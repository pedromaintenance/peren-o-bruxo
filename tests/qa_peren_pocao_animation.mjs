import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const file = path => readFileSync(new URL('../' + path, import.meta.url));
const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');
const meta = JSON.parse(file('assets/icons/pocao-animation.json'));

test('preserve original potion sprite and legacy icon', () => {
  const png = file(meta.source);
  assert.equal(sha256(png), meta.sourceSha256);
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[2048,682]);
  assert.equal(file(meta.backupPreviousStaticIcon).subarray(0,4).toString('ascii'),'RIFF');
});

test('five-frame potion WebP is animated, transparent and integrity-checked', () => {
  const image = file(meta.animation);
  assert.equal(sha256(image),meta.outputSha256);
  assert.equal(image.toString('ascii',0,4),'RIFF');
  assert.equal(image.toString('ascii',8,12),'WEBP');
  assert.equal(image.toString('ascii',12,16),'VP8X');
  assert.equal(image[20]&2,2,'missing animated flag');
  assert.equal(image[20]&16,16,'missing alpha flag');
  assert.equal((image.toString('ascii').match(/ANMF/g)||[]).length,5);
  assert.deepEqual(meta.outputDimensions,[160,160]);
  assert.deepEqual(meta.timeline,[0,1,2,3,4]);
  assert.deepEqual(meta.durationsMs,[180,180,180,180,180]);
});

test('potion category uses new icon and PWA precaches updated file', () => {
  const game=file('game.js').toString();
  const sw=file('sw.js').toString();
  assert.ok(game.includes("it.categoria==='pocao'||it.categoria==='consumivel'"));
  assert.ok(game.includes("return 'pocao'"));
  assert.ok(sw.includes(meta.cacheVersion));
  assert.ok(sw.includes("'pocao'"));
  assert.ok(sw.includes("./assets/icons/"));
});
