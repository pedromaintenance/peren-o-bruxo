"""Create ORIGINAL, deterministic pixel-art sprites/assets; no scraped game art."""
from PIL import Image, ImageDraw
from pathlib import Path
import math, json, random
BASE=Path(__file__).resolve().parents[1]
CHAR=BASE/'phaser/assets/characters/peren'
REG=BASE/'phaser/assets/regions/floresta-murin'
CHAR.mkdir(parents=True, exist_ok=True);REG.mkdir(parents=True, exist_ok=True)
CW,CH=48,64
ANIMS=['idle','walk','run','interact','gather','hurt','cast','attack']
DIRS=['down','left','right','up']
AT=Image.new('RGBA',(CW*32,CH*4))
PALETTE={'cloak':'#202733','shadow':'#101820','accent':'#bd985d','trim':'#896e49','hair':'#cfccd1','hairshade':'#888b9d','skin':'#c69c7e','face':'#aa7663','boot':'#0f151b','glow':'#78c9e6'}

def actor(direction, action, tick):
    img=Image.new('RGBA',(CW,CH));d=ImageDraw.Draw(img)
    walk=action in ['walk','run'];stride=([0,2,0,-2][tick]) if walk else 0
    bob=([0,-1,0,1][tick]) if walk else (0,-1,0,0)[tick] if action=='idle' else 0
    recoil=4 if action=='hurt' and tick in (1,2) else 0
    by=bob+recoil;left=direction=='left';right=direction=='right';back=direction=='up'
    # floor cast shadow
    d.ellipse((12,54,37,61),fill=(3,10,13,80))
    # boots stride/step
    d.polygon([(16,47+by+stride),(24,47+by),(24,56+by),(14,57+by)],fill='#111720')
    d.polygon([(25,47+by),(32,47+by-stride),(34,56+by),(24,56+by)],fill='#16191c')
    d.line((15,55+by,22,55+by),fill='#846d56',width=2)
    d.line((26,54+by,32,54+by),fill='#846d56',width=2)
    # garment
    d.polygon([(17,23+by),(32,23+by),(39,47+by),(34,53+by),(12,53+by),(10,46+by)],fill='#171f2b')
    d.polygon([(18,24+by),(27,24+by),(30,51+by),(13,51+by)],fill='#303747')
    d.polygon([(27,24+by),(33,24+by),(38,48+by),(31,51+by)],fill='#20232e')
    d.line([(18,30+by),(17,46+by),(15,51+by)],fill='#49566a',width=2)
    d.line([(33,33+by),(34,47+by)],fill='#394357',width=2)
    # cloak clasp and belt
    d.line((15,40+by,34,40+by),fill='#765c46',width=3)
    d.rectangle((22,38+by,27,43+by),fill='#d0ac6a')
    d.rectangle((24,39+by,25,41+by),fill='#34443f')
    # raised shoulders / arms
    d.polygon([(14,25+by),(20,24+by),(18,40+by),(13,40+by)],fill='#2c3442')
    d.polygon([(29,24+by),(35,25+by),(38,39+by),(32,40+by)],fill='#242c3a')
    d.line((13,37+by,17,38+by),fill='#9b8051',width=2)
    # neck and hair/head
    d.rectangle((21,20+by,27,27+by),fill='#997c71')
    d.ellipse((16,10+by,33,28+by),fill='#d0bcb9')
    d.ellipse((17,11+by,32,24+by),fill='#caa184')
    if back:
        d.polygon([(16,13+by),(29,9+by),(34,17+by),(34,32+by),(29,31+by),(25,22+by),(19,31+by),(15,31+by)],fill='#bbbcc8')
        d.line((25,11+by,21,24+by),fill='#e5e0df',width=3)
        d.line((29,14+by,32,27+by),fill='#8993a5',width=2)
    else:
        d.polygon([(15,15+by),(18,9+by),(30,8+by),(34,16+by),(31,24+by),(29,18+by),(18,20+by),(16,30+by),(13,29+by)],fill='#bcbcc7')
        d.line((18,11+by,17,27+by),fill='#e2e0e2',width=3)
        d.line((32,14+by,33,27+by),fill='#7e8392',width=2)
        if left:
            d.rectangle((19,19+by,20,20+by),fill='#121a22');d.line((17,23+by,22,23+by),fill='#8a554b')
        elif right:
            d.rectangle((28,19+by,29,20+by),fill='#121a22');d.line((27,23+by,32,23+by),fill='#8a554b')
        else:
            d.rectangle((21,19+by,22,20+by),fill='#17212b');d.rectangle((28,19+by,29,20+by),fill='#17212b')
            d.line((22,24+by,28,24+by),fill='#805a4a')
    # staff held by arm; movement of tip on attack/interact
    holding_right = (direction!='left')
    bx=37 if holding_right else 10
    swing=(tick-1)*5 if action=='attack' else 0
    topx=bx+swing
    ty=2+by if action in ['cast','attack','interact'] else 12+by
    d.line((bx,47+by,topx,ty),fill='#34271d',width=4)
    d.line((bx-1,46+by,topx-1,ty),fill='#94714a',width=2)
    d.ellipse((topx-4,ty-4,topx+3,ty+3),fill='#1a647d',outline='#afd9e6',width=2)
    # spell light and sparks
    if action=='cast':
        glow=(tick+1)*3
        for j in range(3):
            x=topx+int(math.sin(j*2.1+tick)*glow);y=ty-2-j*4
            if 0<=x<48 and y>=0:d.rectangle((x,y,x+2,y+2),fill='#a2eff6')
        d.ellipse((topx-2-glow/2,ty-1-glow/2,topx+glow/2,ty+glow/2),outline='#6ad9f1',width=1)
    if action=='hurt' and tick in (1,2):d.line((13,13+by,34,28+by),fill='#f48b86',width=2)
    if action=='gather':
        hand_y=44+by+tick*2
        d.ellipse((36,hand_y,41,hand_y+5),fill='#c89b7d')
        d.line((36,hand_y,42,55+by),fill='#83ba79',width=2)
    if action=='interact':d.ellipse((36,27+by,41,32+by),fill='#c99a7a')
    return img

clips={}
for di,direc in enumerate(DIRS):
  for ai,action in enumerate(ANIMS):
    frames=[]
    for t in range(4):
      idx=di*32+ai*4+t
      AT.alpha_composite(actor(direc,action,t),(CW*(ai*4+t),CH*di));frames.append(idx)
    clips[f'{direc}-{action}']={'frames':frames,'fps':{'idle':3,'walk':8,'run':12,'interact':6,'gather':6,'hurt':6,'cast':8,'attack':10}[action], 'repeat': action in ['idle','walk','run']}
AT.save(CHAR/'peren-atlas.png',optimize=True)
(CHAR/'atlas.json').write_text(json.dumps({'id':'peren','frameWidth':CW,'frameHeight':CH,'directions':DIRS,'animations':clips,'author':'Projeto Carcaça','origin':'autoral procedural'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# create 256x320 character profile of own icon enlarged with atmospheric gradient (not user reference)
portrait=Image.new('RGBA',(256,256),(12,20,28,255));pd=ImageDraw.Draw(portrait)
for y in range(256):pd.line((0,y,256,y),fill=(12+int(y/24),22+int(y/24),30+int(y/35),255))
pd.ellipse((28,28,230,236),outline=(145,119,78,190),width=4)
figure=actor('down','cast',2).resize((192,256),Image.Resampling.NEAREST)
portrait.alpha_composite(figure,(32,0));portrait.save(CHAR/'portrait.png',optimize=True)
# all 32px ground tiles : 8 soil/moss/wet/trail variants, reproducible
rand=random.Random(73313)
tiles=Image.new('RGBA',(32*8,32))
pal=['#314834','#344e37','#39503b','#2d4635','#3b5137','#4c4935','#534a36','#2b4145']
for j,co in enumerate(pal):
 t=Image.new('RGBA',(32,32),co);p=ImageDraw.Draw(t)
 for z in range(73):
  x=rand.randrange(32);y=rand.randrange(32)
  cl=rand.choice(['#475c40','#243f35','#596446','#283b31']) if j<5 else rand.choice(['#62573f','#3b3b33','#847352'])
  p.rectangle((x,y,x+rand.randrange(1,3),y+rand.randrange(1,3)),fill=cl)
 if j==7:
  p.arc((5,5,28,26),50,200,fill='#87b6ba',width=1)
 tiles.alpha_composite(t,(j*32,0))
tiles.save(REG/'ground-tiles.png',optimize=True)
# several props in consistent style

def tree(variant):
 im=Image.new('RGBA',(64,88));d=ImageDraw.Draw(im)
 d.ellipse((13,78,56,86),fill=(4,16,12,65))
 d.polygon([(24,42),(41,42),(43,81),(31,81)],fill='#403429')
 for j in range(4):
  y=11+j*11;spread=29-j*5
  d.ellipse((32-spread,y,32+spread,64-j*2),fill=['#214231','#2b4a33','#355a3b','#254d36'][j])
 for j in range(22):
  xx=(j*37+variant*17)%51+8;yy=(j*11+variant*3)%41+10
  if ((xx-32)/28)**2+((yy-38)/30)**2<=.90:d.rectangle((xx,yy,xx+3,yy+3),fill=['#526748','#467d52','#254937'][j%3])
 return im
for j in range(3):tree(j).save(REG/f'tree-{j}.png',optimize=True)
for typ in ['herb','mushroom','stone','rune','exit','bush']:
 im=Image.new('RGBA',(32,40));d=ImageDraw.Draw(im)
 if typ=='herb':
  for x in [12,16,20]:
   d.line((16,33,x,12),fill='#5c9e64',width=2);d.ellipse((x-5,12,x+3,23),fill='#78b978',outline='#33684a')
  d.ellipse((15,8,20,13),fill='#c8a4dd')
 if typ=='mushroom':
  for x,y in [(10,24),(21,20)]:d.rectangle((x,y,x+4,33),fill='#d5c1a4');d.pieslice((x-4,y-10,x+10,y+9),180,360,fill='#a15558');d.ellipse((x+2,y-5,x+5,y-2),fill='#f7d4ac')
 if typ=='stone':d.polygon([(3,32),(8,18),(22,14),(29,26),(24,34)],fill='#7a8583',outline='#b7b7a3');d.line((10,22,19,19),fill='#c4c5ae',width=2)
 if typ=='rune':d.polygon([(16,5),(25,17),(25,34),(8,34),(9,17)],fill='#395362',outline='#6c9ea2',width=2);d.line((16,12,16,26),fill='#b8def0',width=2);d.line((11,19,22,19),fill='#b8def0',width=2)
 if typ=='exit':d.rectangle((2,13,29,33),fill='#53412f',outline='#c0a16c',width=2);d.line((8,18,24,18),fill='#dec28a',width=2);d.polygon([(20,13),(27,18),(20,23)],fill='#dec28a')
 if typ=='bush':d.ellipse((2,17,29,37),fill='#284f34');d.ellipse((7,10,27,30),fill='#477747');d.ellipse((2,14,18,28),fill='#416b44')
 im.save(REG/f'{typ}.png',optimize=True)
print('generated',AT.size,'with',len(clips),'animation clips; forest tiles, props')