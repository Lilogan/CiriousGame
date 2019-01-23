var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MenuScene() {
            Phaser.Scene.call(this, {key: "MenuScene"});    
        },

    preload: function(){
        this.load.image('jouer', 'assets/jouer.png');
    },

    create: function () {
        let sprite = this.add.sprite(window.innerWidth/2, window.innerHeight/2, "jouer", false).setOrigin(0.5, 0);
        sprite.setInteractive();
        sprite.on("pointerdown", () => {
            this.scene.start('GameScene');
            this.scene.start('HudScene');
            this.scene.stop('MenuScene');
        }, this);
    }
});

export default MenuScene;