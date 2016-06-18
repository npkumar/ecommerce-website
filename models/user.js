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

// password hashing before save
UserSchema.pre("save", function(next){
    var user = this;
    // if user is not modified
    if (!user.isModified()) return next();
    // else create salt
    bcrypt.genSalt(10, function(err, salt){
        if (err) return next(err);
        // create hash using this salt, third para for progress 
        bcrypt.hash(user.password, salt, null, function(err, hash){
           if (err) return next(err);
           user.password = hash;
           next();
        });
    });
});

// compare password with that in db