"""Pixel QA: official front walk fix, herbs-only sprite, unchanged wounded and generic actions."""
from pathlib import Path
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/"phaser-demo-m1hf/art/characters/peren"
V5=BASE/"official-v5"
digest=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
meta=json.loads((V5/"runtime-provenance.json").read_text())
assert meta["schema"]=="peren-walkfix-herbs-only-v5"
required={
 "source-walkfix-3x4.png":meta["sourceWalkSha256"],
 "source-herb-gather-4x4.png":meta["sourceGatherSha256"],
 "peren-atlas-normal-walkfix-v5.png":meta["fixedNormalAtlasSha256"],
 "peren-atlas-herb-v5.png":meta["herbAtlasSha256"],
}
for name,sha in required.items():assert digest(V5/name)==sha,(name,digest(V5/name))
baseline=Image.open(BASE/"official-v3/peren-atlas-official-48x64.png").convert("RGBA")
normal=Image.open(V5/"peren-atlas-normal-walkfix-v5.png").convert("RGBA")
herb=Image.open(V5/"peren-atlas-herb-v5.png").convert("RGBA")
sourcewalk=Image.open(V5/"source-walkfix-3x4.png").convert("RGBA")
sourceherb=Image.open(V5/"source-herb-gather-4x4.png").convert("RGBA")
assert normal.size==herb.size==baseline.size==(768,512)
assert sourcewalk.size==(480,760) and sourceherb.size==(640,760)
def tile(atlas,index):
 x=(index%16)*48;y=(index//16)*64
 return atlas.crop((x,y,x+48,y+64))
def expected(src,row,col,crop):
 raw=src.crop((col*160,row*190,(col+1)*160,(row+1)*190))
 small=raw.crop(crop).resize((44,59),Image.Resampling.NEAREST)
 out=Image.new("RGBA",(48,64));out.alpha_composite(small,(2,3))
 return out
walk={d*32+4+i for d in range(4) for i in range(4)}
gather={d*32+16+i for d in range(4) for i in range(4)}
for i in range(128):
 if i not in walk:
  assert tile(normal,i).tobytes()==tile(baseline,i).tobytes(),f"Unrelated normal sprite changed: {i}"
 if i not in gather:
  assert tile(herb,i).tobytes()==tile(normal,i).tobytes(),f"Unrelated herb sprite changed: {i}"
for direction in range(4):
 for cycle,col in enumerate((0,1,2,1)):
  i=direction*32+4+cycle
  assert tile(normal,i).tobytes()==expected(sourcewalk,direction,col,(15,15,145,185)).tobytes(),f"Walk frame {i} mismatch"
 for cycle in range(4):
  i=direction*32+16+cycle
  assert tile(herb,i).tobytes()==expected(sourceherb,direction,cycle,(5,5,155,185)).tobytes(),f"Herb frame {i} mismatch"
assert (BASE/"peren-atlas.png").read_bytes()==(V5/"peren-atlas-normal-walkfix-v5.png").read_bytes()
assert (BASE/"peren-herb-atlas.png").read_bytes()==(V5/"peren-atlas-herb-v5.png").read_bytes()
assert (BASE/"official-v4/peren-wounded-atlas.png").is_file()
assert digest(BASE/"official-v4/peren-wounded-atlas.png")=="4520292c92ae79e922a7cffebce5c51863639924cd1bcb9af7bfbe3a20474c78"
for v in ["art-m1h","art-m1hb","art-m1hc","art-m1hd"]:
 directory=ROOT/"phaser-demo-m1hf"/v/"characters/peren"
 assert digest(directory/"peren-atlas.png")==meta["fixedNormalAtlasSha256"]
 assert digest(directory/"peren-herb-atlas.png")==meta["herbAtlasSha256"]
print("Peren V5 PASS — 4 directions, 16 walk-fix frames, 16 herb frames, 112 non-walk unchanged, wounded intact.")
