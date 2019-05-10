let scene; // The scene
let camera; // The camera
let pointer; // The cursor
let controls; // Arrows control (up, down, right, left)
let tmpSprite; // Temp sprite for preview
let key; // Input keys
let cityhall; // The CityHall
let tmpPath = []; // The path for see if a building is connected to CityHall
let zoomMin = 0.25; // Minimal zoom
let zoomMax = 1; // Maximal zoom
let mapSize = 20; // Size of the map
let spriteWidth = 200; // Width of a floor
let spriteHeight = 18; // Height of a floor
let spriteDepth = 100; // Depth of a floor
let borders = 100; // Number of pixel around the map
let hudHeight = 80; // Hud Height
let orientation = ["W","N","E","S"];
let resetProduce = {
    energy: 0,
    water: 0,
    citizens: 0,
    money: 0,
    pollution: 0
};
let resetStorage = {
    energy: 0,
    water: 0,
    citizens: 0,
    pollution: 0
};
let prevSec = -1;

function download(content, fileName) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: "text/plain"});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function upload() {
    let input = document.createElement( "input");
    input.type = "file";
    input.accept = "text/plain";

    input.addEventListener('change', () => {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            let save = CryptoJS.AES.decrypt(reader.result, "EcoCity").toString(CryptoJS.enc.Utf8).split('/');
            let data = JSON.parse(save[1]);
            let map = JSON.parse(save[0]);
            reload(map,data);
        });
        reader.readAsText(input.files[0]);
    });
    input.click();

}

function reload(map,data){
    scene.spriteGroup.destroy(true);
    scene.spriteGroup = scene.add.group();

    scene.mapData.forEach((row, x) => {
        row.forEach((sprite, y)=>{
            spriteRemove(x,y);
        })
    });

    map.forEach((row) => {
        row.forEach((element) =>{
            if (element !== null) {
                let isoPoint = new Phaser.Geom.Point(element.x, element.y);
                let point = fromIsoToCart(isoPoint);
                point.x = Math.ceil(point.x * 2 / spriteWidth);
                point.y = Math.ceil(point.y * 2 / spriteWidth);
                if (element.name.search("road") !== -1){
                    scene.curPlacedBlock = "road";
                }else{
                    scene.curPlacedBlock = element.name;
                    let direction = element.textureKey.split('-')[1];
                    scene.spriteOrientation = orientation.indexOf(direction);

                }

                spritePreview(point.x, point.y,false);
                spritePut(point.x, point.y);
            }
        });
    });
    scene.curPlacedBlock = undefined;
    scene.data = data;
}

function addObjects(obj1,obj2,objMax = undefined) /* Adding two objects */ {
    let obj = {...obj1};
    Object.keys(obj2).map(function(a){
        if(objMax !== undefined && objMax[a] !== undefined  && (obj[a] + obj2[a]) > objMax[a]){
            obj[a] = objMax[a];
        }else {
            obj[a] += obj2[a];
        }
    });
    return obj;
}

function subObjects(obj1,obj2) /* Subtract two objects */ {
    let obj ={...obj1};
    Object.keys(obj2).map(function(a){
        obj[a] -= obj2[a];
    });
    return obj;
}

function cloneObjects(obj) /* Clone a object */{
    if (null == obj || "object" != typeof obj) return obj;
    let copy = obj.constructor();
    for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function fromCartToIso(point) /* Cartesian to Isometric */ {
    let isoPoint = new Phaser.Geom.Point;
    isoPoint.x = (point.x - point.y);
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}

function fromIsoToCart(point) /* Isometric to Cartesian */ {
    let cartPoint = new Phaser.Geom.Point;
    cartPoint.x = (2 * point.y + point.x) / 2;
    cartPoint.y = (2 * point.y - point.x) / 2;

    return cartPoint;
}

function roadNameOrder(name) {
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

function roadUpdate(x, y, updateNext = false, destroy = false) {
    let road = "road";
    let scan = [];
    let nextOrientation = ["E","S","W","N"];
    let range = [1,-1];

    range.forEach((add) => {
        if(y + add >= 0 && y + add < mapSize){
            scan.push(scene.mapData[x][y+add]);
        }else{
            scan.push(undefined);
        }
        if(x - add >= 0 && x - add < mapSize){
            scan.push(scene.mapData[x-add][y]);
        }else{
            scan.push(undefined);
        }
    });

    for (let id in scan){
        if (scan[id] !== undefined){
            if (scan[id].name.search("road") !== -1){
                road += orientation[id];
                if (updateNext){
                    if(destroy){
                        scan[id].name = scan[id].name.replace(nextOrientation[id],"");
                    }else {
                        scan[id].name += nextOrientation[id];
                        scan[id].name = roadNameOrder(scan[id].name);
                    }
                    scan[id].setTexture(scan[id].name);
                }
            }
        }
    }
    road = roadNameOrder(road);

    return road;
}

function getCoordsFromObject(obj, x, y) /* Get all the points of an object */ {
    // Get all places occupied by an object
    let points = [];
    for (let addY = 0; addY < obj.height; addY++){
        for (let addX = 0; addX < obj.width; addX++){
            if(x - addX < 0 || y - addY < 0){
                return [];
            }
            points.push(new Phaser.Geom.Point(x - addX, y - addY))
        }
    }
    return points
}

function spriteConnect(sprite)/* Check element around the sprite */{
    let points = sprite.data.points;
    let direction = sprite.data.orientation;
    let returned = [];

    points.forEach((point, id) => {
        let toCheck = [];
        // If it's a road
        if(direction === undefined) {
            let range = [-1, 1];
            range.forEach((add) => {
                if (point.x + add >= 0 && point.x + add < mapSize) {
                    let xPoint = Phaser.Geom.Point.Clone(point);
                    xPoint.x += add;
                    toCheck.push(xPoint);
                }
                if (point.y + add >= 0 && point.y + add < mapSize) {
                    let yPoint = Phaser.Geom.Point.Clone(point);
                    yPoint.y += add;
                    toCheck.push(yPoint);
                }
            });
        }
        // If orientation is W
        else if (direction === 0 && id < sprite.data.obj.width) {
            let nextPoint = Phaser.Geom.Point.Clone(point);
            nextPoint.y += 1;
            toCheck.push(nextPoint);
        }
        // If orientation is N
        else if (direction === 1 && (id + 1) % sprite.data.obj.width === 0) {
            let nextPoint = Phaser.Geom.Point.Clone(point);
            nextPoint.x -= 1;
            toCheck.push(nextPoint);
        }
        // If orientation is E
        else if (direction === 2 && id < sprite.data.obj.width * sprite.data.obj.height && id >= sprite.data.obj.width * (sprite.data.obj.height - 1)) {
            let nextPoint = Phaser.Geom.Point.Clone(point);
            nextPoint.y -= 1;
            toCheck.push(nextPoint);
        }
        // If orientation is S
        else if (direction === 3 && id % sprite.data.obj.width === 0) {
            let nextPoint = Phaser.Geom.Point.Clone(point);
            nextPoint.x += 1;
            toCheck.push(nextPoint);
        }

        toCheck.forEach((nextPoint) => {
            if (nextPoint.x >= 0 && nextPoint.x < mapSize && nextPoint.y >= 0 && nextPoint.y < mapSize) {
                let nextSprite = scene.mapData[nextPoint.x][nextPoint.y];
                if (nextSprite !== undefined && nextSprite !== sprite) {
                    returned.push(nextSprite);
                    if (nextSprite.name.search("road") !== -1) {
                        sprite.data.connected = true;
                    }
                }
            }
        });
    });

    return returned;

}

function spritePreview(x, y, force = true, isoPoint = undefined) /* Preview the selected sprite on coord */ {
    let obj = cloneObjects(objects[scene.curPlacedBlock]);

    if(scene.spriteOrientation % 2 === 1){
        [obj.height, obj.width] = [obj.width, obj.height];
    }

    let name = scene.curPlacedBlock;
    let points = getCoordsFromObject(obj,x,y);
    let putable = true;

    if(isoPoint === undefined){
        let origin = new Phaser.Geom.Point();
        origin.x = x * spriteWidth / 2;
        origin.y = y * spriteWidth / 2;
        isoPoint = fromCartToIso(origin);
    }

    if(points.length > 0){
        points.forEach((point) => {
            if (scene.mapData[point.x][point.y] !== undefined){
                putable = false;
            }
        });
    }else{
        putable = false;
    }
    console.log(putable);
    if(force || (putable && !force)) {
        if (scene.curPlacedBlock !== "road") {
            tmpSprite = scene.add.sprite(isoPoint.x, isoPoint.y - spriteHeight, name + "-" + orientation[scene.spriteOrientation], false).setOrigin(0.5 + (obj.width - obj.height) / 10, 1);
            tmpSprite.orientation = scene.spriteOrientation;
        } else {
            name = roadUpdate(x, y);
            tmpSprite = scene.add.sprite(isoPoint.x, isoPoint.y - spriteHeight, name, false).setOrigin(0.5, 1);
        }
        if (putable) {
            tmpSprite.points = points;
        } else {
            tmpSprite.setTint(0xe20000);
        }

        tmpSprite.alpha = 0.7;
        tmpSprite.depth = y + x - Math.min(obj.width , obj.height);
        tmpSprite.name = name;
        tmpSprite.obj = obj;
        tmpSprite.putable = putable;
    }

}

function spriteHide() /* Hide the previewed sprite */ {
    if (tmpSprite !== undefined) {
        tmpSprite.destroy();
        delete tmpSprite.data;
        tmpSprite = undefined;
    }
}

function spritePut(x,y) /* Place the previewed sprite */ {
    if(tmpSprite !== undefined && tmpSprite.putable === true) {
        let sprite = scene.add.sprite(tmpSprite.x, tmpSprite.y, tmpSprite.texture.key).setOrigin(tmpSprite.originX, tmpSprite.originY);
        let points = tmpSprite.points;
        sprite.setDataEnabled();
        sprite.data.obj = tmpSprite.obj;
        sprite.depth = tmpSprite.depth;
        sprite.name = tmpSprite.name;
        sprite.data.orientation = tmpSprite.orientation;
        sprite.data.connected = false;
        spriteHide();
        sprite.data.points = points;
        scene.spriteGroup.add(sprite);
        points.forEach((point) => {
            scene.mapData[point.x][point.y] = sprite;
        });

        if (sprite.name.search("cityhall") !== -1) {
            cityhall = sprite;
            sprite.data.connected = true;
        } else if (sprite.name.search("road") !== -1) {
            roadUpdate(x, y, true);
        } else {
            spriteConnect(sprite);
        }
        addResources();
    }
}

function spriteRemove(x,y) /* Remove the sprite on coord */ {
    let sprite = scene.mapData[x][y];
    if (sprite !== undefined) {
        if(sprite.data !== undefined) {
            let points = sprite.data.points;
            points.forEach((point) => {
                delete scene.mapData[point.x][point.y];
            });
        }
        if (sprite.name.search("road") !== -1) {
            roadUpdate(x,y,true,true);
        }else if (sprite.name.search("cityhall") !== -1){
            cityhall = undefined;
        }
        sprite.destroy();

        addResources();
    }
}

function addResources(sprite = undefined){
    let toCheck;

    if(sprite === undefined){
        if(cityhall !== undefined){
            sprite = cityhall;
            tmpPath = [];
            tmpPath.push(sprite.data.points[0]);
            scene.toProduce = addObjects(resetProduce, sprite.data.obj.production);
            scene.storageMax = addObjects(resetStorage, sprite.data.obj.storage);
        }else{
            scene.toProduce = cloneObjects(resetProduce);
            scene.storageMax = cloneObjects(resetStorage);
        }

    }

    if(sprite !== undefined) {
        toCheck = spriteConnect(sprite);
        toCheck.forEach((cSprite) => {
            if (cSprite !== undefined && cSprite !== sprite && !tmpPath.includes(cSprite.data.points[0])) {
                tmpPath.push(cSprite.data.points[0]);
                if (cSprite.name.search("road") !== -1) {
                    addResources(cSprite);
                } else {
                    spriteConnect(cSprite);
                    if(cSprite.data.connected){
                        scene.toProduce = addObjects(scene.toProduce, cSprite.data.obj.production);
                        scene.storageMax = addObjects(scene.storageMax, cSprite.data.obj.storage);
                    }

                }
            }
        });
    }
}

// const reverse = array => [...array].reverse();
// const compose = (a, b) => x => a(b(x));
//
// const flipMatrix = matrix => (
//     matrix[0].map((column, index) => (
//         matrix.map(row => row[index])
//     ))
// );
//
// const rotateMatrix = compose(flipMatrix, reverse);
// const rotateMatrixCounterClockwise = compose(reverse, flipMatrix);

let GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function GameScene() {
        Phaser.Scene.call(this, {key: "GameScene"});
    },
    preload: function () {
        // Define some variables
        scene = this;
        scene.hudHeight = hudHeight;
        scene.spriteOrientation = 0;
        scene.data = {
            energy: 0,
            water: 0,
            citizens: 0,
            money: 0,
            pollution: 0,
            curLevel: 0
        };
        pointer = scene.input.activePointer;
        camera = scene.cameras.main;
        key = this.input.keyboard.addKeys('Z, S, Q, D, R, M, L');

        // Create group of display sprite
        scene.spriteGroup = scene.add.group();

        // Variables for add resources
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
            pollution: 0
        };

        // Initialisation of the data
        if (scene.mapData === undefined) {
            scene.mapData = [];
            for (let i = 0; i < mapSize; i++) {
                scene.mapData[i] = new Array(mapSize);
            }
        }
    },
    create: function () {
        // Set the border of the world for the camera
        camera.setBounds(-(mapSize * spriteWidth / 2 + borders), -(spriteDepth + spriteHeight + borders/2), (mapSize * spriteWidth + 2 * borders), (mapSize * spriteDepth + spriteHeight + borders + hudHeight));
        // Center the camera
        camera.centerToBounds();
        // Set the minimal zoom if the map is too small
        zoomMin = Math.max(zoomMin, camera.width / camera.getBounds().width);

        // Set up arrows controls
        let cursors = scene.input.keyboard.createCursorKeys();
        let controlConfig = {
            camera: camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.5,
            drag: 0.4,
            maxSpeed: 1
        };
        controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        // Create the map with floors and add properties for adding building
        for (let j = 0; j < mapSize; j++) {
            for (let i = 0; i < mapSize; i++) {
                let point = new Phaser.Geom.Point();
                point.x = i * spriteWidth / 2;
                point.y = j * spriteWidth / 2;
                let isoPoint = fromCartToIso(point);
                let sprite = scene.add.sprite(isoPoint.x, isoPoint.y, "grass");
                sprite.setOrigin(0.5,1);
                sprite.depth = -10;
                sprite.setInteractive({draggable: true, pixelPerfect: true});

                // Preview the selected building and tint it if it's not placeable
                sprite.on("pointerover", () => {
                    if (scene.curPlacedBlock !== undefined && scene.curPlacedBlock !== "destroy") {
                        spritePreview(i, j,true, isoPoint);
                    }else if (scene.curPlacedBlock === "destroy"){
                        if (scene.mapData[i][j] !== undefined){
                            scene.mapData[i][j].setTint(0xe20000);
                        }
                    }

                });

                // Hide the previewed building and clear tint
                sprite.on("pointerout", () => {
                    spriteHide();
                    if (scene.mapData[i][j] !== undefined && scene.mapData[i][j].isTinted) {
                        scene.mapData[i][j].clearTint();
                    }
                });

                // Put the previewed building or destroy a building
                sprite.on("pointerdown", (pointer) => {
                    if (pointer.buttons === 1) {
                        if(scene.curPlacedBlock !== undefined) {
                            if (scene.curPlacedBlock === "destroy") {
                                spriteRemove(i, j);
                            } else if (tmpSprite !== undefined) {
                                if(tmpSprite.putable === true) {
                                    spritePut(i, j);
                                }
                            }
                        }
                    }
                });
            }
        }

        // Moving with the mouse
        scene.input.on('drag', (pointer) => {
            camera.scrollX += (pointer.prevPosition.x - pointer.x) / scene.cameras.main.zoom;
            camera.scrollY += (pointer.prevPosition.y - pointer.y) / scene.cameras.main.zoom;
        });

        // Modify zoom with the mouse wheel
        window.addEventListener("wheel", (e) => {
            if (e.deltaY < 0) {
                camera.zoomTo(Phaser.Math.Clamp(camera.zoom * 1.3, zoomMin, zoomMax), 100);
            } else if (e.deltaY > 0) {
                camera.zoomTo(Phaser.Math.Clamp(camera.zoom / 1.3, zoomMin, zoomMax), 100);
            }
        });

        // Cancel with right click
        scene.input.on('pointerdown', (pointer) => {
            if(pointer.buttons === 2){
                if (scene.curPlacedBlock !== undefined) {
                    scene.curPlacedBlock = undefined;
                    spriteHide();
                }
            }
        });


        key.R.on("down", () => {
            if (scene.curPlacedBlock !== undefined) {
                if (scene.curPlacedBlock !== "road" && tmpSprite.points !== undefined) {
                    origin = tmpSprite.points[0];
                    scene.spriteOrientation = (scene.spriteOrientation + 1) % 4;
                    spriteHide();
                    spritePreview(origin.x,origin.y);
                }
            }
        });

        key.M.on("down", () => {
            let map = JSON.stringify(scene.mapData,['name','x','y','textureKey']);
            let data = JSON.stringify(scene.data);
            let save = map + "/" + data;
            let encrypt = CryptoJS.AES.encrypt(save,"EcoCity");
            download(encrypt,"save");
        });
        key.L.on("down", () => {
            upload();
        });




    },
    update: function (time, delta) {
        // Check form arrows keys
        controls.update(delta);

        // Add resources to produce
        if (Math.round(time / 1000) !== prevSec) {
            prevSec = Math.round(time / 1000);
            scene.data = addObjects(scene.data, scene.toProduce, scene.storageMax);
        }
    }
});

export default GameScene;