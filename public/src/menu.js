let scene;
let showPlayMenu = false;
let MenuScene = new Phaser.Class({
        Extends: Phaser.Scene,

        initialize:

            function MenuScene() {
                Phaser.Scene.call(this, {key: "MenuScene"});
            },

        preload: function () {
            scene = this;

            scene.keys = this.input.keyboard.addKeys('ESC');

            //progress bar
            let progressBar = scene.add.graphics();
            let progressBox = scene.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(window.screen.width / 2 - 320 / 2, window.screen.height / 2 - 50 / 2, 320, 50);
            scene.load.on('progress', (value) => {
                progressBar.clear();
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(window.screen.width / 2 - 300 / 2, window.screen.height / 2 - 30 / 2, 300 * value, 30);
            });

            scene.load.on("complete", () => {
                progressBox.destroy();
                progressBar.destroy();
            });


            //load all necessary assets
            $.each(objects, function (index, values) {
                if (values.type === "building") {
                    scene.load.image(index, "/assets/buildings/" + index + ".png");
                    if (index.substr(index.indexOf("-"), index.length) === "-W") {
                        scene.load.image(index + "Icon", "/assets/hudIcons/buildings/" + index + ".png");
                    }
                } else if (values.type === "road") {
                    scene.load.image(index, "/assets/roads/" + index + ".png");
                    scene.load.image(index + "Icon", "/assets/hudIcons/roads/" + index + ".png");
                }
            });

            //in game menu
            this.load.image("deleteBuilding", "/assets/hudIcons/icons/deleteBuilding.png");
            this.load.image("buildBuilding", "/assets/hudIcons/icons/buildBuilding.png");
            this.load.image("energyIcon", "/assets/hudIcons/icons/energyIcon.png");
            this.load.image("waterIcon", "/assets/hudIcons/icons/waterIcon.png");
            this.load.image("pollutionIcon", "/assets/hudIcons/icons/pollutionIcon.png");
            this.load.image("moneyIcon", "/assets/hudIcons/icons/moneyIcon.png");
            this.load.image("citizensIcon", "/assets/hudIcons/icons/citizensIcon.png");
            this.load.image("previousPage", "/assets/hudIcons/icons/previousPage.png");
            this.load.image("nextPage", "/assets/hudIcons/icons/nextPage.png");
            this.load.image("tabHud", "/assets/hudIcons/icons/tabHud.png");
            this.load.image("closeHud", "/assets/hudIcons/icons/closeHud.png");

            //main menu
            this.load.image('jouer', '/assets/menu/jouer.png');
            this.load.image('options', '/assets/menu/options.png');
            this.load.image('quitter', '/assets/menu/quitter.png');
            this.load.image('newgame', '/assets/menu/newgame.png');
            this.load.image('loadgame', '/assets/menu/loadgame.png');

            //in game menu
            this.load.image('fullscreenmode', '/assets/inGameMenu/fullscreen.png');
            this.load.image('windowedmode', '/assets/inGameMenu/windowed.png');
            this.load.image('save', '/assets/inGameMenu/save.png');
            this.load.image('mainmenu', '/assets/inGameMenu/menu.png');

            //others
            this.load.image('grass', '/assets/roads/grass.png');
            this.load.image('fullscreen', '/assets/hudIcons/icons/fullscreen.png');
            this.load.image('arrowN', '/assets/buildings/arrows/arrowN.png');
            this.load.image('arrowS', '/assets/buildings/arrows/arrowS.png');
            this.load.image('arrowE', '/assets/buildings/arrows/arrowE.png');
            this.load.image('arrowW', '/assets/buildings/arrows/arrowW.png');


        },

        create: function () {
            scene.scene.bringToTop();
            let sprite = this.add.sprite(window.screen.width / 2, window.screen.height / 10 * 3.5, 'jouer', false).setOrigin(0.5, 0);
            let option = scene.add.sprite(window.screen.width / 2, window.screen.height / 10 * 5, 'options', false).setOrigin(0.5, 0);
            let leave = scene.add.sprite(window.screen.width / 2, window.screen.height / 10 * 6.5, 'quitter', false).setOrigin(0.5, 0);
            sprite.setInteractive();
            sprite.on("pointerdown", () => {
                if (showPlayMenu === false) {
                    showPlayMenu = true;
                    let newGame = this.add.sprite(window.screen.width / 4 * 3, window.screen.height / 4, 'newgame', false).setOrigin(0.5, 0);
                    let loadGame = this.add.sprite(window.screen.width / 4 * 3, window.screen.height / 4 * 2, 'loadgame', false).setOrigin(0.5, 0);

                    newGame.setInteractive();
                    newGame.on("pointerdown", () => {
                        showPlayMenu = false;
                        this.scene.start('GameScene');
                        this.scene.start('HudScene');
                        this.scene.stop('MenuScene');
                    });
                    loadGame.setInteractive();
                    loadGame.on("pointerdown", () => {
                        showPlayMenu = false;
                        $("#file-input").trigger("click");
                    });
                }
            }, this);
            document.getElementById("file-input").onchange = function () {
                var selectedFile = document.getElementById('file-input').files[0];
                var reader = new FileReader();
                reader.onloadend = function () {
                    if (reader.readyState === 2) {
                        let gameScene = scene.scene.get("GameScene");
                        gameScene.mapData = JSON.parse(reader.result);
                        scene.scene.start('GameScene');
                        scene.scene.start('HudScene');
                        scene.scene.stop('MenuScene');
                        document.getElementById("file-input").value = "";
                    }

                };
                reader.readAsText(selectedFile);
            };
            let fullscreen = this.add.image(40, 40, 'fullscreen').setInteractive();
            fullscreen.setDisplaySize(50, 50);

            fullscreen.on('pointerdown', () => {
                if (scene.scale.isFullscreen) {
                    scene.scale.stopFullscreen();

                } else {

                    scene.scale.startFullscreen();
                }
            });
            fullscreen.on('pointerover', () => {
                if (scene.scale.isFullscreen) {
                    fullscreen.setDisplaySize(50, 50);
                } else {
                    fullscreen.setDisplaySize(65, 65);
                }
            });
            fullscreen.on('pointerout', () => {
                if (scene.scale.isFullscreen) {
                    fullscreen.setDisplaySize(65, 65);

                } else {
                    fullscreen.setDisplaySize(50, 50);
                }
            });

        },

        update: function () {
            if (Phaser.Input.Keyboard.JustDown(scene.keys.ESC)) {
                scene.scale.stopFullscreen();
            }
        }
    })
;

export default MenuScene;