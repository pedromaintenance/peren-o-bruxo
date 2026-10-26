// Real Phaser BattleScene asset QA — not a gallery or mock.
// Runs ONLY when all 8 v8.4 PNGs and the signed manifest are checked into the PR.
import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdirSync} from "node:fs";

const base=process.env.PEREN_BASE_URL||"http://127.0.0.1:8765/phaser-demo-m1hf";
const expected={fire:"peren-v19-casting-fire",arcane:"peren-v84-void"};
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
            if(window.__perenBattleArtV90?.sparksEnabled!==true)throw Error("Casting sparks not available");
            if(window.__perenBattleArtV90?.flameEnabled!==true)throw Error("Enemy flame not available");
            if(window.__perenBattleArtV90?.castingFireEnabled!==true)throw Error("Fire-lit casting Peren not available");
            window.__perenV19Fire={sparks:[],flame:[],casting:[],unexpected:[],sparksPositions:[],sparksWidths:[],flamePositions:[],flameTriads:[]};
            const forbidden=new Set([
              "vfx-fire","peren-v90-infernal","peren-v17-skullcloud","peren-v16-hellskull",
              "peren-v10-flame-legacy","peren-v11-embers","peren-v11-pupil",
              "peren-v12-ring","peren-v13-burst","peren-v14-blaze","peren-v15-smoke"
            ]);
            window.__perenV19Observe=()=>{
              for(const child of scene.children.list){
                if(!child.active||!child.visible||child.alpha<=0)continue;
                const key=child.texture?.key;
                if(key==="peren-v10-sparks"){
                  window.__perenV19Fire.sparks.push(Number(child.frame?.name));
                  window.__perenV19Fire.sparksPositions.push(child.x);
                  window.__perenV19Fire.sparksWidths.push(child.displayWidth);
                }
                if(key==="peren-v10-flame"){
                  window.__perenV19Fire.flame.push(Number(child.frame?.name));
                  window.__perenV19Fire.flamePositions.push(child.x);
                }
                if(key==="peren-v19-casting-fire")window.__perenV19Fire.casting.push(Number(child.frame?.name));
                if(forbidden.has(key))window.__perenV19Fire.unexpected.push(key);
              }
              // Capture the live group after all three sprites have spawned. This
              // checks real Phaser rotation/anchor/scale, not just authored values.
              const visibleFlames=scene.children.list.filter(c=>c.active&&c.visible&&c.alpha>0&&c.texture?.key==="peren-v10-flame");
              if(visibleFlames.length===3){
                window.__perenV19Fire.flameTriads.push(visibleFlames.map(c=>({
                  x:c.x,y:c.y,rotation:c.rotation,scaleX:c.scaleX,
                  originX:c.originX,originY:c.originY,frame:Number(c.frame?.name)
                })));
              }
            };
            scene.events.on("update",window.__perenV19Observe);
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
        if(spell==="fire")assert.equal(during.maskApplied,false,"New casting PNG should not need Infernal cropping");
        assert.equal(during.visible,true);
        assert.equal(during.idleHidden,true,"Cinematic must temporarily hide idle battler");
        assert.equal(during.originalHidden,true);
        assert.ok(during.bottom>0 && during.top<height,"Spell animation must intersect the visible viewport");
        // Do not poll for an ephemeral 895ms sprite after synchronizing across
        // Playwright: the update observer records every live frame and flipX.
        // Screenshot captures the battle; frame-by-frame checks below prove VFX.
        await page.screenshot({path:`artifacts/peren-v85-battle-${spell}-${width}.png`,fullPage:false});
        await page.evaluate(async()=>await window.__perenV85Animation);
        if(spell==="fire"){
          const fire=await page.evaluate(()=>{
            const scene=window.__perenLab.scene.getScene("BattleScene");
            scene.events.off("update",window.__perenV19Observe);
            return {observations:window.__perenV19Fire,arenaWidth:scene.scale.width};
          });
          assert.deepEqual([...new Set(fire.observations.sparks)],[0,1,2,3,4],"Five sparks frames must appear by Peren");
          assert.deepEqual([...new Set(fire.observations.flame)],[0,1,2,3,4],"Five flame frames must appear at the target");
          assert.deepEqual([...new Set(fire.observations.casting)],[0,1,2,3],"Peren must cast in four authored frames");
          const compact=fire.arenaWidth<=620;
          const sparkTarget=fire.arenaWidth*(compact?.30:.285);
          const flameTarget=fire.arenaWidth*(compact?.74:.75);
          assert.ok(fire.observations.sparksPositions.length>0 &&
            fire.observations.sparksPositions.every(x=>Math.abs(x-sparkTarget)<.5),
            "Sparks must sit close to Peren on mobile and desktop");
          assert.ok(fire.observations.sparksWidths.length>0 &&
            fire.observations.sparksWidths.every(width=>width<fire.arenaWidth*(compact?.084:.042)),
            "Sparks should only slightly exceed Peren's hand size, not cover the whole caster");
          assert.ok(fire.observations.flamePositions.length>0 &&
            fire.observations.flamePositions.every(x=>Math.abs(x-flameTarget)<.5),
            "Flame must be centered to the left of its previous target offset");
          assert.ok(fire.observations.flameTriads.length>0,"Three concurrent flames must appear over the enemy");
          for(const trio of fire.observations.flameTriads){
            assert.equal(trio.length,3);
            assert.ok(trio.every(f=>Math.abs(f.x-trio[0].x)<.5&&Math.abs(f.y-trio[0].y)<.5),
              "All flame bases must have the exact same center");
            assert.ok(trio.every(f=>f.originX===.5&&f.originY===1),
              "Flames must rotate around their lower center");
            const angles=trio.map(f=>f.rotation).sort((a,b)=>a-b);
            assert.ok(angles.every((v,i)=>Math.abs(v-[-Math.PI/4,0,Math.PI/4][i])<.01),
              "Side flames must be inclined at negative/positive 45 degrees");
            const core=trio.find(f=>Math.abs(f.rotation)<.01);
            assert.ok(trio.every(f=>f===core||f.scaleX<core.scaleX),"Center flame must be larger");
            assert.ok(trio.every(f=>f.frame===trio[0].frame),"Flame frames must be synchronized");
          }
          assert.deepEqual(fire.observations.unexpected,[],"No procedural vfx-fire, skull cloud, giant Infernal or other high-level VFX");
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
  console.log("PASS: 4 real BattleScene runs; basic Fire Bolt uses Peren casting, hand sparks, enemy flame; Void untouched");
}finally {await browser.close()}
