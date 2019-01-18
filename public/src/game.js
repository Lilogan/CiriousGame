let windowWidth = $(window).width();
let windowHeight = $(window).height();
let spriteWidth = 51.5;
let pointer;
let game;
let config;
let mapObjects;
config = {
    type: Phaser.AUTO,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 0x87CEEB,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 100}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

game = new Phaser.Game(config);




function preload() {
    this.load.crossOrigin = 'Anonymous';
    //load all necessary assets
    this.load.image('floor', 'assets/floor.png');
    this.load.image('building', 'assets/buildings/building1.png');
    this.load.image('shop1', 'assets/buildings/shop1.png');
    this.load.image("roadNS", "assets/roads/roadNS.png");
    this.load.image("roadNSE", "assets/roads/roadNSE.png");
    this.load.image("roadNE", "assets/roads/roadNE.png");
    this.load.image("roadEW", "assets/roads/roadEW.png");
    this.load.image("tree1", "assets/roads/tree1.png");
}

function create() {

    let mapSize = 50;
    let mapData = [
        //posX, posY, dataType
        [24,27,"shop1"],
        [24,26,"shop1"],
        [23,27,"roadNS"],
        [23,26,"roadNS"],
        [23,28,"roadNE"],
        [22,28,"roadEW"],

    ];

    mapObjects = this.add.group();
    let borderOffset = new Phaser.Geom.Point(windowWidth/2, 50/2+windowHeight/2-50*Math.floor(mapSize/2)); // define the offset to center the map

    //display the floor
    for(let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            let point = new Phaser.Geom.Point();
            point.x = j * spriteWidth;
            point.y = i * spriteWidth;
            let isoPoint = fromCartToIso(point);
            this.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y, "floor", false).setOrigin(0.5,1);

        }
    }

    //display elements
    mapData.forEach((curData) => {
        let spriteType = curData[2];
        let object = objects[curData[2]];
        let point = new Phaser.Geom.Point();
        point.x = curData[1] * spriteWidth;
        point.y = curData[0] * spriteWidth;
        let isoPoint = fromCartToIso(point);
        let sprite = this.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y-14, spriteType, false).setOrigin(0.5,1);
        sprite.depth = sprite.y;

    });

    // Zoom camera
    window.addEventListener("wheel", (e) => {
        if(e.deltaY < 0 && this.cameras.main.zoom < 2){
            this.cameras.main.zoomTo(this.cameras.main.zoom + 0.5, 100);
        }else if(e.deltaY > 0 && this.cameras.main.zoom > 0.5){
            this.cameras.main.zoomTo(this.cameras.main.zoom - 0.5, 100);
        }
    });
    pointer = this.input.activePointer;
}
function update() {
    // this.cameras.main.setBounds(this.cameras.main.x,this.cameras.main.y,10000,10000);
    if (pointer.isDown && pointer.justMoved && pointer.buttons === 1){
        this.cameras.main.scrollX -= pointer.x-pointer.prevPosition.x;
        this.cameras.main.scrollY -= pointer.y-pointer.prevPosition.y;
    }
}

function fromCartToIso(point) {
    let isoPoint = new Phaser.Geom.Point;

    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}