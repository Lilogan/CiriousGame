let scene; // The scene
let spriteWidth = 200; // Width of a floor
let spriteHeight = 19; // Height of a floor
let spriteDepth = 100; // Depth of a floor
let mapSize = 10; // Size of the map
let borders = 100; // Number of pixel around the map
let zoomMin = 0.25; // Minimal zoom
let zoomMax = 1; // Maximal zoom
let pointer; // The cursor
let controls; // Arrows control (up, down, right, left)
let camera; // The camera


function fromCartToIso(point) /*Cartesian to Isometric*/ {
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = (point.x - point.y);
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

function fromIsoToCart(point) /*Isometric to Cartesian*/ {
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
        // Define some variable
        scene = this;
        pointer = scene.input.activePointer;
        camera = scene.cameras.main;
        //Create some groups
        scene.floorGroup = scene.add.group();
        scene.buildingGroup = scene.add.group();
    },
    create: function () {
        //Center the camera on the middle floor and set borders
        camera.setBounds(-(mapSize * spriteWidth / 2 + borders), -((spriteDepth + spriteHeight)  / 2 + borders), (mapSize * spriteWidth + 2 * borders), (mapSize * spriteDepth + spriteHeight + 2 * borders));
        camera.centerToBounds();
        zoomMin = Math.max(zoomMin, camera.width / camera.getBounds().width);

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
                point.x = j * spriteWidth / 2;
                point.y = i * spriteWidth / 2;
                let isoPoint = fromCartToIso(point);
                let sprite = scene.add.sprite(isoPoint.x, isoPoint.y, "grass");
                sprite.setInteractive({draggable: true});
                scene.floorGroup.add(sprite);
            }
        }

        // Moving with the mouse
        scene.input.on('drag', (pointer) => {
            camera.scrollX += (pointer.prevPosition.x - pointer.x) / scene.cameras.main.zoom;
            camera.scrollY += (pointer.prevPosition.y - pointer.y) / scene.cameras.main.zoom;
        });

        // Modify zoom with the mouse wheel
        window.addEventListener("wheel", (e) => {
            if (e.deltaY < 0) {
                camera.zoomTo(Phaser.Math.Clamp(camera.zoom * 1.3, zoomMin, zoomMax),100);
            } else if (e.deltaY > 0) {
                camera.zoomTo(Phaser.Math.Clamp(camera.zoom/1.3, zoomMin, zoomMax),100);
            }
        });

    },
    update: function (time,delta) {
        // Check form arrows keys
        controls.update(delta);
    }
});

export default GameScene;