#!/usr/bin/env python3
"""Instala o pacote offline Peren Asset Forge v7 no clone GitHub.

Uso: python ferramentas/instalar_asset_forge_v7.py Peren_Asset_Forge_v7_Painel_Completo.zip

NÃO sobrescreve arquivos divergentes, NÃO atualiza saves nem publica Pages.
Sem dependências externas.
"""
from __future__ import annotations
from pathlib import Path, PurePosixPath
from tempfile import TemporaryDirectory
from zipfile import ZipFile
from hashlib import sha256
import argparse
import json
import shutil

PREFIX="Peren_Asset_Lab_v7/"
TARGET=Path("phaser-demo-m1hf/asset-lab")

def safe_member(name: str):
    parts=PurePosixPath(name).parts
    if not name.startswith(PREFIX) or name.endswith("/"):
        return None
    if ".." in parts or name.startswith("/") or "\\" in name:
        raise ValueError("ZIP com caminho inseguro: "+name)
    rel=name[len(PREFIX):]
    return Path(rel) if rel else None

def check_pack(folder:Path):
    checker=folder/"checksums.sha256"
    if not checker.is_file():raise ValueError("checksums.sha256 ausente")
    count=0
    for line in checker.read_text(encoding="utf-8").splitlines():
        digest,rel=line.split("  ",1)
        p=folder/rel
        if not p.is_file() or sha256(p.read_bytes()).hexdigest()!=digest:
            raise ValueError("Arquivo ausente/adulterado: "+rel)
        count+=1
    manifest=json.loads((folder/"asset-manifest.json").read_text(encoding="utf-8"))
    if manifest.get("version")!=7 or len(manifest.get("items",[]))!=79:
        raise ValueError("Versão ou quantidade de assets incorreta")
    for item in manifest["items"]:
        for frame in item["frames"]:
            if not (folder/frame).is_file():raise ValueError("Frame ausente: "+frame)
    return count

def install(archive:Path,repo:Path):
    dest=repo/TARGET
    with TemporaryDirectory(prefix="peren_asset_lab_") as tmp:
        stage=Path(tmp)/"stage"
        stage.mkdir(parents=True)
        with ZipFile(archive) as z:
            for item in z.infolist():
                rel=safe_member(item.filename)
                if rel is None:continue
                target=stage/rel;target.parent.mkdir(parents=True,exist_ok=True)
                target.write_bytes(z.read(item))
        count=check_pack(stage)
        for path in stage.rglob("*"):
            if not path.is_file():continue
            rel=path.relative_to(stage);target=dest/rel
            if target.exists() and target.read_bytes()!=path.read_bytes():
                raise FileExistsError("Recusado: arquivo existente é diferente: "+str(target))
        for path in stage.rglob("*"):
            if path.is_file():
                target=dest/path.relative_to(stage);target.parent.mkdir(parents=True,exist_ok=True)
                if not target.exists():shutil.copy2(path,target)
    print("✓ Instalação local concluída:",dest)
    print("✓ Arquivos verificados:",count)
    print("✓ Abra:",dest/"index.html")
    print("Importante: confirme arte final antes de publicar. Nenhum commit/merge foi executado.")

if __name__=="__main__":
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("archive",type=Path)
    p.add_argument("--repo",type=Path,default=Path(__file__).resolve().parents[1])
    a=p.parse_args()
    install(a.archive.resolve(),a.repo.resolve())
