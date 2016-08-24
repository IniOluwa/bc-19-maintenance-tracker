var express = require('express');
var router = express.Router();
var jsonParser = require('body-parser').json();
var firebase = require('firebase');
var flash = require('connect-flash');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Maintenance Tracker' });
});

router.get('/signup', function(req, res, next){
  res.render('signup', { title: 'Maintenance Tracker' })
});

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

router.get('/login', function(req, res, next){
  res.render('login', { title: 'Maintenance Tracker' })
});

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

router.get('/error', function(req, res, next){
  res.render('error', { title: 'Maintenance Tracker' })
});

module.exports = router;
