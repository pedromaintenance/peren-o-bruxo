#!/usr/bin/env python3
"""Rebuild 128-frame runtime atlas with 12 new approved 4-direction walking frames.
Preserves existing non-walk pose mappings and 48x64 frame indices. No fabrication of other actions.
"""
from __future__ import annotations
from pathlib import Path
import zipfile,hashlib,io,json,argparse
from PIL import Image

OFFICIAL_ZIP_SHA256='0ff0981e3b1fa26f8d8cfe10131fd33fb85f6957d7700e979b09b54f32e9dcd4'
BASE='Peren_Kerrhylon_Assets/'
NAMES=['01_idle_tres_quartos_esquerda','02_idle_frente','03_idle_tres_quartos_direita','04_idle_perfil_direito','05_idle_costas_a','06_idle_costas_b','07_caminhada_esquerda_passo_01','08_caminhada_esquerda_passo_02','09_caminhada_esquerda_passo_03','10_caminhada_esquerda_passo_04','11_caminhada_esquerda_passo_05','12_idle_costas_c','13_costas_capa_01','14_costas_capa_02','15_costas_capa_03','16_costas_capa_04','17_frente_capa_em_movimento','18_costas_capa_05']
ACTIONS=['idle','walk','run','interact','gather','hurt','cast','attack']
DIRECTIONS=['down','left','right','up']
OLD={
'down':{'idle':[1]*4,'walk':[1]*4,'run':[1]*4,'interact':[1]*4,'gather':[1]*4,'hurt':[1]*4,'cast':[1]*4,'attack':[1]*4},
'left':{'idle':[0]*4,'walk':[6,7,8,9],'run':[7,8,9,10],'interact':[0]*4,'gather':[0]*4,'hurt':[0]*4,'cast':[0]*4,'attack':[0]*4},
'right':{'idle':[0]*4,'walk':[6,7,8,9],'run':[7,8,9,10],'interact':[0]*4,'gather':[0]*4,'hurt':[0]*4,'cast':[0]*4,'attack':[0]*4},
'up':{'idle':[4]*4,'walk':[12,13,14,15],'run':[13,14,15,17],'interact':[4]*4,'gather':[4]*4,'hurt':[4]*4,'cast':[4]*4,'attack':[4]*4},
}

def source_zip(zpath:Path):
    data=zpath.read_bytes(); digest=hashlib.sha256(data).hexdigest()
    if digest!=OFFICIAL_ZIP_SHA256: raise ValueError('Pacote novo diferente do ZIP aprovado: '+digest)
    return zipfile.ZipFile(io.BytesIO(data)),digest

def build(zpath:Path,out:Path):
    out.mkdir(parents=True,exist_ok=True)
    z,digest=source_zip(zpath)
    def image(n):
        return Image.open(io.BytesIO(z.read(BASE+n))).convert('RGBA')
    poses=[image('charset/alinhados/'+n+'.png') for n in NAMES]
    walk={direction:[image(f'charset/caminhada/frames/{direction}/peren_{direction}_frame_{i:02d}.png') for i in [1,2,3]] for direction in ['frente','esquerda','direita','costas']}
    assert all(im.size==(160,190) for im in poses)
    assert all(im.size==(160,190) for frames in walk.values() for im in frames)
    srcatlas=image('charset/caminhada/atlas/peren_caminhada_3col_4lin_160x190.png')
    assert srcatlas.size==(480,760)
    for row,d in enumerate(['frente','esquerda','direita','costas']):
        for col in range(3):
            assert srcatlas.crop((col*160,row*190,(col+1)*160,(row+1)*190)).tobytes()==walk[d][col].tobytes()
    # Existing atlas v2 computed in-place so no change to non-walk frames.
    atlas=Image.new('RGBA',(768,512))
    history=[]
    for di,direction in enumerate(DIRECTIONS):
        for ai,action in enumerate(ACTIONS):
            for fi in range(4):
                idx=di*32+ai*4+fi
                iswalk=action=='walk'
                if iswalk:
                    source_index=[0,1,2,1][fi]
                    source_dir={'down':'frente','left':'esquerda','right':'direita','up':'costas'}[direction]
                    source=walk[source_dir][source_index]
                    # New official sprites are wider than old; common registration retains cape/hair.
                    # Fixed crop/scale/anchor; do NOT normalize bbox independently per frame.
                    crop=(15,15,145,185)
                    frame=source.crop(crop).resize((44,59),Image.Resampling.NEAREST)
                    xpad=2
                    note='new_official_walk'
                    source_name=f'charset/caminhada/frames/{source_dir}/peren_{source_dir}_frame_{source_index+1:02d}.png'
                    mirror=source_dir=='esquerda' and source_index==2 # internal original source mirrored, not runtime flipped
                else:
                    pindex=OLD[direction][action][fi]
                    source=poses[pindex]
                    frame=source.crop((20,18,140,185)).resize((42,59),Image.Resampling.NEAREST)
                    if direction=='right':frame=frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
                    xpad=3
                    note='unchanged_v2_mapping'
                    source_name='charset/alinhados/'+NAMES[pindex]+'.png'
                    mirror=direction=='right'
                tx=(idx%16)*48+xpad
                ty=(idx//16)*64+3
                atlas.alpha_composite(frame,(tx,ty))
                history.append({'index':idx,'direction':direction,'action':action,'cycleIndex':fi,'file':source_name,'mirrored':mirror,'origin':note})
    out_atlas=out/'peren-atlas-official-48x64.png'
    atlas.save(out_atlas,optimize=True)
    original=out/'peren-caminhada-3x4-original-160x190.png';original.write_bytes(z.read(BASE+'charset/caminhada/atlas/peren_caminhada_3col_4lin_160x190.png'))
    report={'schema':'peren-official-walk-v3','source_zip_sha256':digest,'source_walk_sha256':hashlib.sha256(original.read_bytes()).hexdigest(),'frameSize':[48,64],'atlasSize':[768,512],'framesTotal':128,'walkDirectionOrder':DIRECTIONS,'sourceRows':['frente','esquerda','direita','costas'],'walkLoop':'1 → 2 → 3 → 2','sourceFrameMs':180,'runtimeFps':5.5555555556,'walkIndices':{d:[i*32+4+j for j in range(4)] for i,d in enumerate(DIRECTIONS)},'originalLeftFrame03Mirrored':True,'otherActions':'v2 preserved; no new attacks, gathering, cast, hurt, interact or running assets','frames':history}
    (out/'runtime-provenance.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    contact=Image.new('RGBA',(4*48*4,64),(17,28,32,255))
    for di in range(4):
        for f in range(4):
            index=di*32+4+f;x=(index%16)*48;y=(index//16)*64
            contact.alpha_composite(atlas.crop((x,y,x+48,y+64)),(di*192+f*48,0))
    contact.resize((1536,128),Image.Resampling.NEAREST).save(out/'walk-contact-v3.png')
    print(json.dumps({str(p.name):{'size':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in out.iterdir()},indent=2))

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--zip',type=Path,required=True);ap.add_argument('--output',type=Path,required=True)
    args=ap.parse_args();build(args.zip,args.output)