var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectId;
var express = require('express');
var app         =   express();
var bodyParser  =   require('body-parser');
var router      =   express.Router();

//Monogo defaults to 27017
var mongoConnection = "mongodb://localhost:27017/slacker";

//globally scoped variable for using the DB
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

//Body parser is so we can read the payload from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTION");
  next();
});

 
//Test endpoint http://localhost:1234/myEndPoint
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


app.use('/',router);

app.listen(1234);
console.log("Server running on 1234");
