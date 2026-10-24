#!/usr/bin/env python3
"""Install the complete Peren Asset Forge v8 package and its summoning atlas into Phaser.

Usage: python ferramentas/instalar_asset_forge_v8.py Peren_Asset_Forge_v8_Summon_Greater_Demon_Pacote_Completo.zip
Does not merge, publish, touch saves or register any new combat action.
"""
from pathlib import Path, PurePosixPath
from hashlib import sha256
from tempfile import TemporaryDirectory
from zipfile import ZipFile
import argparse,json,shutil
PREFIX="Peren_Asset_Lab_v8/"
LAB=Path("phaser-demo-m1hf/asset-lab")
PHASER=Path("phaser-demo-m1hf/art/characters/peren/battler/summon_greater_demon")
SOURCE=Path("assets/battle/summon_greater_demon")

def digest(path):
 return sha256(path.read_bytes()).hexdigest()

def run(archive:Path,repo:Path):
 with TemporaryDirectory(prefix="peren_lab_v8_") as temp:
  stage=Path(temp)
  with ZipFile(archive) as z:
   for item in z.infolist():
    if item.is_dir() or not item.filename.startswith(PREFIX):continue
    rel=item.filename[len(PREFIX):]
    segments=PurePosixPath(rel).parts
    if not rel or ".." in segments or rel.startswith("/") or "\\" in rel:
     raise ValueError("Invalid ZIP path: "+item.filename)
    file=stage.joinpath(*segments)
    file.parent.mkdir(parents=True,exist_ok=True)
    file.write_bytes(z.read(item))
  manifest=json.loads((stage/"asset-manifest.json").read_text(encoding="utf-8"))
  if manifest.get("version")!=8 or len(manifest.get("items",[]))!=82:
   raise ValueError("Expected Asset Forge v8 with 82 entries")
  count=0
  for line in (stage/"checksums.sha256").read_text().splitlines():
   expected,relative=line.split("  ",1)
   f=stage/relative
   if not f.is_file() or digest(f)!=expected:
    raise ValueError("Missing or corrupt asset: "+relative)
   count+=1
  destinations={}
  for file in stage.rglob("*"):
   if not file.is_file():continue
   destinations[repo/LAB/file.relative_to(stage)]=file
  for file in (stage/SOURCE).rglob("*"):
   if file.is_dir():continue
   relative=file.relative_to(stage/SOURCE)
   if relative.as_posix()=="manifest.json":relative=Path("source-manifest.json")
   target=repo/PHASER/relative
   if target in destinations and destinations[target]!=file:raise ValueError("Destination conflict")
   destinations[target]=file
  for dest,src in destinations.items():
   if dest.exists() and dest.read_bytes()!=src.read_bytes():
    raise FileExistsError("Refusing to overwrite changed file: "+str(dest))
  for dest,src in destinations.items():
   dest.parent.mkdir(parents=True,exist_ok=True)
   if not dest.exists():shutil.copyfile(src,dest)
 print("Verified",count,"files; Asset Forge v8 installed at",repo/LAB)
 print("Phaser PNGs copied to",repo/PHASER)
 print("Review halos and publish binaries before opting into the animation.")

if __name__=="__main__":
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument("archive",type=Path)
 p.add_argument("--repo",type=Path,default=Path(__file__).resolve().parents[1])
 args=p.parse_args()
 run(args.archive.resolve(),args.repo.resolve())
