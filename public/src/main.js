var game;

import HudScene from "./hud.js";
import MenuScene from "./menu.js";
import GameScene from "./game.js";


let windowWidth = $(window).width();
let windowHeight = $(window).height();
let config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: windowWidth,
    height: windowHeight,
    autoResize: true,
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
