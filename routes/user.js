var router = require("express").Router();
var User = require("../models/user");

var passport = require("passport");
var passportConf = require("../config/passport");

router.get("/login", function(req, res) {
    // already logged in
    if (req.user) return res.redirect("/");
    res.render("accounts/login", {message: req.flash("loginMessage")});
});

router.post("/login", passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

router.get("/edit-profile", function(req, res, next) {
    res.render("accounts/edit-profile", { message: req.flash("success")});
});

router.post("/edit-profile", function(req, res, next) {
    User.findOne({_id: req.user._id}, function(err, user) {
       if (err) return next(err);
       
       if (req.body.name) user.profile.name = req.body.name;
       if (req.body.address) user.address = req.body.address;
       
       user.save(function(err){
           if (err) return next(err);
           req.flash("success", "Successfully edited your profile");
           return res.redirect("/edit-profile");
       });
    });
});

router.get("/profile", function(req, res, next) {
    User.findOne({_id: req.user._id}, function(err, user) {
        if (err) return next(err);
        res.render("accounts/profile", {user: user});
    });
});

router.get("/signup", function(req, res, next){
    res.render("accounts/signup", {
        "errors": req.flash("errors")
    });
});

router.post("/signup", function(req, res, next) {
    var user = new User();
    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;
    user.profile.picture = user.gravatar();

    User.findOne({
        email: req.body.email
    }, function(err, existingUser) {
        if (err){
            return next(err);
        }
        if (existingUser) {
            console.log("The user exists: " + req.body.email);
            req.flash("errors", "Account with " + req.body.email + " exists!");
            return res.redirect("/signup");
        }
        else {
            user.save(function(err) {
                if (err) return next(err);
                console.log("Successfully created user " + user.profile.name);
                
                //return res.redirect("/");
                // post signup store cookie
                req.logIn(user, function(err){
                   if (err) return next(err);
                   res.redirect("/profile");
                });
            });
        }
    });

});

module.exports = router;