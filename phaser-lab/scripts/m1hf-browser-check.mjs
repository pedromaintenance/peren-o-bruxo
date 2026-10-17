/**
 * Browser smoke test for the M1h-F optional creature artwork.
 * Requires built Vite preview on localhost:4173 and Playwright Chromium.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';

const url=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
await mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
  for(const [w,h] of [[390,844],[1280,800]]){
    const errors=[];
    const loadedArt=new Set();
    const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
    page.on('pageerror',e=>errors.push('page: '+e.message));
    page.on('response',response=>{
      if(response.url().includes('/art-m1hf/monsters/')&&response.status()===200)loadedArt.add(response.url());
      if(response.status()>=400&&response.url().includes('/art-m1hf/'))errors.push('asset '+response.status()+': '+response.url());
    });
    await page.goto(url+'?art=m1hf',{waitUntil:'networkidle',timeout:30000});
    await page.waitForFunction(()=>window.__perenLab?.registry?.get('ready')===true,{timeout:30000});
    const inspect=await page.evaluate(()=>{
      const game=window.__perenLab;
      return ['mob-galho-infectado','mob-fungo-violeta','mob-ettercap'].map(name=>{
        const texture=game.textures.get(name);
        return {name,frames:texture.frameTotal};
      });
    });
    assert.equal(inspect.length,3);
    for(const texture of inspect){
      assert.ok(texture.frames>=28,texture.name+' missing frames: '+JSON.stringify(texture));
      assert.ok([...loadedArt].some(src=>src.includes('/art-m1hf/monsters/'+texture.name+'/atlas.png')),
        'wrong sprite variant: '+JSON.stringify({texture,requests:[...loadedArt]}));
    }
    await page.locator('#goForest').click();
    await page.waitForTimeout(400);
    await page.screenshot({path:'screenshots/m1hf-game-'+w+'.png',fullPage:true});
    assert.deepEqual(errors,[],'Game/browser errors: '+errors.join(' | '));
    await page.close();

    const review=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
    const reviewErrors=[];
    review.on('pageerror',e=>reviewErrors.push('page: '+e.message));
    review.on('response',response=>{
      if(response.status()>=400&&response.url().includes('/art-m1hf/'))reviewErrors.push('asset '+response.status()+': '+response.url());
    });
    await review.goto(url+'review.html?art=m1hf',{waitUntil:'networkidle',timeout:30000});
    for(const monster of ['mob-galho-infectado','mob-fungo-violeta','mob-ettercap']){
      await review.locator('#entity').selectOption(monster);
      await review.waitForFunction(()=>document.querySelector('#status')?.textContent?.startsWith('Atlas carregado'),{timeout:10000});
      await review.locator('#action').selectOption('attack');
      const framePixels=await review.locator('#frame').evaluate(canvas=>{
        const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
        let nonTransparent=0;
        for(let i=3;i<pixels.length;i+=4)if(pixels[i]>0)nonTransparent++;
        return nonTransparent;
      });
      assert.ok(framePixels>70,'blank '+monster+' frame: '+framePixels);
      await review.screenshot({path:'screenshots/m1hf-'+monster+'-'+w+'.png',fullPage:true});
    }
    const gameLink=await review.locator('#m1hGameLink').getAttribute('href');
    assert.equal(gameLink,'./?art=m1hf');
    assert.deepEqual(reviewErrors,[],'Gallery/browser errors: '+reviewErrors.join(' | '));
    await review.close();
    console.log('M1h-F '+w+'×'+h+': load, 28 frames, encounter route & gallery OK');
  }
}finally{
  await browser.close();
}
