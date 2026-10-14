"""Original, deterministic pixel sprites for Peren M1b, seven clips per creature.
No copyrighted reference art and no placeholder graphics.
Run from any directory; writes canonical assets into phaser/assets/monsters.
"""
from PIL import Image, ImageDraw
from pathlib import Path
import json, math, random

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'phaser/assets/monsters'
ACTS=['idle','walk','alert','attack','hurt','retreat','death']
FRAME=64; COLS=4
CREATURES=[
 ('mob-galho-infectado','Galho Infectado','bramble'),
 ('mob-fungo-violeta','Fungo Violeta','shroom'),
 ('mob-ettercap','Ettercap','spider')]

def draw_bramble(d,f,act):
    bob=[0,-1,0,1][f] if act in ('idle','walk','retreat') else 0
    sw=(-2,-1,2,3)[f] if act=='attack' else (1,-1,1,-1)[f] if act=='walk' else 0
    if act=='death':bob=12
    k=0 if act!='hurt' else 2
    trunk=(50,39,35) if k==0 else (83,50,61)
    d.ellipse((5,26,27,30),fill=(4,9,11,180))
    # rooted feet, twisted bark trunk
    d.line([(13,24+bob),(8,29+bob),(5,29+bob)],fill=(47,39,31),width=3)
    d.line([(18,23+bob),(23,29+bob),(27,28+bob)],fill=(57,42,30),width=3)
    d.polygon([(14,10+bob),(11,15+bob),(12,24+bob),(18,26+bob),(21,17+bob),(18,9+bob)],fill=(30,25,24))
    d.polygon([(15,10+bob),(13,15+bob),(15,24+bob),(19,24+bob),(19,15+bob)],fill=trunk)
    d.line([(17,12+bob),(17,24+bob)], fill=(102,75,50),width=1)
    # snarled branches and reaching fingertips
    d.line([(14,15+bob),(8+sw,11+bob),(5+sw,6+bob)],fill=(82,57,35),width=3)
    d.line([(8+sw,11+bob),(2+sw,10+bob)],fill=(102,70,43),width=2)
    d.line([(8+sw,11+bob),(9+sw,5+bob)],fill=(106,68,40),width=1)
    d.line([(19,15+bob),(24+sw,12+bob),(27+sw,5+bob)],fill=(78,50,38),width=3)
    d.line([(24+sw,12+bob),(29+sw,13+bob)],fill=(97,67,43),width=2)
    for x,y in [(11,9),(20,9),(23,6),(7,6)]:
        d.polygon([(x-3+sw//2,y+bob),(x+2+sw//2,y-2+bob),(x+3+sw//2,y+1+bob)],fill=(50,77,39))
    # magenta infection, paired smouldering eyes
    d.rectangle((14,16+bob,15,17+bob),fill=(202,80,112))
    d.rectangle((18,16+bob,19,17+bob),fill=(202,80,112))
    for x,y in [(16,21),(19,22),(15,12)]:d.point((x,y+bob),fill=(113,48,99))

def draw_shroom(d,f,act):
    bob=[0,-1,0,1][f] if act in ('idle','walk') else 0
    if act=='death':bob=13
    sw=(-1,0,1,2)[f] if act=='attack' else 0
    c=(102,49,125) if act!='hurt' else (147,83,98)
    d.ellipse((4,26,28,30),fill=(4,9,11,180))
    # asymmetrical legs with dangling fungal roots
    d.line([(13,22+bob),(9,29+bob),(6,28+bob)], fill=(138,135,115),width=3)
    d.line([(20,22+bob),(23,29+bob),(26,28+bob)],fill=(142,143,111),width=3)
    d.ellipse((12,14+bob,21,26+bob),fill=(175,162,134))
    d.rectangle((15,20+bob,16,21+bob),fill=(45,27,41))
    # trailing mycelium feelers
    d.line([(14,18+bob),(7-sw,22+bob)],fill=(161,123,157),width=2)
    d.line([(20,19+bob),(27+sw,21+bob)],fill=(150,110,152),width=2)
    # proper layered mushroom cap silhouette
    d.ellipse((5,7+bob,28,19+bob),fill=(44,30,59))
    d.pieslice((4,4+bob,29,19+bob),180,360,fill=c)
    d.polygon([(6,13+bob),(10,8+bob),(15,6+bob),(21,7+bob),(27,13+bob)],fill=c)
    d.line([(6,14+bob),(28,14+bob)],fill=(214,157,217),width=2)
    for x,y,r in [(11,11,2),(17,8,2),(23,11,2)]:
        d.ellipse((x-r,y-r+bob,x+r-1,y+r-1+bob),fill=(204,146,208))
    d.point((15,16+bob),fill=(255,224,129));d.point((20,16+bob),fill=(255,224,129))
    # visible spore plume when alert/attack
    if act in ('alert','attack'):
        for x,y in [(4,9),(28,6),(23,3),(6,3),(30,12)]:
            d.ellipse((x+sw,y+f%2,x+sw+1,y+f%2+1),fill=(182,108,241))

def draw_spider(d,f,act):
    bob=[0,-1,0,1][f] if act in ('idle','walk','retreat') else 0
    reach=2 if act=='attack' and f in (1,2) else 0
    if act=='death':bob=11
    armor=(60,39,37) if act!='hurt' else (135,56,59)
    d.ellipse((2,26,30,31),fill=(3,5,9,190))
    # eight uneven jointed legs
    for xx,side in [(10,-1),(14,-1),(18,1),(21,1)]:
        for dy in (0,5):
            if side<0:pos=[(xx,18+bob),(xx-7-reach,13+dy+bob),(1,24+dy//3+bob)]
            else:pos=[(xx,18+bob),(xx+6+reach,12+dy+bob),(30,25+dy//3+bob)]
            d.line(pos,fill=(66,42,46),width=2)
            d.line([pos[1],pos[2]],fill=(132,80,60),width=1)
    d.ellipse((7,10+bob,26,25+bob),fill=(16,18,25))
    d.ellipse((9,10+bob,24,23+bob),fill=armor)
    d.polygon([(12,13+bob),(19,10+bob),(23,17+bob),(17,20+bob),(10,17+bob)],fill=(84,51,35))
    d.polygon([(13,14+bob),(17,12+bob),(21,16+bob),(17,19+bob)],fill=(171,79,38))
    d.ellipse((13,6+bob,22,13+bob),fill=(34,23,31))
    d.rectangle((14,9+bob,15,10+bob),fill=(240,69,45))
    d.rectangle((19,9+bob,20,10+bob),fill=(240,69,45))
    d.line([(15,12+bob),(13,15+bob)], fill=(210,150,100),width=1)
    d.line([(21,12+bob),(23,15+bob)],fill=(210,150,100),width=1)

def sheet_for(id,name,kind):
    atlas=Image.new('RGBA',(FRAME*COLS,FRAME*len(ACTS)),(0,0,0,0))
    drawer={'bramble':draw_bramble,'shroom':draw_shroom,'spider':draw_spider}[kind]
    for ai,act in enumerate(ACTS):
        for frame in range(COLS):
            tile=Image.new('RGBA',(32,32));d=ImageDraw.Draw(tile)
            drawer(d,frame,act)
            if act=='alert' and frame in (1,2):d.ellipse((25,1,27,3), fill=(255,190,80))
            if act=='hurt' and frame%2==1:d.rectangle((3,3,28,28),outline=(203,94,112),width=1)
            if act=='death':
                tile.putalpha(tile.getchannel('A').point(lambda v:int(v*(1-frame*.24))))
            atlas.paste(tile.resize((64,64),Image.Resampling.NEAREST),(frame*FRAME,ai*FRAME),tile.resize((64,64),Image.Resampling.NEAREST))
    folder=OUT/id;folder.mkdir(parents=True,exist_ok=True)
    atlas.save(folder/'atlas.png', optimize=True)
    base=atlas.crop((0,0,64,64))
    portrait=Image.new('RGBA',(160,160),(13,23,24,255));p=ImageDraw.Draw(portrait)
    p.ellipse((10,10,150,150),fill=(21,39,40),outline=(167,118,73),width=4)
    enlarged=base.resize((144,144),Image.Resampling.NEAREST)
    portrait.alpha_composite(enlarged,(8,7))
    portrait.save(folder/'portrait.png',optimize=True)
    clips={act:{'start':ai*COLS,'end':ai*COLS+3,'fps':{'idle':3,'walk':7,'alert':6,'attack':10,'hurt':8,'retreat':8,'death':6}[act], 'repeat': -1 if act in ('idle','walk','alert','retreat') else 0}for ai,act in enumerate(ACTS)}
    # atlas ordering is rows; Phaser frames per row.
    meta={'id':id,'name':name,'art':'pixel art original desenhada por algoritmo (não placeholder)',
          'atlas':'atlas.png','portrait':'portrait.png','frameWidth':64,'frameHeight':64,
          'columns':COLS,'rows':len(ACTS),'clips':clips,'status':'em_producao',
          'license':'arte autoral do projeto RPG Carcaça','qa':'inspeção em navegador e Android pendentes'}
    (folder/'meta.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    return folder

if __name__=='__main__':
 for id,name,k in CREATURES:print(sheet_for(id,name,k))