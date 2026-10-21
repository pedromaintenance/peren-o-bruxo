"""Exact pixel QA of source wounds, preserved normal atlas and four gait directions."""
from pathlib import Path
from PIL import Image
import hashlib,json

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/"phaser-demo-m1hf/art/characters/peren"
V4=BASE/"official-v4"
normal=Image.open(BASE/"official-v3/peren-atlas-official-48x64.png").convert("RGBA")
wounded=Image.open(V4/"peren-wounded-atlas.png").convert("RGBA")
source=Image.open(V4/"peren-ferido-3x4-original-160x190.png").convert("RGBA")
meta=json.loads((V4/"runtime-provenance.json").read_text())
assert meta["schema"]=="peren-wounded-walk-v4"
assert meta["sourcePackageSha256"]=="c7bc4b761b41760b0e93004b4edeb8a92074f32b220f712b3186ab0844f2f904"
assert meta["runtimeAtlasSha256"]=="4520292c92ae79e922a7cffebce5c51863639924cd1bcb9af7bfbe3a20474c78"
assert wounded.size==normal.size==(768,512) and wounded.mode=="RGBA"
assert source.size==(480,760)
assert meta["frameMs"]==230 and meta["visualThreshold"]==0.5

def cell(im,i):
 x=(i%16)*48;y=(i//16)*64
 return im.crop((x,y,x+48,y+64))

changed=set()
for row,name in enumerate(("frente","esquerda","direita","costas")):
 seen=set()
 for i,col in enumerate((0,1,2,1)):
  index=row*32+4+i
  cut=source.crop((col*160,row*190,(col+1)*160,(row+1)*190))
  frame=cut.crop((5,5,155,185)).resize((44,59),Image.Resampling.NEAREST)
  exp=Image.new("RGBA",(48,64),(0,0,0,0))
  exp.alpha_composite(frame,(2,3))
  assert cell(wounded,index).tobytes()==exp.tobytes(),f"{name} frame {i}: source mismatch"
  bbox=exp.getchannel("A").getbbox()
  assert bbox and 57<=bbox[3]<=62 and 0<bbox[0]<48 and bbox[2]<48, (name,i,bbox)
  seen.add(hashlib.sha256(exp.tobytes()).digest())
  changed.add(index)
 assert len(seen)==3, f"Direction {name} should have 3 distinct poses"

for i in range(128):
 if i not in changed:
  assert cell(wounded,i).tobytes()==cell(normal,i).tobytes(),f"Non-walk frame changed: {i}"
assert len(changed)==16
assert (BASE/"peren-wounded-atlas.png").read_bytes()==(V4/"peren-wounded-atlas.png").read_bytes()
for v in ["art-m1h","art-m1hb","art-m1hc","art-m1hd"]:
 assert (ROOT/f"phaser-demo-m1hf/{v}/characters/peren/peren-wounded-atlas.png").read_bytes()==(V4/"peren-wounded-atlas.png").read_bytes()
assert (ROOT/"phaser-demo/art/characters/peren/peren-wounded-atlas.png").read_bytes()==(V4/"peren-wounded-atlas.png").read_bytes()
print("PEREN WOUNDED WALK QA PASS: 12 source poses, 16 runtime indices, 112 untouched, feet and transparency.")
