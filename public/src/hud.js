let windowWidth = $(window).width(); // window width
let windowHeight = $(window).height(); // window height
let hudHeight = 80; // bottom hud height
let buildingWindowWidth = 300; // build hud height
let buildingWindowHeight = 400; // build hud height
let scene; // This scene
let buildHudState = false; //is building hud displayed
let hudBuildGroup; //group of all elements of current displayed hud
let testGroup; //group of all elements of current displayed hud
let isLast = false; //check if page in hud menu is the last one
let gameScene; // The game scene
let prevSecond = -1;

function buildHud(begin, buildType, curPage) {
    //reset the hud
    if (hudBuildGroup !== undefined) {
        hudBuildGroup.destroy(true);
    }

    // ??
    isLast = false;
    hudBuildGroup = scene.add.group("buildHud");
    let nbElementOfGoodType  = 0;

    // Add to the hud groupe every Geom and Text for the build hud
    let hudBackgroundRec = new Phaser.Geom.Rectangle(0, windowHeight - buildingWindowHeight - hudHeight, buildingWindowWidth, buildingWindowHeight);
    let hudBackground = scene.add.graphics({key: "graph", fillStyle: {color: 0xffffff}});
    hudBuildGroup.add(hudBackground);
    hudBackground.fillRectShape(hudBackgroundRec);

    let buildMenuRoadRec = scene.add.sprite(0, windowHeight - hudHeight - buildingWindowHeight, "tabHud");
    buildMenuRoadRec.setOrigin(0, 0);
    hudBuildGroup.add(buildMenuRoadRec);
    buildMenuRoadRec.setInteractive();
    buildMenuRoadRec.on('pointerdown', function () {
        buildHud(0, "road", 0);
    });

    let buildMenuRoadsText = scene.add.text(42.5, windowHeight - hudHeight - buildingWindowHeight + 5, "Roads");
    hudBuildGroup.add(buildMenuRoadsText);

    let buildMenuBuildingRec = scene.add.sprite(138, windowHeight - hudHeight - buildingWindowHeight, "tabHud");
    buildMenuBuildingRec.setOrigin(0, 0);
    hudBuildGroup.add(buildMenuBuildingRec);
    buildMenuBuildingRec.setInteractive();
    buildMenuBuildingRec.on('pointerdown', function(){
       buildHud(0, "building", 0)
    });

    let buildMenuBuildingText = scene.add.text(170, windowHeight - hudHeight - buildingWindowHeight + 5, "Building");
    hudBuildGroup.add(buildMenuBuildingText);

    let buildMenuEchapRec = scene.add.sprite(275, windowHeight - hudHeight - buildingWindowHeight, "closeHud");
    buildMenuEchapRec.setOrigin(0, 0);
    hudBuildGroup.add(buildMenuEchapRec);
    buildMenuEchapRec.setInteractive();
    buildMenuEchapRec.on('pointerdown', function(){
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

function showResources(){
    if (testGroup !== undefined) {
        testGroup.destroy(true);
    }

    testGroup = scene.add.group("testGroup");

    let hudWaterIcon = scene.add.sprite(200, windowHeight - 35, "waterIcon");
    hudWaterIcon.setOrigin(0, 0);
    hudWaterIcon.setDisplaySize(23, 23);
    testGroup.add(hudWaterIcon);

    let testRec = new Phaser.Geom.Rectangle(230, windowHeight - 31, 250, 15);
    let testGraph1 = scene.add.graphics({key: "graph", fillStyle: {color: 0x000000}});
    testGroup.add(testGraph1);
    testGraph1.fillRectShape(testRec);

    let testRec2 = new Phaser.Geom.Rectangle(230, windowHeight - 31, gameScene.mapData[0].water * 250 / gameScene.storageMax.water, 15);
    let testGraph2 = scene.add.graphics({key: "graph", fillStyle: {color: 0x008acf}});
    testGroup.add(testGraph2);
    testGraph2.fillRectShape(testRec2);

    let testText = scene.add.text(260, windowHeight - 30, ""+ gameScene.mapData[0].water +"/"+ gameScene.storageMax.water +"(+"+ gameScene.toProduce.water +"/sec)");
    testText.setColor("white");
    testText.setFontSize(12);
    testGroup.add(testText);


    let hudEnergyIcon = scene.add.sprite(200, windowHeight - 70, "energyIcon");
    hudEnergyIcon.setOrigin(0, 0);
    hudEnergyIcon.setDisplaySize(23, 23);
    testGroup.add(hudEnergyIcon);

    let testRec11 = new Phaser.Geom.Rectangle(230, windowHeight - 66, 250, 15);
    let testGraph11 = scene.add.graphics({key: "graph", fillStyle: {color: 0x000000}});
    testGroup.add(testGraph11);
    testGraph11.fillRectShape(testRec11);

    let testRec12 = new Phaser.Geom.Rectangle(230, windowHeight - 66, gameScene.mapData[0].energy * 250 / gameScene.storageMax.energy, 15);
    let testGraph12 = scene.add.graphics({key: "graph", fillStyle: {color: 0xffcc00}});
    testGroup.add(testGraph12);
    testGraph12.fillRectShape(testRec12);

    let testText10 = scene.add.text(260, windowHeight - 65, ""+ gameScene.mapData[0].energy +"/"+ gameScene.storageMax.energy +"(+"+ gameScene.toProduce.energy +"/sec)");
    testText10.setColor("white");
    testText10.setFontSize(12);
    testGroup.add(testText10);

    let hudPollutionIcon = scene.add.sprite(500, windowHeight - 70, "pollutionIcon");
    hudPollutionIcon.setOrigin(0, 0);
    hudPollutionIcon.setDisplaySize(23, 23);
    testGroup.add(hudPollutionIcon);

    let testRec21 = new Phaser.Geom.Rectangle(530, windowHeight - 66, 250, 15);
    let testGraph21 = scene.add.graphics({key: "graph", fillStyle: {color: 0x000000}});
    testGroup.add(testGraph21);
    testGraph21.fillRectShape(testRec21);

    //à terminer
    let testRec22 = new Phaser.Geom.Rectangle(530, windowHeight - 66, gameScene.mapData[0].pollution/gameScene.mapData[0].citizens * 250 / gameScene.storageMax.pollution, 15);
    let testGraph22 = scene.add.graphics({key: "graph", fillStyle: {color: 0x5b4d19}});
    testGroup.add(testGraph22);
    testGraph22.fillRectShape(testRec22);
}

let HudScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function HudScene() {
            Phaser.Scene.call(this, {key: "HudScene", active: true});

        },
    preload: function () {
        scene = this;
        gameScene = scene.scene.get("GameScene");
        scene.scene.bringToTop();
    },

    create: function () {
        isLast = false;
        scene.pointer = scene.input.activePointer;

        // Add the bottom black rectangle for top border
        scene.hudBorder = new Phaser.Geom.Rectangle(0, windowHeight - hudHeight, windowWidth, hudHeight);
        scene.graphicsBorder = scene.add.graphics({fillStyle: {color: 0x000000}});
        scene.graphicsBorder.fillRectShape(scene.hudBorder);

        // Add the bottom white rectangle for the hud
        scene.hud = new Phaser.Geom.Rectangle(0, windowHeight - hudHeight + 1, windowWidth, hudHeight - 1);
        scene.graphics = scene.add.graphics({fillStyle: {color: 0xffffff}});
        scene.graphics.fillRectShape(scene.hud);

        // Add hud's sprites and display them
        scene.deleteBuildingIcon = scene.add.sprite(50, windowHeight - hudHeight + hudHeight / 2, "deleteBuilding");
        scene.buildBuildingIcon = scene.add.sprite(130, windowHeight - hudHeight + hudHeight / 2, "buildBuilding");

        scene.deleteBuildingIcon.setDisplaySize(60, 60);
        scene.deleteBuildingIcon.setInteractive({pixelPerfect: false});

        scene.buildBuildingIcon.setDisplaySize(60, 60);
        scene.buildBuildingIcon.setInteractive({pixelPerfect: false});

        // Open the build hud when we click on the "wrench and hammer" icon
        scene.buildBuildingIcon.on("pointerdown", () => {
            if (!buildHudState) {
                buildHudState = true;
                gameScene.curPlacedBlock = undefined;
                buildHud(0, "road",0);
            } else {
                buildHudState = false;
                hudBuildGroup.destroy(true);
            }
        }, this);

        scene.deleteBuildingIcon.on("pointerdown", () => {
            if(gameScene.curPlacedBlock !== "destroy"){
                gameScene.curPlacedBlock = "destroy";
            }else{
                gameScene.curPlacedBlock = undefined;
            }
        });
    },
    update: function (timer) {
        if (Math.round(timer / 1000)+0.5 !== prevSecond) {
            prevSecond = Math.round(timer / 1000)+0.5;
            showResources();
        }
    }});

export default HudScene;