#!/usr/bin/env python3
"""Instalar os oito PNGs v8.4 de batalha a partir do ZIP homologado.

Uso:
  python ferramentas/instalar_battle_v84.py Peren_v84_BattleScene_Assets.zip

O script NÃO faz push/merge, altera saves ou baixa arte de servidores externos.
Recusa sobrescrever dados diferentes e valida PNG, tamanho, dimensão e SHA-256.
"""
from pathlib import Path
from zipfile import ZipFile
from hashlib import sha256
import argparse,json,struct

DEST=Path("phaser-demo-m1hf/art/battle/runtime-v84")
SHAPES={"idle.png":(2240,821),"infernal.png":(2048,682),"void.png":(2560,1086),
        "summon.png":(2048,1024),**{f"portrait_{i:02}.png":(362,1086) for i in range(1,5)}}
SIGNATURE=b"\x89PNG\r\n\x1a\n"

def install(source:Path,repo:Path):
 prefix=DEST.as_posix()+"/"
 with ZipFile(source) as z:
  content=z.read(prefix+"battle-asset-pack-v84.json")
  marker=json.loads(content)
  if marker.get("schema")!="peren-battle-art-v84" or marker.get("verified") is not True:
   raise ValueError("Marcador v8.4 inválido")
  expected={e["path"]:e for e in marker.get("files",[])}
  if set(expected)!=set(SHAPES):raise ValueError("Pacote contém recursos ausentes ou inesperados")
  checked={}
  for name,dims in SHAPES.items():
   raw=z.read(prefix+name)
   entry=expected[name]
   if len(raw)!=entry["bytes"] or sha256(raw).hexdigest()!=entry["sha256"]:
    raise ValueError("Falha de SHA-256: "+name)
   if raw[:8]!=SIGNATURE or struct.unpack(">II",raw[16:24])!=dims:
    raise ValueError("PNG inesperado ou dimensão incorreta: "+name)
   checked[DEST/name]=raw
  checked[DEST/"battle-asset-pack-v84.json"]=content
  for relative,raw in checked.items():
   target=repo/relative
   if target.exists() and target.read_bytes()!=raw:
    raise FileExistsError("Recusada sobrescrita do arquivo diferente: "+str(target))
  for relative,raw in checked.items():
   target=repo/relative;target.parent.mkdir(parents=True,exist_ok=True)
   if not target.exists():target.write_bytes(raw)
 print(f"OK: 8 PNGs verificados e instalados em {repo/DEST}")
 print("Próximo passo: commitar os binários na PR e validar a cena BattleScene real.")

if __name__=="__main__":
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument("archive",type=Path)
 parser.add_argument("--repo",type=Path,default=Path(__file__).resolve().parents[1])
 a=parser.parse_args()
 install(a.archive.resolve(),a.repo.resolve())
