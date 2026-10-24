#!/usr/bin/env python3
"""Validate the exact creator-provided Infernal v9.0 PNG already committed in Git.

No ZIP import, no network and no mutation: release-integrity check only.
"""
from pathlib import Path
import argparse
import hashlib
import json
import struct

EXPECTED_IMAGE_SHA="fc2ecca170a76c76e89ad846709b0d9659e57699eb0611441736ce81a17b22c9"
EXPECTED_BYTES=2208337
EXPECTED_DIMENSIONS=(2048,682)
DEST=Path("phaser-demo-m1hf/art/battle/runtime-v84")
PNG_NAME="infernal-v90.png"
MANIFEST_NAME="battle-asset-pack-v90.json"

def verify(repo:Path)->Path:
    image_path=repo/DEST/PNG_NAME
    image=image_path.read_bytes()
    digest=hashlib.sha256(image).hexdigest()
    if len(image)!=EXPECTED_BYTES or digest!=EXPECTED_IMAGE_SHA:
        raise ValueError("Infernal v9.0 sprite differs from the creator-approved PNG")
    if image[:8]!=b"\x89PNG\r\n\x1a\n":
        raise ValueError("Invalid PNG signature")
    if struct.unpack(">II",image[16:24])!=EXPECTED_DIMENSIONS or image[25]!=6:
        raise ValueError("Expected 2048x682 RGBA PNG, equal 4x2 cells 512x341")
    marker=json.loads((repo/DEST/MANIFEST_NAME).read_text(encoding="utf-8"))
    if marker.get("schema")!="peren-battle-art-v90":
        raise ValueError("Unexpected v9.0 manifest schema")
    if marker.get("frame_dimensions",{}).get("infernal")!=[512,341]:
        raise ValueError("Unexpected v9.0 sprite grid")
    row=[r for r in marker.get("files",[]) if r.get("path")==PNG_NAME]
    if len(row)!=1 or row[0].get("sha256")!=digest or row[0].get("bytes")!=len(image):
        raise ValueError("Manifest digest or size mismatch")
    print("PASS: committed Infernal v9.0 PNG (2048x682; 8 frames 512x341)")
    print("SHA-256:",digest)
    return image_path

if __name__=="__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo",type=Path,default=Path(__file__).resolve().parents[1])
    args=parser.parse_args()
    verify(args.repo.resolve())
