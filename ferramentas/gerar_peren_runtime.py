#!/usr/bin/env python3
"""Rebuilds the game's runtime sprites from the official artist-approved ZIP.

Usage: python ferramentas/gerar_peren_runtime.py --zip 'Peren_Kerrhylon_Assets_Recortados(1).zip'
Requires Pillow. Does not alter original ZIP or invent new directional poses: right is
mirrored left; up/down steps are authentic still poses alternated for continuity.
"""
from PIL import Image, ImageDraw
import zipfile, io, os, json, hashlib
from pathlib import Path
import argparse
parser=argparse.ArgumentParser(description='Gera atlas e retratos runtime de Peren com base no ZIP oficial')
parser.add_argument('--zip',required=True,type=Path,help='ZIP oficial do criador')
parser.add_argument('--output',type=Path,default=Path('phaser-demo-m1hf/art/characters/peren/official-v1'))
args=parser.parse_args()
Z=str(args.zip)
OUT=args.output
OUT.mkdir(parents=True,exist_ok=True)

base='Peren_Kerrhylon_Assets/'
with zipfile.ZipFile(Z) as z:
    poses={i:Image.open(io.BytesIO(z.read(base+name))).convert('RGBA') for i,name in enumerate([
    'charset/alinhados/01_idle_tres_quartos_esquerda.png',
    'charset/alinhados/02_idle_frente.png',
    'charset/alinhados/03_idle_tres_quartos_direita.png',
    'charset/alinhados/04_idle_perfil_direito.png',
    'charset/alinhados/05_idle_costas_a.png',
    'charset/alinhados/06_idle_costas_b.png',
    'charset/alinhados/07_caminhada_esquerda_passo_01.png',
    'charset/alinhados/08_caminhada_esquerda_passo_02.png',
    'charset/alinhados/09_caminhada_esquerda_passo_03.png',
    'charset/alinhados/10_caminhada_esquerda_passo_04.png',
    'charset/alinhados/11_caminhada_esquerda_passo_05.png',
    'charset/alinhados/12_idle_costas_c.png',
    'charset/alinhados/13_costas_capa_01.png',
    'charset/alinhados/14_costas_capa_02.png',
    'charset/alinhados/15_costas_capa_03.png',
    'charset/alinhados/16_costas_capa_04.png',
    'charset/alinhados/17_frente_capa_em_movimento.png',
    'charset/alinhados/18_costas_capa_05.png',
    ])}
    portrait=Image.open(io.BytesIO(z.read(base+'retrato/peren_portrait.png'))).convert('RGBA')
    actor=Image.open(io.BytesIO(z.read(base+'actor/peren_actor.png'))).convert('RGBA')

def pal_save(im,path,colors=128):
    # Exact pixel placement and alpha shapes. Quantization reduces colors for runtime, masters remain in ZIP.
    q=im.quantize(colors=colors,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE)
    q.save(path,optimize=True,compress_level=9)
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

# Maintain proportions, do not crop approved full portrait or actor
p=portrait.resize((128,151),Image.Resampling.NEAREST)
print('portrait',pal_save(p,OUT/'peren-portrait-official-128.png',128))
full=portrait.resize((218,256),Image.Resampling.NEAREST)
square=Image.new('RGBA',(256,256),(0,0,0,0));square.alpha_composite(full,(19,0))
print('portrait-square',pal_save(square,OUT/'peren-portrait-official-256.png',128))
a=actor.resize((128,261),Image.Resampling.NEAREST)
print('actor',pal_save(a,OUT/'peren-actor-official-128.png',128))

# Atlas compatible with all 32 clips in existing peren/atlas.json, 16 columns x 8 rows of 48x64.
# Only actual left-side walk has true five unique stride poses; other movements are nearest-neighbor
# adaptations of the delivered front/back/side poses (with 1px offset). No artificial anatomy.
rows={
 'down':{
 'idle':[1,1,1,16], 'walk':[1,16,1,16], 'run':[16,1,16,1],
 'interact':[16,1,16,1], 'gather':[1,16,1,16], 'hurt':[1,1,1,1],
 'cast':[16,1,16,1], 'attack':[16,1,16,1]},
 'left':{
 'idle':[0,0,0,0], 'walk':[6,7,8,9], 'run':[7,8,9,10],
 'interact':[0,6,0,7], 'gather':[0,6,7,0], 'hurt':[0,0,0,0],
 'cast':[6,0,7,0], 'attack':[7,8,9,10]},
 'right':{
 'idle':[0,0,0,0], 'walk':[6,7,8,9], 'run':[7,8,9,10],
 'interact':[0,6,0,7], 'gather':[0,6,7,0], 'hurt':[0,0,0,0],
 'cast':[6,0,7,0], 'attack':[7,8,9,10]},
 'up':{
 'idle':[4,5,11,4], 'walk':[12,13,14,15], 'run':[13,14,15,17],
 'interact':[4,13,4,14], 'gather':[12,4,13,4], 'hurt':[4,4,4,4],
 'cast':[13,4,14,4], 'attack':[12,13,14,15]},
}
atlas=Image.new('RGBA',(768,512),(0,0,0,0))
map_log=[]
for diridx,(direction,actions) in enumerate(rows.items()):
    for actionidx,(action,sourceposes) in enumerate(actions.items()):
        for f,idx in enumerate(sourceposes):
            frame_num=diridx*32+actionidx*4+f
            x=(frame_num%16)*48; y=(frame_num//16)*64
            sprite=poses[idx]
            bbox=sprite.getchannel('A').getbbox()
            sprite=sprite.crop(bbox)
            scale=min(44/sprite.width,59/sprite.height)
            size=(max(1,round(sprite.width*scale)),max(1,round(sprite.height*scale)))
            sprite=sprite.resize(size,Image.Resampling.NEAREST)
            if direction=='right':sprite=sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
            # Keep foot anchor fixed within each frame, with minimal bob derived from movement.
            bob=(-1 if f in (1,3) and action in ('walk','run') else 0)
            atlas.alpha_composite(sprite,(x+(48-sprite.width)//2,y+62-sprite.height+bob))
            map_log.append({'frame':frame_num,'direction':direction,'action':action,'original_pose':idx+1,'mirrored':direction=='right'})
print('atlas',pal_save(atlas,OUT/'peren-atlas-official-48x64.png',128))
(OUT/'runtime-provenance.json').write_text(json.dumps({'zip_sha256':hashlib.sha256(Path(Z).read_bytes()).hexdigest(),'source':'Peren_Kerrhylon_Assets_Recortados(1).zip','technical_notes':'Art from official poses; only left walk is complete in source. Other directional/action cycles reuse verified poses; right direction mirrors left; not new mastered animation. No antialiasing; quantization 128 indexed colors and nearest-neighbor scaling.','frames':map_log},ensure_ascii=False,indent=2))
# preview compact montage each 4th frame per clip, magnified 2x
sample=Image.new('RGBA',(4*48,8*64),(20,30,38,255))
for d in range(4):
 for a in range(8):
  idx=d*32+a*4
  box=(idx%16*48,idx//16*64,(idx%16+1)*48,(idx//16+1)*64)
  sample.alpha_composite(atlas.crop(box),(d*48,a*64))
sample.resize((768,1024),Image.Resampling.NEAREST).save(OUT/'peren-atlas-preview.png')
for f in OUT.iterdir():print(f.name,f.stat().st_size)