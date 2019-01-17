let config = {
    type: Phaser.AUTO,
    width: 900,
    height: 800,
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


let spriteWidth = 51;


function preload() {
    //load all necessary assets
    this.load.image('floor', 'assets/floor.png');
    this.load.image('building', 'assets/buildings/building1.png');
    this.load.image('shop1', 'assets/buildings/shop1.png');
    this.load.image("roadNS", "assets/roads/roadNS.png");
    this.load.image("roadNSE", "assets/roads/roadNSE.png");
    this.load.image("roadNW", "assets/roads/roadNW.png");
    this.load.image("roadEW", "assets/roads/roadEW.png");
    this.load.image("tree1", "assets/roads/tree1.png");

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
    let mapSize = 30;
    let mapData = [
        //posX, posY, dataType
        [15,6,"roadNS"],
        [15,7,"roadNS"],
        [15,8,"roadNS"],
        [15,9,"roadNS"],
        [15,10,"roadNS"],
        [15,11,"roadNS"],
        [15,12,"roadNS"],
        [15,13,"roadNS"],
        [15,14,"roadNS"],
        [15,15,"roadNS"],
        [15,16,"roadNSE"],
        [15,17,"roadNS"],
        [15,18,"roadNS"],
        [15,19,"roadNS"],
        [15,20,"roadNW"],
        [15,20,"roadNW"],
        [16,20,"roadEW"],
        [17,20,"roadEW"],
        [18,20,"roadEW"],
        [19,20,"roadEW"],
        [20,20,"roadEW"],
        [21,20,"roadEW"],
        [22,20,"roadEW"],
        [14,16,"building"],
        [14,10,"shop1"],
        [14,15,"tree1"],
        [14,17,"tree1"],
    ];

    let map = this.add.group();

    let borderOffset = new Phaser.Geom.Point(450, 50/2+400-50*Math.floor(mapSize/2)); // define the offset to center the map

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
    })


}

function update() {

}

function fromCartToIso(point) {
    let isoPoint = new Phaser.Geom.Point;

    isoPoint.x = point.x - point.y;
    isoPoint.y = (point.x + point.y) / 2;

    return isoPoint;
}
