from pathlib import Path
from PIL import Image
import json,unittest
ROOT=Path(__file__).resolve().parents[1]
IDS=['mob-galho-infectado','mob-fungo-violeta','mob-ettercap']
class ArtTest(unittest.TestCase):
 def test_meta_and_frames(self):
  for id in IDS:
   with self.subTest(id=id):
    folder=ROOT/'phaser/assets/monsters'/id
    meta=json.loads((folder/'meta.json').read_text())
    self.assertEqual(meta['id'],id)
    with Image.open(folder/'atlas.png') as image:self.assertEqual(image.size,(256,448))
    with Image.open(folder/'portrait.png') as image:self.assertEqual(image.size,(160,160))
    self.assertEqual(len(meta['clips']),7)
    for clip,data in meta['clips'].items():
      self.assertEqual(data['end']-data['start']+1,4)
    self.assertIn('original',meta['license']+' '+meta['art'])
 def test_distinct(self):
  atlas=[(ROOT/'phaser/assets/monsters'/i/'atlas.png').read_bytes() for i in IDS]
  self.assertEqual(len(set(atlas)),3)
if __name__=='__main__':unittest.main()