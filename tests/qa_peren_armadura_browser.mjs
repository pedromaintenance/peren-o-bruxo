import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {chromium} from "playwright";
const origin=process.env.PEREN_ORIGIN||"http://127.0.0.1:8765";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 const page=await browser.newPage({viewport:{width:440,height:740},serviceWorkers:"block"});
 const errors=[];page.on("pageerror",e=>errors.push(String(e)));
 await page.goto(origin+"/",{waitUntil:"domcontentloaded"});
 const dims=await page.evaluate(async()=>{
  const img=document.createElement("img");img.id="peren-armor-qa";
  img.src="./assets/icons/armadura.webp";img.alt="Armadura flutuante animada";
  Object.assign(img.style,{position:"fixed",zIndex:"999999",left:"16px",top:"16px",width:"160px",height:"160px",background:"#18212a"});
  document.body.appendChild(img);await img.decode();return [img.naturalWidth,img.naturalHeight];
 });
 assert.deepEqual(dims,[160,160]);
 const image=page.locator("#peren-armor-qa"), samples=[];
 for(let i=0;i<6;i++){await page.waitForTimeout(i===0?100:200);samples.push(createHash("sha256").update(await image.screenshot({animations:"allow"})).digest("hex"));}
 assert.ok(new Set(samples).size>=3,"armour must visibly float across multiple poses");
 assert.deepEqual(errors,[]);
 console.log("PEREN ARMOR BROWSER PASS",samples);
}finally{await browser.close()}
