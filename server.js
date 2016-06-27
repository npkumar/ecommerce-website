var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var ejs = require("ejs");
var engine = require("ejs-mate");

var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("express-flash");

var MongoStore = require("connect-mongo/es5")(session);
var passport = require("passport");

var config = require("./config/config.js");

var User = require("./models/user.js");
var Category = require("./models/category.js");


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
    secret: config.secretKey, 
    store: new MongoStore({
        url: config.database,
        autoReconnect: true
    })
}));
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// req.user is set after login; make avail to all views
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});
// add to locals categories
app.use(function(req, res, next){
    Category.find({}, function(err, categories){
        if (err) return next(err);
        res.locals.categories = categories;
        next();
    });
});

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
var adminRoutes = require("./routes/admin");
app.use(adminRoutes);

app.listen(config.port, function(err){
   if (err) throw err;
   console.log("Server is up at " + config.port);
});