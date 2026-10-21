#!/usr/bin/env python3
"""Reproduz o atlas Phaser da coleta de ervas a partir do ZIP oficial do criador.

Uso: python ferramentas/gerar_peren_coleta_v5.py <ZIP> <diretorio_saida>
O script nunca redesenha quadros e não sobrescreve o atlas de movimento normal/ferido.
"""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import sys
import zipfile
from PIL import Image

ZIP_SHA = 'e19d409448575872b61294f7e48775dfa6de60d1f47161362fa29f016e5d4a0f'
SRC_SHA = 'f8f8d772a5268d0c465ec9ad0b6b2e02fc6660932090b8926ddb96ac4fef4147'
SRC_NAME = 'Peren_Kerrhylon_Assets/charset/coleta/atlas/peren_coleta_4col_4lin_160x190.png'
DIRECTIONS = ('down', 'left', 'right', 'up')
DURATIONS = (350, 250, 450, 850)


def main(zip_path: Path, target: Path) -> None:
    data = zip_path.read_bytes()
    assert hashlib.sha256(data).hexdigest() == ZIP_SHA, 'ZIP distinto da fonte aprovada'
    with zipfile.ZipFile(BytesIO(data)) as z:
        source = z.read(SRC_NAME)
        assert hashlib.sha256(source).hexdigest() == SRC_SHA, 'Master de coleta alterado'
        sheet = Image.open(BytesIO(source)).convert('RGBA')
    assert sheet.size == (640, 760)
    target.mkdir(parents=True, exist_ok=True)
    (target / 'peren-coleta-4x4-original-160x190.png').write_bytes(source)
    runtime = Image.new('RGBA', (192, 256), (0, 0, 0, 0))
    hashes = []
    for row in range(4):
        for col in range(4):
            frame = sheet.crop((col * 160, row * 190, col * 160 + 160, row * 190 + 190))
            cropped = frame.crop((5, 0, 155, 185))
            tile = cropped.resize((44, 59), Image.Resampling.NEAREST)
            runtime.alpha_composite(tile, (col * 48 + 2, row * 64 + 3))
            hashes.append(hashlib.sha256(frame.tobytes()).hexdigest())
    runtime_path = target / 'peren-coleta-runtime-4x4-48x64.png'
    runtime.save(runtime_path, optimize=True)
    meta = {
        'schema': 'peren-herb-harvest-v5', 'sourceZipSha256': ZIP_SHA,
        'originalAtlasSha256': SRC_SHA,
        'runtimeAtlasSha256': hashlib.sha256(runtime_path.read_bytes()).hexdigest(),
        'sourceAtlas': 'peren-coleta-4x4-original-160x190.png',
        'runtimeAtlas': runtime_path.name,
        'sourceSize': [640, 760], 'sourceFrameSize': [160, 190],
        'runtimeSize': [192, 256], 'runtimeFrameSize': [48, 64],
        'directions': list(DIRECTIONS),
        'poses': ['em_pe', 'abaixando', 'recolhendo', 'erguendo_item'],
        'durationsMs': list(DURATIONS), 'sourceCrop': [5, 0, 155, 185],
        'resize': [44, 59], 'offset': [2, 3], 'sourceFrameSHA256': hashes,
        'contentRule': 'Somente recursos do tipo herb; o quarto quadro exibe um ramo verde.',
    }
    (target / 'runtime-provenance.json').write_text(json.dumps(meta, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Gerado:', runtime_path, 'SHA-256:', meta['runtimeAtlasSha256'])


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('Uso: gerar_peren_coleta_v5.py <zip_original> <pasta_saida>')
    main(Path(sys.argv[1]), Path(sys.argv[2]))