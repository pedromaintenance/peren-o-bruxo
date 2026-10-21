#!/usr/bin/env python3
"""Import exactly the user-approved Peren masters from the original ZIP.

Dry-run is the default. To import, use:
  python ferramentas/importar_assets_peren.py --zip "Peren_Kerrhylon_Assets_Recortados(1).zip" --write

Never overwrites the live Phaser atlas or the adapted SVG portrait.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import tempfile
from zipfile import ZipFile

ZIP_SHA256 = "b8947630076d39f4b50a44d50d151088a00ba7e9cfbb84112310a780a9d01e20"
CHECKS = {
    "actor/peren_actor.png": "90616e14fd078b34394562464a9624fc12d143d88a41b3ae5271f90b8ceec631",
    "retrato/peren_portrait.png": "03169c033a3a7d3113d58d54001f9a0033a3612ace509ff71d1c352bd73aa79c",
    "charset/atlas/peren_atlas_6x3_160x190.png": "f071439a066d0c2de13f4ec1e1bcff645a8b2e20a7779fd20ec86d7a2842ef09",
    "expressoes/peren_expressoes_6_frames.png": "5797cee03befedf5ea8e468e49dad210235cb8297852407f298022bb3b4b6e1f",
}
PREFIX = "Peren_Kerrhylon_Assets/"
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "phaser-demo-m1hf/art/characters/peren/official-v1/masters"


def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def plan(zip_path: Path):
    if digest(zip_path.read_bytes()) != ZIP_SHA256:
        raise ValueError("ZIP diferente do pacote oficial aprovado; importação recusada")
    entries = []
    with ZipFile(zip_path) as z:
        for info in z.infolist():
            if info.is_dir():
                continue
            if not info.filename.startswith(PREFIX):
                raise ValueError("Entrada fora da raiz canônica")
            rel = info.filename[len(PREFIX):]
            posix = Path(rel)
            if posix.is_absolute() or ".." in posix.parts or not rel:
                raise ValueError("Caminho inseguro no arquivo")
            if not rel.lower().endswith((".png", ".jpg", ".json", ".md")):
                raise ValueError("Extensão não reconhecida: " + rel)
            raw = z.read(info)
            if len(raw) != info.file_size:
                raise ValueError("Tamanho divergente: " + rel)
            expected = CHECKS.get(rel)
            if expected and digest(raw) != expected:
                raise ValueError("Master divergente: " + rel)
            entries.append((rel, raw))
    if len(entries) != 67 or not set(CHECKS).issubset({k for k,_ in entries}):
        raise ValueError("Pacote incompleto ou diferente: esperado 67 arquivos e quatro masters")
    return entries


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--zip", required=True, type=Path, dest="archive")
    parser.add_argument("--write", action="store_true", help="Copiar 67 originais para pasta versionada")
    parser.add_argument("--target", type=Path, default=OUTPUT)
    args = parser.parse_args()
    entries = plan(args.archive)
    if not args.write:
        print(json.dumps({"valid": True, "count": len(entries), "target": str(args.target), "dry_run": True}, ensure_ascii=False))
        return
    for rel, raw in entries:
        dst = args.target / rel
        if dst.exists():
            if digest(dst.read_bytes()) != digest(raw):
                raise ValueError("Destino já contém arquivo diferente (não sobrescrito): " + str(dst))
            continue
        dst.parent.mkdir(parents=True,exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=dst.parent, prefix=".peren-", delete=False) as tmp:
            tmp.write(raw)
            name=tmp.name
        os.replace(name,dst)
    print(json.dumps({"imported_or_verified": len(entries), "destination": str(args.target)},ensure_ascii=False))


if __name__ == "__main__":
    main()
