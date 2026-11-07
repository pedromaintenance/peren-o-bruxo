/**
 * Browser smoke end-to-end for actual Phaser: craft → inventory → use outside battle
 * → persistent receipt, then open field inventory and verify scene pause/resume.
 * Execute after npm run build and npm run preview.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildCatalogs,newClassicState,stageFromClassic,PHASER_KEY} from '../src/progress.js';
const load=name=>JSON.parse(readFileSync(new URL('../../data/'+name+'.json',import.meta.url),'utf8'));
const c=buildCatalogs(Object.fromEntries(['itens','receitas','magias','monstros','cidades','curadoria_ingredientes'].map(k=>[k,load(k)])));
const state=newClassicState();state.hp=50;state.mp=30;
const initial=stageFromClassic(state,c);
const url=process.env.PEREN_PREVIEW_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(({key,save})=>localStorage.setItem(key,JSON.stringify(save)),{key:PHASER_KEY,save:initial});
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>!!window.__perenProgress?.save,{timeout:30000});

 await page.locator('#showCraft').click();
 await page.waitForSelector('#alchemySidebar:not([hidden])');
 await page.locator('#alchemyFreeMode').click();
 await page.locator('#alchemyA').selectOption('ing-blue-mountain-flower');
 await page.locator('#alchemyB').selectOption('ing-butterfly-wing');
 await page.locator('#alchemyBrew').click();
 await page.waitForFunction(()=>document.getElementById('alchemyLastResult').textContent.includes('Resultado:'),{timeout:30000});
 const crafted=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PHASER_KEY);
 assert.equal(crafted.character.alchemy.preparations.length,1);
 const id=crafted.character.alchemy.preparations[0].id;
 assert.equal(crafted.character.hp,50);
 assert.equal(crafted.character.actions,2);

 await page.locator('#craftClose').click();
 await page.locator('#openBagHub').click();
 await page.waitForSelector('#inventoryUI:not([hidden])');
 const card=page.locator('#invGrid [data-item-id="'+id+'"]');
 assert.equal(await card.count(),1,'O frasco precisa aparecer no inventário de verdade');
 await card.click();
 assert.equal(await page.locator('#invUsePreparation').isVisible(),true);
 assert.equal(await page.locator('#invUsePreparation').isEnabled(),true);
 const shown=await page.locator('#invSelectedDescription').textContent();
 assert.equal(shown.includes('restaurar_saude'),false,'Inventário não pode revelar ID oculto');
 await page.locator('#invUsePreparation').click();
 await page.waitForFunction(()=>document.getElementById('invPrepFeedback').textContent.includes('Preparo utilizado.'));
 const used=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PHASER_KEY);
 assert.equal(used.character.hp,74,'Restaurar Saúde deve funcionar no mundo fora do combate');
 assert.equal(used.character.actions,2,'Uso de campo não cobra ação diária nesta hipótese');
 assert.equal(used.character.alchemy.preparations.length,0,'Deve consumir uma única instância');
 assert.equal(used.ledger['prepared-use:'+id].quantityConsumed,1);
 assert.equal(JSON.stringify(used.ledger['prepared-use:'+id]).includes('restaurar_saude'),false,'Recibo público não pode dar spoiler');
 assert.equal(await page.locator('#invGrid [data-item-id="'+id+'"]').count(),0);
 assert.equal(await page.locator('#invUsePreparation').isVisible(),false);

 await page.locator('#invClose').click();
 await page.locator('#goForest').click();
 await page.waitForSelector('#controls:not([hidden])',{timeout:30000});
 await page.locator('#fieldInventoryBtn').click();
 await page.waitForSelector('#inventoryUI:not([hidden])');
 const paused=await page.evaluate(()=>window.__perenLab.scene.isPaused('ExplorationScene'));
 assert.equal(paused,true,'Menu aberto em campo deve suspender a cena');
 await page.locator('#invClose').click();
 const active=await page.evaluate(()=>window.__perenLab.scene.isActive('ExplorationScene'));
 assert.equal(active,true,'Fechar inventário deve retomar a exploração');
 assert.deepEqual(errors,[],'Erros de script no navegador');
 console.log('Prepared exploration browser smoke: craft, inventory use, persist, field pause/resume PASS');
}finally{
 await browser.close();
}
