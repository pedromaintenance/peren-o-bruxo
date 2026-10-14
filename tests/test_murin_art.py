"""Verifica documentação e atlas artístico M1a sem confundir com QA Android."""
from pathlib import Path
from PIL import Image
import json, unittest
R=Path(__file__).resolve().parents[1]
class M1Art(unittest.TestCase):
 def test_sprite(self):
  p=R/'phaser/assets/characters/peren'
  meta=json.loads((p/'atlas.json').read_text(encoding='utf8'))
  with Image.open(p/'peren-atlas.png') as im:
   self.assertEqual(im.size,(1536,256))
  self.assertEqual(len(meta['animations']),32)
  all_frames=set()
  for name,clip in meta['animations'].items():
   self.assertEqual(len(clip['frames']),4)
   all_frames.update(clip['frames'])
  self.assertEqual(all_frames,set(range(128)))
 def test_ground_and_props(self):
  p=R/'phaser/assets/regions/floresta-murin'
  with Image.open(p/'ground-tiles.png') as im:
   self.assertEqual(im.size,(256,32))
  for f in ['tree-0','tree-1','tree-2','herb','mushroom','stone','rune','exit','bush']:
   self.assertTrue((p/f'{f}.png').exists(),f)
 def test_qa_status_accurate(self):
  review=json.loads((R/'phaser/assets/review.json').read_text(encoding='utf8'))
  self.assertEqual(review['peren']['status'],'em_producao')
  self.assertEqual(review['floresta-murin']['status'],'em_producao')
if __name__=='__main__':unittest.main()