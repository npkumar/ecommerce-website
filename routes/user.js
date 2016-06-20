var router = require("express").Router();
var User = require("../models/user");

router.get("/signup", function(req, res, next){
    res.render("accounts/signup");
});

router.post("/signup", function(req, res, next) {
    var user = new User();
    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;

    User.findOne({
        email: req.body.email
    }, function(err, existingUser) {
        if (err){
            return next(err);
        }
        if (existingUser) {
            console.log("The user exists: " + req.body.email);
            return res.redirect("/signup");
        }
        else {
            user.save(function(err) {
                if (err) return next(err);
                res.json({
                    "message": "Successfully created user " + user.profile.name
                });
            });
        }
    });

});

module.exports = router;