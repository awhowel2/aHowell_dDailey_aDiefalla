const express = require('express');     //import express
const path = require('path');           //import path for http-auth
const auth = require('http-auth');      //import http-auth
const mongoose = require('mongoose');   //import mongoose
const router = express.Router();        //grabbing express router
const { check, validationResult } = require('express-validator');   //import express-validator (to validate user input)
const Registration = mongoose.model('Registration');    //import mongo schema model 

//tell it where to find file with user and password (users.htpasswd)
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
  });

//use router to respond to any requests to the root URL with a pug template (http://localhost:3000)
router.get('/', (req, res) => {
  res.render('form', {title: 'Registration form'});  //sends the rendered view to the client, pass dynamic title name
});

//use router to post contents back to root URL (responding to diff HTTP verb)
router.post('/', 
[
    //validation that name and email are length 1 before submission
    check('name')
        .isLength({min: 1})
        .withMessage('Please enter a name'),    
    check('email')
        .isLength({min: 1})
        .withMessage('Please enter an email'),
],
(req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()){
        const registration = new Registration(req.body);    //create a new registration object w/ data from server and save to db
        registration.save()
            .then(() => {res.redirect('/registrations') //res.send('Thank you for your registration!');  //success message
            })
            .catch((err) => {
                console.log(err);
                res.send('Sorry! Something went wrong.');   //if error caught saving, print not success message
            });
        
    } else {
        res.render('form', { 
            title: 'Registration form',
            errors: errors.array(),
            data: req.body,
        });
    }
  });

//route to post all registrations
router.get('/registrations', basic.check((req, res) => {
    //this find method returns all records in collection if parameters not specified
    Registration.find()
        .then((registrations) => {
            res.render('index', {title: 'Listing registrations', registrations});   //sends all records in collection to view template
        })
        .catch(() => { res.send('Sorry! Something went wrong.'); });
}));
module.exports = router;