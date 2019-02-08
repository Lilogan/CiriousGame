let windowWidth = $(window).width();
let windowHeight = $(window).height();
let hudHeight = 50;
let scene;
let roadHudState = false; //is road hud displayed
let buildingHudState = false; //is building hud displayed
let hudBuildGroup; //group of all elements of current displayed hud
let isLast = false; //check if page in hud menu is the last one
let gameScene;

function buildHud(begin, buildType) {
    //reset the hud
    if (hudBuildGroup !== undefined) {
        hudBuildGroup.destroy(true);
    }

    isLast = false;
    hudBuildGroup = scene.add.group("buildHud");
    gameScene = scene.scene.get("GameScene");
    let background = new Phaser.Geom.Rectangle(150, windowHeight - 400 - hudHeight, 300, 400);
    let graphics = scene.add.graphics({key: "graph", fillStyle: {color: 0x5b5b5b}});
    hudBuildGroup.add(graphics);
    graphics.fillRectShape(background);
    graphics.setAlpha(0.5);

    let curLine = 0;
    let curPos = 0;
    let nbElementSet = 0;
    let values = 1;
    //get 24 elements from begin and display them
    while(nbElementSet < 24 && values !== undefined) {
        values = Object.values(objects)[begin+curPos];
        let index = Object.keys(objects)[begin+curPos];
        if (index !== undefined && values.type === buildType) {
            scene.sprite = hudBuildGroup.create(200-(4*curLine-nbElementSet)*70,windowHeight-hudHeight-330+curLine*55, index+"Icon");
            scene.sprite.setOrigin(0.5,1);
            scene.sprite.setScale(0.6);
            scene.sprite.setInteractive();
            scene.sprite.on("pointerdown", () => {
                gameScene.curPlacedBlock = index;
                hudBuildGroup.destroy(true);
            });
            if (nbElementSet % 4 === 3) {
                curLine += 1;
            }
            nbElementSet++;
        } else {
            isLast = true;
        }

        curPos++;

    }

    if (!isLast) {
        scene.nextPage = hudBuildGroup.create(350, windowHeight - hudHeight - 20, "nextPage");
        scene.nextPage.setInteractive();
        scene.nextPage.on("pointerdown", () => {
            hudBuildGroup.destroy(true);
            buildHud(begin + 24, buildType);
        });
    }
    if (begin !== 0) {
        scene.prevPage = hudBuildGroup.create(250, windowHeight - hudHeight - 20, "previousPage");
        scene.prevPage.setInteractive();
        scene.prevPage.on("pointerdown", () => {
            isLast = false;
            hudBuildGroup.destroy(true);
            buildHud(begin - 24, buildType);
        });
    }

}

var HudScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function HudScene() {
            Phaser.Scene.call(this, {key: "HudScene"});

        },
    preload: function () {
        scene = this;
        scene.scene.bringToTop();

    },

    create: function () {
        isLast = false;
        scene.pointer = scene.input.activePointer;
        gameScene = scene.scene.get("GameScene");


        scene.hud = new Phaser.Geom.Rectangle(0, windowHeight - hudHeight, windowWidth, hudHeight);
        scene.graphics = scene.add.graphics({fillStyle: {color: 0xffffff}});
        scene.graphics.setAlpha(0.8);

        scene.buildRoadIcon = scene.add.sprite(310, windowHeight - hudHeight + hudHeight / 2, "buildRoad");
        scene.buildBuildingIcon = scene.add.sprite(380, windowHeight - hudHeight + hudHeight / 2, "buildBuilding");

        scene.buildRoadIcon.setScale(0.5);
        scene.buildBuildingIcon.setScale(0.5);
        scene.graphics.fillRectShape(scene.hud);

        scene.buildRoadIcon.setInteractive({pixelPerfect: false});
        scene.buildBuildingIcon.setInteractive({pixelPerfect: false});

        scene.buildRoadIcon.on("pointerdown", () => {
            if (!roadHudState) {
                roadHudState = true;
                buildingHudState = false;
                gameScene.curPlacedBlock = undefined;
                buildHud(0, "road");
            } else if(hudBuildGroup !== undefined){
                roadHudState = false;
                hudBuildGroup.destroy(true);
            }
        }, this);

        scene.buildBuildingIcon.on("pointerdown", () => {
            if (!buildingHudState) {
                buildingHudState = true;
                roadHudState = false;
                gameScene.curPlacedBlock = undefined;
                buildHud(0, "building");
            } else {
                buildingHudState = false;
                hudBuildGroup.destroy(true);
            }
        }, this);
    },

    update: function () {

    }


});

export default HudScene;