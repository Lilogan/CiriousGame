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
    "arrows": {
        "type": "other",
        "isIcon": false,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "cityhall-E": {
        "name": "Mairie",
        "type": "building",
        "isIcon": false,
        "width": 4,
        "height": 4,
        "storage": {"energy": 1000, "water": 1000, "citizens": 0, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 1, "money": 0, "pollution": 100}
    },
    "cityhall-N": {
        "name": "Mairie",
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 3,
        "storage": {"energy": 1000, "water": 1000, "citizens": 0, "pollution": 100},
        "production": {"energy": 0, "water": 0, "citizens": 1, "money": 0, "pollution": 0}
    },
    "cityhall-S": {
        "name": "Mairie",
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 3,
        "storage": {"energy": 1000, "water": 1000, "citizens": 0, "pollution": 100},
        "production": {"energy": 0, "water": 0, "citizens": 1, "money": 0, "pollution": 0}
    },
    "cityhall-W": {
        "name": "Mairie",
        "type": "building",
        "isIcon": true,
        "width": 3,
        "height": 3,
        "storage": {"energy": 1000, "water": 1000, "citizens": 0, "pollution": 100},
        "production": {"energy": 0, "water": 0, "citizens": 1, "money": 0, "pollution": 0}
    },
    "factory1-E": {
        "name": "Usine 1",
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0, "pollution": 0},
        "production": {"energy": 10, "water": 25, "citizens": 0, "money": 1000, "pollution": 11},
        "pollutionMax" : 110
    },
    "factory1-N": {
        "name": "Usine 1",
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0, "pollution": 0},
        "production": {"energy": 10, "water": 25, "citizens": 0, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "factory1-S": {
        "name": "Usine 1",
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0, "pollution": 0},
        "production": {"energy": 10, "water": 25, "citizens": 0, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "factory1-W": {
        "name": "Usine 1",
        "type": "building",
        "isIcon": true,
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0, "pollution": 0},
        "production": {"energy": 10, "water": 25, "citizens": 0, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "electricityfactory1-E": {
        "name": "Petite Usine Electrique",
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0, "pollution": 0},
        "production": {"energy": 10, "water": 25, "citizens": 0, "money": 1000, "pollution": 11},
        "pollutionMax" : 110
    },
    "electricityfactory1-N": {
        "name": "Petite Usine Electrique",
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0, "pollution": 0},
        "production": {"energy": 10, "water": 25, "citizens": 0, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "electricityfactory1-S": {
        "name": "Petite Usine Electrique",
        "type": "building",
        "isIcon": false,
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0, "pollution": 0},
        "production": {"energy": 10, "water": 25, "citizens": 0, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "electricityfactory1-W": {
        "name": "Electricité niv 1",
        "type": "building",
        "isIcon": true,
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0, "pollution": 0},
        "production": {"energy": 10, "water": 25, "citizens": 0, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "habitation1-E": {
        "name": "Maison",
        "type": "building",
        "isIcon": false,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 5, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation1-N": {
        "name": "Maison",
        "type": "building",
        "isIcon": false,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 5, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation1-S": {
        "name": "Maison",
        "type": "building",
        "isIcon": false,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 5, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation1-W": {
        "name": "Maison",
        "type": "building",
        "isIcon": true,
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 5, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation2-E": {
        "name": "Appartement",
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 10, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation2-N": {
        "name": "Appartement",
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 10, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation2-S": {
        "name": "Appartement",
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 10, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation2-W": {
        "name": "Appartement",
        "type": "building",
        "isIcon": true,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 10, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation3-E": {
        "name": "Grand Appartement",
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation3-N": {
        "name": "Grand Appartement",
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation3-S": {
        "name": "Grand Appartement",
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation3-W": {
        "name": "Grand Appartement",
        "type": "building",
        "isIcon": true,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation4-E": {
        "name": "Gratte Ciel",
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation4-N": {
        "name": "Gratte Ciel",
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation4-S": {
        "name": "Gratte Ciel",
        "type": "building",
        "isIcon": false,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
    "habitation4-W": {
        "name": "Gratte Ciel",
        "type": "building",
        "isIcon": true,
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25, "pollution": 0},
        "production": {"energy": 0, "water": 0, "citizens": 0, "money": 0, "pollution": 0}
    },
};




