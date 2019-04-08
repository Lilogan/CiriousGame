let windowWidth = window.screen.width; // window width
let windowHeight = window.screen.height; // window height
let hudHeight = 80; // bottom hud height
let buildingWindowWidth = 300; // build hud height
let buildingWindowHeight = 400; // build hud height
let scene; // This scene
let buildHudState = false; //is building hud displayed
let hudBuildGroup; //group of all elements of current displayed hud
let resourcesGroup; //group of all elements of current displayed hud
let isLast = false; //check if page in hud menu is the last one
let gameScene; // The game scene
let prevSecond = -1;

function nbElement(name) {
    let nb = 0;
    console.log(name);
    gameScene.mapData.forEach((curData) => {
        if (curData.name === name) {
            nb++
        }
    });
    if(objects[name].nbMax === 0){
        return -1;
    }else{
        return nb;
    }
}

function buildHud(begin, buildType, curPage) {
    //reset the hud
    if (hudBuildGroup !== undefined) {
        hudBuildGroup.destroy(true);
    }

    // ??
    isLast = false;
    hudBuildGroup = scene.add.group("buildHud");
    let nbElementOfGoodType = 0;

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
    buildMenuBuildingRec.on('pointerdown', function () {
        buildHud(0, "building", 0)
    });

    let buildMenuBuildingText = scene.add.text(170, windowHeight - hudHeight - buildingWindowHeight + 5, "Building");
    hudBuildGroup.add(buildMenuBuildingText);

    let buildMenuEchapRec = scene.add.sprite(275, windowHeight - hudHeight - buildingWindowHeight, "closeHud");
    buildMenuEchapRec.setOrigin(0, 0);
    hudBuildGroup.add(buildMenuEchapRec);
    buildMenuEchapRec.setInteractive();
    buildMenuEchapRec.on('pointerdown', function () {
        buildHudState = false;
        hudBuildGroup.destroy(true);
    });


    // ???
    let curLine = 0;
    let curPos = 0;
    let nbElementSet = 0;
    let values = 1;

    for (let i = 0; i < Object.values(objects).length; i++) {
        let curObject = Object.values(objects)[i];
        let curIndex = Object.keys(objects)[i];
        if (curObject.type === buildType && curObject.isIcon === true && curObject.level <= gameScene.mapData[0].curLevel && nbElement(curIndex) < curObject.nbMax) {
            nbElementOfGoodType++;
        }
    }
    //get 12 elements from begin and display them
    while (nbElementSet < 12 && values !== undefined) {
        values = Object.values(objects)[begin + curPos];
        let index = Object.keys(objects)[begin + curPos];
        if (index !== undefined && values.type === buildType && values.isIcon === true && values !== undefined && values.level <= gameScene.mapData[0].curLevel&& nbElement(index) < values.nbMax) {
            scene.sprite = hudBuildGroup.create(50 - (3 * curLine - nbElementSet) * 100, windowHeight - hudHeight - buildingWindowHeight + 110 + curLine * 90, index + "Icon");
            scene.sprite.setOrigin(0.5, 1);
            if (values.type === "road") {
                scene.sprite.setDisplaySize(80, 41);
            } else {
                scene.sprite.setDisplaySize(70, 70);
            }
            scene.sprite.setInteractive();
            scene.sprite.on("pointerdown", () => {
                gameScene.orientation = "W";
                gameScene.curPlacedBlock = index;
                hudBuildGroup.destroy(true);
            });

            let iconName = scene.add.text(50 - (3 * curLine - nbElementSet) * 100, windowHeight - hudHeight - buildingWindowHeight + 115 + curLine * 90, values.name);
            iconName.setColor("black");
            iconName.setOrigin(0.5, 0);
            iconName.setFontSize(9);
            hudBuildGroup.add(iconName);

            if (nbElementSet % 3 === 2) {
                curLine += 1;
            }
            nbElementSet++;
        }

        if (nbElementOfGoodType === nbElementSet + 12 * curPage && values !== undefined && values.isIcon === true) {
            isLast = true;
        }
        curPos++;
    }
    if (!isLast) {
        scene.sprite = hudBuildGroup.create(250, windowHeight - hudHeight - 20, "nextPage");
        scene.sprite.setInteractive();
        scene.sprite.on("pointerdown", () => {
            hudBuildGroup.destroy(true);
            buildHud(curPos, buildType, curPage + 1);
        });
    }
    if (begin !== 0) {
        scene.sprite = hudBuildGroup.create(50, windowHeight - hudHeight - 20, "previousPage");
        scene.sprite.setInteractive();
        scene.sprite.on("pointerdown", () => {
            let nbFind = 12;
            let newBegin = curPos;
            for (let i = curPos; i > 0; i--) {
                if (Object.values(objects)[i].type === buildType) {
                    nbFind--;
                }
                if (nbFind > 0) {
                    newBegin--;
                }
            }
            hudBuildGroup.destroy(true);
            buildHud(newBegin, buildType, curPage - 1);
        });
    }
}

function showResources() {
    if (resourcesGroup !== undefined) {
        resourcesGroup.destroy(true);
    }

    resourcesGroup = scene.add.group("resourcesGroup");

    // Show pollution progress bar
    let maxRecPollution = new Phaser.Geom.Rectangle(windowWidth - 640, windowHeight - 70, 52, 40);
    let colorMaxRecPollution = scene.add.graphics({key: "graph", fillStyle: {color: 0x000000}});
    resourcesGroup.add(colorMaxRecPollution);
    colorMaxRecPollution.fillRectShape(maxRecPollution);

    let currentRecPollution = new Phaser.Geom.Rectangle(windowWidth - 640, windowHeight - 30, 52, -Math.round(gameScene.mapData[0].pollution / (gameScene.mapData[0].citizens + 1) * 100) / 100 * 40 / 20);
    let colorCurrentRecPollution = scene.add.graphics({key: "graph", fillStyle: {color: 0xb21a1a}});
    resourcesGroup.add(colorCurrentRecPollution);
    colorCurrentRecPollution.fillRectShape(currentRecPollution);

    let hudPollutionIcon = scene.add.sprite(windowWidth - 640, windowHeight - 70, "pollutionIcon");
    hudPollutionIcon.setOrigin(0, 0);
    hudPollutionIcon.setDisplaySize(52, 40);

    let pollutionProgressBarText = scene.add.text(windowWidth - 640, windowHeight - 25, Math.round(gameScene.mapData[0].pollution / (gameScene.mapData[0].citizens + 1) * 100) / 100 + " mg/hbt");
    pollutionProgressBarText.setColor("black");
    pollutionProgressBarText.setFontSize(15);
    resourcesGroup.add(pollutionProgressBarText);

    let pollutionProgressBarPercentage = scene.add.text(windowWidth - 580, windowHeight - 55, "(" + Math.round(Math.round(gameScene.mapData[0].pollution / (gameScene.mapData[0].citizens + 1) * 100) / 100 / 20 * 100 * 100) / 100 + "%)");
    pollutionProgressBarPercentage.setColor("black");
    pollutionProgressBarPercentage.setFontSize(15);
    resourcesGroup.add(pollutionProgressBarPercentage);

    // Show citizens number
    let hudCitizensIcon = scene.add.sprite(windowWidth - 480, windowHeight - 70, "citizensIcon");
    hudCitizensIcon.setOrigin(0, 0);
    hudCitizensIcon.setDisplaySize(23, 23);
    resourcesGroup.add(hudCitizensIcon);

    let citizensProgressBarText = scene.add.text(windowWidth - 450, windowHeight - 65, gameScene.mapData[0].citizens + "/" + gameScene.storageMax.citizens + "");
    citizensProgressBarText.setColor("black");
    citizensProgressBarText.setFontSize(15);
    resourcesGroup.add(citizensProgressBarText);

    // Show money progress bar
    let hudMoneyIcon = scene.add.sprite(windowWidth - 480, windowHeight - 35, "moneyIcon");
    hudMoneyIcon.setOrigin(0, 0);
    hudMoneyIcon.setDisplaySize(23, 23);
    resourcesGroup.add(hudMoneyIcon);

    let moneyProgressBarText = scene.add.text(windowWidth - 450, windowHeight - 30, gameScene.mapData[0].money + "(+" + gameScene.toProduce.money + "/sec)");
    moneyProgressBarText.setColor("black");
    moneyProgressBarText.setFontSize(15);
    resourcesGroup.add(moneyProgressBarText);


    // Show energy progress bar
    let hudEnergyIcon = scene.add.sprite(windowWidth - 300, windowHeight - 70, "energyIcon");
    hudEnergyIcon.setOrigin(0, 0);
    hudEnergyIcon.setDisplaySize(23, 23);
    resourcesGroup.add(hudEnergyIcon);

    let maxRecEnergy = new Phaser.Geom.Rectangle(windowWidth - 270, windowHeight - 66, 250, 15);
    let colorMaxRecEnergy = scene.add.graphics({key: "graph", fillStyle: {color: 0x000000}});
    resourcesGroup.add(colorMaxRecEnergy);
    colorMaxRecEnergy.fillRectShape(maxRecEnergy);

    let currentRecEnergy = new Phaser.Geom.Rectangle(windowWidth - 270, windowHeight - 66, gameScene.mapData[0].energy * 250 / gameScene.storageMax.energy, 15);
    let colorCurrentRecEnergy = scene.add.graphics({key: "graph", fillStyle: {color: 0xffcc00}});
    resourcesGroup.add(colorCurrentRecEnergy);
    colorCurrentRecEnergy.fillRectShape(currentRecEnergy);

    let energyProgressBarText = scene.add.text(windowWidth - 240, windowHeight - 65, gameScene.mapData[0].energy + "/" + gameScene.storageMax.energy + "(+" + gameScene.toProduce.energy + "/sec)");
    energyProgressBarText.setColor("white");
    energyProgressBarText.setFontSize(12);
    resourcesGroup.add(energyProgressBarText);


    // Show water progress bar
    let hudWaterIcon = scene.add.sprite(windowWidth - 300, windowHeight - 35, "waterIcon");
    hudWaterIcon.setOrigin(0, 0);
    hudWaterIcon.setDisplaySize(23, 23);
    resourcesGroup.add(hudWaterIcon);

    let maxRecWater = new Phaser.Geom.Rectangle(windowWidth - 270, windowHeight - 31, 250, 15);
    let colorMaxRecWater = scene.add.graphics({key: "graph", fillStyle: {color: 0x000000}});
    resourcesGroup.add(colorMaxRecWater);
    colorMaxRecWater.fillRectShape(maxRecWater);

    let currentRecWater = new Phaser.Geom.Rectangle(windowWidth - 270, windowHeight - 31, gameScene.mapData[0].water * 250 / gameScene.storageMax.water, 15);
    let colorCurrentRecWater = scene.add.graphics({key: "graph", fillStyle: {color: 0x008acf}});
    resourcesGroup.add(colorCurrentRecWater);
    colorCurrentRecWater.fillRectShape(currentRecWater);

    let waterProgressBarText = scene.add.text(windowWidth - 240, windowHeight - 30, gameScene.mapData[0].water + "/" + gameScene.storageMax.water + "(+" + gameScene.toProduce.water + "/sec)");
    waterProgressBarText.setColor("white");
    waterProgressBarText.setFontSize(12);
    resourcesGroup.add(waterProgressBarText);
}

let HudScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function HudScene() {
            Phaser.Scene.call(this, {key: "HudScene", active: false});

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
        scene.buildBuildingIcon = scene.add.sprite(50, windowHeight - hudHeight + hudHeight / 2, "buildBuilding");
        scene.deleteBuildingIcon = scene.add.sprite(130, windowHeight - hudHeight + hudHeight / 2, "deleteBuilding");

        scene.buildBuildingIcon.setDisplaySize(60, 60);
        scene.buildBuildingIcon.setInteractive({pixelPerfect: false});

        scene.deleteBuildingIcon.setDisplaySize(60, 60);
        scene.deleteBuildingIcon.setInteractive({pixelPerfect: false});

        // Open the build hud when we click on the "wrench and hammer" icon
        scene.buildBuildingIcon.on("pointerdown", () => {
            if (!buildHudState) {
                buildHudState = true;
                gameScene.curPlacedBlock = undefined;
                buildHud(0, "building", 0);
            } else {
                buildHudState = false;
                hudBuildGroup.destroy(true);
            }
        }, this);

        scene.deleteBuildingIcon.on("pointerdown", () => {
            if (gameScene.curPlacedBlock !== "destroy") {
                gameScene.curPlacedBlock = "destroy";
            } else {
                gameScene.curPlacedBlock = "roadNSE";
            }
        });
    },
    update: function (timer) {
        if (Math.round(timer / 1000) + 0.5 !== prevSecond) {
            prevSecond = Math.round(timer / 1000) + 0.5;
            showResources();
        }
    }
});

export default HudScene;