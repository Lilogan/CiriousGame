function fromCartToIso(point) {
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

let scene;
let windowWidth = $(window).width();
let windowHeight = $(window).height();
let spriteSize = 51;
let mapSize = 5; //size of map (square)
let borderOffset = new Phaser.Geom.Point(windowWidth / 2, spriteSize / 2 + windowHeight / 2 - spriteSize * Math.floor(mapSize / 2));
let minPosCamX = -50*mapSize+borderOffset.x - 50;
let minPosCamY = -25*mapSize+borderOffset.x - 50;

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function GameScene() {
            Phaser.Scene.call(this, {key: "GameScene"});
        },
    preload: function () {
        scene = this;
        scene.mapData = [
            [
                1224,
                1479,
                "beachS"
            ]
        ];
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
            scene.keys = this.input.keyboard.addKeys('ESC, UP, DOWN, LEFT, RIGHT, Z, S,Q, D');

            //display the floor
            for (let i = 0; i < mapSize; i++) {
                for (let j = 0; j < mapSize; j++) {
                    let point = new Phaser.Geom.Point();
                    point.x = j * spriteSize;
                    point.y = i * spriteSize;
                    let isoPoint = fromCartToIso(point);
                    // scene.isoPoint = fromCartToIso(scene.point);
                    let sprite = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y + 14, "grass", false).setOrigin(0.5, 1);
                    let tmpSprite;

                    // Preview d'un shop quand le curseur passe au dessus d'une tile, add au click
                    sprite.setInteractive({pixelPerfect: true});
                    sprite.on("pointerover", () => {
                        if (scene.curPlacedBlock !== undefined) {
                            tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                            tmpSprite.alpha = 0.7;
                            tmpSprite.depth = tmpSprite.y + windowWidth;
                            scene.mapData.find(function (element) {
                                if (element[0] === point.x && element[1] === point.y) {
                                    if (objects[element[2]].type !== "road" || objects[scene.curPlacedBlock].type !== "road") {
                                        tmpSprite.tint = 0xf44250;
                                    }
                                }
                            });
                        }
                    }, this);
                    sprite.on("pointerout", () => {
                        if (tmpSprite !== undefined) {
                            tmpSprite.destroy();
                        }
                    }, this);
                    sprite.on("pointerdown", () => {
                        if (scene.curPlacedBlock !== undefined && !scene.pointer.justMoved) {
                            let isOnBlock = scene.mapData.find(function (element) {
                                if (element[0] === point.x && element[1] === point.y) {
                                    return element[2];
                                }
                            });

                            if (isOnBlock === undefined) {
                                isOnBlock = false;
                            }
                            if (!isOnBlock || (objects[isOnBlock[2]].type === "road" && objects[scene.curPlacedBlock].type === "road")) {
                                tmpSprite.alpha = 1;
                                tmpSprite = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y, scene.curPlacedBlock, false).setOrigin(0.5, 1);
                                scene.mapData.push([point.x, point.y, scene.curPlacedBlock]);
                            }

                        }
                    }, this);
                }
            }

            //display elements
            scene.mapData.forEach((curData) => {
                let object = objects[curData[2]];
                let point = new Phaser.Geom.Point();
                point.x = curData[0];
                point.y = curData[1];
                let isoPoint = fromCartToIso(point);
                let sprite = scene.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y, curData[2], false).setOrigin(0.5, 1);
                sprite.depth = sprite.y + windowWidth;
            });

            // Zoom camera
            window.addEventListener("wheel", (e) => {
                minPosCamX = -50*mapSize+borderOffset.x/scene.cameras.main.zoom - 50;
                minPosCamY = (-50*mapSize)/scene.cameras.main.zoom ;
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

        if ((scene.keys.LEFT.isDown || scene.keys.Q.isDown) && scene.cameras.main.scrollX > minPosCamX ) {
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


    }
});

export default GameScene;