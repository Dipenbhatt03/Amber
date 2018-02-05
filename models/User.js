var mongoose = require("mongoose")
var uniqueValidator = require("mongoose-unique-validator");
var crypto = require("crypto");




var userSchema = new mongoose.Schema(
{
	name : {
				type : String,
				required : [true , 'cant be blank'],
				unique : true,
				match : [/^[a-zA-Z0-9]+$/ , "is invalid"],
				index : true
			},
	email : {
				type : String,
				unique : true,
				required : [true , 'cant be blank'],
				index : true
			},
	salt : String,

	driver: {type : Number , default : 0},
	hash : String
} , { timestamps : true });

userSchema.plugin(uniqueValidator , {message : "already taken"});

userSchema.methods.setPassword = function(password)
{
		this.salt = crypto.randomBytes(5).toString('hex');
		//console.log(this.salt);
		this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 20, 'sha512').toString('hex');

		//console.log(this.hash);
}
userSchema.methods.checkPassword = function(password)
{
	var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 20, 'sha512').toString('hex');
	return this.hash == hash;
}

var User = module.exports = mongoose.model("User" , userSchema);