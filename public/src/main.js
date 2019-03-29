var game;

import HudScene from "./hud.js";
import MenuScene from "./menu.js";
import GameScene from "./game.js";


let windowWidth = window.outerWidth;
let windowHeight = window.outerHeight;
let config = {
    type: Phaser.AUTO,
    width: windowWidth,
    height: windowHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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