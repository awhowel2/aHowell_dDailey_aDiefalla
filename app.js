// app.js gives the path to all the views (pug files) and the path to the routing (index.js)

const express = require('express');         //import express module
const path = require('path');               //*****PUG CODE import path module
const routes = require('./routes/index');   //import export value of routes file
const bodyParser = require('body-parser');  //import body parser module

//express stuff
const app = express();      //create express app (app variable using express function)

//path stuff
app.set('views', path.join(__dirname, 'views'));    //builds a path to the views folder using join and __dirname
app.set('view engine', 'pug');      //uses pug as a layout engine for html

//body parser stuff
app.use(bodyParser.urlencoded({extended:true}));    //how to handle data sent as urlencoded to the server (retrieve text in textboxes)

//routes stuff
app.use('/', routes);       //if app recieves forward slash anything use the routes file (index.js)

module.exports = app;       //export our app variable so it can be imported and used in other files