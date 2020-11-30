// start.js is the file that runs first and links paths to the other js files (besides index.js) to open the listen port and connect to the db through mongoose

require('dotenv').config();         //importing the dotenv module (used for db connection details)
const mongoose = require('mongoose');       //import mongoose module for easy database querying and viewing

//db connection using .env to specify db URL
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  //connection to db, when unsuccessful prints errors
  mongoose.connection
    .on('open', () => {
      console.log('Mongoose connection open');
    })
    .on('error', (err) => {
      console.log(`Connection error: ${err.message}`);
    });

//require model for mongo schema
require('./models/Users');

//listening port
const app = require('./app');       //importing the express app created in app.js file (we left off the .js in require())
//tell app to listen on port 3000 for incoming connections
const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);   //output to terminal that server is running
});