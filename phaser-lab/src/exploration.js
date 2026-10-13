import Phaser from 'phaser';
import {buildForest,nearestResource,validExit,TILE,WIDTH,HEIGHT} from './world.js';

const ASSET = './art/';
const PEREN = `${ASSET}characters/peren/`;
const MURIN = `${ASSET}regions/floresta-murin/`;
const directions={down:0,left:1,right:2,up:3};
const actions=['idle','walk','run','interact','gather','hurt','cast','attack'];
const directionsList=Object.keys(directions);

export class ExplorationScene extends Phaser.Scene {
  constructor(){super({key:'ExplorationScene'});this.mode='idle';this.isGathering=false;this.collected=new Set();}
  preload(){
    this.load.spritesheet('peren',PEREN+'peren-atlas.png',{frameWidth:48,frameHeight:64});
    this.load.spritesheet('forest-ground',MURIN+'ground-tiles.png',{frameWidth:32,frameHeight:32});
    ['tree-0','tree-1','tree-2','herb','mushroom','stone','rune','exit','bush'].forEach(n=>this.load.image(n,MURIN+n+'.png'));
  }
  create(){
    this.world=buildForest(this.registry.get('seed')||'murin-001');
    if(!validExit(this.world))throw new Error('Expedição sem caminho até saída');
    const world=this.world; this.registry.set('worldValid',true);
    this.cameras.main.setBounds(0,0,WIDTH*TILE,HEIGHT*TILE);
    this.physics.world.setBounds(0,0,WIDTH*TILE,HEIGHT*TILE);
    const terrain=this.add.group();
    for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)terrain.add(this.add.image(x*TILE,y*TILE,'forest-ground',world.ground[y][x]).setOrigin(0).setDepth(-10));
    const colliders=this.physics.add.staticGroup();
    for(const obj of world.obstacles){
      const spr=colliders.create((obj.x+.5)*TILE,(obj.y+.5)*TILE,obj.kind==='tree'?`tree-${obj.variant}`:'stone');
      spr.setOrigin(.5,obj.kind==='tree'?.91:.88);spr.setDepth(spr.y);
      spr.body.setSize(obj.kind==='tree'?22:22,obj.kind==='tree'?14:12);
      spr.body.setOffset(obj.kind==='tree'?21:5,obj.kind==='tree'?70:20);
      spr.refreshBody();
    }
    // Static blockers over water, invisible. Sprite art remains in the ground layer.
    const blockers=this.physics.add.staticGroup();
    for(const pos of world.blocked){if(world.obstacles.some(o=>`${o.x},${o.y}`===pos))continue;const [x,y]=pos.split(',').map(Number);
      const obj=blockers.create((x+.5)*TILE,(y+.5)*TILE,'forest-ground',7).setVisible(false);
      obj.body.setSize(TILE,TILE);obj.refreshBody();
    }
    this.resources=new Map();
    for(const node of world.nodes){const s=this.add.image((node.x+.5)*TILE,(node.y+.5)*TILE,node.sprite).setDepth(node.y*TILE+16);this.resources.set(node.id,s)}
    const ex=world.exit;const marker=this.add.image((ex.x+.5)*TILE,(ex.y+.5)*TILE,'exit').setDepth(ex.y*TILE+15);
    this.tweens.add({targets:marker,alpha:.55,duration:850,yoyo:true,repeat:-1});
    this.animsForPeren();
    const spawn=world.entry;this.player=this.physics.add.sprite((spawn.x+.5)*TILE,(spawn.y+.5)*TILE,'peren',0);
    this.player.setSize(20,14).setOffset(14,47).setCollideWorldBounds(true).setMaxVelocity(210);
    this.player.setDrag(500);this.direction='right';this.currentAnimation='';
    this.physics.add.collider(this.player,colliders);this.physics.add.collider(this.player,blockers);
    this.cameras.main.startFollow(this.player,true,.10,.10);
    this.cameras.main.setZoom(1.4);
    this.key=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT,E,SPACE,ESC');
    this.joy={x:0,y:0,active:false,pointer:null};
    this.pad=this.add.graphics().setScrollFactor(0).setDepth(3000);
    this.input.on('pointerdown',p=>{if(p.x>this.scale.width*.55||p.y<this.scale.height*.55)return;this.joy={x:0,y:0,active:true,pointer:p.id,baseX:p.x,baseY:p.y}});
    this.input.on('pointermove',p=>{if(!this.joy.active||p.id!==this.joy.pointer||!p.isDown)return;const dx=p.x-this.joy.baseX,dy=p.y-this.joy.baseY;const n=Math.max(42,Math.hypot(dx,dy));this.joy.x=dx/n;this.joy.y=dy/n});
    const release=p=>{if(this.joy.pointer===p.id){this.joy.active=false;this.joy.x=0;this.joy.y=0;}};
    this.input.on('pointerup',release);this.input.on('pointerupoutside',release);
    this.events.once('shutdown',()=>{this.input.off('pointerup',release);this.input.off('pointerupoutside',release)});
    this.registry.set('collected',{});this.registry.set('status','Procure uma erva e toque em COLHER.');
    this.registry.set('ready',true);
    this.drawPad();
    this.scale.on('resize',()=>this.drawPad());
    // a few subtle environmental motes, spatial and not interactive
    const motes=this.add.particles(0,0,'rune',{x:{min:0,max:WIDTH*TILE},y:{min:0,max:HEIGHT*TILE},scale:{start:.08,end:0},alpha:{start:.32,end:0},lifespan:1800,frequency:400,quantity:1,blendMode:'ADD'}).setDepth(1000);
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)motes.stop();
  }
  animsForPeren(){
    for(const [dir,di] of Object.entries(directions))for(const [ai,act] of actions.entries()){
      const key=`peren-${dir}-${act}`;
      if(this.anims.exists(key))continue;
      this.anims.create({key,frames:this.anims.generateFrameNumbers('peren',{start:di*32+ai*4,end:di*32+ai*4+3}),frameRate:{idle:3,walk:8,run:12,interact:6,gather:6,hurt:6,cast:8,attack:10}[act],repeat:['idle','walk','run'].includes(act)?-1:0});
    }
  }
  drawPad(){if(!this.pad)return;this.pad.clear();const x=this.scale.width*.17,y=this.scale.height-105;this.pad.fillStyle(0x101d20,.55);this.pad.fillCircle(x,y,52);this.pad.lineStyle(2,0xd5bc87,.68);this.pad.strokeCircle(x,y,52);const dx=this.joy.active?this.joy.x*39:0,dy=this.joy.active?this.joy.y*39:0;this.pad.fillStyle(0xe1c287,.6);this.pad.fillCircle(x+dx,y+dy,16)}
  playState(act){const key=`peren-${this.direction}-${act}`;if(this.currentAnimation!==key){this.currentAnimation=key;this.player.anims.play(key,true)}}
  collect(){
    if(this.isGathering)return;
    const n=nearestResource(this.world,this.player.x,this.player.y,this.collected);
    if(!n){this.registry.set('status','Aproxime-se de uma planta ou cogumelo.');return}
    this.isGathering=true;this.player.setVelocity(0,0);this.playState('gather');
    this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE,()=>{
      if(this.collected.has(n.id)){this.isGathering=false;return}
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
    if(!this.player||this.isGathering)return;
    if(Phaser.Input.Keyboard.JustDown(this.key.E)||Phaser.Input.Keyboard.JustDown(this.key.SPACE)){this.collect();return}
    let x=0,y=0;
    if(this.key.A.isDown||this.key.LEFT.isDown)x--;if(this.key.D.isDown||this.key.RIGHT.isDown)x++;
    if(this.key.W.isDown||this.key.UP.isDown)y--;if(this.key.S.isDown||this.key.DOWN.isDown)y++;
    x+=this.joy.active?this.joy.x:0;y+=this.joy.active?this.joy.y:0;
    const n=Math.hypot(x,y);const sprint=this.sprintTouch||this.key.SHIFT.isDown;
    const speed=sprint?205:135;
    const vx=n>0?x/n*speed:0,vy=n>0?y/n*speed:0;
    // Accelerator keeps movement fluid without grid snapping.
    const k=Math.min(1,delta*.012);
    this.player.setVelocity(Phaser.Math.Linear(this.player.body.velocity.x,vx,k),Phaser.Math.Linear(this.player.body.velocity.y,vy,k));
    if(n>.12){this.direction=Math.abs(x)>Math.abs(y)?x>0?'right':'left':y>0?'down':'up';this.playState(sprint?'run':'walk')}
    else this.playState('idle');
    this.player.setDepth(this.player.y+24);
    this.drawPad();
    const e=this.world.exit;if(Math.hypot((e.x+.5)*TILE-this.player.x,(e.y+.5)*TILE-this.player.y)<40){this.registry.set('status','Você encontrou a saída. O portal de Portomonte está logo adiante.');this.registry.set('atExit',true)}
    else if(this.registry.get('atExit'))this.registry.set('atExit',false);
  }
}