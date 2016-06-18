var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");

var app = express();

mongoose.connect("mongodb://getnpk:getnpk@ds017544.mlab.com:17544/ecommerce", function(err){
    if (err){
        console.log(err);
    } else {
        console.log("Connected to DB!");
    }
});

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