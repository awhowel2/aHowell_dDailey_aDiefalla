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
                        /*res.render('links',{
                            title: 'Admin links',
                            name: user.username,
                            role: 'ADMIN',
                        });*/
                        break;
                    case "FINANCE_ADMIN":
                        adminType = 'FINANCE_ADMIN';
                        res.redirect('/links')
                        // res.render('links',{
                        //     title: 'Admin links',
                        //     name: user.username,
                        //     role: 'FINANCE_ADMIN',
                        // });
                        break;
                    case "SALES_ADMIN":
                        adminType = 'SALES_ADMIN';
                        res.redirect('/links')
                        // res.render('links',{
                        //     title: 'Admin links',
                        //     name: user.username,
                        //     role: 'SALES_ADMIN',
                        // });
                        break;
                    case "HR_ADMIN":
                        adminType = 'HR_ADMIN';
                        res.redirect('/links')
                        // res.render('links',{
                        //     title: 'Admin links',
                        //     name: user.username,
                        //     role: 'HR_ADMIN',
                        // });
                        break;
                    case "TECH_ADMIN":
                        adminType = 'TECH_ADMIN';
                        res.redirect('/links')
                        // res.render('links',{
                        //     title: 'Admin links',
                        //     name: user.username,
                        //     role: 'TECH_ADMIN',
                        // });
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
        res.render('links', {
            title: 'Manage Users',
        });
    } else {
        res.redirect('/');
    }
})
module.exports = router;