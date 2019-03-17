let windowWidth = $(window).width(); // window width
let windowHeight = $(window).height(); // window height
let hudHeight = 50; // bottom hud height
let buildingWindowWidth = 300; // build hud height
let buildingWindowHeight = 400; // build hud height
let scene; // The scene
let roadHudState = false; //is road hud displayed
let buildHudState = false; //is building hud displayed
let hudBuildGroup; //group of all elements of current displayed hud
let isLast = false; //check if page in hud menu is the last one
let gameScene; // ??

function buildHud(begin, buildType) {
    //reset the hud
    if (hudBuildGroup !== undefined) {
        hudBuildGroup.destroy(true);
    }

    // ??
    isLast = false;
    hudBuildGroup = scene.add.group("buildHud");
    gameScene = scene.scene.get("GameScene");


    // Add to the hud groupe every Geom and Text
    let hudBackgroundRec= new Phaser.Geom.Rectangle(0, windowHeight - buildingWindowHeight - hudHeight, buildingWindowWidth, buildingWindowHeight);
    let hudBackground = scene.add.graphics({key: "graph", fillStyle: {color: 0xffffff}});
    hudBuildGroup.add(hudBackground);
    hudBackground.fillRectShape(hudBackgroundRec);

    let buildMenuRoadsRec = new Phaser.Geom.Rectangle(0, windowHeight - hudHeight - buildingWindowHeight, 137, 25);
    let buildMenuRoads = scene.add.graphics({key: "graph", fillStyle: {color: 0x293133}});
    hudBuildGroup.add(buildMenuRoads);
    buildMenuRoads.fillRectShape(buildMenuRoadsRec);

    let buildMenuRoadsText = scene.add.text(42.5, windowHeight - hudHeight - buildingWindowHeight + 5, "Roads");
    hudBuildGroup.add(buildMenuRoadsText);

    let buildMenuBuildingRec = new Phaser.Geom.Rectangle(138, windowHeight - hudHeight - buildingWindowHeight, 137, 25);
    let buildMenuBuilding = scene.add.graphics({key: "graph", fillStyle: {color: 0x293133}});
    hudBuildGroup.add(buildMenuBuilding);
    buildMenuBuilding.fillRectShape(buildMenuBuildingRec);

    let buildMenuBuildingText = scene.add.text(170, windowHeight - hudHeight - buildingWindowHeight + 5, "Building");
    hudBuildGroup.add(buildMenuBuildingText);

    let buildMenuEchapRec = new Phaser.Geom.Rectangle(275, windowHeight - hudHeight - buildingWindowHeight, 25, 25);
    let buildMenuEchap = scene.add.graphics({key: "graph", fillStyle: {color: 0xFF0000}});
    hudBuildGroup.add(buildMenuEchap);
    buildMenuEchap.fillRectShape(buildMenuEchapRec);


    // ???
    let curLine = 0;
    let curPos = 0;
    let nbElementSet = 0;
    let values = 1;
    //get 12 elements from begin and display them
    while(nbElementSet < 12 && values !== undefined) {
        values = Object.values(objects)[begin+curPos];
        let index = Object.keys(objects)[begin+curPos];
        if (index !== undefined && values.type === buildType && values.isIcon === true) {
            scene.sprite = hudBuildGroup.create(60 - (3 * curLine - nbElementSet) * 90, windowHeight - hudHeight - buildingWindowHeight + 125 + curLine * 75, index+"Icon");
            scene.sprite.setOrigin(0.5,1);
            scene.sprite.setDisplaySize(70, 70);
            // scene.sprite.setScale(0.6);
            scene.sprite.setInteractive();
            scene.sprite.on("pointerdown", () => {
                gameScene.orientation = "W";
                gameScene.curPlacedBlock = index;
                hudBuildGroup.destroy(true);
            });
            if (nbElementSet % 3 === 2) {
                curLine += 1;
            }
            nbElementSet++;
        } else {
            isLast = true;
        }
        curPos++;
    }

    // ça marche pas :'(
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
            Phaser.Scene.call(this, {key: "HudScene", active: true});

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

        scene.deleteBuildingIcon = scene.add.sprite(50, windowHeight - hudHeight + hudHeight / 2, "deleteBuilding");
        scene.buildBuildingIcon = scene.add.sprite(120, windowHeight - hudHeight + hudHeight / 2, "buildBuilding");

        scene.deleteBuildingIcon.setDisplaySize(45, 45);
        scene.buildBuildingIcon.setDisplaySize(45, 45);
        scene.graphics.fillRectShape(scene.hud);

        scene.buildBuildingIcon.setInteractive({pixelPerfect: false});

        // Ouvre le build hud quand on clique sur l'icon "tourne vis et mollette"
        scene.buildBuildingIcon.on("pointerdown", () => {
            if (!buildHudState) {
                buildHudState = true;
                roadHudState = true;
                gameScene.curPlacedBlock = undefined;
                buildHud(0, "road");
            } else {
                buildHudState = false;
                hudBuildGroup.destroy(true);
            }
        }, this);

        // Change d'onglet quand on clique sur "building" ou "road" dans le build hud
        scene.input.on('pointerdown', function (pointer) {
            if (pointer.x > 0 && pointer.x < 137 && pointer.y > windowHeight - hudHeight - buildingWindowHeight && pointer.y < windowHeight - hudHeight - buildingWindowHeight + 25 && buildHudState === true){
                buildHud(0, "road");
            } else if (pointer.x > 138 && pointer.x < 275 && pointer.y > windowHeight - hudHeight - buildingWindowHeight && pointer.y < windowHeight - hudHeight - buildingWindowHeight + 25 && buildHudState === true){
                buildHud(0, "building");
            } else if (pointer.x > 275 && pointer.x < 300 && pointer.y > windowHeight - hudHeight - buildingWindowHeight && pointer.y < windowHeight - hudHeight - buildingWindowHeight + 25 && buildHudState === true){
                buildHudState = false;
                hudBuildGroup.destroy(true);
            }
        });
    }
});

export default HudScene;