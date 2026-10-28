import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.PEREN_BASE_URL||'http://127.0.0.1:8765/phaser-demo-m1hf';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:844},serviceWorkers:'allow'});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base+'/peren-arte.html',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('option[value="gather-herb"]').count(),0);
  await page.locator('#action').selectOption('gather');
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('coleta universal'));
  const pixels=()=>page.locator('canvas[data-dir="0"]').evaluate(c=>Array.from(c.getContext('2d').getImageData(0,0,48,64).data));
  const first=await pixels();await page.waitForTimeout(600);const middle=await pixels();
  await page.waitForTimeout(2000);const last=await pixels();
  await page.waitForTimeout(700);
  assert.ok(first.some((x,i)=>x!==middle[i]),'gather must animate '+width);
  assert.ok(first.some((x,i)=>x!==last[i]),'5th pose must change '+width);
  assert.deepEqual(last,await pixels(),'one-shot must hold final pose');
  assert.equal(await page.locator('canvas[data-dir]').count(),4);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3),false);
  assert.deepEqual(errors,[]);await ctx.close();
 }
 console.log('Peren collect v7 browser PASS: 3 sizes; five-frame one-shot all directions; no herb-only');
} finally { await browser.close() }