let windowWidth = window.screen.width; // window width
let windowHeight = window.screen.height; // window height
let scene; // This scene
let gameScene; // The game scene


function download(filename) {
    let text = btoa(JSON.stringify(scene.scene.get("GameScene").mapData));
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

let InGameMenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function HudScene() {
            Phaser.Scene.call(this, {key: "InGameMenuScene", active: false});
        },
    preload: function () {
        scene = this;
        scene.keys = this.input.keyboard.addKeys('ESC, M');

    },

    create: function () {
        scene.scene.bringToTop();
        scene.scene.bringToTop("HudScene");
        let menuBackgroundRect = new Phaser.Geom.Rectangle(0, 0, 300, windowHeight);
        let PauseBackground = scene.add.graphics({key: "graph", fillStyle: {color: 0x898989}});
        PauseBackground.fillRectShape(menuBackgroundRect);

        let menuBackground = scene.add.graphics({key: "graph", fillStyle: {color: 0x5d5d5e}});

        let pauseText = scene.add.text(150, 50, "PAUSED", {fontSize: 50}).setOrigin(0.5, 0.5);


        let toggleFullscreen;
        if (!scene.scale.isFullscreen) {
            toggleFullscreen = scene.add.sprite(150, 150, "fullscreenmode").setOrigin(0.5, 0.5);
        } else {
            toggleFullscreen = scene.add.sprite(150, 150, "windowedmode").setOrigin(0.5, 0.5);
        }


        let save = scene.add.sprite(150, 240, "save").setOrigin(0.5, 0.5);

        let mainMenu = scene.add.sprite(150, 330, "mainmenu").setOrigin(0.5, 0.5);

        toggleFullscreen.setInteractive();
        toggleFullscreen.on("pointerdown", () => {
            if (scene.scale.isFullscreen) {
                scene.scale.stopFullscreen();

            } else {

                scene.scale.startFullscreen();
            }
            scene.scene.stop();
            scene.scene.wake("GameScene");
        });

        save.setInteractive();
        save.on("pointerdown", () => {
            let saveName = window.prompt("save name");
            if (saveName === "") {
                let date = new Date();
                saveName = "Ecocity" + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
            }
            download(saveName);

        });


        mainMenu.setInteractive();
        mainMenu.on("pointerdown", () => {
            scene.scene.stop("GameScene");
            scene.scene.stop("HudScene");
            scene.scene.get("GameScene").mapData = undefined;
            scene.scene.start("MenuScene");
            scene.scene.stop();
        });
    },
    update: function () {
        if (Phaser.Input.Keyboard.JustDown(scene.keys.M)) {
            scene.scene.stop("InGameMenuScene");
            scene.scene.wake("GameScene");
        }
    }
});

export default InGameMenuScene;