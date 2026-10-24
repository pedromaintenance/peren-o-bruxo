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
          // Phaser.Game.scene is a SceneManager; unlike ScenePlugin it has
          // start(), not launch(). Use the same monster ID as exploration.
          game.scene.start("BattleScene",{
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
        // Trigger the real BattleScene animation without damage, mana, saves or loot.
        // Do NOT await here: the screenshot must prove the effect ON SCREEN,
        // rather than photographing the idle state after the effect has disappeared.
        await page.evaluate(({spell})=>{
          const scene=window.__perenLab.scene.getScene("BattleScene");
          window.__perenV85Animation=scene.animatePlayer(
            spell==="fire"?"spell:mag-raio-de-fogo":"spell:mag-misseis-magicos",[]
          );
          return true;
        },{spell});
        await page.waitForFunction(texture=>{
          const scene=window.__perenLab?.scene?.getScene("BattleScene");
          return scene?.children?.list?.some(child=>
            child.active && child.texture?.key===texture && child.visible);
        },texture,{timeout:8000});
        const during=await page.evaluate(texture=>{
          const scene=window.__perenLab.scene.getScene("BattleScene");
          const sprite=scene.children.list.find(child=>child.active&&child.texture?.key===texture);
          return {
            texture:sprite?.texture?.key,
            visible:sprite?.visible,
            idleHidden:scene.__v84Idle?.sprite?.visible===false,
            originalHidden:scene.peren.visible===false,
            top:sprite?.getBounds?.().top,
            bottom:sprite?.getBounds?.().bottom
          };
        },texture);
        assert.equal(during.texture,texture);
        assert.equal(during.visible,true);
        assert.equal(during.idleHidden,true,"Cinematic must temporarily hide idle battler");
        assert.equal(during.originalHidden,true);
        assert.ok(during.bottom>0 && during.top<height,"Spell animation must intersect the visible viewport");
        await page.screenshot({path:`artifacts/peren-v85-battle-${spell}-${width}.png`,fullPage:false});
        await page.evaluate(async()=>await window.__perenV85Animation);
        const after=await page.evaluate(texture=>{
          const scene=window.__perenLab.scene.getScene("BattleScene");
          return {
            cinematicCount:scene.children.list.filter(child=>child.active&&child.texture?.key===texture).length,
            idleVisible:scene.__v84Idle?.sprite?.visible,
            idleActive:scene.__v84Idle?.sprite?.active,
            oldVisible:scene.peren.visible
          };
        },texture);
        assert.equal(after.cinematicCount,0,"Cinematic leaked a sprite after completing");
        assert.equal(after.idleVisible,true,"New Idle battler did not return");
        assert.equal(after.idleActive,true);
        assert.equal(after.oldVisible,false);
        assert.deepEqual(errors,[],"In-game sprite errors: "+errors.join(" | "));
      } finally {await page.close()}
    }
  }
  console.log("PASS: 4 real BattleScene runs, new Idle visible, infernal and Void spells animated, no runtime sprite errors");
}finally {await browser.close()}
