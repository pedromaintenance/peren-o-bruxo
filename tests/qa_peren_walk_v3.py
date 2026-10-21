"""Pixel-by-pixel checks for approved four-direction 3-frame walk, no invented gestures."""
from pathlib import Path
from PIL import Image,ImageChops
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/"phaser-demo-m1hf/art/characters/peren"
V3=BASE/"official-v3"
V2=BASE/"official-v2/peren-atlas-official-48x64.png"
atlas=Image.open(V3/"peren-atlas-official-48x64.png").convert("RGBA")
old=Image.open(V2).convert("RGBA")
source=Image.open(V3/"peren-caminhada-3x4-original-160x190.png").convert("RGBA")
meta=json.loads((V3/"runtime-provenance.json").read_text())
assert atlas.size==old.size==(768,512)
assert source.size==(480,760)
assert atlas.mode=="RGBA"
assert hashlib.sha256((V3/"peren-atlas-official-48x64.png").read_bytes()).hexdigest()=="62a44d9ca68189014cb9e7731d04af8fe03800992140d99dae75e654c92317ea"
assert hashlib.sha256((V3/"peren-caminhada-3x4-original-160x190.png").read_bytes()).hexdigest()=="4281a7f1e946037f479f94331a509d380d5582cc87b8e1e707f8da1f4ffb359c"
assert meta["schema"]=="peren-official-walk-v3"
assert meta["walkLoop"]=="1 → 2 → 3 → 2"
assert meta["sourceFrameMs"]==180
assert meta["originalLeftFrame03Mirrored"] is True

def tile(img,i):
 x=(i%16)*48;y=(i//16)*64
 return img.crop((x,y,x+48,y+64))

# Verify every runtime walk image matches exactly the source frame with one fixed
# crop and anchor. The fourth frame is the second pose, not a fabricated fourth.
walk_frames=set()
for row,direction in enumerate(["down","left","right","up"]):
 for i,k in enumerate([0,1,2,1]):
  index=row*32+4+i;walk_frames.add(index)
  expected=Image.new("RGBA",(48,64))
  extracted=source.crop((k*160,row*190,(k+1)*160,(row+1)*190))
  expected.alpha_composite(extracted.crop((15,15,145,185)).resize((44,59),Image.Resampling.NEAREST),(2,3))
  actual=tile(atlas,index)
  assert actual.tobytes()==expected.tobytes(),f"{direction} frame {i} mismatch"
  bbox=actual.getchannel("A").getbbox()
  assert bbox is not None and bbox[2]<48 and bbox[3]==62, f"Bad feet/crop {direction}:{i} {bbox}"
 assert len({tile(atlas,row*32+4+i).tobytes() for i in range(4)})==3

# Walk-only change: all 112 other cells match previous version precisely.
for i in range(128):
 if i not in walk_frames:
  assert tile(atlas,i).tobytes()==tile(old,i).tobytes(),f"Non-walk frame changed: {i}"
assert len(walk_frames)==16
for dest in [BASE/"peren-atlas.png",ROOT/"phaser-demo/art/characters/peren/peren-atlas.png"]:
 assert dest.read_bytes()==(BASE/"official-v5/peren-atlas-normal-walkfix-v5.png").read_bytes()
print("WALK V3 PASSED: 4 directions, 3 real poses, 1-2-3-2 loop, 112 legacy frames unchanged.")
