var game;

import HudScene from "./hud.js";
import MenuScene from "./menu.js";
import GameScene from "./game.js";


let windowWidth = window.screen.width;
let windowHeight = window.screen.height;
let config = {
    type: Phaser.AUTO,
    width: windowWidth,
    height: windowHeight,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
    },
    backgroundColor: 0x87CEEB,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    },
    scene: [MenuScene, GameScene, HudScene]
};

game = new Phaser.Game(config);