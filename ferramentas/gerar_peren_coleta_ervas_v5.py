#!/usr/bin/env python3
"""Rebuild Peren walk-fix and HERBS-ONLY gather atlases from approved PNGs.
No new poses. Does not modify the wounded walk atlas or unrelated clips.
Requires Pillow. Usage: python3 ferramentas/gerar_peren_coleta_ervas_v5.py
"""
from pathlib import Path
from PIL import Image
import hashlib, json

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/"phaser-demo-m1hf/art/characters/peren"
V5=BASE/"official-v5"
OLD=BASE/"official-v3/peren-atlas-official-48x64.png"
EXPECTED={
"baseline":"62a44d9ca68189014cb9e7731d04af8fe03800992140d99dae75e654c92317ea",
"walk":"5882fb53ee495e977f69164373ce9a349d5cfc9deddf9f14471bb97690a5d8ba",
"gather":"f8f8d772a5268d0c465ec9ad0b6b2e02fc6660932090b8926ddb96ac4fef4147",
"normal":"e0d20ce3b889d2eb2cc98b2a43a9ab3cc508bfd6bd79cc3a5352be9f615a7685",
"herb":"39675de9f457a63103230422905984a72bac21e8adcba2aa2af5df76772b6c10"}
def checksum(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def compare(path,expected):
    actual=checksum(path)
    if actual!=EXPECTED[expected]:
        raise ValueError(f"Hash incorrect for {path}: {actual}")
def frame(image, row, column, crop):
    raw=image.crop((column*160,row*190,(column+1)*160,(row+1)*190))
    small=raw.crop(crop).resize((44,59),Image.Resampling.NEAREST)
    cell=Image.new("RGBA",(48,64))
    cell.alpha_composite(small,(2,3))
    return cell
def replace(atlas, idx, tile):
    atlas.paste(tile,((idx%16)*48,(idx//16)*64))
def main():
    walkfile=V5/"source-walkfix-3x4.png"
    herbfile=V5/"source-herb-gather-4x4.png"
    for path,expected in [(OLD,"baseline"),(walkfile,"walk"),(herbfile,"gather")]:
        compare(path,expected)
    normal=Image.open(OLD).convert("RGBA")
    walks=Image.open(walkfile).convert("RGBA")
    herbs=Image.open(herbfile).convert("RGBA")
    assert normal.size==(768,512) and walks.size==(480,760) and herbs.size==(640,760)
    for row in range(4):
        for step,col in enumerate((0,1,2,1)):
            replace(normal,row*32+4+step,frame(walks,row,col,(15,15,145,185)))
    normalfile=V5/"peren-atlas-normal-walkfix-v5.png"
    normal.save(normalfile,optimize=True)
    compare(normalfile,"normal")
    gathered=normal.copy()
    for row in range(4):
        for step in range(4):
            replace(gathered,row*32+16+step,frame(herbs,row,step,(5,5,155,185)))
    herbfile=V5/"peren-atlas-herb-v5.png"
    gathered.save(herbfile,optimize=True)
    compare(herbfile,"herb")
    print("Verified normal walk-fix and herb-only atlases (128 indices each).")
if __name__=="__main__":
    main()
