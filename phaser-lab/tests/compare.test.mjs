import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../compare.html',import.meta.url),'utf8');
const vite=readFileSync(new URL('../vite.config.js',import.meta.url),'utf8');
const preparer=readFileSync(new URL('../scripts/prepare-demo.mjs',import.meta.url),'utf8');
test('M1h-F.3 comparator is built and linked from gallery and isolated Pages shell',()=>{
 const review=readFileSync(new URL('../review.html',import.meta.url),'utf8');
 assert.match(vite,/compare:fileURLToPath\(new URL\('\.\/compare\.html'/);
 assert.match(preparer,/m1hfCompareLink/);
 assert.match(preparer,/href="\.\/compare\.html"/);
 assert.match(review,/href="\.\/compare\.html"/);
 assert.match(html,/Mürin — antes e depois/);
});
test('M1h-F.3 compares two genuine monster atlases with matching 7 actions and 4 poses',()=>{
 for(const slug of ['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'])assert.ok(html.includes(slug));
 assert.match(html,/art-m1he\/monsters\//);
 assert.match(html,/art-m1hf\/monsters\//);
 for(const id of ['idle','walk','alert','attack','hurt','retreat','death'])assert.ok(html.includes('value="'+id+'"'));
 for(const id of ['leftFrame','rightFrame','leftStrip','rightStrip','frameInfo','toggle','next','previous','fps','zoom'])
  assert.ok(html.includes('id="'+id+'"'));
 assert.match(html,/imageSmoothingEnabled=false/);
 assert.match(html,/image\.naturalWidth!==256\|\|image\.naturalHeight!==448/);
 assert.match(html,/requestAnimationFrame\(animate\)/);
 assert.match(html,/prefers-reduced-motion: reduce/);
});
test('M1h-F.3 supports manual art review without storing or uploading private game progress',()=>{
 for(const id of ['verdict','reviewNotes','copyFeedback','downloadFeedback','feedbackStatus'])assert.ok(html.includes('id="'+id+'"'));
 for(const disallowed of ['localStorage','sessionStorage','indexedDB','XMLHttpRequest','sendBeacon','fetch(','serviceWorker.register'])
   assert.ok(!html.includes(disallowed),'Comparator must not access '+disallowed);
 assert.match(html,/URL\.createObjectURL/);
 assert.match(html,/navigator\.clipboard\.writeText/);
 assert.match(html,/data-criterion/);
 assert.match(html,/Sem observações/);
});
