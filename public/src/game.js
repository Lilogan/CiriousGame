function fromCartToIso(point) {
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

function setTmpSpriteTint(coord, color) {
    scene.mapData.find(function (element) {
        if (element[0] === coord.x && element[1] === coord.y) {
            if (objects[element[2]].type !== "road" || objects[scene.curPlacedBlock].type !== "road") {
                scene.tmpSprite.tint = color;
                console.log("hit");
            }
        }
    });
}

let scene;
let windowWidth = $(window).width();
let windowHeight = $(window).height();
let spriteSize = 51;
let mapSize = 80; //size of map (square)
// let borderOffset = new Phaser.Geom.Point(0, 0);
let borderOffset = new Phaser.Geom.Point(windowWidth / 2, spriteSize / 2 + windowHeight / 2 - spriteSize * Math.floor(mapSize / 2));
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
        scene = this;
        scene.orientation = "W";
        scene.mapData = [];

        //objects on the map
        scene.curPlacedBlock = undefined; //object to place
        scene.scene.sendToBack();
        // load resources
        scene.load.crossOrigin = 'Anonymous';
    }
    ,

    create:

        function () {
            scene.pointer = this.input.activePointer;
            scene.keys = this.input.keyboard.addKeys('ESC, UP, DOWN, LEFT, RIGHT, Z, S,Q, D, R');

            //display the floor
            for (let i = 0; i < mapSize; i++) {
                for (let j = 0; j < mapSize; j++) {
                    let point = new Phaser.Geom.Point();
                    point.x = j * spriteSize;
                    point.y = i * spriteSize;
                    let isoPoint = fromCartToIso(point);
                    // scene.isoPoint = fromCartToIso(scene.point);
                    let sprite = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y + 14, "grass", false).setOrigin(0.5, 1);

                    // Preview d'un shop quand le curseur passe au dessus d'une tile, add au click
                    sprite.setInteractive({pixelPerfect: true});
                    sprite.on("pointerover", () => {
                        if (scene.curPlacedBlock !== undefined) {
                            let obj = objects[scene.curPlacedBlock];
                            scene.tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x + 100 / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                            if (obj.type === "building") {
                                scene.tmpArrow = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y, "arrow" + scene.orientation, false).setOrigin(0.5, 1);
                            }
                            scene.tmpSprite.alpha = 0.7;
                            scene.tmpSprite.depth = scene.tmpSprite.y - 50 * obj.height + mapSize * 100;
                            for(let k = 0; k < obj.width; k++) {
                                for (let l = 0; l < obj.height; l++) {
                                    let tmpPoint = {
                                        x: (j - l) * spriteSize,
                                        y: (i - k) * spriteSize
                                    };
                                    let tmpIsoPoint = fromCartToIso(tmpPoint);
                                    setTmpSpriteTint(tmpIsoPoint, 0xf44250);
                                }
                            }

                        }
                    }, this);
                    sprite.on("pointerout", () => {
                        if (scene.tmpSprite !== undefined) {
                            scene.tmpSprite.destroy();
                        }
                        if (scene.tmpArrow !== undefined) {
                            scene.tmpArrow.destroy();
                        }
                    }, this);
                    sprite.on("pointerdown", () => {
                        if (scene.curPlacedBlock !== undefined && !scene.pointer.justMoved) {
                            let isOnBlock = scene.mapData.find(function (element) {
                                if(element[2] !== undefined){
                                    let object = objects[element[2]];
                                    for(let k = 0; k < object.width; k++) {
                                        for (let l = 0; l < object.height; l++) {
                                            let tmpPoint = {
                                                x: (j - l) * spriteSize,
                                                y: (i - k) * spriteSize
                                            };
                                            let tmpIsoPoint = fromCartToIso(tmpPoint);
                                            if (element[0] === tmpIsoPoint.x && element[1] === tmpIsoPoint.y) {
                                                return element[2];
                                            }
                                        }
                                    }
                                }

                            });

                            if (isOnBlock === undefined) {
                                isOnBlock = false;
                            }
                            if (!isOnBlock || (objects[isOnBlock[2]].type === "road" && objects[scene.curPlacedBlock].type === "road")) {
                                let obj = objects[scene.curPlacedBlock];
                                scene.tmpSprite.alpha = 1;
                                scene.tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x + 100 / 4 * (obj.width - obj.height), isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                                // scene.mapData.push([isoPoint.x, isoPoint.y, scene.curPlacedBlock]);

                                for(let k = 0; k < obj.width; k++){
                                    for(let l = 0; l < obj.height; l++){
                                        let tmpPoint = {
                                            x: (j-l) * spriteSize,
                                            y: (i-k) *spriteSize
                                        };
                                        let tmpIsoPoint = fromCartToIso(tmpPoint);
                                        if(k === 0 && l === 0){
                                            scene.mapData.push([tmpIsoPoint.x, tmpIsoPoint.y, scene.curPlacedBlock]);

                                        }else{
                                            scene.mapData.push([tmpIsoPoint.x, tmpIsoPoint.y, "invisible"]);
                                        }
                                    }
                                }

                                // scene.mapData.forEach((curItem) => {
                                //     // if(objects[])
                                // })
                            }

                        }
                    }, this);
                }
            }

            //display elements
            scene.mapData.forEach((curData) => {
                if (curData[2] !== undefined) {
                    let object = objects[curData[2]];
                    let point = new Phaser.Geom.Point();
                    point.x = curData[0];
                    point.y = curData[1];
                    let sprite = scene.add.sprite(point.x+ borderOffset.x + 100 / 4 * (object.width - object.height), point.y + borderOffset.y, curData[2], false).setOrigin(0.5, 1);
                    sprite.depth = sprite.y - 50 * object.height + mapSize * 100;
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

    update: function () {
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
                    scene.tmpSprite = scene.add.sprite(scene.tmpSprite.x, scene.tmpSprite.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
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


    }
});

export default GameScene;