import GameScene from "./game.js";
import MenuScene from "./menu.js";

let windowWidth = $(window).width();
let windowHeight = $(window).height();

let config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 0x87CEEB,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [GameScene, MenuScene]
};
let game;


game = new Phaser.Game(config);