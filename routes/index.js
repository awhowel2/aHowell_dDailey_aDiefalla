const express = require('express');     //import express
const path = require('path');           //import path for http-auth
const auth = require('http-auth');      //import http-auth
const mongoose = require('mongoose');   //import mongoose
const router = express.Router();        //grabbing express router
const { check, validationResult } = require('express-validator');   //import express-validator (to validate user input)
const Users = mongoose.model('Users');    //import mongo schema model 

//tell it where to find file with user and password (users.htpasswd) and create basic authentication object
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
    check('username')
        .isLength({min: 1})
        .withMessage('Please enter your username'),    
    check('password')
        .isLength({min: 1})
        .withMessage('Please enter your password'),
],
(req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()){
        const users = new Users(req.body);    //create a new users object w/ data from server and save to db
        /*users.save()
            .then(() => {res.redirect('/registrations') //on success redirect to registrations page
            })
            .catch((err) => {
                console.log(err);
                res.send('Sorry! Something went wrong.');   //if error caught saving, print not success message
            });*/
        
        //code for login check
        Users.findOne({username: users.username}, (err, user) => {
            if (user.password == users.password)
            {
                //redirect to links based on role
                switch(user.role){
                    case "ADMIN":
                        res.render('links',{
                            title: 'Admin links',
                            name: user.username,
                            role: 'ADMIN',
                        });
                        break;
                    case "FINANCE_ADMIN":
                        res.render('links',{
                            title: 'Admin links',
                            name: user.username,
                            role: 'FINANCE_ADMIN',
                        });
                        break;
                    case "SALES_ADMIN":
                        res.render('links',{
                            title: 'Admin links',
                            name: user.username,
                            role: 'SALES_ADMIN',
                        });
                        break;
                    case "HR_ADMIN":
                        res.render('links',{
                            title: 'Admin links',
                            name: user.username,
                            role: 'HR_ADMIN',
                        });
                        break;
                    case "TECH_ADMIN":
                        res.render('links',{
                            title: 'Admin links',
                            name: user.username,
                            role: 'TECH_ADMIN',
                        });
                        break;
                }
            }
            else
            {
                res.render('form', {
                    title: 'Registration form',
                    incorrect: 1,
                    data: req.body,
                });
            }
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
router.get('/registrations', /*basic.check(*/ (req, res) => {
    //this find method returns all records in collection if parameters not specified
    console.log(req.get('Referer'));
    Users.find()
        .then((users) => {
            res.render('index', {title: 'Listing registrations', users});   //sends all records in collection to view template
        })
        .catch(() => { res.send('Sorry! Something went wrong.'); });
})/*)*/;
module.exports = router;