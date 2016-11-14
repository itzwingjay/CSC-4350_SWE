/*
* I've install mongodb, express and body-parser via NPM
*/

var mongodb = require('mongodb');
var express = require('express');
var app         =   express();
var bodyParser  =   require('body-parser');
var router      =   express.Router();

//Unless you changed the port, Monogo defaults to 27017
//You did start mongod right? `mongod --dbpath C:\afolder\mongoStuff` 
var mongoConnection = "mongodb://localhost:27017/slack";

//Need a  globally scoped variable for using the DB returned from the connection
var globalDb;

//This will open the connection and create the DB if it doens't exist
mongodb.MongoClient.connect(mongoConnection, function (err, database) {
  if (err) {
    console.log(err);
  }else {
    console.log('Yay! Mongo is doing mongo stuff. That was easy!');
  }

  globalDb = database;

});


//Body parser is so we can read the payload from a POST without rolling our own 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//All we're doing is saying if we GET /myEndPoint, then respond with this JSON 
//Test this in your browser by going to http://localhost:1234/myEndPoint
router.get("/myEndPoint",function(req,res){
    res.json({"aJsonField" : "Hello World"});
});



//Now that the obligatory hello world is out of the way, let's actually do something...
//If you call this (http://localhost:1234/users in your browser) before you POST anything, you'll get a successful buy empty response 
var REST_COLLECTION = "restaurants";
router.get("/restaurants", function(req,res){
	globalDb.collection(REST_COLLECTION).find({}).toArray(function(err, docs) {
	    if (err) {
	      handleError(res, err.message, "Failed to retrieve restaurants");
	    } else {
	      res.status(200).json(docs);
	    }
	  });
});


//I like to curl things so to input this manually you would - 
//curl -H "Content-Type: application/json" -X POST -d '{"Name":"Chipotle"}' http://localhost:1234/restaurants
//User Postman or whatever you like and POST some info 
app.post("/restaurants", function(req, res) {
  var restaurant = req.body;

  //Do some input validation 
  if (!(req.body.Name)) {
    handleError(res, "Invalid JSON", "restaurant name required", 400);
  }

  globalDb.collection(REST_COLLECTION).insertOne(restaurant, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Error writing restaurant to DB.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});



var EVENT_COLLECTION = "events";
router.get("/events", function(req,res){
  globalDb.collection(EVENT_COLLECTION).find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to retrieve events");
      } else {
        res.status(200).json(docs);
      }
    });
});

app.post("/events", function(req, res) {
  var event = req.body;
  globalDb.collection(EVENT_COLLECTION).insertOne(event, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Error writing event to DB.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});



/*
So you now have a GET and POST you can call via your Front End. 
AngularJS - look at $http
JQuery  - look at get() and post()
*/

app.use('/',router);

app.listen(1234);
console.log("Server running on 1234");
