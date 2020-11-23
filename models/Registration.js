const mongoose = require('mongoose');       //import mongoose to create schema models

//create schema for registration data, specifies how the data should look in mongo collection (trim removes whitespace)
const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Registration', registrationSchema);