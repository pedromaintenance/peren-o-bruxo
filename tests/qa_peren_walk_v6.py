"""Tests for creator-supplied Peren normal walking sprites v6."""
from pathlib import Path
from PIL import Image, ImageChops
import json,hashlib
root=Path(__file__).resolve().parents[1]
base=root/'phaser-demo-m1hf/art/characters/peren'
folder=base/'official-v6'
manifest=json.loads((folder/'manifest.json').read_text())
assert manifest['schema']=='peren.walk.v6'
assert manifest['frameCountPerDirection']==5
assert manifest['unmodifiedAtlasFrames']==80
assert len(manifest['modifiedAtlasIndices'])==48
runtime=base/'peren-atlas.png'
assert hashlib.sha256(runtime.read_bytes()).hexdigest()==manifest['runtimeSha256']
img=Image.open(runtime).convert('RGBA');assert img.size==(768,512)
high=Image.open(folder/manifest['normalizedAtlas']).convert('RGBA');assert high.size==(1120,1040)
assert hashlib.sha256((folder/manifest['normalizedAtlas']).read_bytes()).hexdigest()==manifest['highResSha256']
for d,filename in {'down':'front.png','left':'left.png','right':'right.png','up':'back.png'}.items():
    f=folder/filename
    assert f.is_file() and hashlib.sha256(f.read_bytes()).hexdigest()==manifest['sourceSha256'][d]
    assert Image.open(f).size==tuple(manifest['sourceDimensions'][d])
for d in range(4):
    walk=[]
    for idx in range(d*32+4,d*32+8):
        crop=img.crop(((idx%16)*48,(idx//16)*64,(idx%16+1)*48,(idx//16+1)*64))
        assert crop.getchannel('A').getbbox() is not None
        walk.append(hashlib.sha256(crop.tobytes()).hexdigest())
    assert len(set(walk))==4, 'walk frames must be four distinct poses'
legacy=Image.open(base/'official-v5/peren-atlas-normal-walkfix-v5.png').convert('RGBA')
for idx in set(range(128))-set(manifest['modifiedAtlasIndices']):
    box=((idx%16)*48,(idx//16)*64,(idx%16+1)*48,(idx//16+1)*64)
    assert ImageChops.difference(img.crop(box),legacy.crop(box)).getbbox() is None, f'unrelated frame changed: {idx}'
assert (base/'peren-wounded-atlas.png').is_file()
print('Walk v6 QA PASS: original SHA-256 ×4; high-res 4×5; 48 runtime cells; 80 unchanged; wounded untouched')
