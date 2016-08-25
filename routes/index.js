// Initialize dependencies
var express = require('express');
var router = express.Router();
var jsonParser = require('body-parser').json();
var firebase = require('firebase');
var flash = require('connect-flash');

// Get index page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Maintenance Tracker' });
});

// Get signup page
router.get('/signup', function(req, res, next){
  res.render('signup', { title: 'Maintenance Tracker' })
});

//  Post to signup page and create account
router.post('/signup', function(req, res, next){
    var email = req.body.email
    var password = req.body.password
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var postError = errorMessage
      res.redirect('error', { error: postError })
    });
    console.log('Signed up successfully.')
});

// Get login page
router.get('/login', function(req, res, next){
  res.render('login', { title: 'Maintenance Tracker' })
});

// Post to login page and login
router.post('/login', function(req, res, next){
    var email = req.body.email
    var password = req.body.password
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var postError = errorMessage
      res.redirect('error', { error: postError })
    });
    console.log('Logged in successfully.')
});

// Get error page
router.get('/error', function(req, res, next){
  res.render('error', { title: 'Maintenance Tracker' })
});

module.exports = router;
