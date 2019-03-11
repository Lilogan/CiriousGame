var express = require("express");
var fs = require('file-system');

var app = express();

var serveur = app.listen(80, ()=>{
    console.log("Listening port 80");
});


app.use(express.static('public'))
let objects = {};
objects["invisible"] = {type: "other", width: 1, height: 1, isIcon: false, cityHallLink: false};


fs.readdir("./public/assets/roads/", function(err, items) {
    items.forEach((curItem) => {
        var objectToAdd = {};
        curItem = curItem.replace(".png","");
        objectToAdd.type = undefined;
        objectToAdd.width = 1;
        objectToAdd.height = 1;
        objectToAdd.isIcon = false;
        objectToAdd.cityHallLink = false;
        if(curItem.indexOf("road") !== -1){
            objectToAdd.type = "road";
            objectToAdd.isIcon = true;
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
            objectToAdd.isIcon = false;
            if(curItem[curItem.length - 1] === "W"){
                objectToAdd.isIcon = true;
            }
            objectToAdd.cityHallLink = false;
            objectToAdd.width = 1;
            objectToAdd.height = 1;
            objectToAdd.storage = {
                energy: 0,
                water: 0,
                citizen: 0,
                money: 0,
                pollution: 0,
            };
            objectToAdd.production = {
                energy: 0,
                water: 0,
                citizen: 0,
                money: 0,
                pollution: 0,
            };

            objects[curItem] = objectToAdd;


        });

        fs.writeFile("public/src/objectsData.js", "let objects = " + JSON.stringify(objects), (err) => {
            if(err) {
                console.log("error: "+err);
                return console.log(err);
            }else{
                console.log("it works");
            }
        })
    });


});

