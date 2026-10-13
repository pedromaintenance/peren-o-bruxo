"""Verifica cobertura documental sem confundir planejamento com assets concluídos."""
import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def doc(p):
    return json.loads((ROOT/p).read_text(encoding='utf-8'))

class AssetManifestTests(unittest.TestCase):
    def test_matches_sources(self):
        index=doc('phaser/assets/manifest.generated.json')
        data_map={'items':'itens','recipes':'receitas','monsters':'monstros',
                  'spells':'magias','cities':'cidades','regions':'expedicoes','quests':'missoes'}
        for kind, source in data_map.items():
            with self.subTest(kind=kind):
                self.assertEqual(len(doc(f'phaser/assets/catalog/{kind}.json')),len(doc(f'data/{source}.json')))
        self.assertEqual(index['totals']['npcs'],sum(len(c['mercadores']) for c in doc('data/cidades.json')))
        self.assertEqual(index['totals']['characters'],1)
        self.assertEqual(index['total_records'],sum(index['totals'].values()))

    def test_unique_ids_and_expected_status(self):
        index=doc('phaser/assets/manifest.generated.json')
        seen=set()
        for kind,path in index['catalog_files'].items():
            for row in doc(path):
                self.assertNotIn(row['id'],seen)
                seen.add(row['id'])
                self.assertIn(row['status'],('planejado','em_producao','integrado','aprovado'))
        self.assertEqual(len(seen),index['total_records'])

    def test_reproducible_generation(self):
        r=subprocess.run([sys.executable,str(ROOT/'tools/generate_visual_manifest.py'),'--root',str(ROOT),'--check'],capture_output=True,text=True)
        self.assertEqual(r.returncode,0,r.stdout+r.stderr)

if __name__=='__main__': unittest.main()