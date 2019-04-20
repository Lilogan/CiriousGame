let scene; // The scene
let gameScene; // The scene of game.js
let windowWidth = window.screen.width; // Window width
let windowHeight = window.screen.height; // Window height
let hudHeight; // Height of hud
let pointer; // The mouse pointer
let hudBuildGroup; // Group of all item who can be build displayed on hud
let buildingWindowWidth = 300; // Build hud width
let buildingWindowHeight = 400; // Build hud height
let buildHudState = false; // Is building hud displayed
let resourcesGroup; // Group of all resources displayed on hud
let isLast = false; // Is page in hud menu is the last one
let prevSecond = -1;

function addRectangle(x, y, width, height, color) {
    let graphics;
    let rectangle = new Phaser.Geom.Rectangle(x,y,width,height);
    graphics = scene.add.graphics({fillStyle: {color: color}});
    graphics.fillRectShape(rectangle);
    return graphics;
}

function addSprite(x, y, key, sizeX = 0, sizeY = 0, interactive = undefined, originX = undefined, originY = undefined) {
    let sprite = scene.add.sprite(x,y,key);
    if (sizeX !== 0 && sizeY !== 0){
        sprite.setDisplaySize(sizeX,sizeY);
    }
    if (originX !== undefined && originY !== undefined){
        sprite.setOrigin(originX,originY);
    }
    if(interactive || interactive === {}) {
        sprite.setInteractive(interactive);
    }

    return sprite;
}

function addText(x, y, key, size, color = "black", originX = undefined, originY = undefined){
    let text = scene.add.text(x,y,key);
    text.setColor(color);
    if(size !== 0){
        text.setFontSize(size);
    }
    if (originX !== undefined && originY !== undefined){
        text.setOrigin(originX,originY);
    }
    return text;
}

function addProgressBar(x, y, key, color, size, length, dataCurr, dataMax, dataVar){
    //Icon
    let icon = addSprite(x,y,key,1.6*size, 1.6*size, false,0,0);
    //Background
    let background = addRectangle(x+size*2,y+(size/3.75), length, size, 0x00000);
    //Progress
    let progress = addRectangle(x+size*2,y+(size/3.75), dataCurr*length/dataMax, size, color);
    //Text
    let text = addText((x+size*2)+ length * 0.12, y+(size/3.75)+ size / 15,dataCurr + "/" + dataMax + "(+" + dataVar + "/sec)",0.8*size, "white");

    return [icon,background,progress,text];
}

function showResources() {
    if (resourcesGroup !== undefined) {
        resourcesGroup.destroy(true);
    }
    resourcesGroup = scene.add.group("resourcesGroup");

    // Pollution progress bar
    resourcesGroup.addMultiple([
        //Background
        addRectangle(windowWidth - 640, windowHeight - 70, 52, 40, 0x000000, resourcesGroup),
        //Progress Bar
        addRectangle(windowWidth - 640, windowHeight - 30, 52, -Math.round(gameScene.mapData[0].pollution / (gameScene.mapData[0].citizens + 1) * 100) / 100 * 40 / 200, 0xb21a1a, resourcesGroup),
        //Icon
        addSprite(windowWidth - 640, windowHeight - 70, "pollutionIcon", 52, 40, false, 0, 0, resourcesGroup),
        //Text under
        addText(windowWidth - 640, windowHeight - 25, Math.round(gameScene.mapData[0].pollution / (gameScene.mapData[0].citizens + 1) * 100) / 100 + " mg/hbt", 15),
        //Percentage
        addText(windowWidth - 580, windowHeight - 55, "(" + Math.round(Math.round(gameScene.mapData[0].pollution / (gameScene.mapData[0].citizens + 1) * 100) / 100 / 20 * 100 * 100) / 100 + "%)", 15)

    ]);

    // Citizens number
    resourcesGroup.addMultiple([
        // Icon
        addSprite(windowWidth - 480, windowHeight - 70, "citizensIcon",24,24,false,0,0),
        // Text
        addText(windowWidth - 450, windowHeight - 65, gameScene.mapData[0].citizens + "/" + gameScene.storageMax.citizens + "",15),
    ]);

    // Money number
    resourcesGroup.addMultiple([
        // Icon
        addSprite(windowWidth - 480, windowHeight - 35, "moneyIcon", 24, 24,false,0,0),
        // Text
        addText(windowWidth - 450, windowHeight - 30, gameScene.mapData[0].money + "(+" + gameScene.toProduce.money + "/sec)",15)
    ]);

    // Energy progress bar
    resourcesGroup.addMultiple(addProgressBar(windowWidth - 300, windowHeight - 70, "energyIcon",0xffcc00,15,250, gameScene.mapData[0].energy, gameScene.storageMax.energy, gameScene.toProduce.energy));

    // Water progress bar
    resourcesGroup.addMultiple(addProgressBar(windowWidth - 300, windowHeight - 35, "waterIcon",0x008acf, 15,250, gameScene.mapData[0].water, gameScene.storageMax.water,gameScene.toProduce.water));

}

function buildHud(begin, buildType, curPage){}

let HudScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function HudScene() {
            Phaser.Scene.call(this, {key: "HudScene", active: false});
    },
    preload: function () {
        // Define some variables
        scene = this;
        gameScene = scene.scene.get("GameScene");
        hudHeight = gameScene.hudHeight;
        pointer = scene.input.activePointer;

        scene.hudBuildGroup = scene.add.group("buildHud");

        // Put hud scene in front of the others
        scene.scene.bringToTop();

    },
    create: function () {
        // Add rectangle for setting up the hud
        addRectangle(0, windowHeight - hudHeight, windowWidth, hudHeight, 0x000000);
        addRectangle(0, windowHeight - hudHeight + 1, windowWidth, hudHeight - 1,0xffffff);

        // Add hud's sprites and display them
        scene.buildBuildingIcon = addSprite(50, windowHeight - hudHeight + hudHeight / 2, "buildBuilding",60,60,{pixelPerfect: false});
        scene.deleteBuildingIcon = addSprite(130, windowHeight - hudHeight + hudHeight / 2, "deleteBuilding",60,60,{pixelPerfect: false});

        // Add function on click on these sprites
        scene.buildBuildingIcon.on("pointerdown", () => {
            if (!buildHudState) {
                buildHudState = true;
                gameScene.curPlacedBlock = undefined;
                //buildHud(0, "building", 0);
            } else {
                buildHudState = false;
                hudBuildGroup.destroy(true);
            }
        }, this);
        scene.deleteBuildingIcon.on("pointerdown", () => {
            gameScene.curPlacedBlock = "destroy";
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