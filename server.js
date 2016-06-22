var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var ejs = require("ejs");
var engine = require("ejs-mate");

var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("express-flash");

var config = require("./config/config.js");

var User = require("./models/user.js");

var app = express();

mongoose.connect(config.database, function(err){
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

// needed for flash messages
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secretKey
}));
app.use(flash());

app.engine("ejs", engine);
app.set("view engine", "ejs");

app.get("/*", function(req, res, next){
    if(typeof req.cookies["connect.sid"] !== "undefined"){
        console.log("Cookie: " + req.cookies["connect.sid"]);
    }
    next();
});

//Routers
var mainRoutes = require("./routes/main");
app.use(mainRoutes);
var userRoutes = require("./routes/user");
app.use(userRoutes);

app.listen(config.port, function(err){
   if (err) throw err;
   console.log("Server is up at " + config.port);
});