import Phaser from 'phaser';
import { ExplorationScene } from './exploration.js';

// Experimento técnico. Não modifica a economia, a campanha nem saves da main.
new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'phaser',
  backgroundColor: '#111d1a',
  scale: {mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: 390, height: 844},
  render: {pixelArt: true, antialias: false},
  physics: {default: 'arcade', arcade: {debug: false}},
  scene: [ExplorationScene],
});