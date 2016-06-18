var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var User = require("./models/user.js");

var app = express();

mongoose.connect("mongodb://getnpk:getnpk@ds017544.mlab.com:17544/ecommerce", function(err){
    if (err){
        console.log(err);
    } else {
        console.log("Connected to DB!");
    }
});

app.use(morgan("dev"));

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post("/create-user", function(req, res, next){
    var user = new User();
    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;
    
    user.save(function(err){
       if (err) return next(err);
       res.json({"message": "Successfully saved user " + user.profile.name});
    });
});

app.listen("8080", function(err){
   if (err) throw err;
   console.log("Server is up at 8080");
});