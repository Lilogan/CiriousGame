let windowWidth = $(window).width();
let windowHeight = $(window).height();
let menuHeight = 80;
var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MenuScene() {
            Phaser.Scene.call(this, {key: "menuScene", active: true});
            console.log("test");

        },
    preload: function()
    {
        this.load.image("pollution","assets/menuIcons/pollution.png");
        this.load.image("energy","assets/menuIcons/energy.png");
       this.scene.bringToTop();
    }
    ,

    create: function () {
        this.menu = new Phaser.Geom.Rectangle(0, windowHeight-menuHeight, windowWidth, menuHeight);
        this.graphics = this.add.graphics({ fillStyle: { color: 0xffffff } });
        this.pollutionIcon = this.add.sprite(50,windowHeight-menuHeight+menuHeight/2,"pollution");
        this.energyIcon = this.add.sprite(180,windowHeight-menuHeight+menuHeight/2,"energy");

        this.graphics.fillRectShape(this.menu);

    }
    ,

    update: function () {

    }


});

export default MenuScene;