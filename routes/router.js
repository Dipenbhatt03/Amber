var express = require("express");
var request = require("request");
require('string.format');
var router = express.Router();
var mongoose = require("mongoose");

var User = mongoose.model("User");
var Driver = mongoose.model("Driver")





var positions = [{ lat :15.426449471662174, lng : 73.95498275756836 } , {lat:15.442263503744481 , lng : 73.96923065185547} ,
 {lat: 15.469333501269302,lng : 73.97197723388672}];
var sourceLat,sourceLng,destLat,destLng	;
var id = 0;



//Handler to fill get username for base template

router.get('/getAuth' , function(req,res)
{
	var auth = "login";
	var url = "#";
	var logged = false;
	var username = req.cookies.name;
	if(req.session[username] )
	{

		auth = "logout(" + username + ")";
		url = "/users/logout";
		logged = true;
	}
	
	//res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({"auth" : auth , "url" : url , "logged" : logged}));

});



router.get('/driver' , function(req,res)
{
	var LoggedIn = req.session[req.cookies.name]
	if(LoggedIn)
	{
		if(LoggedIn.driver == 1)
		{
			var position = {
				lat : LoggedIn.lat,
				lng : LoggedIn.lng
			};
			res.render("driver.html" , {"position" : position});	
			req.app.io.on("connection" , function(socket)
			{
				console.log("socket connected:" + socket.id);
			});	
			return;
		}
				
	}	
	res.redirect("/");
	
});




router.get('/' , function(req,res)
{
	
	
	res.render("amb.html" );
});
router.get('/position' , function(req,res)
{

	sourceLat = req.query.lat;
	sourceLng = req.query.lng;
	var shortest = 100000.23 ,i=0;
	var destLat,destLng;

	

	Driver.find({} , function(err,result)
	{
		if(err)
		{
			console.error("Database Error:Couldn't  retrieve data");
			return;
		}
		
		result.forEach(function(element,idx)
		{
			var	 coord = {
				srcLat : sourceLat,
				srcLng : sourceLng,
				destLat : element.lat,
				destLng : element.lng
			}
			var url = ("https://maps.googleapis.com/maps/api/directions/json?origin={srcLat},{srcLng}&destination={destLat},{destLng}&key=AIzaSyDohPphOzhthkP0Hc3AaLRCbfFAQHZNJ88")
			url = url.format(coord);		
			request({uri : url} , function(error,response,body)
			{
				i++;
				if(error)
				{
					console.log("Error occured::Check internet connection");

				}
				else
				{
					try
					{
					//	console.log("index:" + idx);
						var apiData = JSON.parse(body);
						var dist = parseFloat(apiData.routes[0].legs[0].distance.text);
					//	console.log("distance = %s" ,dist);
					//	console.log(element);
						if(dist < shortest)
						{
							destLat = element.lat;
							destLng = element.lng;
							shortest = dist;
						}

						if( i == result.length)
						{

					//		console.log("i=:" + i);
					//		console.log("shortest distance : " + shortest);
							var srcDest =  destLat + "," + destLng + "/" +sourceLat + "," + sourceLng ;
							res.redirect('/driver');
							req.app.io.emit('done',srcDest);
							return;
						}
					}
					catch(e)
					{
						console.log(e)
						return;
					}
				}
			});

		});



	});

});

module.exports.positions = positions;
module.exports.Router = router;