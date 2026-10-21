// Real Phaser Modo Livre scene smoke (not merely a gallery/file URL check).
import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdirSync} from "node:fs";
const base=process.env.PEREN_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const browser=await chromium.launch({headless:true,args:["--no-sandbox","--enable-webgl","--use-gl=angle"]});
try{
  for(const width of [390,1280]){
    const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1});
    const relevant=[];
    page.on("pageerror",err=>{if(/peren|atlas|sprite|frame|texture/i.test(String(err)))relevant.push(String(err))});
    page.on("console",message=>{if(message.type()==="error"&&/peren|atlas|sprite|frame|texture/i.test(message.text()))relevant.push(message.text())});
    await page.goto(base+"/?art=m1hf",{waitUntil:"domcontentloaded"});
    await page.locator("#goForest").waitFor({state:"attached",timeout:30000});
    await page.locator("#goForest").click();
    await page.locator("#phaser canvas").waitFor({state:"attached",timeout:30000});
    await page.waitForTimeout(900);
    const canvas=page.locator("#phaser canvas");
    const box=await canvas.boundingBox();
    assert.ok(box&&box.width>100&&box.height>100,"Phaser forest canvas was not rendered");
    assert.equal(await page.locator("#selectPerenMode").count(),0);
    assert.deepEqual(relevant,[],"Phaser reported sprite/texture failures");
    mkdirSync("artifacts",{recursive:true});
    await page.screenshot({path:"artifacts/peren-v2-forest-"+width+".png",fullPage:false});
    await page.close();
  }
  console.log("Peren playable Phaser: entered forest, canvas present, no sprite-related runtime error.");
}finally{await browser.close();}
