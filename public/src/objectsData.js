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
    "invisible": {"type": "other", "width": 1, "height": 1, "cityHallLink": false},
    "data": {"type": "other", "width": 1, "height": 1, "cityHallLink": false},
    "roadSE": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": false,
        "south": true,
        "east": true,
        "west": false
    },
    "roadEW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": false,
        "south": false,
        "east": true,
        "west": true
    },
    "roadNE": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": true,
        "south": false,
        "east": true,
        "west": false
    },
    "roadNEW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": true,
        "south": false,
        "east": true,
        "west": true
    },
    "roadNS": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": true,
        "south": true,
        "east": false,
        "west": false
    },
    "roadNSE": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": true,
        "south": true,
        "east": true,
        "west": false
    },
    "roadNSEW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": true,
        "south": true,
        "east": true,
        "west": true
    },
    "roadNSW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": true,
        "south": true,
        "east": false,
        "west": true
    },
    "roadNW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": true,
        "south": false,
        "east": false,
        "west": true
    },
    "roadSEW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": false,
        "south": true,
        "east": true,
        "west": true
    },
    "roadSW": {
        "type": "road",
        "width": 1,
        "height": 1,
        "north": false,
        "south": true,
        "east": false,
        "west": true
    },
    "arrows": {
        "type": "other",
        "width": 1,
        "height": 1,
        "storage": {"energy": 0, "water": 0, "citizens": 0},
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0}
    },
    "cityhall": {
        "name": "Mairie",
        "type": "building",
        "width": 3,
        "height": 3,
        "storage": {"energy": 1000, "water": 1000, "citizens": 0},
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0}
    },
    "factory1": {
        "name": "Usine 1",
        "type": "building",
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0},
        "production": {"energy": 10, "water": 25, "money": 10, "pollution": 11},
        "pollutionMax" : 110
    },
    "electricityfactory1": {
        "name": "Electricité niv 1",
        "type": "building",
        "width": 3,
        "height": 2,
        "storage": {"energy": 100, "water": 520, "citizens": 0},
        "production": {"energy": 10, "water": 25, "money": 10, "pollution": 11},
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
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0}
    },
    "habitation3": {
        "name": "Grand Appartement",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 15},
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0}
    },
    "habitation4": {
        "name": "Gratte Ciel",
        "type": "building",
        "width": 2,
        "height": 2,
        "storage": {"energy": 0, "water": 0, "citizens": 25},
        "production": {"energy": 0, "water": 0, "money": 0, "pollution": 0}
    },
};