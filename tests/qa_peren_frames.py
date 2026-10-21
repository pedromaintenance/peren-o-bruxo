"""Pixel-level regressions for source-faithful Peren sprite sheet.

No official master ZIP is checked into the repo. The runtime is reproducible
with ferramentas/gerar_peren_runtime.py when the user-supplied ZIP is available.
"""
from pathlib import Path
from PIL import Image, ImageChops
from collections import Counter
import json, hashlib

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'phaser-demo-m1hf/art/characters/peren'
DIR=BASE/'official-v2'
ATLAS=Image.open(DIR/'peren-atlas-official-48x64.png')
assert ATLAS.size==(768,512),f'Invalid atlas dimensions: {ATLAS.size}'
assert ATLAS.mode=='RGBA',f'Atlas must retain original RGBA, not quantize to a palette: {ATLAS.mode}'
meta=json.loads((DIR/'runtime-provenance.json').read_text())
assert meta['schema']=='peren-official-runtime-2'
assert meta['source_zip_sha256']=='b8947630076d39f4b50a44d50d151088a00ba7e9cfbb84112310a780a9d01e20'
assert meta['atlas_frames']==128 and len(meta['frames'])==128
assert len(set(f['index'] for f in meta['frames']))==128
assert tuple(meta['source_registration'])==(20,18,140,185)

frames=[]
for i in range(128):
 x=(i%16)*48; y=(i//16)*64
 tile=ATLAS.crop((x,y,x+48,y+64))
 bbox=tile.getchannel('A').getbbox()
 assert bbox is not None,f'Frame {i} is entirely empty'
 assert bbox[0]>0 and bbox[1]>0 and bbox[2]<48 and bbox[3]<64,f'Frame {i} is clipped: {bbox}'
 assert bbox[3]==62,f'Feet moved out of alignment on frame {i}: {bbox[3]}'
 frames.append(tile)

# Duplicates are an HONEST placeholder where the official ZIP has no animation;
# replacing them with random steps or varying body dimensions is a regression.
actions=['idle','walk','run','interact','gather','hurt','cast','attack']
unique=[]
for direction in range(4):
 for ai,action in enumerate(actions):
  start=direction*32+ai*4
  hashes=[hashlib.sha256(f.tobytes()).hexdigest() for f in frames[start:start+4]]
  count=len(set(hashes));unique.append(count)
  if action not in ['walk','run']:
   assert count==1,f'{direction}/{action} fakes a missing animation ({count} frames)'
  if direction==0:
   assert count==1,f'Front {action} is not animated in official source'
  if direction in [1,2] and action in ['walk','run']:
   assert count==4,f'Side {action} must retain the original walk cycle'
  if direction==3 and action in ['walk','run']:
   assert count==4,f'Back cape must use source movement, if available'

for left,right in zip(frames[32:64],frames[64:96]):
 assert ImageChops.difference(left.transpose(Image.Transpose.FLIP_LEFT_RIGHT),right).getbbox() is None,'Right sprite is not a true mirror of left'

expected_files={
 'peren-atlas-official-48x64.png':('a17344bda86f503faebd9fe3db65f951b3a0399d7fc39efb18d0b33e262316eb',(768,512)),
 'peren-actor-official-128.png':('f4a611f6073a6436115ee6c73ef5e40b980bc7f7c98735b9483dd67e62e972c9',(128,261)),
 'peren-portrait-official-256.png':('81ae05daca03276ace5c8b463a81a4036be6834ae2e978397cd8b9f58d9a6cbf',(256,256)),
 'peren-portrait-official-128.png':('cab573bc7bac38fde239ad0710261d359eb53954bf81a4f939369cca18d3d68d',(128,151))
}
for name,(expected_hash,shape) in expected_files.items():
 path=DIR/name
 assert path.is_file(),f'Missing runtime art: {name}'
 assert hashlib.sha256(path.read_bytes()).hexdigest()==expected_hash,f'Unexpected sprite content: {name}'
 assert Image.open(path).size==shape
# Legacy v2 remains archived and unmodified; live assets must match new walk-v3 instead.
V3=BASE/'official-v3/peren-atlas-official-48x64.png'
for path in [BASE/'peren-atlas.png',ROOT/'phaser-demo/art/characters/peren/peren-atlas.png']:
 assert path.read_bytes()==V3.read_bytes()

print(f'Peren sprites QA: 128 aligned frames, 4 directions, {len({hashlib.sha256(f.tobytes()).digest() for f in frames})} distinct source renderings; stable missing-action placeholders; truecolor PNGs. PASS')