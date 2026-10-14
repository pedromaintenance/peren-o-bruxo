import unittest
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]/'phaser/assets'
class BattleArt(unittest.TestCase):
 def test_vfx(self):
  for kind in ['fire','ice','arcane']:
   with self.subTest(kind=kind):
    f=ROOT/'vfx'/f'{kind}.png';self.assertTrue(f.exists())
    a=Image.open(f);self.assertEqual(a.size,(800,80));self.assertEqual(a.mode,'RGBA')
    self.assertGreater(sum(px[3]>0 for px in a.getdata()),300)
 def test_scene(self):
  a=Image.open(ROOT/'battle/murin-battle.webp');self.assertEqual(a.size,(640,360))
if __name__=='__main__':unittest.main()
