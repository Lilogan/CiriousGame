let scene;
let windowWidth = $(window).width();
let windowHeight = $(window).height();
let spriteSize = 51;
let mapSize = 80; //size of map (square)
let borderOffset = new Phaser.Geom.Point(windowWidth / 2, spriteSize / 2 + windowHeight / 2 - spriteSize * Math.floor(mapSize / 2)); //offset to center the map
let prevSecond = -1;

//limit of camera
let minPosCamX = -spriteSize * mapSize + borderOffset.x;
let minPosCamY = -spriteSize * mapSize - borderOffset.y + windowHeight;

let orientations = ["W", "N", "E", "S"];


function fromCartToIso(point) {
    //get isometric coordinates from cartesian
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

function fromIsoToCart(point) {
    //get cartesian coordinates from isometric
    let cartPoint = new Phaser.Geom.Point;
    cartPoint.x = point.x + (2 * point.y - point.x) / 2;
    cartPoint.y = (2 * point.y - point.x) / 2;

    return cartPoint;
}

function roadNameInOrder(name) {
    let returned = "road";

    if (name.indexOf("N") !== -1) {
        returned += "N";
    }
    if (name.indexOf("S") !== -1) {
        returned += "S";
    }
    if (name.indexOf("E") !== -1) {
        returned += "E";
    }
    if (name.indexOf("W") !== -1) {
        returned += "W";
    }

    return returned;
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
            if (objects[scene.curPlacedBlock] !== "road" || objects[element.name] !== "road") {
                scene.tmpSprite.tint = color;
            }
        }
    });
}


function checkRoad(nInMapData) {
    let object = scene.mapData[nInMapData];
    let objectCoord = {
        x: object.x,
        y: object.y
    };
    let objectCart = fromIsoToCart(objectCoord);

    scene.mapData.forEach((curElem, n) => {
        let curElemCoord = {
            x: curElem.x,
            y: curElem.y
        };


        if (n !== 0) {
            let curElemCart = fromIsoToCart(curElemCoord);

            if (curElem.connectedToCityHall === false && object.connectedToCityHall === true && (objects[curElem.name].type === "road" || objects[object.name].type === "road" || object.nthElement === curElem.nthElement)) {
                let objectOrientation = curElem.name.split("-")[1];
                if(curElem.name === "invisible"){
                    objectOrientation = curElem.nameLinkedElement.split("-")[1];
                }

                if (curElemCart.x === objectCart.x && curElemCart.y === objectCart.y - spriteSize && (objectOrientation === "W" || objectOrientation === undefined || object.nthElement === curElem.nthElement)) {
                    scene.mapData[n].connectedToCityHall = true;
                    if (curElem.isAddedToData === false && objects[curElem.name].type === "building") {
                        scene.mapData[n].isAddedToData = true;

                        scene.toProduce.energy += objects[curElem.name].production.energy;
                        scene.toProduce.water += objects[curElem.name].production.water;
                        scene.toProduce.citizens += objects[curElem.name].production.citizens;
                        scene.toProduce.money += objects[curElem.name].production.money;
                        scene.toProduce.pollution += objects[curElem.name].production.pollution;
                        scene.storageMax.energy += objects[curElem.name].storage.energy;

                        scene.storageMax.water += objects[curElem.name].storage.water;
                        scene.storageMax.citizens += objects[curElem.name].storage.citizens;
                        scene.storageMax.money += objects[curElem.name].storage.money;
                        scene.storageMax.pollution += objects[curElem.name].storage.pollution;
                    }
                    checkRoad(n);
                }
                if (curElemCart.x === objectCart.x && curElemCart.y === objectCart.y + spriteSize && (objectOrientation === "E" || objectOrientation === undefined || object.nthElement === curElem.nthElement)) {
                    scene.mapData[n].connectedToCityHall = true;
                    if (curElem.isAddedToData === false && objects[curElem.name].type === "building") {
                        scene.mapData[n].isAddedToData = true;

                        scene.toProduce.energy += objects[curElem.name].production.energy;
                        scene.toProduce.water += objects[curElem.name].production.water;
                        scene.toProduce.citizens += objects[curElem.name].production.citizens;
                        scene.toProduce.money += objects[curElem.name].production.money;
                        scene.toProduce.pollution += objects[curElem.name].production.pollution;
                        scene.storageMax.energy += objects[curElem.name].storage.energy;

                        scene.storageMax.water += objects[curElem.name].storage.water;
                        scene.storageMax.citizens += objects[curElem.name].storage.citizens;
                        scene.storageMax.money += objects[curElem.name].storage.money;
                        scene.storageMax.pollution += objects[curElem.name].storage.pollution;
                    }
                    checkRoad(n);
                }
                if (curElemCart.x === objectCart.x - spriteSize && curElemCart.y === objectCart.y && (objectOrientation === "S" || objectOrientation === undefined|| object.nthElement === curElem.nthElement)) {
                    scene.mapData[n].connectedToCityHall = true;
                    if (curElem.isAddedToData === false && objects[curElem.name].type === "building") {
                        scene.mapData[n].isAddedToData = true;

                        scene.toProduce.energy += objects[curElem.name].production.energy;
                        scene.toProduce.water += objects[curElem.name].production.water;
                        scene.toProduce.citizens += objects[curElem.name].production.citizens;
                        scene.toProduce.money += objects[curElem.name].production.money;
                        scene.toProduce.pollution += objects[curElem.name].production.pollution;
                        scene.storageMax.energy += objects[curElem.name].storage.energy;

                        scene.storageMax.water += objects[curElem.name].storage.water;
                        scene.storageMax.citizens += objects[curElem.name].storage.citizens;
                        scene.storageMax.money += objects[curElem.name].storage.money;
                        scene.storageMax.pollution += objects[curElem.name].storage.pollution;
                    }
                    checkRoad(n);
                }
                if (curElemCart.x === objectCart.x + spriteSize && curElemCart.y === objectCart.y && (objectOrientation === "N" || objectOrientation === undefined|| object.nthElement === curElem.nthElement)) {
                    scene.mapData[n].connectedToCityHall = true;
                    if (curElem.isAddedToData === false && objects[curElem.name].type === "building") {
                        scene.mapData[n].isAddedToData = true;

                        scene.toProduce.energy += objects[curElem.name].production.energy;
                        scene.toProduce.water += objects[curElem.name].production.water;
                        scene.toProduce.citizens += objects[curElem.name].production.citizens;
                        scene.toProduce.money += objects[curElem.name].production.money;
                        scene.toProduce.pollution += objects[curElem.name].production.pollution;
                        scene.storageMax.energy += objects[curElem.name].storage.energy;

                        scene.storageMax.water += objects[curElem.name].storage.water;
                        scene.storageMax.citizens += objects[curElem.name].storage.citizens;
                        scene.storageMax.money += objects[curElem.name].storage.money;
                        scene.storageMax.pollution += objects[curElem.name].storage.pollution;
                    }
                    checkRoad(n);
                }



            }
        }

    })
}


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
        scene.mapData = [];
        scene.mapData.push({
            name: "data",
            energy: 0,
            water: 0,
            citizens: 0,
            money: 0,
            pollution: 0,
        });



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
                                        if (objects[scene.curPlacedBlock].type !== "road" || objects[element.name].type !== "road") {
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
                        let curPlacedBlockCopy = scene.curPlacedBlock;

                        objCoords.forEach((curCoord) => {
                            scene.mapData.find((element) => {
                                if (element.x === curCoord.x && element.y === curCoord.y) {
                                    if (objects[scene.curPlacedBlock].type !== "road" || objects[element.name].type !== "road") {
                                        isOnBlock = true;
                                    }
                                }
                            });
                        });


                        if (!isOnBlock) {
                            if (obj.type === "road") {
                                let newRoadOrientation = scene.curPlacedBlock.substr(4, scene.curPlacedBlock.length);
                                for (let k = -1; k <= 1; k++) {
                                    for (let l = -1; l <= 1; l++) {
                                        if (k !== 0 || l !== 0) {
                                            scene.mapData.forEach((curData, n) => {
                                                let correctedBlockOrientation = curData.name.substr(4, curData.name.length);
                                                let coord = {
                                                    x: curData.x,
                                                    y: curData.y
                                                };
                                                let coordCart = fromIsoToCart(coord);
                                                if (coordCart.x === point.x + k * spriteSize && coordCart.y === point.y + l * spriteSize) {
                                                    if (objects[curData.name].type === 'road') {
                                                        if (k === 0 && l === -1) {
                                                            if (newRoadOrientation.indexOf("E") === -1) {
                                                                newRoadOrientation += "E";
                                                            }
                                                            if (correctedBlockOrientation.indexOf("W") === -1) {
                                                                correctedBlockOrientation += "W";
                                                            }
                                                        } else if (k === 0 && l === 1) {
                                                            if (newRoadOrientation.indexOf("W") === -1) {
                                                                newRoadOrientation += "W";
                                                            }
                                                            if (correctedBlockOrientation.indexOf("E") === -1) {
                                                                correctedBlockOrientation += "E";
                                                            }
                                                        } else if (k === -1 && l === 0) {
                                                            if (newRoadOrientation.indexOf("N") === -1) {
                                                                newRoadOrientation += "N";
                                                            }
                                                            if (correctedBlockOrientation.indexOf("S") === -1) {
                                                                correctedBlockOrientation += "S";
                                                            }
                                                        } else if (k === 1 && l === 0) {
                                                            if (newRoadOrientation.indexOf("S") === -1) {
                                                                newRoadOrientation += "S";
                                                            }
                                                            if (correctedBlockOrientation.indexOf("N") === -1) {
                                                                correctedBlockOrientation += "N";
                                                            }
                                                        }
                                                        correctedBlockOrientation = roadNameInOrder(correctedBlockOrientation);
                                                        sprite = scene.add.sprite(curData.x + borderOffset.x, curData.y + borderOffset.y, correctedBlockOrientation, false).setOrigin(0.5, 1);
                                                        sprite.depth = sprite.y - 50 * obj.height + mapSize * 100;
                                                        scene.mapData[n].name = correctedBlockOrientation;
                                                    }
                                                }
                                            });

                                        }
                                    }
                                }
                                newRoadOrientation = roadNameInOrder(newRoadOrientation);
                                scene.curPlacedBlock = newRoadOrientation;

                            }

                            let objToPush = {};
                            let nthInMapData = scene.mapData.length;
                            objCoords.forEach((curCoord, n) => {
                                if (n === 0) {
                                    objToPush = {
                                        name: scene.curPlacedBlock,
                                        nthElement: nthInMapData,
                                        x: curCoord.x,
                                        y: curCoord.y,
                                        isAddedToData: false,
                                        connectedToCityHall: false,
                                    };
                                } else {
                                    objToPush = {
                                        name: "invisible",
                                        nthElement: nthInMapData,
                                        nameLinkedElement: scene.curPlacedBlock,
                                        x: curCoord.x,
                                        y: curCoord.y,
                                        isAddedToData: false,
                                        connectedToCityHall: false,
                                    };
                                }

                                if (objToPush.name.substr(0, objToPush.name.length - 2) === "CityHall") {
                                    objToPush.connectedToCityHall = true;
                                    scene.toProduce.energy += objects[objToPush.name].production.energy;
                                    scene.toProduce.water += objects[objToPush.name].production.water;
                                    scene.toProduce.citizens += objects[objToPush.name].production.citizens;
                                    scene.toProduce.money += objects[objToPush.name].production.money;
                                    scene.toProduce.pollution += objects[objToPush.name].production.pollution;
                                    scene.storageMax.energy += objects[objToPush.name].storage.energy;

                                    scene.storageMax.water += objects[objToPush.name].storage.water;
                                    scene.storageMax.citizens += objects[objToPush.name].storage.citizens;
                                    scene.storageMax.money += objects[objToPush.name].storage.money;
                                    scene.storageMax.pollution += objects[objToPush.name].storage.pollution;
                                }
                                scene.mapData.push(objToPush);
                            });

                            if (scene.orientation === "N" || scene.orientation === "S") {
                                scene.tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x + 100 / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                            } else {
                                scene.tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x - 100 / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                            }
                            scene.tmpSprite.alpha = 1;
                            scene.tmpSprite.depth = scene.tmpSprite.y - 50 * obj.height + mapSize * 100;
                            scene.tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x + 100 / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);

                            scene.curPlacedBlock = curPlacedBlockCopy;

                            if (scene.tmpArrow !== undefined) {
                                scene.tmpArrow.destroy();
                            }
                        }
                    }, this);
                }
            }

            //display map
            scene.mapData.forEach((curData) => {
                if (curData.name !== undefined && objects[curData.name].type !== "other") {
                    let object = objects[curData.name];
                    let point = new Phaser.Geom.Point();


                    point.x = curData.x;
                    point.y = curData.y;
                    let sprite = scene.add.sprite(point.x + borderOffset.x + 100 / 4 * (object.width - object.height), point.y + borderOffset.y, curData.name, false).setOrigin(0.5, 1);
                    sprite.depth = sprite.y - 50 * object.height + mapSize * 100;

                    if(objects[curData.name].type === "building"){
                        scene.toProduce.energy += objects[curData.name].production.energy;
                        scene.toProduce.water += objects[curData.name].production.water;
                        scene.toProduce.citizens += objects[curData.name].production.citizens;
                        scene.toProduce.money += objects[curData.name].production.money;
                        scene.toProduce.pollution += objects[curData.name].production.pollution;

                        scene.storageMax.energy += objects[curData.name].storage.energy;
                        scene.storageMax.water += objects[curData.name].storage.water;
                        scene.storageMax.citizens += objects[curData.name].storage.citizens;
                        scene.storageMax.money += objects[curData.name].storage.money;
                        scene.storageMax.pollution += objects[curData.name].storage.pollution;
                    }


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
            console.log(scene.mapData);
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

            for (let i = 2; i < scene.mapData.length; i++) {
                scene.mapData[i].connectedToCityHall = false;
                if (objects[scene.mapData[i].name].type === "building" && scene.mapData[i].isAddedToData === true) {
                    scene.mapData[i].isAddedToData = false;
                    scene.toProduce.energy -= objects[scene.mapData[i].name].production.energy;
                    scene.toProduce.water -= objects[scene.mapData[i].name].production.water;
                    scene.toProduce.citizens -= objects[scene.mapData[i].name].production.citizens;
                    scene.toProduce.money -= objects[scene.mapData[i].name].production.money;

                    scene.toProduce.pollution -= objects[scene.mapData[i].name].production.pollution;
                    scene.storageMax.energy -= objects[scene.mapData[i].name].storage.energy;
                    scene.storageMax.water -= objects[scene.mapData[i].name].storage.water;
                    scene.storageMax.citizens -= objects[scene.mapData[i].name].storage.citizens;
                    scene.storageMax.money -= objects[scene.mapData[i].name].storage.money;
                    scene.storageMax.pollution -= objects[scene.mapData[i].name].storage.pollution;
                }
            }


            if (scene.mapData.length > 1) {
                checkRoad(1);
            }

            if (scene.mapData[0].energy + scene.toProduce.energy <= scene.storageMax.energy) {
                scene.mapData[0].energy += scene.toProduce.energy;
            } else if (scene.mapData[0].energy + scene.toProduce.energy > scene.storageMax.energy && scene.mapData[0].energy < scene.storageMax.energy) {
                scene.mapData[0].energy = scene.storageMax.energy;
            }

            if (scene.mapData[0].water + scene.toProduce.water <= scene.storageMax.water) {
                scene.mapData[0].water += scene.toProduce.water;
            } else if (scene.mapData[0].water + scene.toProduce.water > scene.storageMax.water && scene.mapData[0].water < scene.storageMax.water) {
                scene.mapData[0].water = scene.storageMax.water;
            }


            if (scene.mapData[0].citizens + scene.toProduce.citizens <= scene.storageMax.citizens) {
                scene.mapData[0].citizens += scene.toProduce.citizens;
            } else if (scene.mapData[0].citizens + scene.toProduce.citizens > scene.storageMax.citizens && scene.mapData[0].citizens < scene.storageMax.citizens) {
                scene.mapData[0].citizens = scene.storageMax.citizens;
            }

            if (scene.mapData[0].money + scene.toProduce.money <= scene.storageMax.money) {
                scene.mapData[0].money += scene.toProduce.money;
            } else if (scene.mapData[0].money + scene.toProduce.money > scene.storageMax.money && scene.mapData[0].money < scene.storageMax.money) {
                scene.mapData[0].money = scene.storageMax.money;
            }

            scene.mapData[0].pollution += scene.toProduce.pollution;


        }


    }
});

export default GameScene;