import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {chromium} from "playwright";
const origin=process.env.PEREN_ORIGIN||"http://127.0.0.1:8765";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 const page=await browser.newPage({viewport:{width:440,height:740},serviceWorkers:"block"});
 const errors=[];
 page.on("pageerror",e=>errors.push(String(e)));
 await page.goto(origin+"/",{waitUntil:"domcontentloaded"});
 const dim=await page.evaluate(async()=>{
  const img=document.createElement("img");img.id="peren-ring-qa";img.src="./assets/icons/anel.webp";img.alt="Anel animado";
  Object.assign(img.style,{position:"fixed",zIndex:"999999",left:"15px",top:"15px",width:"160px",height:"160px",background:"#18212a"});
  document.body.appendChild(img);
  await img.decode();
  return [img.naturalWidth,img.naturalHeight];
 });
 assert.deepEqual(dim,[160,160]);
 const loc=page.locator("#peren-ring-qa");
 const samples=[];
 for(let i=0;i<5;i++){
   await page.waitForTimeout(i===0?110:220);
   const capture=await loc.screenshot({animations:"allow"});
   samples.push(createHash("sha256").update(capture).digest("hex"));
 }
 assert.ok(new Set(samples).size>=2,"rendered WebP image must visibly animate");
 assert.deepEqual(errors,[]);
 console.log("PEREN RING BROWSER PASS",samples);
}finally{await browser.close()}
