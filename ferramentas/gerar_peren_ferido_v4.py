#!/usr/bin/env python3
"""Generate a separate, source-faithful wounded-walk atlas for the free-mode Phaser game.

Only 16 walking frames differ from the normal v3 128-frame atlas. Other 112
frames remain bit-identical. No gameplay health modification and no false
new animations. Source/foot registration is common across all twelve poses.
"""
from pathlib import Path
from PIL import Image
from zipfile import ZipFile
import argparse, hashlib, io, json

ROOT='Peren_Kerrhylon_Assets/'
SOURCE='charset/caminhada_ferido/atlas/peren_ferido_3col_4lin_160x190.png'
FRAMES_PER_DIRECTION=4
SIZE=(48,64)
SOURCE_ROW=['frente','esquerda','direita','costas']
RUNTIME_ROW=['down','left','right','up']
CYCLE=[0,1,2,1]
# Wounded cape extends past x=15; cropping with v3 rectangle clips the cloth.
# This single wider rectangle preserves the costume and maintains common feet.
CROP=(5,5,155,185)
TARGET=(44,59)
ANCHOR=(2,3)

def sha(raw):return hashlib.sha256(raw).hexdigest()

def render(package:Path,normal:Path,out:Path):
 out.mkdir(parents=True,exist_ok=True)
 with ZipFile(package) as z:
  source_bytes=z.read(ROOT+SOURCE)
  extended=z.read(ROOT+'charset/caminhada_ferido/atlas/peren_ferido_5col_4lin_240x285.png')
  manifest=json.loads(z.read(ROOT+'manifest_ferido.json'))
  source=Image.open(io.BytesIO(source_bytes)).convert('RGBA')
  assert source.size==(480,760),source.size
  assert manifest['padrao_compatibilidade']['ordem_linhas']==SOURCE_ROW
  assert manifest['padrao_compatibilidade']['tempo_por_frame_ms']==230
  normal_image=Image.open(normal).convert('RGBA')
  assert normal_image.size==(768,512)
  injured=normal_image.copy()
  mapping=[]
  for direction,row in enumerate(SOURCE_ROW):
   unique=set()
   for col,index in enumerate(CYCLE):
    src=source.crop((index*160,direction*190,(index+1)*160,(direction+1)*190))
    frame=src.crop(CROP).resize(TARGET,Image.Resampling.NEAREST)
    tile=Image.new('RGBA',SIZE,(0,0,0,0));tile.alpha_composite(frame,ANCHOR)
    bbox=tile.getchannel('A').getbbox()
    if bbox is None or bbox[0]==0 or bbox[2]==48 or not 57<=bbox[3]<=62: raise AssertionError(f'Bad wound frame {row}:{col} {bbox}')
    idx=direction*32+4+col
    x=(idx%16)*48;y=(idx//16)*64
    injured.paste(tile,(x,y))
    mapping.append({'atlasFrame':idx,'direction':RUNTIME_ROW[direction],
      'sourceRow':row,'sourceFrame':index+1,'sourceSHA256':sha(src.tobytes()),'feetY':bbox[3]})
    unique.add(sha(tile.tobytes()))
   if len(unique)!=3: raise AssertionError('Expected exactly three wounded frames: '+row)
  output=out/'peren-wounded-atlas.png'
  injured.save(output,optimize=True)
  source_path=out/'peren-ferido-3x4-original-160x190.png'
  source_path.write_bytes(source_bytes)
  report={'schema':'peren-wounded-walk-v4', 'sourcePackageSha256':sha(package.read_bytes()),
    'sourceWalkSha256':sha(source_bytes), 'sourceExtendedSha256':sha(extended),
    'normalAtlasSha256':sha(normal.read_bytes()), 'runtimeAtlasSha256':sha(output.read_bytes()),
    'sourceFrames':'4 directions × 3 (12 art poses)', 'runtimeFrames':'4 directions × 4 (16 cells: 1-2-3-2)',
    'frameSize':[48,64], 'atlasSize':[768,512], 'sourceRows':SOURCE_ROW,
    'order':CYCLE, 'frameMs':230, 'visualThreshold':0.5,
    'note':'Injured walking is an alternative cosmetic gait when 0<HP<=50% max. No speed or damage modifications.',
    'crop':list(CROP),'target':list(TARGET),'anchor':list(ANCHOR),
    'unchangedOtherFrames':112, 'extendedFiveColumnAtlas':'remains in original user-supplied ZIP; not used in runtime',
    'frames':mapping}
  (out/'runtime-provenance.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
  return report

if __name__=='__main__':
 p=argparse.ArgumentParser()
 p.add_argument('--zip',type=Path,required=True)
 p.add_argument('--normal',type=Path,required=True)
 p.add_argument('--out',type=Path,required=True)
 args=p.parse_args()
 print(json.dumps(render(args.zip,args.normal,args.out),indent=2,ensure_ascii=False)[:900])