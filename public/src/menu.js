let scene;
var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MenuScene() {

            Phaser.Scene.call(this, {key: "MenuScene"});
        },

    preload: function(){
        scene = this;

        //load all necessary assets
        scene.load.image('jouer', 'assets/menuIcons/jouer.png');
        $.each(objects, function (index, values) {

            if(values.type === "building"){
                scene.load.image(index, "/assets/buildings/" + index + ".png");
                scene.load.image(index+"Icon", "/assets/hudIcons/buildings/" + index + ".png");
            }else{
                scene.load.image(index, "/assets/roads/" + index + ".png");
                scene.load.image(index+"Icon", "/assets/hudIcons/roads/" + index + ".png");
            }

        });

        this.load.image("buildBuilding", "/assets/hudIcons/buildBuilding.png");
        this.load.image("buildRoad", "/assets/hudIcons/buildRoad.png");
        this.load.image("previousPage", "/assets/hudIcons/previousPage.png");
    },

    create: function () {
        scene.scene.bringToTop();
        let sprite = this.add.sprite(window.innerWidth/2, window.innerHeight/2, "jouer", false).setOrigin(0.5, 0);
        sprite.setInteractive();
        sprite.on("pointerdown", () => {
            scene.scene.start("HudScene");
            scene.scene.start('GameScene');
            scene.scene.stop('MenuScene');
        }, this);
    }
});

export default MenuScene;