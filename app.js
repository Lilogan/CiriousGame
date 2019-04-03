var express = require("express");

var app = express();

app.listen(80, ()=>{
    console.log("Listening port 80");
});

app.use(express.static('public'));