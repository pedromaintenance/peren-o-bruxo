import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>readFileSync(new URL('../'+p,import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
const m=JSON.parse(read('assets/icons/espada-animation.json'));
test('original axial sword sheet preserved',()=>{
 const b=read(m.source);
 assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');
 assert.deepEqual([b.readUInt32BE(16),b.readUInt32BE(20)],m.sourceDimensions);
 assert.equal(sha(b),m.sourceSha256);
 assert.ok(read(m.backupPreviousStaticIcon).length>0);
});
test('five frame animated sword WebP integrity',()=>{
 const b=read(m.animation);
 assert.equal(b.toString('ascii',0,4),'RIFF');
 assert.equal(b.toString('ascii',8,12),'WEBP');
 assert.ok(b.includes(Buffer.from('ANIM')));
 assert.equal((b.toString('ascii').match(/ANMF/g)||[]).length,5);
 assert.equal(sha(b),m.outputSha256);
 assert.deepEqual(m.timeline,[0,1,2,3,4]);
});
test('PWA includes sword and bumped cache',()=>{
 const sw=read('sw.js').toString(),game=read('game.js').toString();
 assert.ok(sw.includes("'espada'"));
 assert.ok(sw.includes(m.cacheVersion));
 assert.ok(game.includes('espada'));
});
