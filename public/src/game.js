function fromCartToIso(point) {
    let isoPoint = new Phaser.Geom.Point;

    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

let windowWidth = $(window).width();
let windowHeight = $(window).height();

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameScene() {
            Phaser.Scene.call(this, {key: "gameScene"});
        },
    preload: function()
    {
        // load resources
        this.load.crossOrigin = 'Anonymous';
        //load all necessary assets
        this.load.image('floor', 'assets/floor.png');
        this.load.image('building', 'assets/buildings/building1.png');
        this.load.image('shop1', 'assets/buildings/shop1.png');
        this.load.image("roadNS", "assets/roads/roadNS.png");
        this.load.image("roadNSE", "assets/roads/roadNSE.png");
        this.load.image("roadNE", "assets/roads/roadNE.png");
        this.load.image("roadEW", "assets/roads/roadEW.png");
        this.load.image("tree1", "assets/roads/tree1.png");
    }
    ,

    create: function () {

        this.pointer = this.input.activePointer;

        let mapData = [
            //posX, posY, dataType
            [24, 26, "shop1"],
            [24, 27, "shop1"],
            [23, 27, "roadNS"],
            [23, 26, "roadNS"],
            [23, 28, "roadNE"],
            [22, 28, "roadEW"],
        ];

        this.spriteWidth = 50;
        this.mapSize = 50;
        this.borderOffset = new Phaser.Geom.Point(windowWidth / 2, 50 / 2 + windowHeight / 2 - 50 * Math.floor(this.mapSize / 2)); // define the offset to center the map

        //display the floor
        for (let i = 0; i < this.mapSize; i++) {
            for (let j = 0; j < this.mapSize; j++) {
                this.point = new Phaser.Geom.Point();
                this.point.x = j * this.spriteWidth;
                this.point.y = i * this.spriteWidth;
                let isoPoint = fromCartToIso(this.point);
                // this.isoPoint = fromCartToIso(this.point);
                this.sprite = this.add.sprite(isoPoint.x + this.borderOffset.x, isoPoint.y + this.borderOffset.y + 14, "floor", false).setOrigin(0.5, 1);


                // Preview d'un shop quand le curseur passe au dessus d'une tile, add le shop au click
                this.sprite.setInteractive({pixelPerfect: true});
                this.sprite.on("pointerover", () => {
                    this.tmpSprite = this.add.sprite(isoPoint.x + this.borderOffset.x, isoPoint.y + this.borderOffset.y, "shop1", false).setOrigin(0.5, 1);
                    this.tmpSprite.alpha = 0.7;
                    this.tmpSprite.depth = this.tmpSprite.y+windowWidth;
                }, this);
                this.sprite.on("pointerout", () => {
                    this.tmpSprite.destroy();
                }, this);
                this.sprite.on("pointerdown", () => {
                    this.tmpSprite.alpha = 1;
                    this.tmpSprite = this.add.sprite(isoPoint.x + this.borderOffset.x, isoPoint.y + this.borderOffset.y, "shop1", false).setOrigin(0.5, 1);
                }, this);
            }
        }

        //display elements
        mapData.forEach((curData) => {
            let spriteType = curData[2];
            let object = objects[curData[2]];
            let point = new Phaser.Geom.Point();
            point.x = curData[1] * this.spriteWidth;
            point.y = curData[0] * this.spriteWidth;
            this.isoPoint = fromCartToIso(point);
            this.sprite = this.add.sprite(this.isoPoint.x + this.borderOffset.x, this.isoPoint.y + this.borderOffset.y, spriteType, false).setOrigin(0.5, 1);
            this.sprite.depth = this.sprite.y + windowWidth;
        });

        // Zoom camera
        window.addEventListener("wheel", (e) => {
            if (e.deltaY < 0 && this.cameras.main.zoom < 2) {
                this.cameras.main.zoomTo(this.cameras.main.zoom + 0.5, 100);
            } else if (e.deltaY > 0 && this.cameras.main.zoom > 0.5) {
                this.cameras.main.zoomTo(this.cameras.main.zoom - 0.5, 100);
            }
        });
    }
    ,

    update: function () {

        if (this.pointer.isDown && this.pointer.justMoved && this.pointer.buttons === 1) {
            this.cameras.main.scrollX -= (this.pointer.x - this.pointer.prevPosition.x) / this.cameras.main.zoom;
            this.cameras.main.scrollY -= (this.pointer.y - this.pointer.prevPosition.y) / this.cameras.main.zoom;
        }
    }


});

export default GameScene;