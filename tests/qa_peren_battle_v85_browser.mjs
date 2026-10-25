// Real Phaser BattleScene asset QA — not a gallery or mock.
// Runs ONLY when all 8 v8.4 PNGs and the signed manifest are checked into the PR.
import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdirSync} from "node:fs";

const base=process.env.PEREN_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const expected={fire:"peren-v90-infernal",arcane:"peren-v84-void"};
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
        await page.waitForFunction(()=>window.__perenBattleArtV90?.enabled===true,null,{timeout:45000});
        const initial=await page.evaluate(()=>{
          const game=window.__perenLab;
          if(!game)throw new Error("Peren Phaser game was not initialized");
          const battle=game.scene.getScene("BattleScene");
          const exploration=game.scene.getScene("ExplorationScene");
          // Reproduce the REAL user route: a live forest monster opens
          // the encounter dialog. Clicking its Fight button then launches
          // BattleScene and hides exploration controls via the game's UI.
          const beast=exploration.beasts?.find(b=>b.type==="mob-fungo-violeta"&&b.sprite?.active)
            || exploration.beasts?.find(b=>b.sprite?.active);
          if(!beast)throw new Error("No live Mürin forest monster for encounter QA");
          exploration.openEncounter(beast);
          return {installed:battle.__perenV84Installed,monster:beast.name};
        });
        assert.equal(initial.installed,true,"BattleScene bridge was not installed before combat");
        await page.locator("#encounterModal").waitFor({state:"visible",timeout:12000});
        await page.locator("#observeBeast").click();
        await page.locator("#battleUI").waitFor({state:"visible",timeout:12000});
        const ui=await page.evaluate(()=>({
          battleVisible:!document.querySelector("#battleUI").hidden,
          forestControlsHidden:document.querySelector("#controls").hidden,
          encounterHidden:document.querySelector("#encounterModal").hidden
        }));
        assert.deepEqual(ui,{battleVisible:true,forestControlsHidden:true,encounterHidden:true},
          "The real combat HUD must replace the exploration controls");
        await page.waitForFunction(()=>{
          const s=window.__perenLab?.scene?.getScene("BattleScene");
          return s?.__v84Idle?.sprite?.active===true && s.peren?.visible===false;
        },null,{timeout:30000});
        const state=await page.evaluate(()=>{
          const s=window.__perenLab.scene.getScene("BattleScene");
          const t=s.__v84Idle.sprite,canvas=s.game.canvas.getBoundingClientRect();
          const head=document.getElementById("battleHeader").getBoundingClientRect();
          const panel=document.getElementById("battlePanel").getBoundingClientRect();
          const bounds=t.getBounds(),scale=canvas.height/s.scale.height;
          return {visible:t.visible,texture:t.texture?.key,frames:s.anims.get("peren-v84-idle-loop")?.frames?.length,
           originalVisible:s.peren.visible,hp:s.state?.playerHp,mp:s.state?.playerMp,
           boundsTop:canvas.top+bounds.top*scale,boundsBottom:canvas.top+bounds.bottom*scale,
           arenaTop:head.bottom,arenaBottom:panel.top,panelHeight:panel.height};
        });
        assert.equal(state.texture,"peren-v84-idle","Old exploration sprite was not replaced by battler");
        assert.equal(state.frames,4);
        assert.equal(state.originalVisible,false);
        assert.ok(state.hp>0);
        assert.ok(state.mp>0);
        assert.ok(state.boundsTop>=state.arenaTop-18,
          "Idle battler is hidden behind the combat header");
        assert.ok(state.boundsBottom<=state.arenaBottom+15,
          "Idle battler is hidden behind the commands");
        if(width<=620)assert.ok(state.panelHeight<height*.34,
          "Battle actions occupy too much of the mobile screen");
        if(spell==="fire")await page.screenshot({
          path:`artifacts/peren-v85-idle-${width}.png`,fullPage:false
        });
        // Trigger the real BattleScene animation without damage, mana, saves or loot.
        // Do NOT await here: the screenshot must prove the effect ON SCREEN,
        // rather than photographing the idle state after the effect has disappeared.
        await page.evaluate(({spell})=>{
          const scene=window.__perenLab.scene.getScene("BattleScene");
          if(spell==="fire"){
            if(window.__perenBattleArtV90?.sparksEnabled!==true)throw Error("Spark v10 PNG not activated in BattleScene");
            if(window.__perenBattleArtV90?.flameEnabled!==true)throw Error("Flame v10 PNG not activated in BattleScene");
            if(window.__perenBattleArtV90?.embersEnabled!==true)throw Error("Embers v11 PNG not activated in BattleScene");
            if(window.__perenBattleArtV90?.pupilEnabled!==true)throw Error("Pupil v11 PNG not activated in BattleScene");
            if(window.__perenBattleArtV90?.ringEnabled!==true)throw Error("Ring v12 PNG not activated in BattleScene");
            if(window.__perenBattleArtV90?.burstEnabled!==true)throw Error("Burst v13 PNG not activated in BattleScene");
            if(window.__perenBattleArtV90?.blazeEnabled!==true)throw Error("Labareda v14 PNG not activated in BattleScene");
            window.__perenV10SparkFrames=[];
            window.__perenV10Track=()=>{
              const sprite=scene.children.list.find(child=>child.active&&child.texture?.key==="peren-v10-sparks");
              if(sprite)window.__perenV10SparkFrames.push(Number(sprite.frame?.name));
            };
            scene.events.on("update",window.__perenV10Track);
            window.__perenV10FlameFrames=[];
            window.__perenV10FlameTrack=()=>{
              const sprite=scene.children.list.find(child=>child.active&&child.texture?.key==="peren-v10-flame");
              if(sprite)window.__perenV10FlameFrames.push(Number(sprite.frame?.name));
            };
            scene.events.on("update",window.__perenV10FlameTrack);
            for(const [id,key] of [["Embers","peren-v11-embers"],["Pupil","peren-v11-pupil"]]){
              const frames=[];
              window["__perenV11"+id+"Frames"]=frames;
              const handler=()=>{
                const sprite=scene.children.list.find(child=>
                  child.active&&child.texture?.key===key&&child.alpha>0);
                if(sprite)frames.push(Number(sprite.frame?.name));
              };
              window["__perenV11"+id+"Track"]=handler;
              scene.events.on("update",handler);
            }
            window.__perenV12RingFrames=[];
            window.__perenV12RingTrack=()=>{
              const sprite=scene.children.list.find(child=>
                child.active&&child.texture?.key==="peren-v12-ring"&&child.alpha>0);
              if(sprite)window.__perenV12RingFrames.push(Number(sprite.frame?.name));
            };
            scene.events.on("update",window.__perenV12RingTrack);
            window.__perenV13BurstFrames=[];
            window.__perenV13BurstTrack=()=>{
              const sprite=scene.children.list.find(child=>
                child.active&&child.texture?.key==="peren-v13-burst"&&child.alpha>0);
              if(sprite)window.__perenV13BurstFrames.push(Number(sprite.frame?.name));
            };
            scene.events.on("update",window.__perenV13BurstTrack);
            window.__perenV14BlazeFrames=[];
            window.__perenV14BlazeTrack=()=>{
              const sprite=scene.children.list.find(child=>
                child.active&&child.texture?.key==="peren-v14-blaze"&&child.alpha>0);
              if(sprite)window.__perenV14BlazeFrames.push(Number(sprite.frame?.name));
            };
            scene.events.on("update",window.__perenV14BlazeTrack);
            window.__perenV92SeenFrames=[];
            window.__perenV92Observe=()=>{
              const sprite=scene.children.list.find(child=>
                child.active&&child.texture?.key==="peren-v90-infernal");
              if(sprite)window.__perenV92SeenFrames.push(Number(sprite.frame?.name));
            };
            scene.events.on("update",window.__perenV92Observe);
          }
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
            maskApplied:Boolean(sprite?.mask),
            idleHidden:scene.__v84Idle?.sprite?.visible===false,
            originalHidden:scene.peren.visible===false,
            top:sprite?.getBounds?.().top,
            bottom:sprite?.getBounds?.().bottom
          };
        },texture);
        assert.equal(during.texture,texture);
        if(spell==="fire")assert.equal(during.maskApplied,true,"Infernal sprite must feather its cropped atlas edges");
        assert.equal(during.visible,true);
        assert.equal(during.idleHidden,true,"Cinematic must temporarily hide idle battler");
        assert.equal(during.originalHidden,true);
        assert.ok(during.bottom>0 && during.top<height,"Spell animation must intersect the visible viewport");
        // Frame-by-frame evidence is collected by scene update listeners above.
        // Avoid waiting on an ephemeral frame after expensive screenshots:
        // the renderer may have passed it by the time Playwright polls.
        await page.screenshot({path:`artifacts/peren-v85-battle-${spell}-${width}.png`,fullPage:false});
        await page.evaluate(async()=>await window.__perenV85Animation);
        if(spell==="fire"){
          const sparkFrames=await page.evaluate(()=>{
            const scene=window.__perenLab.scene.getScene("BattleScene");
            scene.events.off("update",window.__perenV10Track);
            return [...new Set(window.__perenV10SparkFrames)];
          });
          assert.deepEqual(sparkFrames,[0,1,2,3,4],
            "Spark animation must show all five author-approved phases before ending");
          const flameFrames=await page.evaluate(()=>{
            const scene=window.__perenLab.scene.getScene("BattleScene");
            scene.events.off("update",window.__perenV10FlameTrack);
            return [...new Set(window.__perenV10FlameFrames)];
          });
          assert.deepEqual(flameFrames,[0,1,2,3,4],
            "Flame animation must show all five creator-approved phases before ending");
          const phases=await page.evaluate(()=>{
            const scene=window.__perenLab.scene.getScene("BattleScene");
            return ["Embers","Pupil"].map(id=>{
              scene.events.off("update",window["__perenV11"+id+"Track"]);
              return [...new Set(window["__perenV11"+id+"Frames"])];
            });
          });
          assert.deepEqual(phases,[[0,1,2,3,4],[0,1,2,3,4]],
            "Embers and Pupil must each render all five real phases");
          const ringFrames=await page.evaluate(()=>{
            const scene=window.__perenLab.scene.getScene("BattleScene");
            scene.events.off("update",window.__perenV12RingTrack);
            return [...new Set(window.__perenV12RingFrames)];
          });
          assert.deepEqual(ringFrames,[0,1,2,3,4],
            "Fifth effect Ring must render all five real phases");
          const burstFrames=await page.evaluate(()=>{
            const scene=window.__perenLab.scene.getScene("BattleScene");
            scene.events.off("update",window.__perenV13BurstTrack);
            return [...new Set(window.__perenV13BurstFrames)];
          });
          assert.deepEqual(burstFrames,[0,1,2,3,4],
            "Sixth effect Burst must render all five actual frames");
          const blazeFrames=await page.evaluate(()=>{
            const scene=window.__perenLab.scene.getScene("BattleScene");
            scene.events.off("update",window.__perenV14BlazeTrack);
            return [...new Set(window.__perenV14BlazeFrames)];
          });
          assert.deepEqual(blazeFrames,[0,1,2,3,4],
            "Seventh fire effect Labareda must render all five actual frames");
          const seen=await page.evaluate(()=>{
            const scene=window.__perenLab.scene.getScene("BattleScene");
            scene.events.off("update",window.__perenV92Observe);
            return window.__perenV92SeenFrames;
          });
          assert.ok(seen.includes(6),"Clean ending frame #6 must be visible");
          assert.equal(seen.includes(7),false,"Defective skull frame #7 was drawn!");
        }
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
