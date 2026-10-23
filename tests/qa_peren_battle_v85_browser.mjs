// Real Phaser BattleScene asset QA — not a gallery or mock.
// Runs ONLY when all 8 v8.4 PNGs and the signed manifest are checked into the PR.
import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdirSync} from "node:fs";

const base=process.env.PEREN_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const expected={fire:"peren-v84-infernal",arcane:"peren-v84-void"};
const browser=await chromium.launch({headless:true,args:["--no-sandbox","--enable-webgl","--use-gl=angle"]});
mkdirSync("artifacts",{recursive:true});
try {
  for(const [width,height] of [[390,844],[1280,800]]){
    for(const [spell,texture] of [["fire",expected.fire],["arcane",expected.arcane]]){
      const page=await browser.newPage({viewport:{width,height},serviceWorkers:"block"});
      const errors=[];
      page.on("pageerror",err=>errors.push(String(err)));
      page.on("console",msg=>{if(msg.type()==="error")errors.push(msg.text())});
      page.on("response",resp=>{
        if(resp.url().includes("/art/battle/runtime-v84/")&&!resp.ok())errors.push("asset HTTP "+resp.status()+": "+resp.url());
      });
      try {
        await page.goto(base+"/?art=v85-qa",{waitUntil:"domcontentloaded",timeout:30000});
        await page.locator("#goForest").waitFor({state:"visible",timeout:30000});
        await page.locator("#goForest").click();
        await page.locator("#phaser canvas").waitFor({state:"visible",timeout:30000});
        await page.waitForFunction(()=>window.__perenBattleArtV84?.enabled===true,null,{timeout:45000});
        const initial=await page.evaluate(()=>{
          const game=window.__perenLab;
          if(!game)throw new Error("Peren Phaser game was not initialized");
          const scene=game.scene.getScene("BattleScene");
          game.scene.launch("BattleScene",{
            beast:{type:"mob-fungo-violeta",name:"Fungo Violeta",instanceId:"qa-v85"},
            key:"qa-v85-battle"
          });
          return {installed:scene.__perenV84Installed};
        });
        assert.equal(initial.installed,true,"BattleScene bridge was not installed before combat");
        await page.waitForFunction(()=>{
          const s=window.__perenLab?.scene?.getScene("BattleScene");
          return s?.__v84Idle?.sprite?.active===true && s.peren?.visible===false;
        },null,{timeout:30000});
        const state=await page.evaluate(()=>{
          const s=window.__perenLab.scene.getScene("BattleScene");
          const t=s.__v84Idle.sprite;
          return {visible:t.visible,texture:t.texture?.key,frames:s.anims.get("peren-v84-idle-loop")?.frames?.length,
           originalVisible:s.peren.visible,hp:s.state?.playerHp,mp:s.state?.playerMp};
        });
        assert.equal(state.texture,"peren-v84-idle","Old exploration sprite was not replaced by battler");
        assert.equal(state.frames,4);
        assert.equal(state.originalVisible,false);
        assert.ok(state.hp>0);
        assert.ok(state.mp>0);
        // Exercise real visual action choreography (without invoking save/loot).
        // Keep the original BattleScene.animatePlayer implementation in the call chain.
        const seen=await page.evaluate(async({spell,texture})=>{
          const s=window.__perenLab.scene.getScene("BattleScene");
          const original=s.add.sprite.bind(s.add),frames=[];
          s.add.sprite=(...args)=>{
            const spr=original(...args);
            if(args[2]===texture)frames.push({texture:args[2],frame:spr.frame?.name});
            return spr;
          };
          try {await s.animatePlayer(spell==="fire"?"spell:mag-raio-de-fogo":"spell:mag-misseis-magicos",[])}
          finally {s.add.sprite=original}
          return {frames,stillActive:!!s.__v84Idle?.sprite?.active,originalVisible:s.peren.visible};
        },{spell,texture});
        assert.ok(seen.frames.length>=1,"Expected an actual "+texture+" sprite in BattleScene");
        assert.ok(seen.stillActive,"Battler was lost after casting animation");
        assert.equal(seen.originalVisible,false);
        assert.deepEqual(errors,[],"In-game sprite errors: "+errors.join(" | "));
        await page.screenshot({path:`artifacts/peren-v85-battle-${spell}-${width}.png`,fullPage:false});
      } finally {await page.close()}
    }
  }
  console.log("PASS: 4 real BattleScene runs, new Idle visible, infernal and Void spells animated, no runtime sprite errors");
}finally {await browser.close()}
