import Phaser from 'phaser';
import {buildForest,nearestResource,validExit,TILE,WIDTH,HEIGHT} from './world.js';
import {MURIN_BEASTS,spawnMurinCreatures,monsterDecision,worldWeather,environmentAt,safeRetreat} from './encounters.js';
import {encounterKey,defaultProfile} from './combat.js';

const ASSET = './art/';
const artVariant=new URLSearchParams(location.search).get('art');
const PEREN=({'m1h':'./art-m1h/characters/peren/','m1hb':'./art-m1hb/characters/peren/','m1hc':'./art-m1hc/characters/peren/','m1hd':'./art-m1hd/characters/peren/'})[artVariant]||`${ASSET}characters/peren/`;
const MURIN = `${ASSET}regions/floresta-murin/`;
const MONSTER_ART=artVariant==='m1hf'?'./art-m1hf/monsters/':artVariant==='m1he'?'./art-m1he/monsters/':`${ASSET}monsters/`;
const directions={down:0,left:1,right:2,up:3};
const actions=['idle','walk','run','interact','gather','hurt','cast','attack'];
const directionsList=Object.keys(directions);

export class ExplorationScene extends Phaser.Scene {
  constructor(){super({key:'ExplorationScene'});this.mode='idle';this.isGathering=false;this.collected=new Set();}
  preload(){
    this.load.spritesheet('peren',PEREN+'peren-atlas.png',{frameWidth:48,frameHeight:64});
    this.load.spritesheet('forest-ground',MURIN+'ground-tiles.png',{frameWidth:32,frameHeight:32});
    ['tree-0','tree-1','tree-2','herb','mushroom','stone','rune','exit','bush'].forEach(n=>this.load.image(n,MURIN+n+'.png'));
    for(const beast of MURIN_BEASTS){
      this.load.spritesheet(beast.id,`${MONSTER_ART}${beast.id}/atlas.png`,{frameWidth:64,frameHeight:64});
      this.load.image(`${beast.id}-portrait`,`${MONSTER_ART}${beast.id}/portrait.png`);
    }
  }
  create(){
    this.world=buildForest(this.registry.get('seed')||'murin-001');
    const bridge=this.registry.get('progressBridge');
    this.collected=new Set(bridge?.collectedIds(this.world.seed)||[]);
    if(!this.registry.get('combatProfile'))this.registry.set('combatProfile',defaultProfile());
    this.weather=worldWeather(this.world.seed);
    this.activeEncounter=null;this.enemyClock=0;
    if(!validExit(this.world))throw new Error('Expedição sem caminho até saída');
    const world=this.world; this.registry.set('worldValid',true);
    this.cameras.main.setBounds(0,0,WIDTH*TILE,HEIGHT*TILE);
    this.physics.world.setBounds(0,0,WIDTH*TILE,HEIGHT*TILE);
    const terrain=this.add.group();
    for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)terrain.add(this.add.image(x*TILE,y*TILE,'forest-ground',world.ground[y][x]).setOrigin(0).setDepth(-10));
    // Foliage is visual only. Physics colliders are small trunk footprints.
    // Keeping images separate avoids StaticBody offsets turning crowns into walls.
    const colliders=this.physics.add.staticGroup();
    this.treeTrunks=[];
    for(const obj of world.obstacles){
      const x=(obj.x+.5)*TILE,y=(obj.y+.5)*TILE;
      const tree=obj.kind==='tree';
      this.add.image(x,y,tree?`tree-${obj.variant}`:'stone')
        .setOrigin(.5,tree?.91:.88).setDepth(y+(tree?6:0));
      const trunk=colliders.create(x,y+(tree?-2:-5),'stone');
      trunk.setDisplaySize(tree?14:22,tree?14:14).setVisible(false);
      trunk.refreshBody();
      if(tree)this.treeTrunks.push({id:obj.id,x,y,collider:trunk});
    }
    // Static blockers over water, invisible. Sprite art remains in the ground layer.
    const blockers=this.physics.add.staticGroup();
    for(const pos of world.blocked){if(world.obstacles.some(o=>`${o.x},${o.y}`===pos))continue;const [x,y]=pos.split(',').map(Number);
      const obj=blockers.create((x+.5)*TILE,(y+.5)*TILE,'forest-ground',7).setVisible(false);
      obj.body.setSize(TILE,TILE);obj.refreshBody();
    }
    this.resources=new Map();
    for(const node of world.nodes){if(this.collected.has(node.id))continue;const s=this.add.image((node.x+.5)*TILE,(node.y+.5)*TILE,node.sprite).setDepth(node.y*TILE+16);this.resources.set(node.id,s)}
    const ex=world.exit;const marker=this.add.image((ex.x+.5)*TILE,(ex.y+.5)*TILE,'exit').setDepth(ex.y*TILE+15);
    this.tweens.add({targets:marker,alpha:.55,duration:850,yoyo:true,repeat:-1});
    this.animsForPeren();
    const spawn=world.entry;this.player=this.physics.add.sprite((spawn.x+.5)*TILE,(spawn.y+.5)*TILE,'peren',0);
    this.player.setSize(20,14).setOffset(14,47).setCollideWorldBounds(true).setMaxVelocity(210);
    this.player.setDrag(500);this.direction='right';this.currentAnimation='';
    this.physics.add.collider(this.player,colliders);this.physics.add.collider(this.player,blockers);
    this.createBeasts(colliders,blockers);
    this.cameras.main.startFollow(this.player,true,.10,.10);
    this.cameras.main.setZoom(1.4);
    this.key=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT,E,SPACE,ESC');
    // A joystick is drawn in fixed HTML, outside the zoomed camera.
    this.joy={x:0,y:0,active:false};this.gamepadInput={move:{x:0,y:0},sprint:false};
    this.registry.set('collected',{});this.registry.set('status',this.weather==='neblina'?'A névoa esconde predadores. Observe antes de avançar.':'Siga a trilha: ervas e criaturas estão à espreita.');
    this.registry.set('beastCount',this.beasts.length);this.registry.set('weather',this.weather);this.registry.set('threat','Patrulhas distantes');
    this.registry.set('ready',true);
    // a few subtle environmental motes, spatial and not interactive
    const motes=this.add.particles(0,0,'rune',{x:{min:0,max:WIDTH*TILE},y:{min:0,max:HEIGHT*TILE},scale:{start:.08,end:0},alpha:{start:.32,end:0},lifespan:1800,frequency:400,quantity:1,blendMode:'ADD'}).setDepth(1000);
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)motes.stop();
    if(!document.getElementById('hub').hidden)this.scene.pause();
  }
  animsForPeren(){
    for(const [dir,di] of Object.entries(directions))for(const [ai,act] of actions.entries()){
      const key=`peren-${dir}-${act}`;
      if(this.anims.exists(key))continue;
      this.anims.create({key,frames:this.anims.generateFrameNumbers('peren',{start:di*32+ai*4,end:di*32+ai*4+3}),frameRate:{idle:3,walk:8,run:12,interact:6,gather:6,hurt:6,cast:8,attack:10}[act],repeat:['idle','walk','run'].includes(act)?-1:0});
    }
  }
  playState(act){const key=`peren-${this.direction}-${act}`;if(this.currentAnimation!==key){this.currentAnimation=key;this.player.anims.play(key,true)}}
  createBeasts(colliders,blockers){
    const claims=this.registry.get('combatProfile')?.claims||{};
    this.beasts=spawnMurinCreatures(this.world).filter(monster=>!claims[encounterKey(this.world.seed,monster.instanceId)]).map(monster=>{
      const spr=this.physics.add.sprite(monster.x,monster.y,monster.type,0);
      spr.setCollideWorldBounds(true).setSize(25,18).setOffset(20,38).setMaxVelocity(95);
      spr.setDepth(spr.y+28);
      this.physics.add.collider(spr,colliders);this.physics.add.collider(spr,blockers);
      for(const [ai,act] of ['idle','walk','alert','attack','hurt','retreat','death'].entries()){
        const key=`${monster.type}-${act}`;
        if(!this.anims.exists(key))this.anims.create({key,
          frames:this.anims.generateFrameNumbers(monster.type,{start:ai*4,end:ai*4+3}),
          frameRate:{idle:3,walk:7,alert:6,attack:10,hurt:8,retreat:8,death:6}[act],
          repeat:['idle','walk','alert','retreat'].includes(act)?-1:0});
      }
      spr.anims.play(`${monster.type}-idle`);
      const bar=this.add.graphics().setDepth(5000);
      return {...monster,sprite:spr,bar};
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
      for(const beast of this.beasts){beast.sprite?.destroy();beast.bar?.destroy();}
    });
  }
  updateBeasts(delta,time){
    if(!this.beasts||this.activeEncounter)return;
    const player={x:this.player.x,y:this.player.y};
    const running=this.key.SHIFT.isDown||this.sprintTouch||this.gamepadInput?.sprint;
    let highest=0;
    for(let i=0;i<this.beasts.length;i++){
      const beast=this.beasts[i];const spr=beast.sprite;
      const decision=monsterDecision(this.world,beast,player,Math.min(100,delta),{sprint:running,weather:this.weather,time});
      Object.assign(beast,decision.next);
      if(decision.detected)highest++;
      if(decision.encounter){this.openEncounter(beast);return;}
      const target=beast.target;
      const walk=target?Math.hypot(target.x-spr.x,target.y-spr.y):0;
      const speed=beast.state==='perseguicao'?beast.speed*1.15:beast.state==='retirada'?beast.speed*.85:beast.speed*.65;
      if(target&&walk>8){spr.setVelocity((target.x-spr.x)/walk*speed,(target.y-spr.y)/walk*speed);}else spr.setVelocity(0,0);
      const wanted=beast.state==='perseguicao'?'alert':beast.state==='retirada'?'retreat':walk>8?'walk':'idle';
      const anim=`${beast.type}-${wanted}`;
      if(spr.anims.currentAnim?.key!==anim)spr.anims.play(anim,true);
      spr.setFlipX(target?.x<spr.x);spr.setDepth(spr.y+28);
      beast.x=spr.x;beast.y=spr.y;
      const bar=beast.bar;bar.clear();
      // The red alert rune appears only when the creature perceives Peren.
      if(beast.state==='perseguicao'){
        bar.fillStyle(0x11151a,.82);bar.fillRoundedRect(spr.x-14,spr.y-39,28,5,2);
        bar.fillStyle(0xe99d68,1);bar.fillRoundedRect(spr.x-13,spr.y-38,26,3,1);
      }
    }
    const label=highest?`${highest} criatura(s) perceberam Peren`:'Patrulhas distantes';
    if(this.registry.get('threat')!==label)this.registry.set('threat',label);
  }
  openEncounter(beast){
    if(this.activeEncounter)return;
    this.activeEncounter=beast;
    this.player.setVelocity(0,0);beast.sprite.setVelocity(0,0);
    this.registry.set('status',`Encontro: ${beast.name}. É possível observar ou recuar.`);
    this.registry.set('encounter',{id:beast.instanceId,type:beast.type,name:beast.name,behavior:beast.behavior});
    this.game.events.emit('peren-encounter',this.registry.get('encounter'));
    this.scene.pause();
  }
  fightEncounter(){
    const beast=this.activeEncounter;
    if(!beast||this.scene.isActive('BattleScene'))return false;
    this.registry.set('encounter',null);
    const key=encounterKey(this.world.seed,beast.instanceId);
    this.scene.launch('BattleScene',{beast:{type:beast.type,name:beast.name,instanceId:beast.instanceId},key});
    return true;
  }
  finishCombat(outcome){
    const beast=this.activeEncounter;
    if(!beast){this.scene.resume();return false;}
    if(outcome==='won'){
      beast.sprite?.destroy();beast.bar?.destroy();
      this.beasts=this.beasts.filter(b=>b!==beast);
      this.registry.set('beastCount',this.beasts.length);
      this.registry.set('status',`${beast.name} foi derrotado. Os materiais estão no inventário de Peren.`);
    }else{
      const safe=safeRetreat(this.world,{x:this.player.x,y:this.player.y},beast,this.beasts.filter(b=>b!==beast));
      this.player.body.reset(safe.x,safe.y);
      beast.cooldown=14000;beast.state='retirada';beast.lastSeen=null;
      beast.sprite.body.reset(beast.sprite.x,beast.sprite.y);
      this.registry.set('status',outcome==='fled'?'Peren escapou. Nenhuma recompensa concedida.':'Peren foi resgatado. Nenhuma recompensa concedida.');
    }
    this.activeEncounter=null;
    this.registry.set('encounter',null);
    this.scene.resume();return true;
  }
  retreatEncounter(){
    const beast=this.activeEncounter;if(!beast)return false;
    const safe=safeRetreat(this.world,{x:this.player.x,y:this.player.y},beast,this.beasts.filter(b=>b!==beast));
    this.player.body.reset(safe.x,safe.y);
    beast.cooldown=10000;beast.state='retirada';beast.lastSeen=null;
    beast.sprite.body.reset(beast.sprite.x,beast.sprite.y);
    this.activeEncounter=null;
    this.registry.set('encounter',null);
    this.registry.set('status',`Você recuou de ${beast.name}. Nenhum XP, ouro ou loot foi concedido.`);
    this.scene.resume();return true;
  }
  collect(){
    if(this.isGathering)return;
    const n=nearestResource(this.world,this.player.x,this.player.y,this.collected);
    if(!n){this.registry.set('status','Aproxime-se de uma planta ou cogumelo.');return}
    this.isGathering=true;this.player.setVelocity(0,0);this.playState('gather');
    this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE,()=>{
      if(this.collected.has(n.id)){this.isGathering=false;return}
      const bridge=this.registry.get('progressBridge');
      if(bridge){try{bridge.execute({type:'collect',seed:this.world.seed,nodeId:n.id,world:this.world});
         this.registry.set('combatProfile',bridge.combatProfile());this.game.events.emit('peren-progress-change',bridge.read());
       }catch(err){this.registry.set('status','Coleta não salva: '+err.message);this.game.events.emit('peren-progress-error',err.message);this.isGathering=false;return}}
      this.collected.add(n.id);
      const bag={...this.registry.get('collected')};bag[n.itemId]=(bag[n.itemId]||0)+n.count;
      this.registry.set('collected',bag);
      this.registry.set('status',`+${n.count} ${n.name}`);
      const s=this.resources.get(n.id);if(s){this.tweens.add({targets:s,y:s.y-20,alpha:0,duration:300,onComplete:()=>s.destroy()})}
      this.isGathering=false;
    });
  }
  command(action){if(action==='gather')this.collect();if(action==='sprint')this.sprintTouch=true;if(action==='walk')this.sprintTouch=false;}
  update(_t,delta){
    if(!this.player||this.isGathering||this.activeEncounter)return;
    if(Phaser.Input.Keyboard.JustDown(this.key.E)||Phaser.Input.Keyboard.JustDown(this.key.SPACE)){this.collect();return}
    let x=0,y=0;
    if(this.key.A.isDown||this.key.LEFT.isDown)x--;if(this.key.D.isDown||this.key.RIGHT.isDown)x++;
    if(this.key.W.isDown||this.key.UP.isDown)y--;if(this.key.S.isDown||this.key.DOWN.isDown)y++;
    x+=this.joy.active?this.joy.x:0;y+=this.joy.active?this.joy.y:0;
    x+=this.gamepadInput?.move?.x||0;y+=this.gamepadInput?.move?.y||0;
    const n=Math.hypot(x,y);const sprint=this.sprintTouch||this.key.SHIFT.isDown||this.gamepadInput?.sprint;
    // Soggy soil slows movement; shrub cover reduces monster sight in pure AI rules.
    const env=environmentAt(this.world,this.player.x,this.player.y);
    const speed=(sprint?205:135)*(env.wet?.78:1);
    const vx=n>0?x/n*speed:0,vy=n>0?y/n*speed:0;
    // Accelerator keeps movement fluid without grid snapping.
    const k=Math.min(1,delta*.012);
    this.player.setVelocity(Phaser.Math.Linear(this.player.body.velocity.x,vx,k),Phaser.Math.Linear(this.player.body.velocity.y,vy,k));
    if(n>.12){this.direction=Math.abs(x)>Math.abs(y)?x>0?'right':'left':y>0?'down':'up';this.playState(sprint?'run':'walk')}
    else this.playState('idle');
    this.player.setDepth(this.player.y+24);
    this.updateBeasts(delta,_t);
    const e=this.world.exit;if(Math.hypot((e.x+.5)*TILE-this.player.x,(e.y+.5)*TILE-this.player.y)<40){this.registry.set('status','Você encontrou a saída. O portal de Portomonte está logo adiante.');this.registry.set('atExit',true)}
    else if(this.registry.get('atExit'))this.registry.set('atExit',false);
  }
}
