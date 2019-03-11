function fromCartToIso(point) {
    //get isometric coordinates from cartesian's
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

function getCoordsFromObject(obj, x, y) {
    //get all places occupied by an object
    let kMax = obj.width;
    let lMax = obj.height;
    if (scene.orientation === "E" || scene.orientation === "W") {
        kMax = obj.height;
        lMax = obj.width;
    }

    let coords = [];
    for (let k = 0; k < kMax; k++) {
        for (let l = 0; l < lMax; l++) {
            let tmpPoint = {
                x: (x - l) * spriteSize,
                y: (y - k) * spriteSize
            };
            let tmpIsoPoint = fromCartToIso(tmpPoint);
            coords.push(tmpIsoPoint);
        }
    }

    return coords;
}

function setTmpSpriteTint(coord, color) {
    //change the color of an object tanks to it coordinates
    scene.mapData.find((element) => {
        if (element.x === coord.x && element.y === coord.y) {
            console.log("a");
            if (objects[scene.curPlacedBlock] !== "road" || objects[element.name] !== "road") {
                scene.tmpSprite.tint = color;
            }
        }
    });
}

let scene;
let windowWidth = $(window).width();
let windowHeight = $(window).height();
let spriteSize = 51;
let mapSize = 80; //size of map (square)
let borderOffset = new Phaser.Geom.Point(windowWidth / 2, spriteSize / 2 + windowHeight / 2 - spriteSize * Math.floor(mapSize / 2)); //offset to center the map
let prevSecond = -1;
let toProduce = {
    energy: 0,
    water: 0,
    citizens: 0,
    money: 0,
    pollution: 0
};
let storageMax = {
    energy: 0,
    water: 0,
    citizens: 0,
    money: 0,
    pollution: 0
};

//limit of camera
let minPosCamX = -spriteSize * mapSize + borderOffset.x;
let minPosCamY = -spriteSize * mapSize - borderOffset.y + windowHeight;

let orientations = ["W", "N", "E", "S"];

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameScene() {
            Phaser.Scene.call(this, {key: "GameScene"});
        },
    preload: function () {
        //initialisation of useful variables
        scene = this;
        scene.orientation = "W";
        scene.pointer = this.input.activePointer;
        scene.keys = this.input.keyboard.addKeys('ESC, UP, DOWN, LEFT, RIGHT, Z, S,Q, D, R');
        scene.mapData = [];
        scene.mapData.push({
            name: "data",
            energy: 0,
            water: 0,
            citizens: 0,
            money: 0,
            pollution: 0,
        });

        scene.mapData.push(
            {
                "name": "data",
                "energy": 0,
                "water": 0,
                "citizens": 0,
                "money": 0,
                "pollution": 0
            }
        );


        scene.curPlacedBlock = undefined; //object to place
        scene.scene.sendToBack();

        scene.load.crossOrigin = 'Anonymous';
    }
    ,

    create:

        function () {

            //display the floor and prepare the map making
            for (let i = 0; i < mapSize; i++) {
                for (let j = 0; j < mapSize; j++) {
                    let point = new Phaser.Geom.Point();
                    point.x = j * spriteSize;
                    point.y = i * spriteSize;
                    let isoPoint = fromCartToIso(point);
                    let sprite = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y + 14, "grass", false).setOrigin(0.5, 1);

                    // preview a building with mouse and change tint if necessary space on map is not free
                    sprite.setInteractive({pixelPerfect: true});
                    sprite.on("pointerover", () => {
                        if (scene.curPlacedBlock !== undefined) {
                            let obj = objects[scene.curPlacedBlock];
                            let objCoords = getCoordsFromObject(obj, j, i);


                            if (scene.orientation === "N" || scene.orientation === "S") {
                                scene.tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x + 100 / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                            } else {
                                scene.tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x - 100 / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                            }


                            if (obj.type === "building") {
                                scene.tmpArrow = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y, "arrow" + scene.orientation, false).setOrigin(0.5, 1);
                            }


                            scene.tmpSprite.alpha = 0.7;
                            scene.tmpSprite.depth = scene.tmpSprite.y - 50 * obj.height + mapSize * 100;


                            objCoords.forEach((curCoord) => {
                                scene.mapData.find((element) => {
                                    if (element.x === curCoord.x && element.y === curCoord.y) {
                                        if (objects[scene.curPlacedBlock] !== "road" || objects[element.name] !== "road") {
                                            scene.tmpSprite.tint = 0xe20000;
                                        }
                                    }
                                });
                            });
                        }
                    }, this);


                    //destroy previewed building
                    sprite.on("pointerout", () => {
                        if (scene.tmpSprite !== undefined) {
                            scene.tmpSprite.destroy();
                        }
                        if (scene.tmpArrow !== undefined) {
                            scene.tmpArrow.destroy();
                        }
                    }, this);


                    //create a building if necessary space on map is free
                    sprite.on("pointerdown", () => {
                        let obj = objects[scene.curPlacedBlock];
                        let objCoords = getCoordsFromObject(obj, j, i);
                        let isOnBlock = false;


                        objCoords.forEach((curCoord) => {
                            scene.mapData.find((element) => {
                                if (element.x === curCoord.x && element.y === curCoord.y) {
                                    if (objects[scene.curPlacedBlock] !== "road" || objects[element.name] !== "road") {
                                        console.log("yes putain");
                                        isOnBlock = true;
                                    }
                                }
                            });
                        });


                        if (!isOnBlock) {
                            scene.tmpSprite.alpha = 1;
                            scene.tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x + 100 / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                            scene.tmpSprite.depth = scene.tmpSprite.y - 50 * obj.height + mapSize * 100;


                            if (scene.tmpArrow !== undefined) {
                                scene.tmpArrow.destroy();
                            }


                            if (obj.type === "building") {
                                scene.tmpArrow = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y, "arrow" + scene.orientation, false).setOrigin(0.5, 1);
                            }


                            objCoords.forEach((curCoord, n) => {
                                if (n === 0) {
                                    scene.mapData.push({
                                        name: scene.curPlacedBlock,
                                        x: curCoord.x,
                                        y: curCoord.y
                                    });
                                } else {
                                    scene.mapData.push({
                                        name: "invisible",
                                        x: curCoord.x,
                                        y: curCoord.y
                                    });

                                }
                            });
                            toProduce.energy += objects[scene.curPlacedBlock].production.energy;
                            toProduce.water += objects[scene.curPlacedBlock].production.water;
                            toProduce.citizens += objects[scene.curPlacedBlock].production.citizens;
                            toProduce.money += objects[scene.curPlacedBlock].production.money;
                            toProduce.pollution += objects[scene.curPlacedBlock].production.pollution;

                            storageMax.energy += objects[scene.curPlacedBlock].storage.energy;
                            storageMax.water += objects[scene.curPlacedBlock].storage.water;
                            storageMax.citizens += objects[scene.curPlacedBlock].storage.citizens;
                            storageMax.money += objects[scene.curPlacedBlock].storage.money;
                            storageMax.pollution += objects[scene.curPlacedBlock].storage.pollution;

                            console.log(scene.mapData);
                        }
                    }, this);
                }
            }

            //display map
            scene.mapData.forEach((curData) => {
                console.log(curData);
                if (curData.name !== undefined && objects[curData.name].type !== "other") {
                    let object = objects[curData.name];
                    let point = new Phaser.Geom.Point();


                    point.x = curData.x;
                    point.y = curData.y;
                    let sprite = scene.add.sprite(point.x + borderOffset.x + 100 / 4 * (object.width - object.height), point.y + borderOffset.y, curData.name, false).setOrigin(0.5, 1);
                    sprite.depth = sprite.y - 50 * object.height + mapSize * 100;


                    toProduce.energy += objects[curData.name].production.energy;
                    toProduce.water += objects[curData.name].production.water;
                    toProduce.citizens += objects[curData.name].production.citizens;
                    toProduce.money += objects[curData.name].production.money;
                    toProduce.pollution += objects[curData.name].production.pollution;

                    storageMax.energy += objects[curData.name].storage.energy;
                    storageMax.water += objects[curData.name].storage.water;
                    storageMax.citizens += objects[curData.name].storage.citizens;
                    storageMax.money += objects[curData.name].storage.money;
                    storageMax.pollution += objects[curData.name].storage.pollution;

                }
            });

            // Zoom camera
            window.addEventListener("wheel", (e) => {
                minPosCamX = -50 * mapSize + borderOffset.x / scene.cameras.main.zoom - 50;
                minPosCamY = -spriteSize * mapSize + (windowHeight - borderOffset.y) / scene.cameras.main.zoom;


                if (e.deltaY < 0 && scene.cameras.main.zoom < 2) {
                    scene.cameras.main.zoomTo(scene.cameras.main.zoom + 0.5, 100);
                } else if (e.deltaY > 0 && scene.cameras.main.zoom > 0.5) {
                    scene.cameras.main.zoomTo(scene.cameras.main.zoom - 0.5, 100);
                }
            });

        }

    ,

    update: function (timer) {
        //move camera
        if (scene.pointer.isDown && scene.pointer.justMoved && scene.pointer.buttons === 1) {
            scene.cameras.main.scrollX -= (scene.pointer.x - scene.pointer.prevPosition.x) / scene.cameras.main.zoom;
            scene.cameras.main.scrollY -= (scene.pointer.y - scene.pointer.prevPosition.y) / scene.cameras.main.zoom;
        }

        if ((scene.keys.UP.isDown || scene.keys.Z.isDown) && scene.cameras.main.scrollY > minPosCamY) {
            for (let i = 0; i < 500; i++) {
                scene.cameras.main.scrollY -= 0.017;
            }
        }
        if ((scene.keys.DOWN.isDown || scene.keys.S.isDown) && scene.cameras.main.scrollY < -minPosCamY) {
            for (let i = 0; i < 500; i++) {
                scene.cameras.main.scrollY += 0.017;
            }
        }

        if ((scene.keys.LEFT.isDown || scene.keys.Q.isDown) && scene.cameras.main.scrollX > minPosCamX) {
            for (let i = 0; i < 500; i++) {
                scene.cameras.main.scrollX -= 0.017;
            }
        }
        if ((scene.keys.RIGHT.isDown || scene.keys.D.isDown) && scene.cameras.main.scrollX < -minPosCamX) {
            for (let i = 0; i < 500; i++) {
                scene.cameras.main.scrollX += 0.017;
            }
        }


        if (Phaser.Input.Keyboard.JustDown(scene.keys.ESC)) {
            if (scene.curPlacedBlock !== undefined) {
                scene.curPlacedBlock = undefined;
            } else {
                scene.scene.start("MenuScene");
            }
        }


        //rotate building
        if (Phaser.Input.Keyboard.JustDown(scene.keys.R)) {
            if (scene.curPlacedBlock !== undefined) {
                let object = objects[scene.curPlacedBlock];


                if (object.type === "building") {
                    scene.orientation = orientations[(orientations.indexOf(scene.orientation) + 1) % 4];
                    scene.tmpSprite.destroy();
                    scene.tmpArrow.destroy();
                    scene.curPlacedBlock = scene.curPlacedBlock.replace(/.$/, scene.orientation);


                    if (scene.orientation === "N" || scene.orientation === "S") {
                        scene.tmpSprite = scene.add.sprite(scene.tmpSprite.x + 200 / 4 * (object.width - object.height), scene.tmpSprite.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                    } else {
                        scene.tmpSprite = scene.add.sprite(scene.tmpSprite.x - 200 / 4 * (object.width - object.height), scene.tmpSprite.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                    }


                    scene.tmpArrow = scene.add.sprite(scene.tmpSprite.x, scene.tmpSprite.y, "arrow" + scene.orientation, false).setOrigin(0.5, 1);
                    scene.tmpSprite.alpha = 0.7;


                    let isoPoint = {
                        x: scene.tmpSprite.x,
                        y: scene.tmpSprite.y
                    };

                    setTmpSpriteTint(isoPoint, 0xf44250);
                    scene.tmpSprite.depth = scene.tmpSprite.y - 50 * object.height + mapSize * 100;
                }
            }
        }


        if (Math.round(timer / 1000) !== prevSecond) {
            prevSecond = Math.round(timer / 1000);

            if (scene.mapData[0].energy + toProduce.energy <= storageMax.energy) {
                scene.mapData[0].energy += toProduce.energy
            } else if (scene.mapData[0].energy + toProduce.energy > storageMax.energy && scene.mapData[0].energy < storageMax.energy) {
                scene.mapData[0].energy = storageMax.energy;
            }

            if (scene.mapData[0].water + toProduce.water <= storageMax.water) {
                scene.mapData[0].water += toProduce.water
            } else if (scene.mapData[0].water + toProduce.water > storageMax.water && scene.mapData[0].water < storageMax.water) {
                scene.mapData[0].water = storageMax.water;
            }

            if (scene.mapData[0].citizens + toProduce.citizens <= storageMax.citizens) {
                scene.mapData[0].citizens += toProduce.citizens
            } else if (scene.mapData[0].citizens + toProduce.citizens > storageMax.citizens && scene.mapData[0].citizens < storageMax.citizens) {
                scene.mapData[0].citizens = storageMax.citizens;
            }

            if (scene.mapData[0].money + toProduce.money <= storageMax.money) {
                scene.mapData[0].money += toProduce.money
            } else if (scene.mapData[0].money + toProduce.money > storageMax.money && scene.mapData[0].money < storageMax.money) {
                scene.mapData[0].money = storageMax.money;
            }

            if (scene.mapData[0].pollution + toProduce.pollution <= storageMax.pollution) {
                scene.mapData[0].pollution += toProduce.pollution
            } else if (scene.mapData[0].pollution + toProduce.pollution > storageMax.pollution && scene.mapData[0].pollution < storageMax.pollution) {
                scene.mapData[0].pollution = storageMax.pollution;
            }
            console.log("storage: " + JSON.stringify(scene.mapData[0]));
            console.log("prod: " + JSON.stringify(toProduce));

        }


    }
});

export default GameScene;