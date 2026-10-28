import assert from "node:assert/strict";
import {chromium} from "playwright";
const origin=process.env.PEREN_ORIGIN||"http://127.0.0.1:8765";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 const page=await browser.newPage({viewport:{width:440,height:740},serviceWorkers:"block"});
 const errors=[];
 page.on("pageerror",e=>errors.push(String(e)));
 await page.goto(origin+"/",{waitUntil:"domcontentloaded"});
 const answer=await page.evaluate(async()=>{
  const image=new Image();image.src="./assets/icons/anel.webp";
  await image.decode();
  const c=document.createElement("canvas");c.width=160;c.height=160;
  const g=c.getContext("2d",{willReadFrequently:true});
  const sample=()=>{g.clearRect(0,0,160,160);g.drawImage(image,0,0);let d=g.getImageData(0,0,160,160).data;let v=0;for(let i=0;i<d.length;i+=53)v=(v*33+d[i])>>>0;return v};
  const first=sample();
  await new Promise(r=>setTimeout(r,420));
  const second=sample();
  return {complete:image.complete,dimensions:[image.naturalWidth,image.naturalHeight],first,second};
 });
 assert.equal(answer.complete,true);
 assert.deepEqual(answer.dimensions,[160,160]);
 assert.notEqual(answer.first,answer.second,"animated webp must advance frames");
 assert.deepEqual(errors,[]);
 console.log("PEREN RING BROWSER PASS",answer);
}finally{await browser.close()}
