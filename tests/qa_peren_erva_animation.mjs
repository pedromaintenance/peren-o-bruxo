import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>readFileSync(new URL('../'+p,import.meta.url));
const m=JSON.parse(read('assets/icons/erva-animation.json'));
test('herb source integrity',()=>{const b=read(m.source);assert.equal(b.readUInt32BE(16),2520);assert.equal(b.readUInt32BE(20),660);assert.equal(createHash('sha256').update(b).digest('hex'),m.sourceSha256);assert.ok(read(m.backupPreviousStaticIcon).length>0);});
test('five-frame WebP animation',()=>{const b=read(m.animation);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');assert.equal((b.toString('ascii').match(/ANMF/g)||[]).length,5);assert.equal(createHash('sha256').update(b).digest('hex'),m.outputSha256);});
test('PWA updated',()=>{const sw=read('sw.js').toString();assert.ok(sw.includes(m.cacheVersion));assert.ok(sw.includes("'erva'"));});
