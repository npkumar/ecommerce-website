var router = require("express").Router();

var User = require("../models/user");
var Product = require("../models/product");

router.get("/", function(req, res){
   res.render("main/home"); 
});

router.get("/about", function(req, res){
   res.render("main/about"); 
});

// for testing
router.get("/users", function(req, res){
   User.find({}, function(err, users){
      if (err) return res.json({"message": err});
      return res.json(users);
   });
});

router.get("/products/:id", function(req, res, next){
   Product
   .find({category: req.params.id})
   .populate("category")
   .exec(function(err, products){
      if (err) return next(err);
      res.render("main/category", {
         products: products
      });
   });
});

module.exports = router;