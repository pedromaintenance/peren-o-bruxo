#!/usr/bin/env python3
"""Reproduce the Peren v6 PNG imports from three creator-provided files.

Run from the repository root:
 python ferramentas/importar_peren_batalha_v6.py \
   --idle "Mago Astral Sombrio em Quatro Quadros(1).png" \
   --portraits "Ficha de Personagem_ Mago Celestial Gótico.png" \
   --v6zip "Peren_Kerrhylon_Assets_v6_Batalha_Integrada.zip"

Requires Pillow. Does not overwrite altered or existing game assets.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path
from zipfile import ZipFile
from PIL import Image

SHA = {
 "idle": "87f63f78130ffeb171f766dcdad44ac220167f7f027e61be3828e2536288d24b",
 "portraits": "21edb1c9320fcd052f0aa89f5816ad463ad122c0c06f40ee781231268413abfe",
 "v6zip": "8165928775b3dd8ac7b1cc0bc1c9e5f5e6321c080dc3ae7770827dc75759695d",
 "gather": "42cb2f2827a9eb1a71c52fef858f23a53fb28445071aeb3406c972f923b72ba1"
}
BASE = Path("phaser-demo-m1hf")
IDLE_DIR = BASE / "art/characters/peren/battler/v6"
PORTRAIT_DIR = BASE / "art/characters/peren/scenes/portraits"
VOID_DIR = BASE / "art/battle/peren-void-rift"


def sha(data):
 return hashlib.sha256(data).hexdigest()


def save(repo, relative, data):
 path = repo / relative
 path.parent.mkdir(parents=True, exist_ok=True)
 if path.exists():
  if path.read_bytes() != data:
   raise RuntimeError(f"Refusing to overwrite different existing asset: {relative}")
  return path
 path.write_bytes(data)
 return path


def import_sheet(repo, source, expected, dims, out_dir, master, prefix):
 data = source.read_bytes()
 assert sha(data) == SHA[expected], f"Unexpected hash: {source}"
 image = Image.open(io.BytesIO(data)).convert("RGBA")
 assert image.size == dims and image.width % 4 == 0, f"Unexpected size: {image.size}"
 save(repo, out_dir / master, data)
 for i in range(4):
  frame = image.crop((i * image.width // 4, 0, (i + 1) * image.width // 4, image.height))
  b = io.BytesIO()
  frame.save(b, format="PNG", optimize=True)
  save(repo, out_dir / f"{prefix}_{i+1:02d}.png", b.getvalue())
 return 5


def import_vfx(repo, source):
 data = source.read_bytes()
 assert sha(data) == SHA["v6zip"], "V6 archive SHA does not match"
 names = [
  "01_charge_spark", "02_charge_cluster", "03_rift_opening",
  "04_rift_stabilized", "05_power_surge", "06_projectile_launch",
  "07_projectile_extended", "08_dissipation"
 ]
 with ZipFile(source) as archive:
  files = {Path(n).name:n for n in archive.namelist() if "/void_rift/" in n and n.endswith(".png")}
  for name in names:
   raw = archive.read(files[name + ".png"])
   image = Image.open(io.BytesIO(raw))
   assert image.size == (543,362) and image.mode == "RGBA"
   save(repo, VOID_DIR / (name + ".png"), raw)
  gathered = next(n for n in archive.namelist() if n.endswith("/peren_coleta_geral_4col_4lin_160x190.png"))
  assert sha(archive.read(gathered)) == SHA["gather"], "Coleta Geral has changed; check PR #62"
 return 8


def mark_imported(repo, relative):
 path = repo / relative
 data = json.loads(path.read_text(encoding="utf-8"))
 data["importStatus"] = "complete"
 if "blockingIssues" not in data:
  data["publicRuntimeEnabled"] = True
 # The raw Void Rift still contains green background and printed frame numbers.
 path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
 p = argparse.ArgumentParser(description=__doc__)
 p.add_argument("--idle", required=True, type=Path)
 p.add_argument("--portraits", required=True, type=Path)
 p.add_argument("--v6zip", required=True, type=Path)
 p.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[1])
 args=p.parse_args()
 root=args.repo.resolve()
 for file in (args.idle,args.portraits,args.v6zip):
  if not file.is_file():p.error(f"Missing file: {file}")
 count=import_sheet(root,args.idle,"idle",(1916,821),IDLE_DIR,"peren_idle_battler_4frames.png","idle")
 count+=import_sheet(root,args.portraits,"portraits",(1448,1086),PORTRAIT_DIR,"peren_scene_portraits_4poses.png","portrait")
 count+=import_vfx(root,args.v6zip)
 for path in (IDLE_DIR/"manifest.json",PORTRAIT_DIR/"manifest.json",VOID_DIR/"manifest.json"):
  mark_imported(root,path)
 print(f"Imported {count} PNG files (including 2 intact masters) into {root}")
 print("WARNING: Void Rift still needs manual background/label cleanup before public runtime.")

if __name__ == "__main__":
 main()
