var mongodb = require('mongodb');
var express = require('express');
var app         =   express();
var bodyParser  =   require('body-parser');
var router      =   express.Router();

//Monogo defaults to 27017
// `mongod --dbpath C:\afolder\mongoStuff` 
var mongoConnection = "mongodb://localhost:27017/slack";

//Need a  globally scoped variable
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


//Test endPoint
router.get("/myEndPoint",function(req,res){
    res.json({"aJsonField" : "Hello World"});
});




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



//curl -H "Content-Type: application/json" -X POST -d '{"Name":"Chipotle"}' http://localhost:1234/restaurants

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


/*
So you now have a GET you can call via your Front End. 
AngularJS - look at $http
JQuery  - look at get() and post()
*/

app.use('/',router);

app.listen(1234);
console.log("Server running on 1234");
