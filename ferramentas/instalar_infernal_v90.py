#!/usr/bin/env python3
"""Import the creator-approved Infernal v9.0 sprite sheet without touching other sprites.

Usage: python ferramentas/instalar_infernal_v90.py asset-ingest/Peren_Infernal_v90_GitHub_Ingest.zip

Pure local import. SHA-256 checks both ZIP and PNG; no network, no save changes.
"""
from pathlib import Path
from zipfile import ZipFile
import argparse
import hashlib
import json
import struct

EXPECTED_ARCHIVE_SHA="ad53107a88c542054bf90e9b85a89819b453f9f20114ed17a876764ff969aa7e"
EXPECTED_IMAGE_SHA="b52a89a9737403071c898cfbcec428dbfd892a6e4ebc728f12a573892e785c0a"
DEST=Path("phaser-demo-m1hf/art/battle/runtime-v84")
PNG_NAME="infernal-v90.png"
MANIFEST_NAME="battle-asset-pack-v90.json"
ZIP_PREFIX=DEST.as_posix()+"/"

def checksum(value:bytes)->str:
    return hashlib.sha256(value).hexdigest()

def install(archive:Path,repo:Path)->Path:
    if checksum(archive.read_bytes())!=EXPECTED_ARCHIVE_SHA:
        raise ValueError("Archive is not the exact approved v9.0 release")
    with ZipFile(archive) as z:
        image=z.read(ZIP_PREFIX+PNG_NAME)
        original=json.loads(z.read(ZIP_PREFIX+MANIFEST_NAME))
    if checksum(image)!=EXPECTED_IMAGE_SHA:
        raise ValueError("Image differs from creator-approved v9.0")
    if image[:8]!=b"\x89PNG\r\n\x1a\n" or struct.unpack(">II",image[16:24])!=(2172,724):
        raise ValueError("Expected 2172x724 RGBA atlas, 4x2 equal 543x362 frames")
    if image[25]!=6:
        raise ValueError("Expected RGBA PNG")
    stored=repo/DEST/MANIFEST_NAME
    if not stored.is_file():
        raise FileNotFoundError("Versioned manifest must already be in the branch")
    current=json.loads(stored.read_text(encoding="utf-8"))
    for manifest in [original,current]:
        if manifest.get("schema")!="peren-battle-art-v90":
            raise ValueError("Unexpected manifest schema")
        if manifest.get("frame_dimensions",{}).get("infernal")!=[543,362]:
            raise ValueError("Unexpected frame dimensions")
        matches=[f for f in manifest.get("files",[]) if f.get("path")==PNG_NAME]
        if len(matches)!=1 or matches[0].get("sha256")!=EXPECTED_IMAGE_SHA or matches[0].get("bytes")!=len(image):
            raise ValueError("Manifest checksum/length does not match atlas")
    if original!=current:
        raise ValueError("ZIP manifest and GitHub manifest differ")
    destination=repo/DEST/PNG_NAME
    if destination.exists() and destination.read_bytes()!=image:
        raise FileExistsError("Refusing to overwrite different v9.0 PNG")
    destination.parent.mkdir(parents=True,exist_ok=True)
    if not destination.exists():destination.write_bytes(image)
    print("PASS: verified v9.0 Infernal PNG (2172x724, 8 cells 543x362)")
    print("SHA-256:",EXPECTED_IMAGE_SHA)
    return destination

if __name__=="__main__":
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("archive",type=Path)
    p.add_argument("--repo",type=Path,default=Path(__file__).resolve().parents[1])
    args=p.parse_args()
    install(args.archive.resolve(),args.repo.resolve())
