let scene; // The scene
let camera; // The camera
let pointer; // The cursor
let controls; // Arrows control (up, down, right, left)
let zoomMin = 0.25; // Minimal zoom
let zoomMax = 1; // Maximal zoom
let mapSize = 10; // Size of the map
let spriteWidth = 200; // Width of a floor
let spriteHeight = 19; // Height of a floor
let spriteDepth = 100; // Depth of a floor
let borders = 100; // Number of pixel around the map
let hudHeight = 80;

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

function spritePreview(isoPoint, i, j) {}

function spriteHide() {}

function spritePut(point, isoPoint, i, j, sprite) {}

let GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function GameScene() {
        Phaser.Scene.call(this, {key: "GameScene"});
    },
    preload: function () {
        // Define some variables
        scene = this;
        scene.hudHeight = hudHeight;
        pointer = scene.input.activePointer;
        camera = scene.cameras.main;

        // Create group of display sprite
        scene.spriteGroup = scene.add.group();

        // Variables for add resources
        scene.toProduce = {
            energy: 0,
            water: 0,
            citizens: 0,
            money: 0,
            pollution: 0
        };
        scene.storageMax = {
            energy: 0,
            water: 0,
            citizens: 0,
            money: 0,
            pollution: 0
        };

        // Initialisation of the data
        if (scene.mapData === undefined) {
            scene.mapData = [];
            scene.mapData.push({
                name: "data",
                energy: 0,
                water: 0,
                citizens: 0,
                money: 0,
                pollution: 0,
                curLevel: 0
            });
        }
    },
    create: function () {
        // Set the border of the world for the camera
        camera.setBounds(-(mapSize * spriteWidth / 2 + borders), -((spriteDepth + spriteHeight + borders) / 2), (mapSize * spriteWidth + 2 * borders), (mapSize * spriteDepth + spriteHeight + borders + hudHeight));
        // Center the camera
        camera.centerToBounds();
        // Set the minimal zoom if the map is too small
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

        //Create the map with floors and add properties for adding building
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                let point = new Phaser.Geom.Point();
                point.x = j * spriteWidth / 2;
                point.y = i * spriteWidth / 2;
                let isoPoint = fromCartToIso(point);
                let sprite = scene.add.sprite(isoPoint.x, isoPoint.y, "grass");
                sprite.setInteractive({draggable: true, pixelPerfect: true});

                //Preview the selected building
                sprite.on("pointerover", () => {
                    spritePreview(isoPoint, i, j);
                }, this);

                //Hide the previewed building
                sprite.on("pointerout", () => {
                    spriteHide();
                }, this);

                //Put the previewed building
                sprite.on("pointerdown", () => {
                    spritePut(point, isoPoint, i, j, sprite);
                }, this);
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
                camera.zoomTo(Phaser.Math.Clamp(camera.zoom * 1.3, zoomMin, zoomMax), 100);
            } else if (e.deltaY > 0) {
                camera.zoomTo(Phaser.Math.Clamp(camera.zoom / 1.3, zoomMin, zoomMax), 100);
            }
        });

    },
    update: function (time, delta) {
        // Check form arrows keys
        controls.update(delta);
    }
});

export default GameScene;