import HudScene from "./hud.js";
import MenuScene from "./menu.js";
import GameScene from "./game.js";

document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});

let config = {
    type: Phaser.AUTO,
    width: window.screen.width,
    height: window.screen.height,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
    },
    backgroundColor: 0x87CEEB,
    physics: {
        default: 'arcade',
    },
    scene: [MenuScene, GameScene, HudScene]
};

new Phaser.Game(config);