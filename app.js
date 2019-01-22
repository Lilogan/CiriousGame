var express = require("express");
var fs = require('file-system');

var app = express();

var serveur = app.listen(80, ()=>{
    console.log("Listening port 80");
});


app.use(express.static('public'))
let objects = {};
fs.readdir("./public/assets/roads/", function(err, items) {
    items.forEach((curItem) => {
        var objectToAdd = {};
        curItem = curItem.replace(".png","");
        objectToAdd.type = undefined;
        objectToAdd.width = 1;
        objectToAdd.height = 1;
        if(curItem.indexOf("road") !== -1){
            objectToAdd.type = "road";
            objectToAdd.north = curItem.indexOf("N") !== -1;
            objectToAdd.south = curItem.indexOf("S") !== -1;
            objectToAdd.east = curItem.indexOf("E") !== -1;
            objectToAdd.west = curItem.indexOf("W") !== -1;
        }
        objects[curItem] = objectToAdd;
    });
    fs.readdir("./public/assets/buildings/", function(err, items) {
        items.forEach((curItem) => {
            var objectToAdd = {};
            curItem = curItem.replace(".png","");
            objectToAdd.type = "building";
            objectToAdd.width = 1;
            objectToAdd.height = 1;
            objects[curItem] = objectToAdd;
        });
        console.log(objects);
    });
});

