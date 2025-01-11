// js/game.js
import { BootScene } from './scenes/Boot.js';
import { MenuScene } from './scenes/Menu.js';
import { BattleScene } from './scenes/Battle.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game',
    scene: [BootScene, MenuScene, BattleScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
};

let game = new Phaser.Game(config);

