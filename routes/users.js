var express = require("express");
var mongoose = require("mongoose");


var User = mongoose.model("User");
var Driver = mongoose.model("Driver");


var router = express.Router();

router.post('/signup' , function(req,res)
{	
	//console.log(Users);
	var name = req.body.Sname,
		email = req.body.Semail,
		password = req.body.Spassword;
	const user = new User({
		name : name,
		email : email,
		
	});
	user.setPassword(password);
	console.log(user);
	user.save(function(err,result)
	{
		if(err)
		{
			console.log(err);
			return res.status(500).send({success : false , message : 'User already exists'});
		}
		else
		{

			res.cookie("name" , result.name);
			req.session[result.name] = result;
			res.redirect('/');
		}	
	});

	return;
});

router.post("/login" ,function(req,res)
{
	var name = req.body.Lname,
		password = req.body.Lpassword,
		type = req.body.type;
	var Logger ;
	console.log(req.body);
	if(type == "user")
		Logger = User;
	else if(type == "driver")
		Logger = Driver;

	try
	{
		console.log("sad");
		Logger.find({"name" : name} , function(err , result)
		{
			var status = false;
			if(result[0])
			{
				console.log(result[0].salt);
				if(result[0].checkPassword(password))
				{
					console.log("User Found");
					res.cookie("name" , result[0].name);
					req.session[result[0].name] = result[0];
					status = true;
				}
			}

			if(!status)
				console.error("Password is wrong");
			res.send({"status" : status});
			return;

		});	
	}
	catch(e)
	{
		console.log(e);
		res.send({"status" : false });	
	}
	
});


router.get("/logout" , function(req,res)
{
	req.session.destroy(function()
	{
		console.log("User logged out");
	});
	res.clearCookie("name");
	return res.redirect('/');
});


module.exports.UserRouter = router;