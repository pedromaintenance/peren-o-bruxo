import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {chromium} from "playwright";
const origin=process.env.PEREN_ORIGIN||"http://127.0.0.1:8765";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try {
 const page=await browser.newPage({viewport:{width:440,height:740},serviceWorkers:"block"});
 const errors=[];page.on("pageerror",e=>errors.push(String(e)));
 await page.goto(origin+"/",{waitUntil:"domcontentloaded"});
 const dimensions=await page.evaluate(async()=>{
  const img=document.createElement("img");img.id="peren-bow-qa";
  img.src="./assets/icons/arco.webp";img.alt="Arco animado";
  Object.assign(img.style,{position:"fixed",zIndex:"999999",left:"16px",top:"16px",width:"160px",height:"160px",background:"#18212a"});
  document.body.appendChild(img);
  await img.decode();return [img.naturalWidth,img.naturalHeight];
 });
 assert.deepEqual(dimensions,[160,160]);
 const loc=page.locator("#peren-bow-qa");
 const samples=[];
 for(let i=0;i<6;i++){await page.waitForTimeout(i===0?110:200);samples.push(createHash("sha256").update(await loc.screenshot({animations:"allow"})).digest("hex"));}
 assert.ok(new Set(samples).size>=3,"bow animation must visibly advance among poses");
 assert.deepEqual(errors,[]);
 console.log("PEREN BOW BROWSER PASS",samples);
}finally{await browser.close()}
