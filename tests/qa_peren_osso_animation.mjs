import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const file = path => readFileSync(new URL('../' + path, import.meta.url));
const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');
const meta = JSON.parse(file('assets/icons/osso-animation.json'));

test('preserve supplied bone sprite unchanged', () => {
  const png = file(meta.source);
  assert.equal(sha256(png), meta.sourceSha256);
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [2048, 455]);
});

test('five-frame bone WebP is animated, transparent and reproducible', () => {
  const img = file(meta.animation);
  assert.equal(sha256(img), meta.outputSha256);
  assert.equal(img.toString('ascii', 0, 4), 'RIFF');
  assert.equal(img.toString('ascii', 8, 12), 'WEBP');
  assert.equal(img.toString('ascii', 12, 16), 'VP8X');
  assert.ok((img[20] & 2) === 2, 'WebP animated flag must be set');
  assert.ok((img[20] & 16) === 16, 'WebP alpha flag must be set');
  assert.equal((img.toString('ascii').match(/ANMF/g) || []).length, 5);
  assert.deepEqual(meta.outputDimensions, [160, 160]);
  assert.deepEqual(meta.timeline, [0, 1, 2, 3, 4]);
});

test('inventory maps materials to bone icon and PWA precaches it', () => {
  const game = file('game.js').toString();
  const sw = file('sw.js').toString();
  assert.ok(game.includes("n.includes('osso')?'osso'"));
  assert.ok(sw.includes(meta.cacheVersion));
  assert.ok(sw.includes("'osso'"));
});
