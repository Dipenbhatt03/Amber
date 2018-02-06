var express = require("express");
var morgan = require('morgan')
var nunjucks = require("nunjucks");
var bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")
var mongoose = require("mongoose");
var Users = require("./models/User");
var Drivers = require("./models/Driver");

var session = require('express-session');
var routes = require("./routes/router")
var users = require("./routes/users")


//mongoose.connect("mongodb://127.0.0.1:27017/SEproject");
//mongoose.connect("mongodb://Asmodeus:<amber@123>@ds225028.mlab.com:25028/amber");

MONGOLAB_URI = "mongodb://admin:amber123@ds225028.mlab.com:25028/amber";

mongoose.connect(MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});



//Connection Events
mongoose.connection.on("connected" , function()
{
	console.log("Database connected;")
});
mongoose.connection.on("error" , function()
{
	console.log("Database connected;")
});



var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


app.use(morgan('dev'));

nunjucks.configure("views" , {
	autoescape : true,
	express : app
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
 
}));


app.io = io;

app.use("/",routes.Router);
app.use("/users" , users.UserRouter);


if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}


server.listen(8000);

module.exports = app;
