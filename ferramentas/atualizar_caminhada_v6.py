#!/usr/bin/env python3
"""Consolida as 4 sequências originais e atualiza SOMENTE idle/walk/run do atlas Phaser.

O atlas 48x64 tem 128 quadros, 16 colunas, 8 linhas. Todos os outros
80 quadros são preservados pixel a pixel. Não modifica o atlas ferido.
"""
import argparse,hashlib,io,json,zipfile
from pathlib import Path
from PIL import Image

DIRECTIONS=('down','left','right','up')
SOURCE_NAME={'down':'front.png','left':'left.png','right':'right.png','up':'back.png'}
EXPECTED_SIZE={'down':(1280,260),'left':(2048,682),'right':(1280,260),'up':(1280,260)}
EXPECTED_SHA={
'down':'2309d029316f3514b668a7287b27fb2ffe60ea47edc2572a192909a465ee0cfd',
'left':'68a5119c572e2e9904aa532925ace1166ecd3935f8c7198a781cbcf3e396f278',
'right':'3e789e7c4d20b7a0b7e2dcad2499c4bf10114dba42b771a4b5844432b7ec6564',
'up':'7a28e6a7ad535b6ebcac14358729b8082e7298e87032f2ce9d347509fe3be84d',
}
WALK_FRAME_MS=180


def build(repo_root:Path, package:Path):
    art=repo_root/'phaser-demo-m1hf/art/characters/peren'
    source=art/'official-v6'
    source.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(package) as z:
        sprites={}
        for direction in DIRECTIONS:
            name=SOURCE_NAME[direction];raw=z.read(name)
            sha=hashlib.sha256(raw).hexdigest()
            if sha!=EXPECTED_SHA[direction]:raise ValueError(f'{name}: invalid original SHA-256 {sha}')
            im=Image.open(io.BytesIO(raw)).convert('RGBA')
            if im.size!=EXPECTED_SIZE[direction]:raise ValueError(f'{name}: size {im.size}')
            (source/name).write_bytes(raw)
            sprites[direction]=im

    frames={}
    for direction,im in sprites.items():
        frames[direction]=[]
        for i in range(5):
            if direction=='left':
                # The five source poses use 409/410-pixel columns. A constant
                # 328x380 crop yields the SAME registration, no per-frame bbox drift.
                center=round((i+.5)*im.width/5)
                crop=(center-164,132,center+164,512)
                src=im.crop(crop).resize((224,260),Image.Resampling.LANCZOS)
            else:
                x=264*i
                crop=(x,0,x+224,260)
                src=im.crop(crop)
            frames[direction].append(src)

    # 5 frames per direction, no gutters. Frame 0 = idle; 1..4 = walk cycle.
    high=Image.new('RGBA',(1120,1040),(0,0,0,0))
    for row,direction in enumerate(DIRECTIONS):
        for i,im in enumerate(frames[direction]):high.alpha_composite(im,(224*i,260*row))
    high_path=source/'peren-walk-4-directions-5frames-224x260.png'
    high.save(high_path,optimize=True)
    # Keep original runtime frames from Git tracked active atlas. No redraw of other actions.
    runtime_path=art/'peren-atlas.png'
    runtime=Image.open(runtime_path).convert('RGBA')
    if runtime.size!=(768,512):raise ValueError(f'Atlas runtime incompatível {runtime.size}')
    original=runtime.copy()
    modified=[]
    for di,direction in enumerate(DIRECTIONS):
        # Active game expects 4 idle, 4 walk and 4 run frames per direction.
        for action,poses in [('idle',[0]*4),('walk',[1,2,3,4]),('run',[1,2,3,4])]:
            ai={'idle':0,'walk':1,'run':2}[action]
            for n,pose in enumerate(poses):
                idx=di*32+ai*4+n
                px=(idx%16)*48;py=(idx//16)*64
                # Uniform source canvas and foot registration across every pose/direction.
                img=frames[direction][pose].resize((44,59),Image.Resampling.LANCZOS)
                runtime.paste((0,0,0,0),(px,py,px+48,py+64))
                runtime.alpha_composite(img,(px+2,py+3))
                modified.append(idx)
    # Strong guard: no other atlas cells may change, especially gathering and spells.
    for idx in set(range(128))-set(modified):
        box=((idx%16)*48,(idx//16)*64,(idx%16+1)*48,(idx//16+1)*64)
        if original.crop(box).tobytes()!=runtime.crop(box).tobytes():
            raise AssertionError('Modified unrelated frame '+str(idx))
    runtime.save(runtime_path,optimize=True)
    payload={
        'schema':'peren.walk.v6','name':'Peren Kerrhylon — Caminhada normal',
        'school':None,'sourcePackage':package.name,
        'directions':list(DIRECTIONS),'frameCountPerDirection':5,
        'frames':{'idle':0,'walkingLoop':[1,2,3,4]},
        'sourceDimensions':{d:list(EXPECTED_SIZE[d]) for d in DIRECTIONS},
        'sourceSha256':EXPECTED_SHA,'normalizedAtlas':high_path.name,
        'normalizedFrameSize':[224,260],'normalizedAtlasSize':[1120,1040],
        'runtimeAtlas':'../peren-atlas.png','runtimeFrameSize':[48,64],
        'modifiedActions':['idle','walk','run'],
        'modifiedAtlasIndices':modified,
        'unmodifiedAtlasFrames':80,
        'runUsesWalkFrames':True,'walkFrameMs':WALK_FRAME_MS,
        'cropPolicy':{'left':'fixed x centered per fifth, crop 328×380 at y=132..512; proportional Lanczos reduction to 224×260','down/right/up':'224×260 starting at x=264*n; four 40px transparent gutters'},
        'runtimeSha256':hashlib.sha256(runtime_path.read_bytes()).hexdigest(),
        'highResSha256':hashlib.sha256(high_path.read_bytes()).hexdigest(),
        'status':'integrated into normal field atlas; wounded atlas and gameplay untouched'
    }
    (source/'manifest.json').write_text(json.dumps(payload,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    atlas_manifest=art/'atlas.json'
    data=json.loads(atlas_manifest.read_text(encoding='utf-8'))
    data['runtime'].update({'version':6,'source':'Four creator-supplied five-pose directional walks; 5-frame source (idle+4 gait)','walkSource':'official-v6/peren-walk-4-directions-5frames-224x260.png','provenance':'official-v6/manifest.json','walkFrames':'1 → 2 → 3 → 4','walkFrameMs':WALK_FRAME_MS,'downMovement':'4 unique gait poses + idle','leftMovement':'4 unique gait poses + idle','rightMovement':'4 unique gait poses + idle','backMovement':'4 unique gait poses + idle','runSource':'same four source walking poses at existing run animation rate'})
    (atlas_manifest).write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'runtime_sha256':payload['runtimeSha256'],'high_res_sha256':payload['highResSha256'],'modified':len(modified),'originals':list(SOURCE_NAME.values())},ensure_ascii=False))
    return payload

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--repo',type=Path,default=Path('.'));p.add_argument('--package',type=Path,default=Path('phaser-demo-m1hf/art/characters/peren/official-v6/peren-walk-originals.zip'))
    a=p.parse_args();build(a.repo,a.repo/a.package)