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
        "storage": {"energy": 1000, "water": 1000, "citizens": 0},
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0,"citizens": 1}
    },
    "factory1": {
        "name": "Usine 1",
        "type": "building",
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 100, "citizens": 0},
        "production": {"energy": 10, "water": 10, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "electricityfactory1": {
        "name": "Electricité niv 1",
        "type": "building",
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 0, "citizens": 0},
        "production": {"energy": 10, "water": 0, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "electricityfactory2": {
        "name": "Electricité niv 2",
        "type": "building",
        "width": 3,
        "height": 3,
        "storage": {"energy": 200, "water": 0, "citizens": 0},
        "production": {"energy": 20, "water": 0, "money": 10, "pollution": 6},
        "pollutionMax" : 110
    },
    "waterfactory1": {
        "name": "Eau niv 1",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 100, "citizens": 0},
        "production": {"energy": 0, "water": 10, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "waterfactory2": {
        "name": "Eau niv 2",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 200, "citizens": 0},
        "production": {"energy": 0, "water": 20, "money": 10, "pollution": 6},
        "pollutionMax" : 110
    },
    "habitation1": {
        "name": "Maison",
        "type": "building",
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 5},
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0}
    },
    "habitation2": {
        "name": "Appartement",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 10},
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0,"citizens": 1}
    },
    "habitation3": {
        "name": "Grand Appartement",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15},
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0,"citizens": 1}
    },
    "habitation4": {
        "name": "Gratte Ciel",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25},
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0,"citizens": 2}
    },
};