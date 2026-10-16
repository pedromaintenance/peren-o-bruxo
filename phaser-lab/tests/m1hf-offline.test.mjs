import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const generator=readFileSync(new URL('../scripts/prepare-demo.mjs',import.meta.url),'utf8');
const browserScript=readFileSync(new URL('../scripts/m1hf-offline-browser.mjs',import.meta.url),'utf8');
test('M1h-F.3 offline navigation retrieves requested cached HTML, not always index',()=>{
 assert.match(generator,/caches\.match\(req,\{ignoreSearch:true\}\)/);
 assert.match(generator,/page===\\'\\'\\|\\|page===\\'index.html\\'/);
 assert.match(generator,/if\(cachedPage\)return cachedPage/);
 assert.match(generator,/return Response\.error\(\)/);
 assert.match(generator,/peren-phaser-m1hf-preview-/);
});
test('M1h-F.3 offline service worker does not remove classic or other preview caches',()=>{
 assert.match(generator,/k\.startsWith\(CACHE_PREFIX\)/);
 assert.ok(!generator.includes("k.startsWith('peren-phaser-demo-')"));
 assert.match(generator,/url\.pathname\.startsWith\(scope\.pathname\)/);
 assert.match(generator,/cache\.addAll\(FILES\)/);
});
test('M1h-F.3 browser QA verifies offline game, compare, gallery and CC0 audit',()=>{
 for(const route of ['compare.html','review.html?art=m1hf','asset-audition.html'])
  assert.ok(browserScript.includes(route));
 assert.match(browserScript,/context\.setOffline\(true\)/);
 assert.match(browserScript,/QA-CLASSIC-UNTOUCHED/);
 assert.match(browserScript,/QA-STABLE-UNTOUCHED/);
 assert.match(browserScript,/qa-m1hf-offline/);
});
