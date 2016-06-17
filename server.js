var express = require("express");
var morgan = require("morgan");

var app = express();

app.use(morgan("dev"));

app.get("/", function(req, res){
    res.json({
        "name": "getnpk"
    });
});

app.listen("8080", function(err){
   if (err) throw err;
   console.log("Server is up at 8080");
});