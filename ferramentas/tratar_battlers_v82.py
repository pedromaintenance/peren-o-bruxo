#!/usr/bin/env python3
"""Peren battler v8.2: soften frame boundaries without inventing missing projectile pixels.

Usage:
  python ferramentas/tratar_battlers_v82.py Peren_Ciclo_v81_Battlers_Corrigidos.zip --out ./battler-v82-review

Requires Pillow only. Writes REVIEW-ONLY Infernal / Void Rift; never deploys or
mutates the approved v8.1 Idle/Summon, gameplay or save files.
"""
from argparse import ArgumentParser
from hashlib import sha256
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile
import json
from PIL import Image, ImageChops

INPUTS={
 "infernal":("1f28c2549a1f34c2b7079837389b1bbe30663cd34140e517206afb4c342a5d6d",512,341),
 "void":("da72c02c0bc202cb93a6a5cfa73c8d1d81a41b294b516ac9d450b889bfe6e20d",543,362)
}

def digest(buf):
 return sha256(buf).hexdigest()

def contact(im,w,h):
 a=im.getchannel("A")
 v=[]
 for row in range(2):
  for seam in range(1,4):
   left=a.crop((seam*w-1,row*h,seam*w,(row+1)*h)).tobytes()
   right=a.crop((seam*w,row*h,seam*w+1,(row+1)*h)).tobytes()
   v.append(sum(x>24 and y>24 for x,y in zip(left,right)))
 return v

def fade_cell(cell,index):
 if index not in (3,4,5,6):return cell
 w,h=cell.size
 start=int(w*(.81 if index in (5,6) else .94))
 ramp=[]
 for x in range(w):
  if x<start:ramp.append(255)
  else:
   t=min(1,max(0,(x-start)/max(1,w-start-1)))
   ramp.append(round(255*(1-3*t*t+2*t*t*t)))
 fade=Image.frombytes("L",(w,h),bytes(ramp)*h)
 rgba=cell.copy()
 rgba.putalpha(ImageChops.multiply(rgba.getchannel("A"),fade))
 return rgba

def main(archive,out):
 out.mkdir(parents=True,exist_ok=True)
 summary={}
 with ZipFile(archive) as z:
  for name,(expected,w,h) in INPUTS.items():
   original=z.read("revisao-pendente/"+name+".png")
   if digest(original)!=expected:raise ValueError("Unexpected v8.1 source: "+name)
   img=Image.open(BytesIO(original)).convert("RGBA")
   if img.size!=(w*4,h*2):raise ValueError("Unexpected grid size: "+name)
   result=Image.new("RGBA",img.size,(0,0,0,0))
   for i in range(8):
    x=i%4*w;y=i//4*h
    src=img.crop((x,y,x+w,y+h))
    dst=fade_cell(src,i)
    result.paste(dst,(x,y))
   path=out/(name+".png");result.save(path,optimize=True)
   summary[name]={"source_sha256":digest(original),"result_sha256":digest(path.read_bytes()),
     "frame_size":[w,h],"frames":8,"contacts_before":contact(img,w,h),
     "contacts_after":contact(result,w,h),"status":"review_only_not_published",
     "method":"right edge smootherstep alpha; no content generated",
     "limitation":"tip of projectile is absent in the source and remains absent"}
 (out/"qa.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
 for n,s in summary.items():print(n,s["contacts_before"],"=>",s["contacts_after"])
 print("These atlas images are for human ART REVIEW ONLY, not the Phaser runtime.")

if __name__=="__main__":
 p=ArgumentParser(description=__doc__)
 p.add_argument("archive",type=Path)
 p.add_argument("--out",type=Path,default=Path("peren-v82-review"))
 a=p.parse_args()
 main(a.archive,a.out)
