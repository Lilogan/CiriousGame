let scene; // The scene
let gameScene; // The scene of game.js
let windowWidth = window.screen.width; // Window width
let windowHeight = window.screen.height; // Window height
let hudHeight; // Height of hud
let pointer; // The mouse pointer
let hudBuildGroup; // Group of all item who can be build displayed on hud
let resourcesGroup; // Group of all resources displayed on hud
let buildHudWidth = 300; // Build hud width
let buildHudHeight = 400; // Build hud height
let buildHudIconSize = 70; // Size of build hud icon
let buildHudSpace = 30; // Space between two icons
let buildHudState = false; // Is building hud displayed
let removeIcon;
let prevSecond = -1;

function addRectangle(x, y, width, height, color) /* Create rectangle */ {
    let graphics;
    // Object
    let rectangle = new Phaser.Geom.Rectangle(x,y,width,height);
    // Graphics
    graphics = scene.add.graphics({fillStyle: {color: color}});
    // Add graphics to object
    graphics.fillRectShape(rectangle);

    return graphics;
}

function addSprite(x, y, key, sizeX = 0, sizeY = 0, interactive = undefined, originX = undefined, originY = undefined) /* Create sprite */ {
    // Sprite + coord
    let sprite = scene.add.sprite(x,y,key);
    // Size
    if (sizeX !== 0 && sizeY !== 0){
        sprite.setDisplaySize(sizeX,sizeY);
    }
    // Origin
    if (originX !== undefined && originY !== undefined){
        sprite.setOrigin(originX,originY);
    }
    // Interactive
    if(interactive || interactive === {}) {
        sprite.setInteractive(interactive);
    }

    return sprite;
}

function addText(x, y, key, size = 0, color = "black", originX = undefined, originY = undefined) /* Create text */ {
    // Text + coord
    let text = scene.add.text(x,y,key);
    // Color
    text.setColor(color);
    // Size (0 no change)
    if(size !== 0){
        text.setFontSize(size);
    }
    // Origin
    if (originX !== undefined && originY !== undefined){
        text.setOrigin(originX,originY);
    }

    return text;
}

function addProgressBar(x, y, key, color, size, length, dataCurr, dataMax, dataVar) /* Create progress bar */ {
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

function showResources() /* Display resources */ {
    // Reset resources
    if (resourcesGroup !== undefined) {
        resourcesGroup.destroy(true);
    }

    // Create resources group
    resourcesGroup = scene.add.group("resourcesGroup");

    // Pollution progress bar
    resourcesGroup.addMultiple([
        //Background
        addRectangle(windowWidth - 640, windowHeight - 70, 52, 40, 0x000000, resourcesGroup),
        //Progress Bar
        addRectangle(windowWidth - 640, windowHeight - 30, 52, -Math.round(gameScene.data.pollution / (gameScene.data.citizens + 1) * 100) / 100 * 40 / 200, 0xb21a1a, resourcesGroup),
        //Icon
        addSprite(windowWidth - 640, windowHeight - 70, "pollutionIcon", 52, 40, false, 0, 0, resourcesGroup),
        //Text under
        addText(windowWidth - 640, windowHeight - 25, Math.round(gameScene.data.pollution / (gameScene.data.citizens + 1) * 100) / 100 + " mg/hbt", 15),
        //Percentage
        addText(windowWidth - 580, windowHeight - 55, "(" + Math.round(Math.round(gameScene.data.pollution / (gameScene.data.citizens + 1) * 100) / 100 / 20 * 100 * 100) / 100 + "%)", 15)

    ]);

    // Citizens number
    resourcesGroup.addMultiple([
        // Icon
        addSprite(windowWidth - 480, windowHeight - 70, "citizensIcon",24,24,false,0,0),
        // Text
        addText(windowWidth - 450, windowHeight - 65, gameScene.data.citizens + "/" + gameScene.storageMax.citizens + "",15),
    ]);

    // Money number
    resourcesGroup.addMultiple([
        // Icon
        addSprite(windowWidth - 480, windowHeight - 35, "moneyIcon", 24, 24,false,0,0),
        // Text
        addText(windowWidth - 450, windowHeight - 30, gameScene.data.money + "(+" + gameScene.toProduce.money + "/sec)",15)
    ]);

    // Energy progress bar
    resourcesGroup.addMultiple(addProgressBar(windowWidth - 300, windowHeight - 70, "energyIcon",0xffcc00,15,250, gameScene.data.energy, gameScene.storageMax.energy, gameScene.toProduce.energy));

    // Water progress bar
    resourcesGroup.addMultiple(addProgressBar(windowWidth - 300, windowHeight - 35, "waterIcon",0x008acf, 15,250, gameScene.data.water, gameScene.storageMax.water,gameScene.toProduce.water));

}

function nbBuildingMap(name) /* Count number of a building who be place*/ {
    let nb = 0;
    gameScene.mapData.forEach((curData) => {
        console.log(name);
        console.log(curData);
        if (curData.name === name) {
            nb++;
        }
    });
    return nb;
}

function buildHud(curPage) /* Display the build hud */ {
    //Reset hud
    if (hudBuildGroup !== undefined) {
        hudBuildGroup.destroy(true);
    }

    // Define of some variables
    let buildingAvailable = [];
    let buildHudMaxElement = (buildHudWidth*buildHudHeight) / Math.pow((buildHudIconSize+buildHudSpace),2);
    let step = buildHudIconSize + buildHudSpace;
    let lastPage = true;

    // Create the hud build group
    hudBuildGroup = scene.add.group("buildHud");


    // Create all graph for the build hud and add to a group
    let hudGraph = [
        // Background
        addRectangle(0, windowHeight - buildHudHeight - hudHeight, buildHudWidth, buildHudHeight,0xffffff),
        // Header
        addRectangle(0, windowHeight - hudHeight - buildHudHeight,buildHudWidth,25,0x293133),
        // Title
        addText((buildHudWidth - 25) / 2, windowHeight - hudHeight - buildHudHeight + 5, "Building", 0,"white",0.5,0),
        // Close
        addSprite(buildHudWidth - 25, windowHeight - hudHeight - buildHudHeight, "closeHud", 0,0, {}, 0, 0)
    ];
    hudBuildGroup.addMultiple(hudGraph);

    // Add function for close the build hud
    hudGraph[3].on('pointerdown', function () {
        buildHudState = false;
        gameScene.curPlacedBlock = undefined;
        hudBuildGroup.destroy(true);
    });

    // Take all building who can be place
    for (let i = 0; i < Object.values(objects).length; i++) {
        let curObject = Object.values(objects)[i];
        if (curObject.type === "building" /*&& curObject.level <= gameScene.data.curLevel*/) {
            buildingAvailable.push(Object.keys(objects)[i]);
        }
    }

    // Take element for the page
    if(curPage > 1){
        buildingAvailable.splice(0, buildHudMaxElement * (curPage-1));
    }

    // Remove excess buildings
    if(buildingAvailable.length > buildHudMaxElement) {
        lastPage = false;
        buildingAvailable.splice(buildHudMaxElement, buildingAvailable.length - buildHudMaxElement);
    }

    //Show all building available
    buildingAvailable.forEach(function(element, index) {
        let col = index % (buildHudWidth/step);
        let line = Math.trunc(index /(buildHudWidth/step));
        let icon = [
            addSprite(step/2 + step * col, windowHeight - hudHeight - buildHudHeight + 40 + line * 9*step/10, element + "Icon",buildHudIconSize,buildHudIconSize,{},0.5,0),
            addText(step/2 + step * col, windowHeight - hudHeight - buildHudHeight + 40 + buildHudIconSize + line * 9*step/10, objects[element].name,step/10 - 1,"black",0.5,0)
        ];
        hudBuildGroup.addMultiple(icon);
        icon[0].on("pointerdown", () => {
            gameScene.orientation = "W";
            gameScene.curPlacedBlock = element;
            buildHudState = false;
            hudBuildGroup.destroy(true);
        });

    });

    // Add sprite for page up if it's needed
    if(curPage > 1) {
        let sprite = addSprite((buildHudWidth-25)/5, windowHeight - hudHeight - buildHudHeight,"previousPage",25,25,{},0.5, 0);
        hudBuildGroup.add(sprite);
        sprite.on("pointerdown", () => {
            hudBuildGroup.destroy(true);
            buildHud(curPage - 1);
        });
    }

    // Add sprite for page down if it's needed
    if(!lastPage){
        let sprite = addSprite(4*(buildHudWidth-25)/5, windowHeight - hudHeight - buildHudHeight,"nextPage",25,25,{},0.5, 0);
        hudBuildGroup.add(sprite);
        sprite.on("pointerdown", () => {
            hudBuildGroup.destroy(true);
            buildHud(curPage + 1);
        });
    }

}

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

        // Put hud scene in front of the others
        scene.scene.bringToTop();

    },
    create: function () {
        // Add rectangle for setting up the hud
        addRectangle(0, windowHeight - hudHeight, windowWidth, hudHeight, 0x000000);
        addRectangle(0, windowHeight - hudHeight + 1, windowWidth, hudHeight - 1,0xffffff);

        // Add hud's sprites and display them
        let buildIcon = addSprite(50, windowHeight - hudHeight + hudHeight / 2, "buildBuilding",60,60,{pixelPerfect: false});
        removeIcon = addSprite(130, windowHeight - hudHeight + hudHeight / 2, "deleteBuilding",60,60,{pixelPerfect: false});
        let roadIcon = addSprite(210, windowHeight - hudHeight + hudHeight / 2, "buildRoad",60,60,{pixelPerfect: false});

        // Add function on click on these sprites
        buildIcon.on("pointerdown", () => {
            if (!buildHudState) {
                buildHudState = true;
                gameScene.curPlacedBlock = undefined;
                buildHud(1);
            } else {
                buildHudState = false;
                hudBuildGroup.destroy(true);
            }
        },);
        removeIcon.on("pointerdown", () => {
            gameScene.curPlacedBlock = "destroy";
            removeIcon.setTintFill(0xe20000);
        });
        roadIcon.on("pointerdown", () => {
            gameScene.curPlacedBlock = "road";
        });

    },
    update: function (timer) {
        // Update Resources
        if (Math.round(timer / 1000) + 0.5 !== prevSecond) {
            prevSecond = Math.round(timer / 1000) + 0.5;
            showResources();
        }

        // Clear the tint of destroy icon
        if(removeIcon.isTinted && gameScene.curPlacedBlock !== "destroy"){
            removeIcon.clearTint();
        }
    }
});

export default HudScene;