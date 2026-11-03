import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GUIDE_SECTIONS} from '../src/ui-guide.js';

test('M1h-F.7: quatro capitulos de controles implementados, somente leitura',()=>{
 assert.deepEqual(GUIDE_SECTIONS.map(x=>x.id),['explorar','combate','cidade','seguranca']);
 for(const section of GUIDE_SECTIONS){
  assert.ok(section.title&&section.intro);
  assert.equal(section.lines.length,4);
  assert.ok(section.lines.every(line=>line.length===2&&line.every(Boolean)));
 }
 const source=readFileSync(new URL('../src/ui-guide.js',import.meta.url),'utf8');
 assert.doesNotMatch(source,/(?:localStorage|sessionStorage|indexedDB)\b|\bfetch\(|sendBeacon|XMLHttpRequest/);
});
test('M1h-F.7: modal isolado, alternancia, foco e gamepad documentados',()=>{
 const markup=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const driver=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(markup,/id="guideUI" hidden role="dialog" aria-modal="true"/);
 assert.match(markup,/id="showGuide"[^>]*hidden/);
 assert.match(markup,/id="guideContent"/);
 assert.match(driver,/M1HF_PREVIEW\?createGuideScreen/);
 assert.match(driver,/if\(guide\?\.isOpen\(\)\)/);
 assert.match(driver,/guide\.cycleTab/);
 assert.match(markup,/ui-guide\.css/);
});
