let scene; // The scene
let camera; // The camera
let pointer; // The cursor
let controls; // Arrows control (up, down, right, left)
let tmpSprite; // Temp sprite for preview
let zoomMin = 0.25; // Minimal zoom
let zoomMax = 1; // Maximal zoom
let mapSize = 20; // Size of the map
let spriteWidth = 200; // Width of a floor
let spriteHeight = 18; // Height of a floor
let spriteDepth = 100; // Depth of a floor
let borders = 100; // Number of pixel around the map
let hudHeight = 80;

function addObjects(obj1,obj2) /* Adding two objects */ {
    let obj ={};
    Object.keys(obj2).map(function(a){
        obj[a] = obj1[a] + obj2[a]
    });
    return obj;
}

function subObjects(obj1,obj2) /* Subtract two objects */ {
    let obj ={};
    Object.keys(obj2).map(function(a){
        obj[a] = obj1[a] - obj2[a]
    });
    return obj;
}

function fromCartToIso(point) /* Cartesian to Isometric */ {
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = (point.x - point.y);
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

function fromIsoToCart(point) /* Isometric to Cartesian */ {
    let cartPoint = new Phaser.Geom.Point;
    cartPoint.x = (2 * point.y + point.x) / 2;
    cartPoint.y = (2 * point.y - point.x) / 2;

    return cartPoint;
}

function getCoordsFromObject(obj, i, j) /* Get all the points of an object */ {
    // Get all places occupied by an object
    let points = [];
    for (let x = 0; x < obj.height; x++){
        for (let y = 0; y < obj.width; y++){
            if(i - x < 0 || j - y < 0){
                return [];
            }
            points.push(new Phaser.Geom.Point(i - x, j - y))
        }
    }
    return points
}

function spritePreview(isoPoint, i, j) /* Preview the selected sprite on coord */ {
    let obj = objects[scene.curPlacedBlock];
    let points = getCoordsFromObject(obj,i,j);
    tmpSprite = scene.add.sprite(isoPoint.x , isoPoint.y - spriteHeight, scene.curPlacedBlock + "-" + scene.orientation, false).setOrigin(0.5 + (obj.width - obj.height)/10 , 1);
    tmpSprite.alpha = 0.7;
    tmpSprite.depth = i + j - Math.min(obj.width , obj.height);
    tmpSprite.name = scene.curPlacedBlock;
    tmpSprite.obj = obj;
    tmpSprite.putable = true;
    if(points.length > 0){
        points.forEach((point) => {
            if (scene.mapData[point.x][point.y] !== undefined){
            tmpSprite.putable = false;
            }
        });
    }else{
        tmpSprite.putable = false;
    }

    if(tmpSprite.putable){
        tmpSprite.points = points;
    }else{
        tmpSprite.setTint(0xe20000);
    }
}

function spriteHide() /* Hide the previewed sprite */ {
    if (tmpSprite !== undefined) {
        tmpSprite.destroy();
    }
}

function spritePut() /* Place the previewed sprite */ {
    let sprite = scene.add.sprite(tmpSprite.x, tmpSprite.y, tmpSprite.texture.key).setOrigin(tmpSprite.originX, tmpSprite.originY);
    let points = tmpSprite.points;
    tmpSprite.destroy();
    sprite.depth = tmpSprite.depth;
    sprite.name = tmpSprite.name;
    sprite.points = points;
    scene.spriteGroup.add(sprite);
    points.forEach((point) =>{
        scene.mapData[point.x][point.y] = sprite;
    });

    scene.toProduce = addObjects(scene.toProduce, objects[sprite.name].production);
    scene.storageMax = addObjects(scene.storageMax, objects[sprite.name].storage);
}

function spriteRemove(i,j) /* Remove the sprite on coord */ {
    let sprite = scene.mapData[i][j];
    if (sprite !== undefined) {
        let points = sprite.points;
        scene.toProduce = subObjects(scene.toProduce, objects[sprite.name].production);
        scene.storageMax = subObjects(scene.storageMax, objects[sprite.name].storage);
        sprite.destroy();
        points.forEach((point) => {
            delete scene.mapData[point.x][point.y];
        })
    }
}

// const reverse = array => [...array].reverse();
// const compose = (a, b) => x => a(b(x));
//
// const flipMatrix = matrix => (
//     matrix[0].map((column, index) => (
//         matrix.map(row => row[index])
//     ))
// );
//
// const rotateMatrix = compose(flipMatrix, reverse);
// const rotateMatrixCounterClockwise = compose(reverse, flipMatrix);

let GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function GameScene() {
        Phaser.Scene.call(this, {key: "GameScene"});
    },
    preload: function () {
        // Define some variables
        scene = this;
        scene.hudHeight = hudHeight;
        scene.data = {
            energy: 0,
            water: 0,
            citizens: 0,
            money: 0,
            pollution: 0,
            curLevel: 0
        };
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
            for (let i = 0; i < mapSize; i++) {
                scene.mapData[i] = new Array(mapSize);
            }
        }
    },
    create: function () {
        // Set the border of the world for the camera
        camera.setBounds(-(mapSize * spriteWidth / 2 + borders), -(spriteDepth + spriteHeight + borders/2), (mapSize * spriteWidth + 2 * borders), (mapSize * spriteDepth + spriteHeight + borders + hudHeight));
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

        // Create the map with floors and add properties for adding building
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                let point = new Phaser.Geom.Point();
                point.x = j * spriteWidth / 2;
                point.y = i * spriteWidth / 2;
                let isoPoint = fromCartToIso(point);
                let sprite = scene.add.sprite(isoPoint.x, isoPoint.y, "grass");
                sprite.setOrigin(0.5,1);
                sprite.depth = -10;
                sprite.setInteractive({draggable: true, pixelPerfect: true});

                // Preview the selected building and tint it if it's not placeable
                sprite.on("pointerover", () => {
                    if (scene.curPlacedBlock !== undefined && scene.curPlacedBlock !== "destroy") {
                        spritePreview(isoPoint, i, j);
                    }else if (scene.curPlacedBlock === "destroy"){
                        if (scene.mapData[i][j] !== undefined){
                            scene.mapData[i][j].setTint(0xe20000);
                        }
                    }

                });

                // Hide the previewed building and clear tint
                sprite.on("pointerout", () => {
                    spriteHide();
                    if (scene.mapData[i][j] !== undefined && scene.mapData[i][j].isTinted) {
                        scene.mapData[i][j].clearTint();
                    }
                });

                // Put the previewed building or destroy a building
                sprite.on("pointerdown", (pointer) => {
                    if (pointer.buttons === 1) {
                        if(scene.curPlacedBlock !== undefined) {
                            if (scene.curPlacedBlock === "destroy") {
                                spriteRemove(i, j);
                            } else if (tmpSprite !== undefined) {
                                if(tmpSprite.putable === true) {
                                    spritePut();
                                }
                            }
                        }
                    }
                });
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

        // Cancel with right click
        scene.input.on('pointerdown', function(pointer){
            if(pointer.buttons === 2){
                if (scene.curPlacedBlock !== undefined) {
                    scene.curPlacedBlock = undefined;
                    spriteHide();
                }
            }
        });

    },
    update: function (time, delta) {
        // Check form arrows keys
        controls.update(delta);
    }
});

export default GameScene;