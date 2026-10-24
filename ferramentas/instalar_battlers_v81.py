#!/usr/bin/env python3
"""Install the six art-reviewed Peren v8.1 images in the GitHub Pages app clone.

  python ferramentas/instalar_battlers_v81.py Peren_Ciclo_v81_Battlers_Corrigidos.zip

No network access, no commit, no gameplay or save edits, no destructive overwrite.
"""
from pathlib import Path
from zipfile import ZipFile
from hashlib import sha256
import argparse,json

DIR=Path("phaser-demo-m1hf/art/battle/runtime-v81")
FILENAMES={"idle.png","summon.png",*(f"portrait_{i:02d}.png" for i in range(1,5))}

def install(archive:Path,repo:Path):
 source=str(DIR).replace("\\","/")+"/"
 with ZipFile(archive) as z:
  marker=z.read(source+"battle-asset-pack-v81.json")
  config=json.loads(marker)
  if config.get("schema")!="peren-battle-art-v81" or config.get("released")!=["idle","summon","portraits"]:
   raise ValueError("Unknown release candidate or staging policy")
  listed={x["path"]:x for x in config["files"]}
  if set(listed)!=FILENAMES:raise ValueError("Unexpected assets in release")
  buffers={}
  for name,meta in listed.items():
   data=z.read(source+name)
   if len(data)!=meta["bytes"] or sha256(data).hexdigest()!=meta["sha256"]:
    raise ValueError("Hash mismatch: "+name)
   if data[:8]!=b"\x89PNG\r\n\x1a\n":
    raise ValueError("Not PNG: "+name)
   buffers[DIR/name]=data
  buffers[DIR/"battle-asset-pack-v81.json"]=marker
  for relative,data in buffers.items():
   target=repo/relative
   if target.exists() and target.read_bytes()!=data:
    raise FileExistsError("Refusing to overwrite divergent file: "+str(target))
  for relative,data in buffers.items():
   target=repo/relative
   target.parent.mkdir(parents=True,exist_ok=True)
   if not target.exists():target.write_bytes(data)
  print("Installed and checked",len(listed),"binary sprites + marker.")
  print("Git commit, PR merge and browser verification are separate steps.")
  print("Infernal and Void Rift remain review-only; NEVER copy them into the runtime.")

if __name__=="__main__":
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument("archive",type=Path)
 p.add_argument("--repo",type=Path,default=Path(__file__).resolve().parents[1])
 a=p.parse_args()
 install(a.archive.resolve(),a.repo.resolve())
