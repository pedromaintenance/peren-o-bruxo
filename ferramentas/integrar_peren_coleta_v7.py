#!/usr/bin/env python3
"""Install creator-approved Peren gather v7 for every collectable.

Run from repo root, after ZIP has been committed. Idempotent; aborts when
compiled runtime does not match expected code instead of silently shipping.
"""
from __future__ import annotations
import hashlib
import json
import re
import zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / 'phaser-demo-m1hf'
PEREN = WEB / 'art/characters/peren'
V7 = PEREN / 'official-v7'
ARCHIVE = V7 / 'peren-collect-v7-assets.zip'
BIN = WEB / 'assets/game-B5Gp97dd.js'
EXPECTED_ZIP_SHA256 = '7fbaf35948c7d0506dd93b1b6333a2220ef0b319e80e3c9b383515bf9cbb32ab'
DIRECTIONS = ('down','left','right','up')
DURATIONS = (300,160,220,180,360)


def assert_sha(path: Path, expected: str):
    actual=hashlib.sha256(path.read_bytes()).hexdigest()
    assert actual==expected, f'{path}: SHA256 expected {expected}, got {actual}'


def replace_once(s: str, old: str, new: str, label: str):
    assert s.count(old)==1, f'{label}: expected exactly one occurrence, got {s.count(old)}'
    return s.replace(old,new,1)


def install_assets():
    assert_sha(ARCHIVE,EXPECTED_ZIP_SHA256)
    allowed={'front_source_5frames_40px.png','left_source_5frames_40px.png',
             'right_source_5frames_40px.png','back_source_5frames_40px.png',
             'peren-collect-4directions-5frames-224x260.png',
             'peren-collect-atlas-48x64.png','manifest.json'}
    with zipfile.ZipFile(ARCHIVE) as z:
        assert set(z.namelist())==allowed, 'Unexpected/unsafe ZIP contents'
        for name in sorted(allowed):
            dest=V7/name
            dest.write_bytes(z.read(name))
    source=json.loads((V7/'manifest.json').read_text(encoding='utf-8'))
    runtime=source['runtimeAsset']
    assert source['schema']=='peren.collect.v7' and runtime['size']==[240,256]
    assert source['directions']==list(DIRECTIONS)
    for s in source['sources']:
        img=Image.open(V7/s['file'])
        assert img.size==(1280,260), f'Invalid source {s}'
        assert hashlib.sha256(img.convert('RGBA').tobytes()).hexdigest()==s['sha256'],s['direction']
    raw=Image.open(V7/'peren-collect-4directions-5frames-224x260.png')
    assert raw.size==(1120,1040) and raw.mode=='RGBA'
    assert_sha(V7/'peren-collect-4directions-5frames-224x260.png',source['normalizedAtlasSha256'])
    assert_sha(V7/'peren-collect-atlas-48x64.png',runtime['sha256'])
    import shutil
    shutil.copy2(V7/'peren-collect-atlas-48x64.png',PEREN/'peren-collect-atlas.png')
    # Grounding: unpacking source originals is reversible; no edits to source pixels.
    return source


def modify_compiled_phaser():
    s=BIN.read_text(encoding='utf-8')
    s=replace_once(s,
        'this.load.spritesheet("peren-herb",Xi+"peren-herb-atlas.png",{frameWidth:48,frameHeight:64})',
        'this.load.spritesheet("peren-collect","./art/characters/peren/peren-collect-atlas.png",{frameWidth:48,frameHeight:64})',
        'loader')
    s=replace_once(s,
        'for(const[X,Y]of Object.entries(Vi))for(const[Z,K]of Yi.entries()){const H=',
        'for(const[X,Y]of Object.entries(Vi))for(const[Z,K]of Yi.entries()){if(K==="gather")continue;const H=',
        'skip old gather clip')
    old='for(const[X,Y]of Object.entries(Vi)){const Z=`peren-herb-${X}-gather`;this.anims.exists(Z)||this.anims.create({key:Z,frames:[{key:"peren-herb",frame:Y*32+16,duration:350},{key:"peren-herb",frame:Y*32+17,duration:250},{key:"peren-herb",frame:Y*32+18,duration:450},{key:"peren-herb",frame:Y*32+19,duration:850}],frameRate:1000/475,repeat:0})}'
    frames=','.join('{key:"peren-collect",frame:Y*5+'+str(i)+',duration:'+str(d)+'}' for i,d in enumerate(DURATIONS))
    new='for(const[X,Y]of Object.entries(Vi)){const Z=`peren-${X}-gather`;this.anims.exists(Z)||this.anims.create({key:Z,frames:['+frames+'],frameRate:1000/244,repeat:0})}'
    s=replace_once(s,old,new,'5-frame animation registration')
    s=replace_once(s,
       ':X==="gather-herb"?`peren-herb-${this.direction}-gather`:`peren-${this.direction}-${X}`',
       ':`peren-${this.direction}-${X}`','generic playback')
    s=replace_once(s,'this.playState(X.sprite==="herb"?"gather-herb":"gather")',
       'this.playState("gather")','all nodes gather')
    assert 'gather-herb' not in s and 'peren-herb' not in s,'Legacy spell references survive'
    BIN.write_text(s,encoding='utf-8')


def modify_meta():
    p=PEREN/'atlas.json'
    d=json.loads(p.read_text(encoding='utf-8'))
    r=d['runtime'];r.pop('herbGather',None)
    r['gatherV7']={
       'texture':'peren-collect',
       'sheet':'peren-collect-atlas.png',
       'manifest':'official-v7/manifest.json',
       'columns':5,'rows':4,'frameWidth':48,'frameHeight':64,
       'directionFrameNumbers':{direction:[i*5+k for k in range(5)] for i,direction in enumerate(DIRECTIONS)},
       'durationsMs':list(DURATIONS),'repeat':0,
       'usedFor':'all collectable nodes, including herbs and mushrooms',
       'note':'gather action frames in main 128-frame atlas are placeholders; runtime uses the dedicated 20-frame texture'
    }
    p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')


def modify_gallery():
    p=WEB/'peren-arte.html'
    s=p.read_text(encoding='utf-8')
    s=replace_once(s,
       '<option value="gather">Coleta genérica (cogumelos e outros)</option><option value="gather-herb">Colhendo ervas (animação oficial)</option>',
       '<option value="gather">Coletando (todos os itens, 5 quadros)</option>',
       'gallery dropdown')
    s=re.sub(r'<p class="notice">ATUALIZAÇÃO V6:.*?</p>',
       '<p class="notice">ATUALIZAÇÃO V7: uma única animação de coleta em cinco quadros e quatro direções, para ervas, cogumelos e todos os outros recursos. Retorno ao Idle após concluir; as caminhadas normal e ferida permanecem independentes.</p>',s,count=1)
    begin=s.index('<script>\n/* Enable direct-link')
    end=s.index('</script>',begin)+len('</script>')
    js='''<script>
if("serviceWorker" in navigator) navigator.serviceWorker.register("./demo-sw.js").catch(()=>{});
const picture=new Image();
const normalAtlas="./art/characters/peren/peren-atlas.png";
const woundedAtlas="./art/characters/peren/official-v4/peren-wounded-atlas.png";
const collectAtlas="./art/characters/peren/peren-collect-atlas.png";
const condition=document.getElementById("condition"),actionSelect=document.getElementById("action");
const canvases=[...document.querySelectorAll("canvas[data-dir]")];
const actions=["idle","walk","run","interact","gather","hurt","cast","attack"];
const gatherDelays=[300,160,220,180,360];
let ready=false,frame=0,nextTick=0;
function gathering(){return actionSelect.value==="gather"}
function texture(){return gathering()?collectAtlas:(condition.value==="wounded"?woundedAtlas:normalAtlas)}
function interval(){return gathering()?gatherDelays[frame]:actionSelect.value==="walk"?(condition.value==="wounded"?230:180):125}
function draw(){
 const action=Math.max(0,actions.indexOf(actionSelect.value));
 for(const canvas of canvases){
  const dir=Number(canvas.dataset.dir),index=gathering()?dir*5+frame:dir*32+action*4+frame;
  const sx=gathering()?index%5*48:index%16*48;
  const sy=gathering()?Math.floor(index/5)*64:Math.floor(index/16)*64;
  const ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;
  ctx.clearRect(0,0,48,64);ctx.drawImage(picture,sx,sy,48,64,0,0,48,64);
 }
}
function onReady(){
 const good=gathering()?(picture.naturalWidth===240&&picture.naturalHeight===256):(picture.naturalWidth===768&&picture.naturalHeight===512);
 if(!good){document.getElementById("status").textContent="Atlas inválido: dimensões incorretas";ready=false;return}
 ready=true;frame=0;draw();nextTick=performance.now()+interval();
 document.getElementById("status").textContent=gathering()?"20 quadros · 48×64 px · coleta universal (cinco poses, sem repetição)":"128 quadros · 48×64 px · caminhada normal 180 ms / ferido 230 ms";
}
function reset(){ready=false;frame=0;const src=texture();
 if(picture.getAttribute("src")===src&&picture.complete&&picture.naturalWidth){onReady();return}
 picture.src=src;
}
picture.onload=onReady;
picture.onerror=()=>{ready=false;document.getElementById("status").textContent="Não foi possível carregar o atlas offline."};
condition.addEventListener("change",reset);actionSelect.addEventListener("change",reset);
function render(time){
 if(ready&&time>=nextTick){
  if(!gathering()||frame<4){frame=gathering()?frame+1:(frame+1)%4;draw();nextTick=time+interval()}
 }
 requestAnimationFrame(render);
}
reset();requestAnimationFrame(render);
</script>'''
    s=s[:begin]+js+s[end:]
    p.write_text(s,encoding='utf-8')


def modify_sw():
    p=WEB/'demo-sw.js'
    s=p.read_text(encoding='utf-8')
    m=re.search(r'const FILES=(\[[^\n]+\]);',s)
    assert m,'FILES list not found'
    files=json.loads(m.group(1))
    files=[f for f in files if 'peren-herb-atlas.png' not in f and 'peren-atlas-herb-v5.png' not in f and 'source-herb-gather-4x4.png' not in f]
    for f in ('./art/characters/peren/peren-collect-atlas.png','./art/characters/peren/official-v7/manifest.json','./art/characters/peren/official-v7/peren-collect-4directions-5frames-224x260.png'):
        if f not in files:files.insert(0,f)
    s=s[:m.start(1)]+json.dumps(files,separators=(',',':'))+s[m.end(1):]
    s,n=re.subn(r'const CACHE="[^"]+";', 'const CACHE="peren-phaser-m1hf-preview-infernal-v90-collect-v7-20261028";',s,count=1)
    assert n==1
    p.write_text(s,encoding='utf-8')
    for name in files:
        path=WEB/name[2:]
        assert path.exists(),f'Service worker attempted to cache a missing file: {name}'


def remove_legacy():
    targets=[
       PEREN/'peren-herb-atlas.png',
       PEREN/'official-v5/peren-atlas-herb-v5.png',
       PEREN/'official-v5/source-herb-gather-4x4.png',
       ROOT/'phaser-demo/art/characters/peren/peren-herb-atlas.png',
       *(WEB/v/'characters/peren/peren-herb-atlas.png' for v in ('art-m1h','art-m1hb','art-m1hc','art-m1hd')),
    ]
    for p in targets:
        if p.exists():p.unlink()
    # Historical v5 provenance is retained but explicitly marked deprecated.
    p=PEREN/'official-v5/runtime-provenance.json'
    d=json.loads(p.read_text(encoding='utf-8'))
    d['supersededBy']='official-v7/manifest.json'
    d['historicalOnly']=True
    d['removedHerbSpecificRuntime']=True
    p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')


def remove_superseded_tests_and_update_workflows():
    # Both CI workflows must validate the replacement instead of enforcing a removed feature.
    for path in (ROOT/'.github/workflows/peren-official-art-qa.yml',ROOT/'.github/workflows/peren-walk-v6-qa.yml'):
        s=path.read_text(encoding='utf-8')
        s=s.replace('qa_peren_ervas_v5','qa_peren_coleta_v7')
        s=s.replace('ferramentas/gerar_peren_coleta_ervas_v5.py','ferramentas/integrar_peren_coleta_v7.py')
        s=s.replace('Herb-only collection browser','Unified gather collection browser')
        path.write_text(s,encoding='utf-8')
    for name in ('qa_peren_ervas_v5.mjs','qa_peren_ervas_v5.py','qa_peren_ervas_v5_browser.mjs'):
        p=ROOT/'tests'/name
        if p.exists():p.unlink()
    old=ROOT/'ferramentas/gerar_peren_coleta_ervas_v5.py'
    if old.exists():old.unlink()


def main():
    install_assets()
    modify_compiled_phaser()
    modify_meta()
    modify_gallery()
    remove_legacy()
    modify_sw()
    remove_superseded_tests_and_update_workflows()
    print('Peren v7: 4 directions x 5 frames, generic gather for every node; prior herb runtime removed; cache audited')

if __name__=='__main__':main()