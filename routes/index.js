const express = require('express');     //import express
const path = require('path');           //import path for http-auth
const auth = require('http-auth');      //import http-auth
const mongoose = require('mongoose');   //import mongoose
const router = express.Router();        //grabbing express router
const { check, validationResult } = require('express-validator');   //import express-validator (to validate user input)
const Users = mongoose.model('Users');    //import mongo schema model 

var adminType;
var currentUser;

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
                currentUser = user.username;
                //redirect to links based on role
                switch(user.role){
                    case "ADMIN":
                        adminType = 'ADMIN';
                        res.redirect('/links')
                        break;
                    case "FINANCE_ADMIN":
                        adminType = 'FINANCE_ADMIN';
                        res.redirect('/links')
                        break;
                    case "SALES_ADMIN":
                        adminType = 'SALES_ADMIN';
                        res.redirect('/links')
                        break;
                    case "HR_ADMIN":
                        adminType = 'HR_ADMIN';
                        res.redirect('/links')
                        break;
                    case "TECH_ADMIN":
                        adminType = 'TECH_ADMIN';
                        res.redirect('/links')
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
            //errors: errors.array(),
            incorrect: 1,
            data: req.body,
        });
    }
  });

//route to post all registrations
router.get('/registrations', (req, res) => {
    //this find method returns all records in collection if parameters not specified
    Users.find()
        .then((users) => {
            res.render('index', {title: 'Listing registrations', users});   //sends all records in collection to view template
        })
        .catch(() => { res.send('Sorry! Something went wrong.'); });
});


router.get('/links', (req, res) => {
    //this method routes to the different links based on user role
    if (req.get('Referer') == "http://localhost:3000/" || req.get('Referer') == "http://localhost:3000/links"){
        res.render('links',{
            title: 'Admin links',
            name: currentUser,
            role: adminType,
        });
    } else {
        res.redirect('/');
    }
});

//Prewrote manage users link
router.get('/manageUsers', (req, res) => {
    if(req.get('Referer') == "http://localhost:3000/links"){
        res.render('manageUsers', {
            title: 'Manage Users',
            name: currentUser,
            role: 'ADMIN ',
        });
    } else {
        res.redirect('/');
    }
})

router.get('/delete', (req, res) => {
    if(req.get('Referer') == "http://localhost:3000/manageUsers"){
        res.render('delete', {
            title: 'Account Deletion',
            name: currentUser,
            role: 'Account Deletion',
        });
    } else {
        res.redirect('/');
    }
})

router.post('/delete', (req, res) => {

    Users.findOneAndDelete({ username: req.body.username }, function (err, docs) { 
        if (err){ 
            console.log(err) 
        }
    })
    res.redirect('/')
});

router.get('/Registration', (req, res) => {
    if(req.get('Referer') == "http://localhost:3000/manageUsers"){
        res.render('Registration', {
            title: 'Account Registration',
            name: currentUser,
            role: 'Account Registration',
        });
    } else {
        res.redirect('/');
    }
})

router.post('/Registration', (req, res) => {
    //Creates new User variable with input parameters
    var newUser = new Users({username: req.body.username, password: req.body.password, role: req.body.Roles});
    //Saves User to database
    newUser.save(function (err){
        if(err)
            console.log("Error in creation")
    })
    //Redirects back to login
    res.redirect('/');
  });

router.get('/changeRole', (req,res) => {
    if(req.get('Referer') == "http://localhost:3000/manageUsers"){
        res.render('changerole', {
            title: 'Change User Roles',
            name: currentUser,
        });
    } else {
        res.redirect('/');
    }
});

router.post('/changeRole', (req,res) => {

    Users.findOne({ username: req.body.username }, function (err, doc){
        doc.role = req.body.role;
        doc.save();
      });

    res.redirect('/');
});
  

module.exports = router;

