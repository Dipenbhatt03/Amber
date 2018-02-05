var mongoose = require("mongoose")
var uniqueValidator = require("mongoose-unique-validator");
var crypto = require("crypto");




var driverSchema = new mongoose.Schema(
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
	lat : Number,
	lng : Number,
	driver: {type : Number , default : 1},
	hash : String
} , { timestamps : true });

driverSchema.plugin(uniqueValidator , {message : "already taken"});

driverSchema.methods.setPassword = function(password)
{
		this.salt = crypto.randomBytes(5).toString('hex');
		//console.log(this.salt);
		this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 20, 'sha512').toString('hex');

		//console.log(this.hash);
}
driverSchema.methods.checkPassword = function(password)
{
	var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 20, 'sha512').toString('hex');
	return this.hash == hash;
}

var Driver = module.exports = mongoose.model("Driver" , driverSchema);