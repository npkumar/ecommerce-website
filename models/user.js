var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

// user schema
var UserSchema = new Schema({
   email : {type: String, unique: true, lowercase: true},
   password: String,
   
   profile: {
       name : {type: String, default: ""},
       picture: {type: String, default: ""}
   },
   
   address: String,
   history: [{
       date: Date,
       paid: {type: Number, default: 0}
   }]
});

// password hashing

// compare password with that in db