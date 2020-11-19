
var express = require('express');  
var app = express();  
var MongoClient = require('mongodb').MongoClient;  
var assert = require('assert');
//const cors = require('cors');

//app.use(cors());

var mongodb;

// Connection URL
var url = 'mongodb+srv://overlord-user:compengirules@cluster0.10bua.mongodb.net/admin_portal?retryWrites=true&w=majority';

// Create a MongoDB connection pool and start the application
// after the database connection is ready
MongoClient.connect(url, (err, db) => {
    if (err) {
      //logger.warn(`Failed to connect to the database. ${err.stack}`);
      console.log('failed to connect to db');
    }
    app.locals.db = db;
    app.listen(5000, () => {
      //logger.info(`Node.js app is listening at http://localhost:5000/`);
      console.log("app is listening on port 5000");
    });
  });

app.get('/', function(request, response) {
    const db = request.app.locals.db;
    db.listCollections({});
    response.send('see console');
});