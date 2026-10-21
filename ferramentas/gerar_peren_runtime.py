#!/usr/bin/env python3
"""Generate stable, source-faithful Peren sprites from the official supplied ZIP.

No animation is fabricated: missing motions are held in a source pose. The same
160x190 source registration rectangle is used for every pose to prevent size jitter.
Only walking left and cape motion from behind have moving source art; walking
right mirrors the left. Use --output to choose a location without touching masters.
"""
from __future__ import annotations
from PIL import Image
from pathlib import Path
import argparse, io, zipfile, hashlib, json

parser=argparse.ArgumentParser()
parser.add_argument('--zip',required=True,type=Path)
parser.add_argument('--output',default=Path('phaser-demo-m1hf/art/characters/peren/official-v2'),type=Path)
args=parser.parse_args()
ZIP=args.zip
OUT=args.output
OUT.mkdir(parents=True,exist_ok=True)
EXPECTED_HASH='b8947630076d39f4b50a44d50d151088a00ba7e9cfbb84112310a780a9d01e20'
actual=hashlib.sha256(ZIP.read_bytes()).hexdigest()
if actual!=EXPECTED_HASH: raise SystemExit('ZIP oficial incorreto; SHA-256 não corresponde ao pacote aprovado')
base='Peren_Kerrhylon_Assets/'
files=[
 '01_idle_tres_quartos_esquerda','02_idle_frente','03_idle_tres_quartos_direita','04_idle_perfil_direito',
 '05_idle_costas_a','06_idle_costas_b','07_caminhada_esquerda_passo_01','08_caminhada_esquerda_passo_02',
 '09_caminhada_esquerda_passo_03','10_caminhada_esquerda_passo_04','11_caminhada_esquerda_passo_05',
 '12_idle_costas_c','13_costas_capa_01','14_costas_capa_02','15_costas_capa_03',
 '16_costas_capa_04','17_frente_capa_em_movimento','18_costas_capa_05']
with zipfile.ZipFile(ZIP) as z:
 poses=[Image.open(io.BytesIO(z.read(base+'charset/alinhados/'+n+'.png'))).convert('RGBA') for n in files]
 portrait=Image.open(io.BytesIO(z.read(base+'retrato/peren_portrait.png'))).convert('RGBA')
 actor=Image.open(io.BytesIO(z.read(base+'actor/peren_actor.png'))).convert('RGBA')

# Color faithful PNG RGBA (no palette truncation). Nearest-neighbor downsampling only.
portrait128=portrait.resize((128,151),Image.Resampling.NEAREST)
portrait128.save(OUT/'peren-portrait-official-128.png',optimize=True)
portraitfull=portrait.resize((218,256),Image.Resampling.NEAREST)
square=Image.new('RGBA',(256,256),(0,0,0,0)); square.alpha_composite(portraitfull,(19,0))
square.save(OUT/'peren-portrait-official-256.png',optimize=True)
actor128=actor.resize((128,261),Image.Resampling.NEAREST)
actor128.save(OUT/'peren-actor-official-128.png',optimize=True)

# Static placeholders ARE DELIBERATE: gestures do not exist in the official source.
# Never substitute a walk cycle for an interaction, wound, gathering, spell or attack.
actions=['idle','walk','run','interact','gather','hurt','cast','attack']
rows={
'down':{'idle':[1]*4,'walk':[1]*4,'run':[1]*4,
        'interact':[1]*4,'gather':[1]*4,'hurt':[1]*4,'cast':[1]*4,'attack':[1]*4},
'left':{'idle':[0]*4,'walk':[6,7,8,9],'run':[7,8,9,10],
        'interact':[0]*4,'gather':[0]*4,'hurt':[0]*4,'cast':[0]*4,'attack':[0]*4},
'right':{'idle':[0]*4,'walk':[6,7,8,9],'run':[7,8,9,10],
        'interact':[0]*4,'gather':[0]*4,'hurt':[0]*4,'cast':[0]*4,'attack':[0]*4},
'up':{'idle':[4]*4,'walk':[12,13,14,15],'run':[13,14,15,17],
      'interact':[4]*4,'gather':[4]*4,'hurt':[4]*4,'cast':[4]*4,'attack':[4]*4}}

# Official sources aligned by foot at y=184 on a 160x190 canvas. Use a SINGLE
# registration rectangle and scale. Cropping each source by its changing alpha
# bounding box had made Peren appear to inflate/shrink across every stride.
registration=(20,18,140,185)
scale_size=(42,59)
frame_size=(48,64)
atlas=Image.new('RGBA',(16*48,8*64),(0,0,0,0))
provenance=[]
for di,(direction,clips) in enumerate(rows.items()):
 for ai,action in enumerate(actions):
  for f,idx in enumerate(clips[action]):
   seq=di*32+ai*4+f
   source=poses[idx]
   if source.size!=(160,190):raise ValueError('Fonte desalinhada '+files[idx])
   # Includes transparent margins, so common coordinates and foothold remain fixed.
   frame=source.crop(registration).resize(scale_size,Image.Resampling.NEAREST)
   if direction=='right':frame=frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
   x=(seq%16)*48 + 3
   y=(seq//16)*64 + 3
   atlas.alpha_composite(frame,(x,y))
   provenance.append({'index':seq,'direction':direction,'action':action,'pose':files[idx],
       'mirrored':direction=='right','source_motion':action in ('walk','run') and
       direction in ('left','right','up')})
atlas.save(OUT/'peren-atlas-official-48x64.png',optimize=True)

m={
 'schema':'peren-official-runtime-2',
 'source_zip_sha256':actual,
 'source_count':18,'frame_size':[48,64],'atlas_size':[768,512],
 'atlas_frames':128,'alpha_preserved':True,'source_registration':registration,
 'registered_image_size':scale_size,
 'limitations':'Walk/Run left use original left gait; right mirrors it. Up uses authored cape poses, not leg animation. Down is held front. Interact/gather/hurt/cast/attack are static placeholders pending specifically drawn assets. No artificial frame wobble or scale normalization.',
 'frames':provenance}
(OUT/'runtime-provenance.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')

# QA compare all 32 four-frame clips as a contact sheet in action/direction order.
contact=Image.new('RGBA',(4*48,8*64),(20,30,38,255))
for direction in range(4):
 for action in range(8):
  seq=direction*32+action*4
  contact.alpha_composite(atlas.crop(((seq%16)*48,(seq//16)*64,((seq%16)+1)*48,((seq//16)+1)*64)),(direction*48,action*64))
contact.resize((768,1024),Image.Resampling.NEAREST).save(OUT/'peren-atlas-preview.png')
for p in OUT.iterdir():print(p.name,p.stat().st_size)