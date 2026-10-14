/** Animated JRPG battle stage. State changes are delegated to combat.js (pure). */
import Phaser from 'phaser';
import {newBattle,stepBattle,settleBattle,settleEscape,defaultProfile,battleRng} from './combat.js';

const ART='./art/';
export class BattleScene extends Phaser.Scene {
  constructor(){super({key:'BattleScene'});this.busy=false;this.resolved=false;this.state=null;}
  init(data){this.config=data;this.busy=false;this.resolved=false;}
  preload(){
    this.load.image('murin-battle-bg',ART+'battle/murin-battle.webp');
    for(const type of ['fire','ice','arcane'])this.load.spritesheet('vfx-'+type,ART+`vfx/${type}.png`,{frameWidth:80,frameHeight:80});
  }
  create(){
    const profile=this.registry.get('combatProfile')||defaultProfile();
    this.registry.set('combatProfile',profile);
    const {beast,key}=this.config;
    this.state=newBattle(beast,profile,key);
    this.rng=battleRng(key+':round');
    const w=this.scale.width,h=this.scale.height;
    this.cameras.main.setBackgroundColor('#0c161a');
    this.backdrop=this.add.image(w/2,h*.52,'murin-battle-bg').setDepth(-5).setDisplaySize(w,h*.72);
    this.add.rectangle(w/2,h*.095,w,h*.16,0x07121a,.9).setDepth(-4);
    this.add.rectangle(w/2,h*.875,w,h*.22,0x07121a,.88).setDepth(-4);
    this.peren=this.add.sprite(w*.27,h*.61,'peren',0).setScale(Math.max(1.8,w/225)).setDepth(12);
    this.foe=this.add.sprite(w*.735,h*.56,beast.type,0).setScale(Math.max(1.65,w/260)).setDepth(11).setFlipX(true);
    this.peren.anims.play('peren-right-idle');
    this.foe.anims.play(`${beast.type}-idle`);
    this.nameText=this.add.text(w*.74,h*.41,beast.name.toUpperCase(),{fontFamily:'Georgia,serif',fontSize:'15px',color:'#f0d7a5',stroke:'#091117',strokeThickness:3}).setOrigin(.5).setDepth(15);
    this.hpBar=this.add.graphics().setDepth(16);
    this.floatGroup=this.add.group();
    for(const type of ['fire','ice','arcane'])if(!this.anims.exists('vfx-'+type))this.anims.create({key:'vfx-'+type,frames:this.anims.generateFrameNumbers('vfx-'+type,{start:0,end:9}),frameRate:18,repeat:0});
    this.scale.on('resize',this.resize,this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.scale.off('resize',this.resize,this));
    this.registry.set('battleState',this.publicState());
    this.game.events.emit('peren-battle-change',this.publicState());
    this.updateBar();
  }
  resize(size){if(!this.peren)return;const w=size.width,h=size.height;
    this.backdrop.setPosition(w/2,h*.52).setDisplaySize(w,h*.72);
    this.peren.setPosition(w*.27,h*.61).setScale(Math.max(1.8,w/225));
    this.foe.setPosition(w*.735,h*.56).setScale(Math.max(1.65,w/260));
    this.nameText.setPosition(w*.74,h*.41);this.updateBar();
  }
  publicState(){if(!this.state)return null;const b=this.state,p=this.registry.get('combatProfile')||defaultProfile();return {status:b.status,round:b.round,monster:b.enemyName,enemyHp:b.hp,enemyMaxHp:b.maxHp,hp:b.playerHp,maxHp:b.playerMaxHp,mp:b.playerMp,maxMp:b.playerMaxMp,potions:b.potions,log:b.log.slice(0,3),busy:this.busy,level:p.level,gold:p.gold,xp:p.xp,bag:p.bag,key:b.key,reward:this.reward||null};}
  updateBar(){if(!this.hpBar||!this.foe)return;const f=this.state;
    this.hpBar.clear();const x=this.foe.x-56,y=this.foe.y-95;
    this.hpBar.fillStyle(0x090f13,.93);this.hpBar.fillRoundedRect(x,y,112,11,3);
    this.hpBar.fillStyle(0xa64f42);this.hpBar.fillRoundedRect(x+2,y+2,108*f.hp/f.maxHp,7,2);
  }
  announce(){const state=this.publicState();this.registry.set('battleState',state);this.game.events.emit('peren-battle-change',state);this.updateBar();}
  async wait(ms){return new Promise(resolve=>this.time.delayedCall(ms,resolve));}
  hitText(who,damage,color='#f6da9e'){
    const target=who==='enemy'?this.foe:this.peren;
    const label=this.add.text(target.x,target.y-104,'-'+damage,{fontFamily:'Georgia,serif',fontSize:'25px',fontStyle:'bold',stroke:'#101417',strokeThickness:4,color}).setOrigin(.5).setDepth(30);
    this.tweens.add({targets:label,y:label.y-30,alpha:0,duration:620,onComplete:()=>label.destroy()});
  }
  async animatePlayer(action,events){
    if(action==='attack'){
      const from=this.peren.x;this.peren.anims.play('peren-right-attack',true);
      await new Promise(done=>this.tweens.add({targets:this.peren,x:from+Math.min(95,this.scale.width*.23),duration:165,yoyo:true,ease:'Quad.easeOut',onComplete:done}));
    } else if(action.startsWith('spell:')){
      this.peren.anims.play('peren-right-cast',true);
      const effect=action.includes('fogo')?'fire':action.includes('gelo')?'ice':'arcane';
      const fx=this.add.sprite(this.foe.x,this.foe.y-21,'vfx-'+effect,0).setScale(1.7).setDepth(25).setBlendMode(Phaser.BlendModes.ADD);
      fx.anims.play('vfx-'+effect);await this.wait(590);fx.destroy();
    } else if(action==='defend'||action==='potion'){
      this.peren.anims.play('peren-right-interact',true);
      const color=action==='potion'?0x79d98a:0x87c3ee;
      const rune=this.add.circle(this.peren.x,this.peren.y-30,18,color,.46).setDepth(22);
      this.tweens.add({targets:rune,scale:2.7,alpha:0,duration:370,onComplete:()=>rune.destroy()});
      await this.wait(380);
    }
    if(events.some(e=>e.kind==='hit'&&e.source==='player')){
      const hit=events.find(e=>e.kind==='hit'&&e.source==='player');
      this.hitText('enemy',hit.damage,'#f7c978');
      if(this.state.status==='won')this.foe.anims.play(`${this.config.beast.type}-death`,true);
      else this.foe.anims.play(`${this.config.beast.type}-hurt`,true);
      this.cameras.main.shake(95,.003);await this.wait(270);
    }
  }
  async animateEnemy(events){
    const hit=events.find(e=>e.kind==='hit'&&e.source==='enemy');
    if(hit){this.foe.anims.play(`${this.config.beast.type}-attack`,true);await this.wait(270);
      this.peren.anims.play('peren-right-hurt',true);this.hitText('player',hit.damage,'#ff858e');this.cameras.main.shake(80,.004);await this.wait(270);
    } else if(events.some(e=>e.kind==='frozen')){
      const ice=this.add.circle(this.foe.x,this.foe.y-10,24,0x7ecbed,.55).setDepth(30);
      this.tweens.add({targets:ice,scale:1.7,alpha:0,duration:400,onComplete:()=>ice.destroy()});await this.wait(300);
    }
  }
  async takeTurn(action){
    if(this.busy||this.resolved||!this.state||this.state.status!=='active')return false;
    const result=stepBattle(this.state,action,this.rng);
    if(result.error){this.game.events.emit('peren-battle-error',result.error);return false;}
    this.busy=true;this.announce();this.state=result.state;
    if(action==='flee'){this.announce();this.busy=false;return true;}
    await this.animatePlayer(action,result.events);
    await this.animateEnemy(result.events);
    this.peren.anims.play('peren-right-idle',true);
    if(this.state.status==='active')this.foe.anims.play(`${this.config.beast.type}-idle`,true);
    else if(this.state.status==='lost')this.peren.anims.play('peren-right-hurt',true);
    this.busy=false;this.announce();return true;
  }
  endBattle(){
    if(this.busy||this.resolved||this.state.status==='active')return false;
    this.resolved=true;
    const profile=this.registry.get('combatProfile')||defaultProfile();
    const win=settleBattle(profile,this.state);
    const next=win.applied?win.profile:settleEscape(profile,this.state);
    this.reward=win.reward||null;
    this.registry.set('combatProfile',next);
    this.registry.set('battleState',null);
    const explorer=this.scene.get('ExplorationScene');
    explorer.finishCombat(this.state.status);
    this.game.events.emit('peren-battle-end',{result:this.state.status,reward:this.reward,applied:win.applied,profile:next});
    this.scene.stop();
    return true;
  }
}
