let scene; // Global Variable for the scene
let windowWidth = window.screen.width;
let windowHeight = window.screen.height;

let MenuScene = new Phaser.Class({
    Extends: Phaser.Scene,

    // Initialize scene as "MenuScene"
    initialize:
        function MenuScene() {
            Phaser.Scene.call(this, {key: "MenuScene"});
        },

    preload: function(){
        scene = this;

        // Add key ESC as usable key
        scene.keys = this.input.keyboard.addKeys('ESC');

        // scene.scene.stop("HudScene"); // ??

        // Progress bar when you wait for every sprite to be preload
        let progressBar = scene.add.graphics();
        let progressBox = scene.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(windowWidth/2 - 320/2, windowHeight/2 - 50/2, 320, 50);
        scene.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(windowWidth/2 - 300/2, windowHeight/2 - 30/2, 300 * value, 30);
        });
        scene.load.on("complete", () => {
            progressBox.destroy();
            progressBar.destroy();
        });


        // Load all necessary assets
            // Buildings, roads and associated icons
            $.each(objects, function (index, values) {
                if(values.type === "building"){
                    scene.load.image(index + "-W", "/assets/buildings/" + index + "-W"+".png");
                    scene.load.image(index + "-N", "/assets/buildings/" + index + "-N"+".png");
                    scene.load.image(index + "-E", "/assets/buildings/" + index + "-E"+".png");
                    scene.load.image(index + "-S", "/assets/buildings/" + index + "-S"+".png");
                    scene.load.image(index+"Icon", "/assets/hudIcons/buildings/" + index + "-W" + ".png");
                }else if(values.type === "road"){
                    scene.load.image(index, "/assets/roads/" + index + ".png");
                    scene.load.image(index+"Icon", "/assets/hudIcons/roads/" + index + ".png");
                }

            });

            // Hud icons and interactive shapes
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

            // Main menu texts
            this.load.image('jouer', '/assets/menu/jouer.png');
            this.load.image('options', '/assets/menu/options.png');
            this.load.image('quitter', '/assets/menu/quitter.png');
            this.load.image('fullscreen', '/assets/menu/fullscreen.png');

            // Others
            this.load.image('grass', '/assets/roads/grass.png');
            this.load.image('arrowN', '/assets/buildings/arrows/arrowN.png');
            this.load.image('arrowS', '/assets/buildings/arrows/arrowS.png');
            this.load.image('arrowE', '/assets/buildings/arrows/arrowE.png');
            this.load.image('arrowW', '/assets/buildings/arrows/arrowW.png');

    },

    create: function () {
        // Put this scene in front of the others
        scene.scene.bringToTop();

        // Put the play, option and exit text
        let playSprite = scene.add.sprite(window.screen.width/2, window.screen.height/10 * 3.5, 'jouer', false).setOrigin(0.5, 0.5);
        playSprite.setInteractive();
        playSprite.on("pointerdown", () => {
            this.scene.start('GameScene');
            this.scene.start('HudScene');
            this.scene.stop('MenuScene');
        }, this);

        let optionSprite = scene.add.sprite(window.screen.width/2, window.screen.height/10 * 5, 'options', false).setOrigin(0.5, 0.5);
        let leaveSprite = scene.add.sprite(window.screen.width/2, window.screen.height/10 * 6.5, 'quitter', false).setOrigin(0.5, 0.5);

        // Add the fullscreen logo and make it interactive
        let fullscreen = this.add.image(30, 30,'fullscreen').setInteractive();
        fullscreen.setDisplaySize(30,30);
        fullscreen.on('pointerdown',()=>{
            if(scene.scale.isFullscreen){
                scene.scale.stopFullscreen();
            }else{
                scene.scale.startFullscreen();
            }
        });
        fullscreen.on('pointerover', ()=>{
            fullscreen.setDisplaySize(45,45);
        });
        fullscreen.on('pointerout',()=>{
            fullscreen.setDisplaySize(30,30);
        })
    },

    update: function(){
        // Escape from fullscreen mode when pressing escape
        if(Phaser.Input.Keyboard.JustDown(scene.keys.ESC)){
            scene.scale.stopFullscreen();
        }
    }
});

export default MenuScene;