"""M1e: original handcrafted pixel art for Peren (no external runtime assets).

Standalone generator: replaces only Peren's animation atlas, metadata and portraits.
Usage: python tools/make_peren_m1e.py
"""
from pathlib import Path
from PIL import Image, ImageDraw
import json, math

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'phaser/assets/characters/peren'
DEST.mkdir(parents=True, exist_ok=True)
W,H = 48,64
DIRECTIONS = ['down', 'left', 'right', 'up']
ACTIONS = ['idle','walk','run','interact','gather','hurt','cast','attack']
FPS = {'idle':4,'walk':8,'run':12,'interact':7,'gather':7,'hurt':8,'cast':9,'attack':11}
P={
 'outline':'#10121d','dark':'#1b1b2d','cloth':'#302c48','cloth2':'#44405f','clothlit':'#615477',
 'coat':'#24283f','coatlit':'#394260','trim':'#bd895a','gold':'#e2b879',
 'hat':'#22233a','hatlit':'#49405d','band':'#844655', 'wine':'#8f434d','scarflit':'#b35f63',
 'skin':'#d19a74','skinlit':'#efbe91','shadow':'#985e53','hair':'#27242f','grey':'#a8a4b6',
 'beard':'#302734','boots':'#1a1b28','bootrim':'#77635a','wood':'#574032','woodlit':'#a17a51',
 'core':'#b8a0ff','magic':'#aa64ff','glow':'#e4c4ff','rune':'#6e57bd',
}

def poly(d, pts, color):d.polygon(pts,fill=P.get(color,color))
def rect(d,xy,color):d.rectangle(xy,fill=P.get(color,color))
def line(d,xy,color,width=1):d.line(xy,fill=P.get(color,color),width=width)

def make_actor(direction, action, frame):
    im=Image.new('RGBA',(W,H));d=ImageDraw.Draw(im)
    side=direction in ('left','right'); rev=direction=='left';back=direction=='up'
    walking=action in ('walk','run');step=[-2,0,2,0][frame] if walking else 0
    if action=='run':step=round(step*1.6)
    bob=([0,1,0,-1][frame] if walking else [0,0,-1,0][frame] if action=='idle' else 0)
    if action=='gather':bob+=3 if frame in (1,2) else 1
    if action=='hurt':bob+=2 if frame in (1,2) else 0
    tilt=2 if action=='hurt' and frame in (1,2) else 0
    cy=lambda y:y+bob+tilt
    swing=([0,1,2,0][frame] if walking else [0,1,0,-1][frame])
    # Shadow floats at fixed ground contact; character remains anchored across every clip.
    d.ellipse((14,55,36,59),fill=(8,8,18,84))
    # Boots & trouser stepping, with visible two legs even when facing sideways.
    if side:
        rect(d,(20-step,46+bob,24-step,56+bob),'boots')
        rect(d,(26+step,46+bob,30+step,56+bob),'boots')
        rect(d,(19-step,55+bob,25-step,58+bob),'bootrim')
        rect(d,(25+step,55+bob,31+step,58+bob),'bootrim')
    else:
        rect(d,(17+step,45+bob,23+step,57+bob),'boots')
        rect(d,(27-step,45+bob,33-step,57+bob),'boots')
        rect(d,(16+step,56+bob,24+step,58+bob),'bootrim')
        rect(d,(26-step,56+bob,34-step,58+bob),'bootrim')
    # Flowing cloak: lower edge changes with walk phase (not a translation-only animation).
    flare=abs(step)+(2 if action=='cast' and frame==3 else 0)
    poly(d,[(18,25+bob),(33,25+bob),(39+flare,48+bob),(35+flare,55+bob),
            (29,53+bob),(24,56+bob),(18,53+bob),(12-flare,55+bob),(10-flare,48+bob)],'outline')
    poly(d,[(17,26+bob),(32,26+bob),(37+flare,48+bob),(34,53+bob),(29,52+bob),
            (24,54+bob),(16,52+bob),(12-flare,53+bob),(13,43+bob)],'coat')
    poly(d,[(16,28+bob),(23,30+bob),(20,50+bob),(15,51+bob),(12,47+bob)],'coatlit')
    poly(d,[(30,29+bob),(33,30+bob),(37+flare,49+bob),(34,51+bob)],'cloth')
    line(d,[(16,43+bob),(14,50+bob),(17,52+bob)],'clothlit',2)
    line(d,[(33,45+bob),(35,52+bob)],'clothlit')
    # Tunic and asymmetrical leather cross strap + potion clasp
    poly(d,[(18,25+bob),(32,25+bob),(31,44+bob),(19,44+bob)],'cloth2')
    line(d,[(18,29+bob),(29,40+bob)],'trim',2)
    line(d,[(19,39+bob),(31,39+bob)],'outline',4)
    line(d,[(20,40+bob),(30,40+bob)],'trim',2)
    rect(d,(24,38+bob,28,42+bob),'gold')
    rect(d,(25,39+bob,27,40+bob),'dark')
    rect(d,(31,41+bob,34,47+bob),'wine')
    rect(d,(32,42+bob,33,45+bob),'gold')
    # Arms/hands, posing through action frames.
    larm=[14,35+bob];rarm=[35,35+bob]
    if action=='gather':rarm=[37,42+bob+frame%2*2]
    elif action=='interact':rarm=[39,27+bob-frame%2*2]
    elif action=='cast':larm=[12-frame,27+bob-2*(frame%2)];rarm=[38,23+bob-frame]
    elif action=='attack':rarm=[39-frame*3,28+bob+frame*2]
    elif action=='hurt':larm=[13,39+bob];rarm=[31,35+bob]
    line(d,[(17,29+bob),larm], 'cloth',6)
    line(d,[(32,29+bob),rarm], 'cloth',6)
    rect(d,(larm[0]-2,larm[1]-2,larm[0]+2,larm[1]+2),'skin')
    rect(d,(rarm[0]-2,rarm[1]-2,rarm[0]+2,rarm[1]+2),'skin')
    # Neck, scarf / red collar; scarf tail moves in run.
    rect(d,(21,22+bob,28,29+bob),'skin')
    poly(d,[(17,25+bob),(22,22+bob),(30,23+bob),(34,27+bob),(28,30+bob),(18,29+bob)],'wine')
    line(d,[(17,26+bob),(25,28+bob),(32,26+bob)],'scarflit',2)
    poly(d,[(17,28+bob),(13-(2 if action=='run' else 0),34+bob),(18,37+bob),(20,29+bob)],'wine')
    # Hair framing skin; enlarged head remains 13px height above scarf.
    if back:
        poly(d,[(18,12+bob),(31,12+bob),(33,25+bob),(30,29+bob),(19,29+bob),(16,25+bob)],'hair')
        rect(d,(17,19+bob,19,25+bob),'grey');rect(d,(31,19+bob,32,26+bob),'grey')
    else:
        poly(d,[(18,13+bob),(31,13+bob),(33,21+bob),(30,28+bob),(20,28+bob),(16,22+bob)],'hair')
        poly(d,[(20,15+bob),(29,15+bob),(30,23+bob),(27,26+bob),(21,25+bob),(18,21+bob)],'skin')
        line(d,[(20,16+bob),(28,16+bob)],'skinlit',2)
        # Beard, eyebrow and nose: real facial features visible at native zoom.
        if side:
            eye_x=21 if rev else 27
            rect(d,(eye_x,19+bob,eye_x+1,20+bob),'outline')
            rect(d,((19 if rev else 29),20+bob,(20 if rev else 30),23+bob),'skinlit')
            poly(d,[(20,22+bob),(29,23+bob),(28,28+bob),(24,31+bob),(20,27+bob)],'beard')
            rect(d,(19 if rev else 29,17+bob,20 if rev else 30,22+bob),'grey')
        else:
            rect(d,(21,19+bob,22,20+bob),'outline');rect(d,(27,19+bob,28,20+bob),'outline')
            line(d,[(21,18+bob),(23,18+bob)],'hair');line(d,[(26,18+bob),(28,18+bob)],'hair')
            rect(d,(24,22+bob,25,23+bob),'shadow')
            poly(d,[(20,23+bob),(23,26+bob),(26,26+bob),(29,23+bob),(29,28+bob),
                    (25,31+bob),(22,29+bob)],'beard')
            line(d,[(22,26+bob),(26,27+bob)],'shadow')
            rect(d,(18,17+bob,19,22+bob),'grey');rect(d,(30,18+bob,31,23+bob),'grey')
    # Oversized iconic pointed witch-hat, asymmetric brim. Crown/flap change with run and cast.
    hattilt=2 if action=='cast' and frame==3 else 0
    poly(d,[(13,14+bob),(19,7+bob),(23,3+bob),(31,8+bob),(32,14+bob)],'outline')
    poly(d,[(15,13+bob),(22,5+bob),(24,7+bob),(29,9+bob),(30,15+bob)],'hat')
    poly(d,[(20,7+bob),(23,5+bob),(28,10+bob),(23,9+bob)],'hatlit')
    line(d,[(17,13+bob),(31,13+bob)],'band',3)
    rect(d,(23,11+bob,26,15+bob),'gold')
    rect(d,(24,12+bob,25,14+bob),'outline')
    poly(d,[(10-hattilt,15+bob),(38+hattilt,14+bob),(42+hattilt,17+bob),(33,19+bob),
            (13,19+bob),(8-hattilt,18+bob)],'outline')
    line(d,[(12,16+bob),(38,16+bob)],'hatlit',2)
    # Staff behind hand, crystal visible high above body; tilt/sweep is distinct action animation.
    staffx=39 if not rev else 8
    if action=='cast':tip=(staffx-4+frame*2,1+max(0,2-frame))
    elif action=='attack':tip=(staffx-11+frame*5,11+frame*4)
    elif action=='interact':tip=(staffx+2,5+frame%2)
    elif walking:tip=(staffx+swing,9+abs(step))
    else:tip=(staffx,10)
    line(d,[(staffx,49+bob),tip],'outline',5)
    line(d,[(staffx,48+bob),tip],'wood',3)
    line(d,[(staffx-1,41+bob),(tip[0]-1,tip[1]+3)],'woodlit')
    tx,ty=tip
    poly(d,[(tx-4,ty+1),(tx,ty-5),(tx+4,ty+1),(tx,ty+7)],'outline')
    poly(d,[(tx-2,ty+1),(tx,ty-3),(tx+2,ty+1),(tx,ty+5)],'magic')
    rect(d,(tx,ty-1,tx+1,ty+1),'glow')
    # Strong magical pose: symmetrical visual arc, glow charge and motes.
    if action=='cast':
        radius=[2,4,6,9][frame]
        d.arc((tx-radius,ty-radius,tx+radius,ty+radius),200,345,fill=P['magic'],width=1)
        d.arc((tx-radius-2,ty-radius-2,tx+radius+2,ty+radius+2),0,105,fill=P['rune'],width=1)
        for j in range(3):
            xx=tx+round(math.sin(j*2.4+frame)*radius*1.2)
            yy=ty+round(math.cos(j*1.8+frame)*radius*1.3)
            if 0<=xx<W and 0<=yy<H:rect(d,(xx,yy,xx+1,yy+1),'glow' if j==1 else 'magic')
        if frame==3:
            line(d,[(10,38),(7,31)],'rune');rect(d,(6,30,8,32),'magic')
    if action=='hurt' and frame in (1,2):
        line(d,[(16,27+bob),(30,20+bob)],'#e3727e',2)
        rect(d,(10,23+bob,12,25+bob),'scarflit')
    if action=='gather':
        rect(d,(rarm[0]+2,rarm[1]+3,rarm[0]+4,rarm[1]+6),'magic')
    if action=='attack' and frame in (1,2):
        d.arc((tx-8,ty-9,tx+8,ty+9),265,65,fill=P['glow'],width=2)
    return im

atlas=Image.new('RGBA',(W*32,H*4))
clips={}
for di,direc in enumerate(DIRECTIONS):
    for ai,action in enumerate(ACTIONS):
        frames=[]
        for t in range(4):
            index=di*32+ai*4+t
            atlas.alpha_composite(make_actor(direc,action,t),(W*(ai*4+t),H*di))
            frames.append(index)
        clips[f'{direc}-{action}']={'frames':frames,'fps':FPS[action], 'repeat':action in ('idle','walk','run')}
atlas.save(DEST/'peren-atlas.png',optimize=True)
(DEST/'atlas.json').write_text(json.dumps({'id':'peren','frameWidth':W,'frameHeight':H,
    'directions':DIRECTIONS,'animations':clips,'author':'Projeto Carcaça',
    'origin':'pixel art procedural original M1e; 128 frames; 32 directional clips',
    'palette':P},indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

# Deliberately draw a larger portrait, not a scaled screenshot of the tiny field sprite.
# The same hat, skin, grey streaks, scarf, beard, and purple crystal are consistent.
def portrait(mood='neutral'):
    c=Image.new('RGBA',(128,128),(16,17,31,255));d=ImageDraw.Draw(c)
    for y in range(128):
        d.line((0,y,127,y),fill=(16+y//28,17+y//19,31+y//18,255))
    for i in range(18):
        x=(i*37+14)%128;y=(i*59+13)%105
        rect(d,(x,y,x+1,y+1),'rune')
    d.ellipse((7,5,120,121),outline='#514268',width=2)
    # shoulders, robe, travel belt
    poly(d,[(9,126),(16,98),(35,87),(89,86),(115,99),(125,127)],'outline')
    poly(d,[(13,126),(19,101),(42,91),(86,92),(109,101),(119,127)],'coat')
    poly(d,[(20,100),(37,88),(48,92),(34,125),(12,126)],'coatlit')
    poly(d,[(87,92),(110,105),(118,126),(99,126)],'cloth2')
    line(d,[(42,91),(75,125)],'trim',4)
    poly(d,[(36,92),(57,82),(84,86),(99,99),(77,109),(48,108)],'wine')
    line(d,[(39,95),(66,103),(86,96)],'scarflit',4)
    poly(d,[(37,103),(20,118),(38,125),(51,106)],'wine')
    # neck, hair, ears, face
    rect(d,(48,74,75,97),'shadow')
    poly(d,[(39,38),(47,30),(79,30),(88,40),(90,73),(79,93),(43,87),(33,68)],'hair')
    poly(d,[(43,43),(81,42),(85,69),(75,84),(55,87),(41,71)],'skin')
    poly(d,[(47,42),(74,39),(82,45),(81,53),(44,50)],'skinlit')
    rect(d,(39,58,43,67),'shadow');rect(d,(84,57,89,66),'shadow')
    # expressive eyes / brows
    line(d,[(47,57),(57,55)],'hair',3);line(d,[(68,55),(80,57)],'hair',3)
    eye_y=61 if mood!='hurt' else 63
    rect(d,(49,eye_y,54,eye_y+2),'outline');rect(d,(71,eye_y,76,eye_y+2),'outline')
    rect(d,(52,eye_y,53,eye_y),'glow' if mood=='cast' else 'grey')
    rect(d,(73,eye_y,74,eye_y),'glow' if mood=='cast' else 'grey')
    poly(d,[(62,61),(59,70),(66,73),(68,69)],'shadow')
    # beard in layers and grey temples
    poly(d,[(41,71),(49,76),(59,78),(66,75),(76,77),(83,70),(84,87),(75,97),(63,103),
            (51,96),(42,85)],'beard')
    line(d,[(51,79),(62,82),(73,79)],'hair',4)
    line(d,[(60,88),(67,89)],'shadow',2)
    line(d,[(44,68),(43,83)],'grey',4);line(d,[(83,67),(84,81)],'grey',3)
    line(d,[(56,94),(61,97),(69,94)],'clothlit',2)
    # iconic witch hat and aged brass clasp
    poly(d,[(28,42),(47,17),(59,7),(79,23),(83,42)],'outline')
    poly(d,[(34,39),(55,13),(65,18),(77,24),(78,40)],'hat')
    poly(d,[(51,19),(59,13),(70,25),(57,25)],'hatlit')
    line(d,[(36,36),(79,36)],'band',6)
    rect(d,(57,31,66,39),'gold');rect(d,(60,33,63,37),'dark')
    poly(d,[(13,43),(32,39),(87,39),(109,46),(101,52),(30,52),(14,48)],'outline')
    poly(d,[(16,44),(35,41),(90,42),(105,46),(98,48),(24,48)],'hatlit')
    # staff glows on left, slightly in front of brim
    line(d,[(17,125),(17,19)],'outline',8)
    line(d,[(17,123),(17,20)],'wood',5)
    line(d,[(15,112),(15,26)],'woodlit',2)
    poly(d,[(9,19),(17,4),(25,19),(17,32)],'outline')
    poly(d,[(12,19),(17,9),(22,19),(17,28)],'magic')
    poly(d,[(16,12),(19,18),(17,23)],'glow')
    if mood=='cast':
        d.ellipse((2,4,32,34),outline=P['magic'],width=2)
        for x,y in [(27,8),(32,27),(5,34),(36,11),(108,29)]:rect(d,(x,y,x+2,y+2),'glow')
    elif mood=='hurt':
        line(d,[(83,65),(92,75)],'scarflit',2)
    return c.resize((256,256),Image.Resampling.NEAREST)
for mood,name in [('neutral','portrait.png'),('cast','portrait-cast.png'),('hurt','portrait-hurt.png')]:
    portrait(mood).save(DEST/name,optimize=True)
print(f'Generated Peren M1e: {atlas.width}x{atlas.height} atlas, 128 frames, {len(clips)} clips, 3 portraits at {DEST}')
