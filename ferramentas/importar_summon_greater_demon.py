#!/usr/bin/env python3
"""Import the creator's Summon Greater Demon art into the Peren Phaser tree.

Usage:
 python ferramentas/importar_summon_greater_demon.py "Peren_Summon_Greater_Demon_Integration_v1(1).zip"

Only installs pixel-identical PNGs and source metadata. Never changes rules or saves.
"""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

EXPECTED="e0e36495bfa649ff85af65e94e844ffa5a15dec92de2ebc0519e357b7432c179"
PREFIX="peren_summon_greater_demon/"
DEST=Path("phaser-demo-m1hf/art/characters/peren/battler/summon_greater_demon")

def digest(data):
 return hashlib.sha256(data).hexdigest()

def run(archive:Path,repo:Path):
 raw=archive.read_bytes()
 if digest(raw)!=EXPECTED:raise ValueError("Summon archive differs from approved source")
 with ZipFile(archive) as z:
  entries={}
  for line in z.read(PREFIX+"checksums.sha256").decode().splitlines():
   sha,relative=line.split("  ",1)
   rel=PurePosixPath(relative)
   if not relative or rel.is_absolute() or ".." in rel.parts or "\\" in relative:
    raise ValueError("Unsafe archive path: "+relative)
   content=z.read(PREFIX+relative)
   if digest(content)!=sha:raise ValueError("Corrupt image/content: "+relative)
   # Keep approved release-gate manifest separate from original author manifest.\n   entries["source-manifest.json" if relative=="manifest.json" else relative]=content
  src=json.loads(entries["source-manifest.json"])
  if len(src["frames"])!=8 or src["atlas"]["width"]!=2048 or src["atlas"]["frame_width"]!=512:
   raise ValueError("Unexpected source manifest")
  target=repo/DEST
  # Validate ALL before writing any file; refuse different existing files.
  for relative,content in entries.items():
   path=target/relative
   if path.is_file() and path.read_bytes()!=content:
    raise FileExistsError("Refusing to replace differing asset: "+str(path))
  for relative,content in entries.items():
   path=target/relative
   path.parent.mkdir(parents=True,exist_ok=True)
   if not path.exists():path.write_bytes(content)
  # Preserve the repo release-gate manifest as separate metadata.
  print("Summon sources imported and SHA-verified:",len(entries),"files to",target)
  print("Review chroma halos; then commit binaries, validate Pages and set assetsInstalled=true.")
  print("This command deliberately does NOT register a learned spell, change combat or publish.")

if __name__=="__main__":
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument("archive",type=Path)
 parser.add_argument("--repo",type=Path,default=Path(__file__).resolve().parents[1])
 a=parser.parse_args()
 run(a.archive.resolve(),a.repo.resolve())
