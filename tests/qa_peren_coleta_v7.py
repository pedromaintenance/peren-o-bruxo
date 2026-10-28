"""Pixel-level regression of the unified Peren collect asset v7."""
from pathlib import Path
from PIL import Image,ImageChops
import json,hashlib
ROOT=Path(__file__).resolve().parents[1]
PEREN=ROOT/'phaser-demo-m1hf/art/characters/peren'
V7=PEREN/'official-v7'
manifest=json.loads((V7/'manifest.json').read_text(encoding='utf-8'))
assert manifest['schema']=='peren.collect.v7'
assert manifest['directions']==['down','left','right','up']
assert manifest['runtimeAsset']['size']==[240,256]
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(V7/'peren-collect-atlas-48x64.png')==manifest['runtimeAsset']['sha256']
assert sha(PEREN/'peren-collect-atlas.png')==manifest['runtimeAsset']['sha256']
assert sha(V7/'peren-collect-4directions-5frames-224x260.png')==manifest['normalizedAtlasSha256']
hi=Image.open(V7/'peren-collect-4directions-5frames-224x260.png').convert('RGBA')
lo=Image.open(PEREN/'peren-collect-atlas.png').convert('RGBA')
assert hi.size==(1120,1040) and lo.size==(240,256)
for row,source in enumerate(manifest['sources']):
    original=Image.open(V7/source['file']).convert('RGBA')
    assert original.size==(1280,260)
    assert hashlib.sha256(original.tobytes()).hexdigest()==source['sha256']
    for col in range(5):
        box=(col*264,0,col*264+224,260)
        source_tile=original.crop(box)
        atlas_tile=hi.crop((col*224,row*260,(col+1)*224,(row+1)*260))
        assert ImageChops.difference(source_tile,atlas_tile).getbbox() is None,(row,col)
        runtime_tile=lo.crop((col*48,row*64,(col+1)*48,(row+1)*64))
        assert runtime_tile.getchannel('A').getbbox() is not None,(row,col)
        # Detect accidental border-cutting and preserve room for particle/foot alignment.
        bbox=runtime_tile.getchannel('A').getbbox()
        assert 0 <= bbox[0] < 48 and bbox[2] <= 48
        assert 0 <= bbox[1] < 64 and bbox[3] <= 64
assert not (PEREN/'peren-herb-atlas.png').exists()
assert not (PEREN/'official-v5/peren-atlas-herb-v5.png').exists()
assert not (PEREN/'official-v5/source-herb-gather-4x4.png').exists()
print('Peren coleta v7 PASS: 4 × 5 original poses, 20 runtime frames, no herb-only atlas')