let scene;
let spriteSize = 200;
let mapSize = 5;

function fromCartToIso(point) { //
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

function fromIsoToCart(point) {
    let cartPoint = new Phaser.Geom.Point;
    cartPoint.x = point.x + (2 * point.y - point.x) / 2;
    cartPoint.y = (2 * point.y - point.x) / 2;

    return cartPoint;
}

let GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function GameScene() {
        Phaser.Scene.call(this, {key: "GameScene"});
    },
    preload: function () {
        scene = this;
        scene.spritesGroup = scene.add.group("floorGroup");
    },
    create: function () {
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                let point = new Phaser.Geom.Point();
                point.x = j * spriteSize / 2;
                point.y = i * spriteSize / 2;
                let isoPoint = fromCartToIso(point);
                let sprite = scene.add.sprite(isoPoint.x, isoPoint.y, "grass", false);
            }
        }
    },
    update: function () {

    }
});

export default GameScene;