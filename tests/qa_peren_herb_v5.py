"""Compare every harvest frame pixel-for-pixel with the approved master."""
from pathlib import Path
from PIL import Image
import hashlib
import json

ROOT=Path(__file__).resolve().parents[1]
PATH=ROOT/"phaser-demo-m1hf/art/characters/peren/official-v5"
meta=json.loads((PATH/"runtime-provenance.json").read_text())
source=(PATH/"peren-coleta-4x4-original-160x190.png").read_bytes()
atlas_file=PATH/"peren-coleta-runtime-4x4-48x64.png"
assert meta["schema"]=="peren-herb-harvest-v5"
assert hashlib.sha256(source).hexdigest()=="f8f8d772a5268d0c465ec9ad0b6b2e02fc6660932090b8926ddb96ac4fef4147"
assert hashlib.sha256(atlas_file.read_bytes()).hexdigest()=="ed55e98fba4aff8aff46adea3d63d3d97e540f0e808f7cb9241403beada40ed6"
assert meta["durationsMs"]==[350,250,450,850]
im=Image.open(PATH/"peren-coleta-4x4-original-160x190.png").convert("RGBA")
runtime=Image.open(atlas_file).convert("RGBA")
assert im.size==(640,760) and runtime.size==(192,256)
unique=set()
for row in range(4):
 for col in range(4):
  crop=im.crop((col*160,row*190,col*160+160,row*190+190)).crop((5,0,155,185))
  tile=Image.new("RGBA",(48,64))
  tile.alpha_composite(crop.resize((44,59),Image.Resampling.NEAREST),(2,3))
  actual=runtime.crop((col*48,row*64,col*48+48,row*64+64))
  assert actual.tobytes()==tile.tobytes(),f"wrong frame row={row} col={col}"
  bbox=actual.getchannel("A").getbbox()
  assert bbox and bbox[3]==62 and bbox[0]>0 and bbox[2]<48,(row,col,bbox)
  unique.add(hashlib.sha256(actual.tobytes()).digest())
assert len(unique)==16,"One or more poses are accidentally repeated"
assert (ROOT/"phaser-demo-m1hf/art/characters/peren/peren-herb-gather.png").read_bytes()==atlas_file.read_bytes()
for v in ["art-m1h","art-m1hb","art-m1hc","art-m1hd"]:
 assert (ROOT/f"phaser-demo-m1hf/{v}/characters/peren/peren-herb-gather.png").read_bytes()==atlas_file.read_bytes()
print("PEREN HERB v5 PASS: 16 distinct official frames, all feet registered, source RGBA preserved.")
