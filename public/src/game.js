let windowWidth = $(window).width();
let windowHeight = $(window).height();
let config = {
    type: Phaser.AUTO,
    width: windowWidth,
    height: windowHeight,
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

let game = new Phaser.Game(config);


let spriteWidth = 51.5;
let pointer;

function preload() {
    this.load.crossOrigin = 'Anonymous';
    //load all necessary assets
    this.load.image('floor', 'assets/floor.png');
    this.load.image('building', 'assets/buildings/building1.png');
    this.load.image('shop1', 'assets/buildings/shop1.png');
    this.load.image("roadNS", "assets/road finished/roadNS.png");
    this.load.image("roadEW", "assets/road finished/roadEW.png");

}

function create() {
    let objects = {
        "building1":{
            "type": "building1",
            "id": 0,
            "width": 1,
            "height": 1,
        },
        "roadNS":{
            "type": "roadNS",
            "id": 1,
            "width": 1,
            "height": 1,
        },
        "roadNSE":{
            "type": "roadNSE",
            "id": 2,
            "width": 1,
            "height": 1,
        }
        ,
        "roadEW":{
            "type": "roadEW",
            "id": 3,
            "width": 1,
            "height": 1,
        },
        "tree1":{
            "type": "tree1",
            "id": 4,
            "width": 1,
            "height": 1,
        },
        "shop1":{
            "type": "shop1",
            "id": 0,
            "width": 1,
            "height": 1,
        },
    };
    let mapSize = 50;
    let mapData = [
        //posX, posY, dataType
        [7,6,"roadNS"],
        [7,7,"roadNS"],

    ];

    let map = this.add.group();

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
        let sprite = this.add.sprite(isoPoint.x + borderOffset.x, isoPoint.y + borderOffset.y, spriteType, false).setOrigin(0.5,1);
    });
    window.addEventListener("wheel", (e) => {
        console.log(e);
        if(e.deltaY < 1){
            this.cameras.main.zoom += 0.5;
        }else if(e.deltaY > 1){
            this.cameras.main.zoom -= 0.5;
        }
    });
    pointer = this.input.activePointer;
}
function update() {
    // this.cameras.main.setBounds(this.cameras.main.x,this.cameras.main.y,10000,10000);
    if (pointer.isDown && pointer.justMoved && pointer.buttons === 1){
        this.cameras.main.scrollX -= pointer.x-pointer.prevPosition.x;
        this.cameras.main.scrollY -= pointer.y-pointer.prevPosition.y;
    }else if(WheelEvent.deltaX){
        console.log("chibre");
    }
}

function fromCartToIso(point) {
    let isoPoint = new Phaser.Geom.Point;

    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}