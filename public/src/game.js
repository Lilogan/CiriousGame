let scene; // The scene
let windowWidth = $(window).width(); // window width
let windowHeight = $(window).height(); // window height
let spriteSize = 200; // sprite size (50) + space between sprites (1)
let mapSize = 10; // size of map (square)
let borderOffset = new Phaser.Geom.Point(0, -mapSize / 2 * 102 + 102 - 102 / 2); //offset to center the map
let prevSecond = -1; // ??
let hudHeight = 80; // bottom hud height
let contextualMenuWidth = 300;
let contextualMenuHeight = 400; // build hud height

// Contextual menu
let contextualHudGroup;

//limit of camera
let minPosCamX = 0;
let maxPosCamX = 0;
let minPosCamY = 0;
let maxPosCamY = 0;

// Set the notation for the orientation of sprites
let orientations = ["W", "N", "E", "S"];




function spriteOver(isoPoint, i, j) {
    if (scene.curPlacedBlock !== undefined && scene.curPlacedBlock !== "destroy") {
        let obj = objects[scene.curPlacedBlock];
        let objCoords = getCoordsFromObject(obj, j, i);

        if (scene.orientation === "N" || scene.orientation === "S") {
            scene.tmpSprite = scene.add.sprite(isoPoint.x + spriteSize / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
            if (obj.type === "building") {
                scene.tmpArrow = scene.add.sprite(isoPoint.x, isoPoint.y + borderOffset.y, "arrow" + scene.orientation, false).setOrigin(0.5, 1);
            }
        } else {
            scene.tmpSprite = scene.add.sprite(isoPoint.x - spriteSize / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
            if (obj.type === "building") {
                scene.tmpArrow = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y, "arrow" + scene.orientation, false).setOrigin(0.5, 1);
            }
        }
        scene.tmpSprite.alpha = 0.7;


        let vect = new Phaser.Geom.Point;
        vect.x = (-obj.height * 100 + obj.width * 100);
        vect.y = (-obj.height * 56 - obj.width * 56);
        scene.tmpSprite.depth = scene.tmpSprite.y - Math.sqrt(vect.x ** 2 + vect.y ** 2) / 2;
        if (obj.type === "building") {
            scene.tmpArrow.depth = scene.tmpSprite.depth + 1;
        }
        objCoords.forEach((curCoord) => {
            scene.mapData.forEach((element) => {
                if (element.x === curCoord.x && element.y === curCoord.y) {
                    if (objects[scene.curPlacedBlock].type !== "road" || objects[element.name].type !== "road") {
                        scene.tmpSprite.tint = 0xe20000;
                        scene.tint = 0xe20000;
                    }
                }
                let cartCoord = {
                    x: j * spriteSize / 2,
                    y: i * spriteSize / 2,
                };
                if ((scene.orientation === "E" || scene.orientation === "W") && (cartCoord.y - (obj.height - 1) * spriteSize / 2 < 0 || cartCoord.x - (obj.width - 1) * spriteSize / 2 < 0)) {
                    scene.tmpSprite.tint = 0xe20000;
                    scene.tint = 0xe20000;
                } else if ((scene.orientation === "N" || scene.orientation === "S") && (cartCoord.y - (obj.width - 1) * spriteSize / 2 < 0 || cartCoord.x - (obj.height - 1) * spriteSize / 2 < 0)) {
                    scene.tmpSprite.tint = 0xe20000;
                    scene.tint = 0xe20000;
                }
            });
        });
    }
}

function spriteOut() {
    scene.tint = undefined;
    if (scene.tmpSprite !== undefined) {
        scene.tmpSprite.destroy();
    }
    if (scene.tmpArrow !== undefined) {
        scene.tmpArrow.destroy();
    }
}

function spriteDown(point, isoPoint, i, j, sprite) {
    if (scene.curPlacedBlock !== undefined && scene.pointer.buttons === 1 && scene.curPlacedBlock !== "destroy") {
        let obj = objects[scene.curPlacedBlock];
        let objCoords = getCoordsFromObject(obj, j, i);
        let isOnBlock = false;
        let curPlacedBlockCopy = scene.curPlacedBlock;

        objCoords.forEach((curCoord) => {
            scene.mapData.find((element) => {
                if (element.x === curCoord.x && element.y === curCoord.y) {
                    if ((objects[scene.curPlacedBlock].type !== "road" || objects[element.name].type !== "road")) {
                        isOnBlock = true;
                    }
                    if ((objects[scene.curPlacedBlock].type === "road" && objects[element.name].type === "road")) {
                        removeSprite(element.nthElement, false);
                        scene.tmpSprite.destroy();
                        isOnBlock = false;
                    }
                }
            });
            let cartCoord = {
                x: j * spriteSize / 2,
                y: i * spriteSize / 2,
            };
            if ((scene.orientation === "E" || scene.orientation === "W") && (cartCoord.y - (obj.height - 1) * spriteSize / 2 < 0 || cartCoord.x - (obj.width - 1) * spriteSize / 2 < 0)) {
                isOnBlock = true;
            } else if ((scene.orientation === "N" || scene.orientation === "S") && (cartCoord.y - (obj.width - 1) * spriteSize / 2 < 0 || cartCoord.x - (obj.height - 1) * spriteSize / 2 < 0)) {
                isOnBlock = true;
            }
        });


        if (!isOnBlock) {
            let nthInMapData = scene.mapData.length;
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
                                if (coordCart.x === point.x + k * spriteSize / 2 && coordCart.y === point.y + l * spriteSize / 2) {
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
                                        removeSprite(curData.nthElement, false);
                                        curData.name = correctedBlockOrientation;
                                        if (scene.mapData[scene.mapData.length - 1].nthElement !== undefined) {
                                            curData.nthElement = scene.mapData[scene.mapData.length - 1].nthElement + 1;
                                        } else {
                                            curData.nthElement = 1;
                                        }
                                        scene.mapData.push(curData);
                                        let newRoad = scene.spritesGroup.create(curData.x + borderOffset.x, curData.y + borderOffset.y, correctedBlockOrientation, false).setOrigin(0.5, 1);
                                        let vect = new Phaser.Geom.Point;
                                        vect.x = (-obj.height * 100 + obj.width * 100);
                                        vect.y = (-obj.height * 56 - obj.width * 56);
                                        newRoad.depth = newRoad.y - Math.sqrt(vect.x ** 2 + vect.y ** 2) / 2;
                                        newRoad.setInteractive({pixelPerfect: true});
                                        newRoad.on("pointerdown", () => {
                                            if (scene.curPlacedBlock === "destroy") {
                                                removeSprite(curData.nthElement, false);
                                            }
                                        });
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
            objCoords.forEach((curCoord, n) => {
                if (n === 0) {
                    objToPush = {
                        name: scene.curPlacedBlock,
                        nthElement: nthInMapData,
                        nameLinkedElement: scene.curPlacedBlock,
                        x: curCoord.x,
                        y: curCoord.y,
                        isAddedToData: false,
                        connectedToCityHall: false,
                        yetProduced: 0
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
                        yetProduced: 0
                    };
                }

                if (objToPush.name.substr(0, objToPush.name.length - 2) === "cityhall") {
                    objToPush.connectedToCityHall = true;
                    scene.toProduce.energy += objects[objToPush.name].production.energy;
                    scene.toProduce.water += objects[objToPush.name].production.water;
                    scene.toProduce.citizens += objects[objToPush.name].production.citizens;
                    scene.toProduce.money += objects[objToPush.name].production.money;
                    scene.toProduce.pollution += objects[objToPush.name].production.pollution;

                    scene.storageMax.energy += objects[objToPush.name].storage.energy;
                    scene.storageMax.water += objects[objToPush.name].storage.water;
                    scene.storageMax.citizens += objects[objToPush.name].storage.citizens;
                    scene.storageMax.pollution += objects[objToPush.name].storage.pollution;
                }
                scene.mapData.push(objToPush);

            });
            let defSprite;
            if (scene.orientation === "N" || scene.orientation === "S") {
                defSprite = scene.spritesGroup.create(isoPoint.x + borderOffset.x + spriteSize / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
            } else {
                defSprite = scene.spritesGroup.create(isoPoint.x + borderOffset.x - spriteSize / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
            }

            defSprite.alpha = 1;
            let vect = new Phaser.Geom.Point;
            vect.x = (-obj.height * 100 + obj.width * 100);
            vect.y = (-obj.height * 55 - obj.width * 55);

            defSprite.depth = defSprite.y - Math.sqrt(vect.x ** 2 + vect.y ** 2) / 2;
            defSprite.setInteractive({pixelPerfect: true});

            defSprite.on("pointerdown", () => {
                if (scene.curPlacedBlock === "destroy") {
                    removeSprite(objToPush.nthElement, false);
                } else if (obj.type === "building") {
                    // Contextual menu
                    // openContextualMenu(obj);
                } else if (scene.curPlacedBlock !== undefined) {
                    spriteDown(point, isoPoint, i, j, defSprite);
                }
            });
            defSprite.on("pointerover", () => {
                if(scene.curPlacedBlock === "destroy"){
                    defSprite.tint = 0xe20000;
                }
            });
            defSprite.on("pointerout", () => {
                spriteOut();
                defSprite.tint = undefined;
            });
            scene.curPlacedBlock = curPlacedBlockCopy;

            if (scene.tmpArrow !== undefined) {
                scene.tmpArrow.destroy();
            }
        }
    }
}

function removeSprite(nth, keepInMapData) {
    let nthElement = -1;
    let curN = 0;
    let isDone = false;
    scene.mapData.forEach((curData) => {
        if (curData.name !== "invisible" && curData.nthElement === nth) {
            scene.spritesGroup.getChildren()[nthElement].destroy();
        }
        if (curData.nthElement === nth && keepInMapData === false && isDone === false) {
            scene.mapData.splice(curN, objects[curData.name].width * objects[curData.name].height);
            let curNthElem = 0;
            for (let i = 1; i < scene.mapData.length; i++) {
                if (scene.mapData[i].name !== "invisible") {
                    curNthElem++;
                }
                scene.mapData[i].nthElement = curNthElem;
            }
            isDone = true;
            curN--;
        }
        if (curData.name !== "invisible") {
            ++nthElement;
        }
        curN++;
    });
}

// Add all the resources every seconds
function addDataToResources(curElem, n) {
    scene.mapData[n].connectedToCityHall = true;
    if (curElem.isAddedToData === false && objects[curElem.name].type === "building") {
        scene.mapData[n].isAddedToData = true;

        scene.toProduce.energy += objects[curElem.name].production.energy;
        scene.toProduce.water += objects[curElem.name].production.water;
        scene.toProduce.citizens += objects[curElem.name].production.citizens;
        scene.toProduce.money += objects[curElem.name].production.money;
        if (scene.mapData[n].yetProduced < objects[curElem.name].pollutionMax) {
            scene.toProduce.pollution += objects[curElem.name].production.pollution;
            scene.mapData[n].yetProduced += objects[curElem.name].production.pollution;
        }

        scene.storageMax.energy += objects[curElem.name].storage.energy;
        scene.storageMax.water += objects[curElem.name].storage.water;
        scene.storageMax.citizens += objects[curElem.name].storage.citizens;
        scene.storageMax.pollution += objects[curElem.name].storage.pollution;
    }
}

// get isometric coordinates from cartesian
function fromCartToIso(point) {
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

// get cartesian coordinates from isometric
function fromIsoToCart(point) {
    let cartPoint = new Phaser.Geom.Point;
    cartPoint.x = point.x + (2 * point.y - point.x) / 2;
    cartPoint.y = (2 * point.y - point.x) / 2;

    return cartPoint;
}

// Make the road name in order
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

// Get all the points of an object
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
                x: (x - l) * spriteSize / 2,
                y: (y - k) * spriteSize / 2
            };
            let tmpIsoPoint = fromCartToIso(tmpPoint);
            coords.push(tmpIsoPoint);
        }
    }

    return coords;
}


// Check if a sprite is connected to the city hall through the road
function isSpriteConnectedToRoad(nInMapData) {
    let object = scene.mapData[nInMapData];
    let objectCoord = {
        x: object.x,
        y: object.y
    };
    let objectCart = fromIsoToCart(objectCoord);

    // Add recources needed for each elements
    scene.mapData.forEach((curElem, n) => {
        let curElemCoord = {
            x: curElem.x,
            y: curElem.y
        };


        if (n !== 0) {
            let curElemCart = fromIsoToCart(curElemCoord);

            if (curElem.connectedToCityHall === false && object.connectedToCityHall === true && (objects[curElem.name].type === "road" || objects[object.name].type === "road" || object.nthElement === curElem.nthElement)) {
                let objectOrientation = curElem.name.split("-")[1];
                if (curElem.name === "invisible") {
                    objectOrientation = curElem.nameLinkedElement.split("-")[1];
                }
                if (curElemCart.x === objectCart.x && curElemCart.y === objectCart.y - spriteSize / 2 && (objectOrientation === "W" || objectOrientation === undefined || object.nthElement === curElem.nthElement)) {
                    addDataToResources(curElem, n);
                    isSpriteConnectedToRoad(n);
                }
                if (curElemCart.x === objectCart.x && curElemCart.y === objectCart.y + spriteSize / 2 && (objectOrientation === "E" || objectOrientation === undefined || object.nthElement === curElem.nthElement)) {
                    addDataToResources(curElem, n);
                    isSpriteConnectedToRoad(n);
                }
                if (curElemCart.x === objectCart.x - spriteSize / 2 && curElemCart.y === objectCart.y && (objectOrientation === "S" || objectOrientation === undefined || object.nthElement === curElem.nthElement)) {

                    addDataToResources(curElem, n);
                    isSpriteConnectedToRoad(n);
                }
                if (curElemCart.x === objectCart.x + spriteSize / 2 && curElemCart.y === objectCart.y && (objectOrientation === "N" || objectOrientation === undefined || object.nthElement === curElem.nthElement)) {
                    addDataToResources(curElem, n);
                    isSpriteConnectedToRoad(n);
                }
            }
        }

    })
}

function openContextualMenu(obj) {
    if (contextualHudGroup !== undefined) {
        contextualHudGroup.destroy(true);
    }

    contextualHudGroup = scene.add.group("contextualHudGroup");

    // Add to the contextual menu every Geom and Text
    let contextualMenuBackgroundRec = new Phaser.Geom.Rectangle(windowWidth - contextualMenuWidth, windowHeight - contextualMenuHeight - hudHeight, contextualMenuWidth, contextualMenuHeight);
    let contextualMenuBackground = scene.add.graphics({key: "graph", fillStyle: {color: 0xffffff}});
    contextualHudGroup.add(contextualMenuBackground);
    contextualMenuBackground.fillRectShape(contextualMenuBackgroundRec);
}

let GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
        function GameScene() {
            Phaser.Scene.call(this, {key: "GameScene"});
        },

    preload: function () {
        scene = this; // The scene
        //initialisation of useful variables
        scene.cameras.main.centerOn(0, 0);
        scene.orientation = "W"; // Default orrientation
        scene.pointer = this.input.activePointer; // Our cursor
        scene.keys = this.input.keyboard.addKeys('ESC, UP, DOWN, LEFT, RIGHT, Z, S, Q, D, R, M');
        scene.spritesGroup = scene.add.group("spritesGroup");
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


        scene.curPlacedBlock = undefined; //object to place
        scene.scene.sendToBack(); // Put the scene behind the hud

        scene.load.crossOrigin = 'Anonymous';
    },

    create: function () {
        minPosCamX = scene.cameras.main.scrollX - (mapSize / 2 * spriteSize - spriteSize - windowWidth / 2);
        maxPosCamX = scene.cameras.main.scrollX + (mapSize / 2 * spriteSize - spriteSize - windowWidth / 2);
        minPosCamY = scene.cameras.main.scrollY - (mapSize / 2 * 102 / 2 - 102 / 2);
        maxPosCamY = scene.cameras.main.scrollY + (mapSize / 2 * 102 / 2 - 102 / 2);

        //display the floor and prepare the map making
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                let point = new Phaser.Geom.Point();
                point.x = j * spriteSize / 2;
                point.y = i * spriteSize / 2;
                let isoPoint = fromCartToIso(point);
                let sprite = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y + 18, "grass", false).setOrigin(0.5, 1);
                sprite.depth = -100 * mapSize;
                // preview a building with mouse and change tint if necessary space on map is not free
                sprite.setInteractive({pixelPerfect: true});

                sprite.on("pointerover", () => {
                    spriteOver(isoPoint, i, j);
                }, this);


                //destroy previewed building
                sprite.on("pointerout", () => {
                    spriteOut();
                }, this);


                //create a building if necessary space on map is free
                sprite.on("pointerdown", () => {
                    spriteDown(point, isoPoint, i, j, sprite);
                }, this);
            }
        }

        //display map
        scene.mapData.forEach((curData) => {
            if (curData.name === "data") {
                scene.mapData[0].energy = curData.energy;
                scene.mapData[0].water = curData.water;
                scene.mapData[0].citizens = curData.citizens;
                scene.mapData[0].money = curData.money;
                scene.mapData[0].pollution = curData.pollution;
            }
            if (curData.name !== undefined && objects[curData.name].type !== "other") {
                let object = objects[curData.name];
                let point = new Phaser.Geom.Point();


                point.x = curData.x;
                point.y = curData.y;
                let sprite;
                if (scene.orientation === "N" || scene.orientation === "S") {
                    sprite = scene.spritesGroup.create(point.x + borderOffset.x + spriteSize / 4 * (object.width - object.height), point.y + borderOffset.y, curData.name, false).setOrigin(0.5, 1);
                } else {
                    sprite = scene.spritesGroup.create(point.x + borderOffset.x - spriteSize / 4 * (object.width - object.height), point.y + borderOffset.y, curData.name, false).setOrigin(0.5, 1);
                }
                let vect = new Phaser.Geom.Point;
                vect.x = (-object.height * 100 + object.width * 100);
                vect.y = (-object.height * 55 - object.width * 55);
                sprite.depth = sprite.y - Math.sqrt(vect.x ** 2 + vect.y ** 2) / 2;
            }
        });

        // Zoom camera
        window.addEventListener("wheel", (e) => {
            minPosCamX = -50 * mapSize + borderOffset.x / scene.cameras.main.zoom - 50;
            minPosCamY = -spriteSize / 2 * mapSize + (windowHeight - borderOffset.y) / scene.cameras.main.zoom;


            if (e.deltaY < 0 && scene.cameras.main.zoom < 1) {
                scene.cameras.main.zoomTo(scene.cameras.main.zoom + 0.35 * (scene.cameras.main.zoom), 100);
            } else if (e.deltaY > 0 && scene.cameras.main.zoom > 0.25) {
                scene.cameras.main.zoomTo(scene.cameras.main.zoom - 0.35 * (scene.cameras.main.zoom), 100);
            }
        });

    },

    update: function (timer) {
        //move camera
        if (scene.pointer.isDown && scene.pointer.justMoved && scene.pointer.buttons === 1) {
            let isMovableX = true;
            let isMovableY = true;
            if (scene.cameras.main.scrollY - (scene.pointer.y - scene.pointer.prevPosition.y) <= minPosCamY || scene.cameras.main.scrollY - (scene.pointer.y - scene.pointer.prevPosition.y) >= maxPosCamY) {
                isMovableY = false;
            }

            if (scene.cameras.main.scrollX - (scene.pointer.x - scene.pointer.prevPosition.x) <= minPosCamX || scene.cameras.main.scrollX - (scene.pointer.x - scene.pointer.prevPosition.x) >= maxPosCamX) {
                isMovableX = false;
            }
            if (isMovableX) {
                scene.cameras.main.scrollX -= (scene.pointer.x - scene.pointer.prevPosition.x) / scene.cameras.main.zoom;
            }
            if (isMovableY) {
                scene.cameras.main.scrollY -= (scene.pointer.y - scene.pointer.prevPosition.y) / scene.cameras.main.zoom;
            }
        }

        if ((scene.keys.UP.isDown || scene.keys.Z.isDown) && scene.cameras.main.scrollY > minPosCamY) {
            for (let i = 0; i < 500; i++) {
                scene.cameras.main.scrollY -= 0.017;
            }
        }
        if ((scene.keys.DOWN.isDown || scene.keys.S.isDown) && scene.cameras.main.scrollY < maxPosCamY) {
            for (let i = 0; i < 500; i++) {
                scene.cameras.main.scrollY += 0.017;
            }
        }

        if ((scene.keys.LEFT.isDown || scene.keys.Q.isDown) && scene.cameras.main.scrollX > minPosCamX) {
            for (let i = 0; i < 500; i++) {
                scene.cameras.main.scrollX -= 0.017;
            }
        }


        if ((scene.keys.RIGHT.isDown || scene.keys.D.isDown) && scene.cameras.main.scrollX < maxPosCamX) {
            for (let i = 0; i < 500; i++) {
                scene.cameras.main.scrollX += 0.017;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(scene.keys.M)) {
            scene.scene.pause("GameScene");
            scene.scene.launch("InGameMenuScene");
        }

        if (scene.pointer.buttons === 2) {
            if (scene.curPlacedBlock !== undefined) {
                scene.curPlacedBlock = undefined;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(scene.keys.R)) {
            console.log(scene.mapData);
            if (scene.curPlacedBlock !== undefined) {
                let object = objects[scene.curPlacedBlock];
                if (object!== undefined && object.type === "building") {
                    scene.orientation = orientations[(orientations.indexOf(scene.orientation) + 1) % 4];

                    scene.curPlacedBlock = scene.curPlacedBlock.replace(/.$/, scene.orientation);
                    scene.tmpSprite.destroy();
                    scene.tmpArrow.destroy();


                    if (scene.orientation === "N" || scene.orientation === "S") {
                        scene.tmpSprite = scene.add.sprite(scene.tmpSprite.x + spriteSize / 2 * (object.width - object.height), scene.tmpSprite.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                        if (object.type === "building") {
                            scene.tmpArrow = scene.add.sprite(scene.tmpArrow.x, scene.tmpArrow.y, "arrow" + scene.orientation, false).setOrigin(0.5, 1);
                        }
                    } else {
                        scene.tmpSprite = scene.add.sprite(scene.tmpSprite.x - spriteSize / 2 * (object.width - object.height), scene.tmpSprite.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                        if (object.type === "building") {
                            scene.tmpArrow = scene.add.sprite(scene.tmpArrow.x, scene.tmpArrow.y, "arrow" + scene.orientation, false).setOrigin(0.5, 1);
                        }
                    }
                    scene.tmpSprite.alpha = 0.7;
                    if (scene.tint !== undefined) {
                        scene.tmpSprite.tint = scene.tint;
                    }

                    let vect = new Phaser.Geom.Point;
                    vect.x = (-object.height * 100 + object.width * 100);
                    vect.y = (-object.height * 55 - object.width * 55);
                    scene.tmpSprite.depth = scene.tmpSprite.y - Math.sqrt(vect.x ** 2 + vect.y ** 2) / 2;
                    scene.tmpArrow.depth = scene.tmpSprite.depth + 1;
                }
            }
        }

        if (Phaser.Input.Keyboard.JustDown(scene.keys.ESC)) {
            scene.scale.stopFullscreen();
        }


        if (Math.round(timer / 1000) !== prevSecond) {
            prevSecond = Math.round(timer / 1000);
            for (let i = 2; i < scene.mapData.length; i++) {
                scene.mapData[i].connectedToCityHall = false;
                if (objects[scene.mapData[i].name].type === "building" && scene.mapData[i].isAddedToData === true) {
                    scene.mapData[i].isAddedToData = false;
                    scene.toProduce.energy = 0;
                    scene.toProduce.water = 0;
                    scene.toProduce.citizens = objects["cityhall-S"].production.citizens;
                    scene.toProduce.money = 0;
                    scene.toProduce.pollution = 0;


                    scene.storageMax.energy -= objects[scene.mapData[i].name].storage.energy;
                    scene.storageMax.water -= objects[scene.mapData[i].name].storage.water;
                    scene.storageMax.citizens -= objects[scene.mapData[i].name].storage.citizens;
                    scene.storageMax.pollution -= objects[scene.mapData[i].name].storage.pollution;
                }
            }


            if (scene.mapData.length >= 2) {
                isSpriteConnectedToRoad(1);
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

            scene.mapData[0].money += scene.toProduce.money;
            scene.mapData[0].pollution += scene.toProduce.pollution;
        }


        //level
        if(scene.mapData.length > 1 && scene.mapData[0].curLevel === 0){
            scene.mapData[0].curLevel = 1;
        }
    }
});

export default GameScene;