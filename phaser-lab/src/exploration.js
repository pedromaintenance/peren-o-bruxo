import Phaser from 'phaser';

const SIZE = 40;
const W = 40;
const H = 36;
const WALK = 160;

// IMPORTANTE: este laboratório usa formas pintadas como PLACEHOLDERS. Ele não
// pretende fingir que os sprites exclusivos de monstros/Peren já estão prontos.
export class ExplorationScene extends Phaser.Scene {
  constructor() {super({key: 'ExplorationScene'}); this.terrain = []; this.actors = [];}

  create() {
    this.cameras.main.setBounds(0,0,W*SIZE,H*SIZE);
    const rand = new Phaser.Math.RandomDataGenerator(['peren-lab-murin-001']);
    const floor = this.add.graphics().setDepth(-2);
    floor.fillStyle(0x263c30); floor.fillRect(0,0,W*SIZE,H*SIZE);
    for (let y=0;y<H;y++) for(let x=0;x<W;x++) {
      const v=rand.frac(); floor.fillStyle(v>.7 ? 0x2e4937 : (v<.15?0x24392e:0x294132));
      floor.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);
      if(rand.frac()<.35){floor.fillStyle(0x526048,.27);floor.fillCircle(x*SIZE+13,y*SIZE+24,1+rand.between(1,4));}
    }
    const tr = this.make.graphics({x:0,y:0});
    tr.fillStyle(0x171d20);tr.fillCircle(16,13,7); tr.fillStyle(0x68563b);tr.fillEllipse(16,27,20,24);
    tr.fillStyle(0xd7c5a1); tr.fillCircle(16,13,5);tr.fillStyle(0xd8b36a);tr.fillRect(5,31,22,3);
    tr.generateTexture('peren-placeholder',32,36);tr.destroy();
    const treeTex = this.make.graphics({x:0,y:0});
    treeTex.fillStyle(0x44372d);treeTex.fillRect(16,28,9,25);
    treeTex.fillStyle(0x203b31);treeTex.fillCircle(20,21,19);
    treeTex.fillStyle(0x345740);treeTex.fillCircle(12,15,11);
    treeTex.generateTexture('tree-placeholder',42,55);treeTex.destroy();
    const obstacles = this.physics.add.staticGroup();
    for(let i=0;i<190;i++) {
      const x=rand.between(1,W-2)*SIZE+SIZE/2;
      const y=rand.between(1,H-2)*SIZE+SIZE/2;
      if(Math.abs(x-W*SIZE/2)<145&&Math.abs(y-H*SIZE/2)<145)continue;
      const tree=obstacles.create(x,y,'tree-placeholder').setOrigin(.5,.83).refreshBody();
      tree.body.setSize(20,14).setOffset(11,39);
      tree.setDepth(y);
    }
    this.player=this.physics.add.sprite(W*SIZE/2,H*SIZE/2,'peren-placeholder').setDepth(9000);
    this.player.setCollideWorldBounds(true).setSize(20,16).setOffset(6,20);
    this.physics.add.collider(this.player,obstacles);
    this.cameras.main.startFollow(this.player,true,.09,.09);
    this.cameras.main.setZoom(1.3);
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
    // Joystick sem biblioteca externa; disponível para toque e mouse.
    this.joy={x:0,y:0,active:false,pointer:null};
    this.pad = this.add.graphics().setScrollFactor(0).setDepth(20000);
    this.input.on('pointerdown',p=>{if(p.x<this.scale.width*.68){this.joy.active=true;this.joy.pointer=p.id;this.joy.baseX=p.x;this.joy.baseY=p.y;this.joy.x=0;this.joy.y=0;}});
    this.input.on('pointermove',p=>{if(!this.joy.active||p.id!==this.joy.pointer||!p.isDown)return;const dx=p.x-this.joy.baseX,dy=p.y-this.joy.baseY;const n=Math.max(1,Math.hypot(dx,dy));this.joy.x=dx/Math.max(42,n);this.joy.y=dy/Math.max(42,n);});
    const release=p=>{if(p.id===this.joy.pointer){this.joy.active=false;this.joy.x=0;this.joy.y=0;}};
    this.input.on('pointerup',release);this.input.on('pointerupoutside',release);
    this.scale.on('resize',()=>this.drawPad());this.drawPad();
    this.add.text(W*SIZE/2,H*SIZE/2-100,'Floresta de Mürin · Protótipo de movimentação',{fontFamily:'system-ui',fontSize:'14px',color:'#dfc494',backgroundColor:'#172822bb',padding:{x:8,y:5}}).setOrigin(.5);
  }

  drawPad() {
    this.pad.clear();
    const x=this.scale.width*.17,y=this.scale.height-105;
    this.pad.lineStyle(2,0xe4ca92,.5);this.pad.fillStyle(0x13211b,.45);this.pad.fillCircle(x,y,43);this.pad.strokeCircle(x,y,43);
    if(this.joy?.active){this.pad.fillStyle(0xffd583,.6);this.pad.fillCircle(this.joy.baseX+this.joy.x*40,this.joy.baseY+this.joy.y*40,16);}
  }

  update() {
    let x=0,y=0;
    if(this.keys.A.isDown||this.keys.LEFT.isDown)x--;
    if(this.keys.D.isDown||this.keys.RIGHT.isDown)x++;
    if(this.keys.W.isDown||this.keys.UP.isDown)y--;
    if(this.keys.S.isDown||this.keys.DOWN.isDown)y++;
    if(this.joy?.active){x+=this.joy.x;y+=this.joy.y;}
    const magnitude=Math.hypot(x,y)||1;
    this.player.setVelocity(x/magnitude*WALK,y/magnitude*WALK);
    this.player.setDepth(this.player.y+60);
    this.drawPad();
  }
}