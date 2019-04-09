let scene;
let spriteSize = 200;
let mapSize = 20;
let pointer;
let controls;
let camera;


function fromCartToIso(point) { // Cartesian to Isometric for place sprite
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = (point.x - point.y);
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

function fromIsoToCart(point) { // Place of sprite Isometric to Cartesian
    let cartPoint = new Phaser.Geom.Point;
    cartPoint.x = (2 * point.y + point.x) / 2;
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
        pointer = scene.input.activePointer;
        camera = scene.cameras.main;
        //Create some groups
        scene.floorGroup = scene.add.group();
        scene.buildingGroup = scene.add.group();
    },
    create: function () {
        //Center the camera on the middle floor
        camera.centerOn(0,(mapSize-1)*spriteSize/4);

        // Set up arrows controls
        let cursors = scene.input.keyboard.createCursorKeys();
        let controlConfig = {
            camera: camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.5,
            drag: 0.4,
            maxSpeed: 1
        };
        controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        //Create the map with floors and add to their group
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                let point = new Phaser.Geom.Point();
                point.x = j * spriteSize / 2;
                point.y = i * spriteSize / 2;
                let isoPoint = fromCartToIso(point);
                let sprite = scene.add.sprite(isoPoint.x, isoPoint.y, "grass"); 
                sprite.setInteractive({draggable: true});
                scene.floorGroup.add(sprite);
            }
        }

        //Moving with the mouse
        scene.input.on('drag', function(pointer){
            console.log(pointer);
            camera.scrollX += pointer.prevPosition.x - pointer.x;
            camera.scrollY += pointer.prevPosition.y - pointer.y;
        });

    },
    update: function (time,delta) {
        // Check form arrows keys
        controls.update(delta);
    }
});

export default GameScene;