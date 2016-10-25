var mongodb = require('mongodb');
var express = require('express');
var app 		= express();
var bodyParser	= require('body-parser');
var router		= express.Router();

//End point for the DB when localhosted
var mongoConnection = "mongodb://localhost:27017/restaurant";

//global scoped variable for DB
var globalDb;

//open connection and create DB of it doesn't exsit
mongodb.MongoClient.connect(mongoConnection, function(err,database){
	if(err){
		console.log(err);
	}else{
		console.log('Awesome, Mongodb is connected!')
	}

	globalDb = database;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

var RESTAURANT_COLLECTION = "restaurants";
router.get("/restaurants", function(req,res){
	globalDb.collection(RESTAURANT_COLLECTION).find({}).toArray(function(err, docs){
		if(err){
			handleError(res, err.message, "Failed to get restaurants");
		}else{
			res.status(200).json(docs);
		}
	});
});