var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MenuScene() {
            Phaser.Scene.call(this, {key: "MenuScene"});    
        },

    preload: function(){
        this.load.image('jouer', '/assets/menu/jouer.png');
        this.load.image('options', '/assets/menu/options.png');
        this.load.image('quitter', '/assets/menu/quitter.png');
    },

    create: function () {
        let sprite = this.add.sprite(window.innerWidth/2, window.innerHeight/10 * 3.5, 'jouer', false).setOrigin(0.5, 0);
        this.add.sprite(window.innerWidth/2, window.innerHeight/10 * 5, 'options', false).setOrigin(0.5, 0);
        this.add.sprite(window.innerWidth/2, window.innerHeight/10 * 6.5, 'quitter', false).setOrigin(0.5, 0);
        sprite.setInteractive();
        sprite.on("pointerdown", () => {
            this.scene.start('GameScene');
            this.scene.start('HudScene');
            this.scene.stop('MenuScene');
        }, this);
    }
});

export default MenuScene;