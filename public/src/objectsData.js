// Type : Type of the sprites (road, building, other)
// Width : number of tiles of width
// Height : number of tiles of height
// IsIcon : is the sprite the icon on the build hud
// For roads :
// W/N/E/S : where the road connect with
// For building :
// Storage : number of resources the building may store
// production : number of resources the building produce
let objects = {
    "invisible": {"type": "other", "width": 1, "height": 1, "isIcon": false, "cityHallLink": false},
    "data": {"type": "other", "width": 1, "height": 1, "isIcon": false, "cityHallLink": false},
    "beach": {"width": 1, "height": 1, "isIcon": false},
    "beachCornerES": {"width": 1, "height": 1, "isIcon": false},
    "beachCornerNE": {"width": 1, "height": 1, "isIcon": false},
    "beachCornerNW": {"width": 1, "height": 1, "isIcon": false},
    "beachCornerSW": {"width": 1, "height": 1, "isIcon": false},
    "beachE": {"width": 1, "height": 1, "isIcon": false},
    "beachES": {"width": 1, "height": 1, "isIcon": false},
    "beachN": {"width": 1, "height": 1, "isIcon": false},
    "beachNE": {"width": 1, "height": 1, "isIcon": false},
    "beachNW": {"width": 1, "height": 1, "isIcon": false},
    "beachS": {"width": 1, "height": 1, "isIcon": false},
    "beachSW": {"width": 1, "height": 1, "isIcon": false},
    "beachW": {"width": 1, "height": 1, "isIcon": false},
    "bridgeEW": {"width": 1, "height": 1, "isIcon": false},
    "bridgeNS": {"width": 1, "height": 1, "isIcon": false},
    "coniferAltShort": {"width": 1, "height": 1, "isIcon": false},
    "coniferAltTall": {"width": 1, "height": 1, "isIcon": false},
    "coniferShort": {"width": 1, "height": 1, "isIcon": false},
    "coniferTall": {"width": 1, "height": 1, "isIcon": false},
    "dirt": {"width": 1, "height": 1, "isIcon": false},
    "dirtDouble": {"width": 1, "height": 1, "isIcon": false},
    "endE": {"width": 1, "height": 1, "isIcon": false},
    "endN": {"width": 1, "height": 1, "isIcon": false},
    "endS": {"width": 1, "height": 1, "isIcon": false},
    "endW": {"width": 1, "height": 1, "isIcon": false},
    "exitE": {"width": 1, "height": 1, "isIcon": false},
    "exitN": {"width": 1, "height": 1, "isIcon": false},
    "exitS": {"width": 1, "height": 1, "isIcon": false},
    "exitW": {"width": 1, "height": 1, "isIcon": false},
    "grass": {"width": 1, "height": 1, "isIcon": false},
    "grassWhole": {"width": 1, "height": 1, "isIcon": false},
    "lotE": {"width": 1, "height": 1, "isIcon": false},
    "lotES": {"width": 1, "height": 1, "isIcon": false},
    "lotN": {"width": 1, "height": 1, "isIcon": false},
    "lotNE": {"width": 1, "height": 1, "isIcon": false},
    "lotNW": {"width": 1, "height": 1, "isIcon": false},
    "lotS": {"width": 1, "height": 1, "isIcon": false},
    "lotSW": {"width": 1, "height": 1, "isIcon": false},
    "lotW": {"width": 1, "height": 1, "isIcon": false},
    "riverBankedES": {"width": 1, "height": 1, "isIcon": false},
    "riverBankedEW": {"width": 1, "height": 1, "isIcon": false},
    "riverBankedNE": {"width": 1, "height": 1, "isIcon": false},
    "riverBankedNS": {"width": 1, "height": 1, "isIcon": false},
    "riverBankedNW": {"width": 1, "height": 1, "isIcon": false},
    "riverBankedSW": {"width": 1, "height": 1, "isIcon": false},
    "riverES": {"width": 1, "height": 1, "isIcon": false},
    "riverEW": {"width": 1, "height": 1, "isIcon": false},
    "riverNE": {"width": 1, "height": 1, "isIcon": false},
    "riverNS": {"width": 1, "height": 1, "isIcon": false},
    "riverNW": {"width": 1, "height": 1, "isIcon": false},
    "riverSW": {"width": 1, "height": 1, "isIcon": false},
    "roadSE": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": false,
        "south": true,
        "east": true,
        "west": false
    },
    "roadEW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": false,
        "south": false,
        "east": true,
        "west": true
    },
    "roadNE": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": true,
        "south": false,
        "east": true,
        "west": false
    },
    "roadNEW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": true,
        "south": false,
        "east": true,
        "west": true
    },
    "roadNS": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": true,
        "south": true,
        "east": false,
        "west": false
    },
    "roadNSE": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": true,
        "south": true,
        "east": true,
        "west": false
    },
    "roadNSEW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": true,
        "south": true,
        "east": true,
        "west": true
    },
    "roadNSW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": true,
        "south": true,
        "east": false,
        "west": true
    },
    "roadNW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": true,
        "south": false,
        "east": false,
        "west": true
    },
    "roadSEW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": false,
        "south": true,
        "east": true,
        "west": true
    },
    "roadSW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "isIcon": true,
        "north": false,
        "south": true,
        "east": false,
        "west": true
    },
    "tree1": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "treeAltShort": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "treeAltTall": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "treeShort": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "treeTall": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "water": {"width": 1, "height": 1, "isIcon": false},
    "waterCornerES": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "waterCornerNE": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "waterCornerNW": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "waterCornerSW": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "waterE": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "waterES": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "waterN": {
        "type": "road",
        "width": 1, "height": 1, "isIcon": false
    },
    "waterNE": {"width": 1, "height": 1, "isIcon": false},
    "waterNW": {"width": 1, "height": 1, "isIcon": false},
    "waterS": {"width": 1, "height": 1, "isIcon": false},
    "waterSW": {"width": 1, "height": 1, "isIcon": false},
    "waterW": {"width": 1, "height": 1, "isIcon": false},
    "arrows": {
        "type": "other",
        "isIcon": false,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "cityhall-E": {
        "type": "building",
        "isIcon": false,
        "width": 4,
        "height": 4,
        "storage": {"energy": 1000, "water": 1000, "citizens": 0, "money": 1000, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 1, "money": 0, "pollution": 0}
    },
    "cityhall-N": {
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 3,
        "storage": {"energy": 1000, "water": 1000, "citizens": 0, "money": 1000, "pollution": 1000},
        "production": {"energy": 0, "water": 0, "citizens": 1, "money": 0, "pollution": 0}
    },
    "cityhall-S": {
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 3,
        "storage": {"energy": 1000, "water": 1000, "citizens": 0, "money": 1000, "pollution": 1000},
        "production": {"energy": 0, "water": 0, "citizens": 1, "money": 0, "pollution": 0}
    },
    "cityhall-W": {
        "type": "building",
        "isIcon": true,
        "width": 3,
        "height": 3,
        "storage": {"energy": 1000, "water": 1000, "citizens": 0, "money": 1000, "pollution": 1000},
        "production": {"energy": 0, "water": 0, "citizens": 1, "money": 0, "pollution": 0}
    },


    "factory1-E": {
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 0, "money": 100, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 10, "pollution": 11}
    },
    "factory1-N": {
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 0, "money": 100, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 10, "pollution": 11}
    },
    "factory1-S": {
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 0, "money": 100, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 10, "pollution": 11}
    },
    "factory1-W": {
        "type": "building",
        "isIcon": true,
        "width": 3,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 0, "money": 100, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 10, "pollution": 11}
    },


    "habitation1-E": {
        "type": "building",
        "isIcon": false,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 5, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation1-N": {
        "type": "building",
        "isIcon": false,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 5, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation1-S": {
        "type": "building",
        "isIcon": false,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 5, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation1-W": {
        "type": "building",
        "isIcon": true,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 5, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },

    "habitation2-E": {
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 10, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation2-N": {
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 10, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation2-S": {
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 10, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation2-W": {
        "type": "building",
        "isIcon": true,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 10, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },


    "habitation3-E": {
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation3-N": {
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation3-S": {
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation3-W": {
        "type": "building",
        "isIcon": true,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },

    "habitation4-E": {
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation4-N": {
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation4-S": {
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation4-W": {
        "type": "building",
        "isIcon": true,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25, "money": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },


}




