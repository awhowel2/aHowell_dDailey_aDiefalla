// users.js holds the schema Users to specify how the data should be stored and recieved from the db

const mongoose = require('mongoose');       //import mongoose to create schema models

//create schema for user data, specifies how the data should look in mongo collection (trim removes whitespace)
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Users', usersSchema);