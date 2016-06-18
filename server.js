var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var engine = require("ejs-mate");

var User = require("./models/user.js");

var app = express();

mongoose.connect("mongodb://getnpk:getnpk@ds017544.mlab.com:17544/ecommerce", function(err){
    if (err){
        console.log(err);
    } else {
        console.log("Connected to DB!");
    }
});

app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine("ejs", engine);
app.set("view engine", "ejs");

//Routers
var mainRoutes = require("./routes/main");
app.use(mainRoutes);
var userRoutes = require("./routes/user");
app.use(userRoutes);

app.listen("8080", function(err){
   if (err) throw err;
   console.log("Server is up at 8080");
});