/*
* I've install mongodb, express and body-parser via NPM
*/

var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectId;
var express = require('express');
var app         =   express();
var bodyParser  =   require('body-parser');
var router      =   express.Router();



//Unless you changed the port, Monogo defaults to 27017
//You did start mongod right? `mongod --dbpath C:\afolder\mongoStuff` 
var mongoConnection = "mongodb://localhost:27017/slacker";

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

/* Database schema
 *  {
      "_id": <ObjectId>,
      "name": <string>,
      "hour": <string>,
      "menu": {
        "item1": <string>,
        "item2": <string>,
        .
        .
        .
        "itemn": <string>
      }
    }
 */

//Body parser is so we can read the payload from a POST without rolling our own 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTION");
  next();
});

//All we're doing is saying if we GET /myEndPoint, then respond with this JSON 
//Test this in your browser by going to http://localhost:1234/myEndPoint
router.get("/myEndPoint",function(req,res){
    res.json({ message : "Hello World"});
});


/*
 *  "/restaurants"
 *  GET: Find all restaurants
 *  POST: Create new restaurant
 */


//If you call this (http://localhost:1234/restaurants in your browser) before you POST anything, you'll get a successful empty response 
var REST_COLLECTION = "restaurants";
var HOURS_COLLECTION = "hours";

router.get("/restaurants", function(req,res){
	globalDb.collection(REST_COLLECTION).find({}).toArray(function(err, docs) {
	    if (err) {
	      handleError(res, err.message, "Failed to retrieve restaurants");
	    } else {
	      res.status(200).json(docs);
	    }
	  });
});

router.get("/hours", function(req,res){
  globalDb.collection(HOURS_COLLECTION).find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to retrieve hours");
      } else {
        res.status(200).json(docs);
      }
    });
});


//I like to curl things so to input this manually you would - 
//curl -H "Content-Type: application/json" -X POST -d '{"Name":"Chipotle"}' http://localhost:1234/restaurants
//User Postman or whatever you like and POST some info 
app.post("/restaurants", function(req, res) {
  var restaurant = req.body
  //Do some input validation 
  if (!(req.body.name)) {
    handleError(res, "Invalid JSON", "restaurant name required", 400);
  }
    if (!(req.body.pic)) {
    handleError(res, "Invalid JSON", "restaurant name required", 400);
  }
    if (!(req.body.href)) {
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

app.post("/hours", function(req, res) {
  var hour = req.body
  //Do some input validation 
  if (!(req.body.date)) {
    handleError(res, "Invalid JSON", "hour name required", 400);
  }

  globalDb.collection(HOURS_COLLECTION).insertOne(hour, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Error writing restaurant to DB.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});


/*
 *  "/restaurants/:id"
 *    GET: find restaurant by id
 *    PUT: update restaurant by id
 *    DELETE: delete restuarnt by id
 */

router.get("/restaurants/:id", function(req,res){
  globalDb.collection(REST_COLLECTION).findOne({_id: new ObjectId(req.params.id) }, function(err,doc){
    if(err){
      handleError(res, err.message, " Failed to get restaurant");
    } else {
      res.status(200).json(doc);
    }
  });
});

router.put("/restaurants/:id", function(req,res){
  var updateDoc = req.body;
  delete updateDoc._id;

  globalDb.collection(REST_COLLECTION).updateOne({_id: new ObjectId(req.params.id)}, updateDoc, function(err,doc){
    if(err){
      handleError(res, err.message, "Failed to update restaurant");
    } else {
      res.status(204).json({ message: "restaurant updated!"});
    }
  });
});

app.delete("/restaurants/:id", function(req,res){
  globalDb.collection(REST_COLLECTION).deleteOne({_id: new ObjectId(req.params.id)}, function(err, result){
    if(err){
      handleError(res, err.message, "Failed to delete restaurant");
    } else {
      res.status(204).json({ message: "restaurant deleted!"});
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
