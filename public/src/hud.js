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

function buildHud(begin, buildType, curPage) {
    //reset the hud
    if (hudBuildGroup !== undefined) {
        hudBuildGroup.destroy(true);
    }

    // ??
    isLast = false;
    hudBuildGroup = scene.add.group("buildHud");
    gameScene = scene.scene.get("GameScene");
    let nbElementOfGoodType  = 0;

    // Add to the hud groupe every Geom and Text for the build hud
    let hudBackgroundRec= new Phaser.Geom.Rectangle(0, windowHeight - buildingWindowHeight - hudHeight, buildingWindowWidth, buildingWindowHeight);
    let hudBackground = scene.add.graphics({key: "graph", fillStyle: {color: 0xffffff}});
    hudBuildGroup.add(hudBackground);
    hudBackground.fillRectShape(hudBackgroundRec);

    let buildMenuRoadRec = scene.add.sprite(0, windowHeight - hudHeight - buildingWindowHeight, "tabHud");
    buildMenuRoadRec.setOrigin(0, 0);
    hudBuildGroup.add(buildMenuRoadRec);
    buildMenuRoadRec.setInteractive();
    buildMenuRoadRec.on('pointerdown', function (pointer) {
        buildHud(0, "road", 0);
    });

    let buildMenuRoadsText = scene.add.text(42.5, windowHeight - hudHeight - buildingWindowHeight + 5, "Roads");
    hudBuildGroup.add(buildMenuRoadsText);

    let buildMenuBuildingRec = scene.add.sprite(138, windowHeight - hudHeight - buildingWindowHeight, "tabHud");
    buildMenuBuildingRec.setOrigin(0, 0);
    hudBuildGroup.add(buildMenuBuildingRec);
    buildMenuBuildingRec.setInteractive();
    buildMenuBuildingRec.on('pointerdown', function(pointer){
       buildHud(0, "building", 0)
    });

    let buildMenuBuildingText = scene.add.text(170, windowHeight - hudHeight - buildingWindowHeight + 5, "Building");
    hudBuildGroup.add(buildMenuBuildingText);

    let buildMenuEchapRec = scene.add.sprite(275, windowHeight - hudHeight - buildingWindowHeight, "closeHud");
    buildMenuEchapRec.setOrigin(0, 0);
    hudBuildGroup.add(buildMenuEchapRec);
    buildMenuEchapRec.setInteractive();
    buildMenuEchapRec.on('pointerdown', function(pointer){
        buildHudState = false;
        hudBuildGroup.destroy(true);
    });


    // ???
    let curLine = 0;
    let curPos = 0;
    let nbElementSet = 0;
    let values = 1;

    for(let i = 0; i < Object.values(objects).length; i++){
        let curObject = Object.values(objects)[i];
        if(curObject.type === buildType && curObject.isIcon === true){
            nbElementOfGoodType++;
        }
    }
    //get 12 elements from begin and display them
    while(nbElementSet < 12 && values !== undefined) {
        values = Object.values(objects)[begin+curPos];
        let index = Object.keys(objects)[begin+curPos];
        if (index !== undefined && values.type === buildType && values.isIcon === true && values !== undefined) {
            scene.sprite = hudBuildGroup.create(60 - (3 * curLine - nbElementSet) * 90, windowHeight - hudHeight - buildingWindowHeight + 125 + curLine * 75, index+"Icon");
            scene.sprite.setOrigin(0.5,1);
            scene.sprite.setDisplaySize(70, 70);
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
        }

        if(nbElementOfGoodType === nbElementSet + 12*curPage && values !== undefined && values.isIcon === true){
            isLast = true;
        }
        curPos++;
    }
    if (!isLast) {
        scene.sprite = hudBuildGroup.create(250, windowHeight - hudHeight - 20, "nextPage");
        scene.sprite.setInteractive();
        scene.sprite.on("pointerdown", () => {
            hudBuildGroup.destroy(true);
            console.log(curPos);
            buildHud(curPos, buildType, curPage+1);
        });
    }
    if (begin !== 0) {
        scene.sprite = hudBuildGroup.create(50, windowHeight - hudHeight - 20, "previousPage");
        scene.sprite.setInteractive();
        scene.sprite.on("pointerdown", () => {
            let nbFind = 12;
            let newBegin = curPos;
            for(let i = curPos; i > 0; i--){
                if(Object.values(objects)[i].type === buildType){
                    nbFind--;
                }
                if(nbFind > 0){
                    newBegin--;
                }
            }
            hudBuildGroup.destroy(true);
            buildHud(newBegin, buildType, curPage-1);
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

        // Add the bottom white rectangle for the hud
        scene.hud = new Phaser.Geom.Rectangle(0, windowHeight - hudHeight, windowWidth, hudHeight);
        scene.graphics = scene.add.graphics({fillStyle: {color: 0xffffff}});
        scene.graphics.fillRectShape(scene.hud);

        // Add hud's sprites and display them
        scene.deleteBuildingIcon = scene.add.sprite(50, windowHeight - hudHeight + hudHeight / 2, "deleteBuilding");
        scene.buildBuildingIcon = scene.add.sprite(120, windowHeight - hudHeight + hudHeight / 2, "buildBuilding");
        scene.deleteBuildingIcon.setDisplaySize(45, 45);
        scene.buildBuildingIcon.setDisplaySize(45, 45);
        scene.buildBuildingIcon.setInteractive({pixelPerfect: false});

        // Open the build hud when we click on the "wrench and hammer" icon
        scene.buildBuildingIcon.on("pointerdown", () => {
            if (!buildHudState) {
                buildHudState = true;
                roadHudState = true;
                gameScene.curPlacedBlock = undefined;
                buildHud(0, "road",0);
            } else {
                buildHudState = false;
                hudBuildGroup.destroy(true);
            }
        }, this);
    }
});

export default HudScene;