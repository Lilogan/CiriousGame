// Type : Type of the sprites (road, building, other)
// Width : number of tiles of width
// Height : number of tiles of height
// For roads :
// W/N/E/S : where the road connect with
// For building :
// Storage : number of resources the building may store
// production : number of resources the building produce
let objects = {
    "road": {
        "type": "road",
        "width": 1,
        "height": 1,
    },
    "cityhall": {
        "name": "Mairie",
        "type": "building",
        "width": 3,
        "height": 3,
        "storage": {"energy": 1000, "water": 1000},
        "production": {"citizens": 1}
    },
    "factory1": {
        "name": "Usine 1",
        "type": "building",
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 100, "pollution" : 110},
        "production": {"energy": 10, "water": 10, "money": 10, "pollution": 11},
    },
    "electricityfactory1": {
        "name": "Electricité niv 1",
        "type": "building",
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "pollution" : 110},
        "production": {"energy": 10, "water": 0, "money": 10, "pollution": 11},
    },
    "electricityfactory2": {
        "name": "Electricité niv 2",
        "type": "building",
        "width": 3,
        "height": 3,
        "storage": {"energy": 200, "pollution" : 60},
        "production": {"energy": 20, "money": 10, "pollution": 6},
    },
    "waterfactory1": {
        "name": "Eau niv 1",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"water": 100, "pollution" : 110},
        "production": {"energy": 0, "water": 10, "money": 10, "pollution": 11},
    },
    "waterfactory2": {
        "name": "Eau niv 2",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"water": 200, "pollution" : 60},
        "production": {"energy": 0, "water": 20, "money": 10, "pollution": 6},
    },
    "habitation1": {
        "name": "Maison",
        "type": "building",
        "width": 1,
        "height": 1,
        "storage": {"citizens": 5},
        "production": {}
    },
    "habitation2": {
        "name": "Appartement",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"citizens": 10},
        "production": {"citizens": 1}
    },
    "habitation3": {
        "name": "Grand Appartement",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"citizens": 15},
        "production": {"citizens": 1}
    },
    "habitation4": {
        "name": "Gratte Ciel",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"citizens": 25},
        "production": {"citizens": 2}
    },
};