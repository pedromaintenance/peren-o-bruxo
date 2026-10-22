#!/usr/bin/env python3
"""Instala os sprites de batalha v8 no jogo real, a partir do Asset Forge v8.

Exemplo:
 python ferramentas/instalar_battle_art_v8.py Peren_Asset_Forge_v8_Summon_Greater_Demon_Pacote_Completo.zip

Lê e verifica todos os checksums do pacote de 82 entradas, gera 4 atlas sem
reescalar os pixels originais, preserva 4 portraits e cria um manifesto de
implantação SHA-256. NÃO altera regras, saves nem faz push/merge do GitHub.
Necessita Pillow: python -m pip install Pillow
"""
from pathlib import Path, PurePosixPath
from zipfile import ZipFile
from tempfile import TemporaryDirectory
from hashlib import sha256
from PIL import Image
from io import BytesIO
import argparse
import json

PREFIX="Peren_Asset_Lab_v8/"
TARGET=Path("phaser-demo-m1hf/art/battle/runtime-v8")
SETS={
 "idle":(["assets/battle/idle/%02d.png"%i for i in range(1,5)],(479,821),4,1),
 "infernal":(["assets/battle/infernal_attack/"+n+".png" for n in (
  "01_fagulhas","02_concentracao","03_fenda_de_fogo","04_fenda_aberta",
  "05_inferno_expandindo","06_lancamento","07_rajada_infernal","08_dissipacao")],(512,341),4,2),
 "void":(["assets/battle/void_rift/keyed/"+n+".png" for n in (
  "01_charge_spark","02_charge_cluster","03_rift_opening","04_rift_stabilized",
  "05_power_surge","06_projectile_launch","07_projectile_extended","08_dissipation")],(543,362),4,2)
}
PORTRAITS=["assets/scenes/portrait_%02d.png"%i for i in range(1,5)]
SUMMON="assets/battle/summon_greater_demon/atlases/peren_summon_greater_demon_4x2_512.png"

def digest(data):return sha256(data).hexdigest()

def unpack_and_verify(archive,folder):
 with ZipFile(archive) as z:
  for member in z.infolist():
   if not member.filename.startswith(PREFIX) or member.is_dir():continue
   name=member.filename[len(PREFIX):]
   pp=PurePosixPath(name)
   if pp.is_absolute() or ".." in pp.parts or "\\" in name:
    raise ValueError("Unsafe ZIP name: "+name)
   path=folder.joinpath(*pp.parts)
   path.parent.mkdir(parents=True,exist_ok=True)
   path.write_bytes(z.read(member))
  meta=json.loads((folder/"asset-manifest.json").read_text(encoding="utf8"))
  if meta.get("version")!=8 or len(meta.get("items",[]))!=82:
   raise ValueError("Not an approved Asset Forge v8 archive")
  count=0
  for line in (folder/"checksums.sha256").read_text(encoding="utf8").splitlines():
   expected,relative=line.split("  ",1)
   src=folder/relative
   if not src.is_file() or digest(src.read_bytes())!=expected:
    raise ValueError("Corrupted source: "+relative)
   count+=1
  return count

def png(data,expect=None):
 img=Image.open(BytesIO(data))
 img.load()
 if img.mode!="RGBA":raise ValueError("Input must preserve RGBA")
 if expect and img.size!=expect:raise ValueError(f"Unexpected image dimensions: {img.size}, expected {expect}")
 return img

def atlas(folder,names,size,columns,rows):
 combined=Image.new("RGBA",(size[0]*columns,size[1]*rows))
 for index,name in enumerate(names):
  piece=png((folder/name).read_bytes(),size)
  combined.paste(piece,((index%columns)*size[0],(index//columns)*size[1]))
 output=BytesIO()
 combined.save(output,format="PNG",optimize=True)
 return output.getvalue()

def install(archive,repo):
 with TemporaryDirectory(prefix="peren_battle_v8_") as tmp:
  stage=Path(tmp)
  checks=unpack_and_verify(archive,stage)
  binary={}
  for name,(frames,dims,columns,rows) in SETS.items():
   binary[name+".png"]=atlas(stage,frames,dims,columns,rows)
  binary["summon.png"]=(stage/SUMMON).read_bytes()
  png(binary["summon.png"],(2048,1024))
  for i,name in enumerate(PORTRAITS,1):
   raw=(stage/name).read_bytes()
   png(raw,(362,1086))
   binary["portrait_%02d.png"%i]=raw
  output={"schema":"peren-battle-art-v8","verified":True,
   "source":"Peren_Asset_Forge_v8_Summon_Greater_Demon_Pacote_Completo.zip",
   "sourceArchiveSha256":digest(archive.read_bytes()),
   "verifiedFiles":checks,
   "note":"Verified assets; opt-in only, no new combat action or modified saves",
   "files":[{"path":name,"sha256":digest(data),"bytes":len(data)} for name,data in sorted(binary.items())]}
  binary["battle-asset-pack-v8.json"]=(json.dumps(output,indent=2,ensure_ascii=False)+"\n").encode("utf8")
  folder=repo/TARGET
  # Prevent partially overwriting an existing asset library.
  conflicts=[str(folder/name) for name,raw in binary.items()
   if (folder/name).exists() and (folder/name).read_bytes()!=raw]
  if conflicts:raise FileExistsError("Existing files differ; refusing overwrite: "+", ".join(conflicts))
  folder.mkdir(parents=True,exist_ok=True)
  for name,raw in binary.items():
   dest=folder/name
   if not dest.exists():dest.write_bytes(raw)
  print("Peren v8: source files verified:",checks)
  print("Created/verified files:",len(binary))
  print("Assets:",folder)
  print("Ready marker:",folder/"battle-asset-pack-v8.json")
  print("Commit binaries alongside the runtime bridge before releasing.")
  return output

if __name__=="__main__":
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument("archive",type=Path)
 parser.add_argument("--repo",type=Path,default=Path(__file__).resolve().parents[1])
 args=parser.parse_args()
 install(args.archive.resolve(),args.repo.resolve())
