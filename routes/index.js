// Initialize dependencies
var express = require('express');
var app = express();
var router = express.Router();
var jsonParser = require('body-parser').json();
var firebase = require('firebase');
var flash = require('connect-flash');
var maintenanceRequest = require('../models/index.js')



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
    if(errorMessage)return res.send(errorMessage);
  });
  console.log('Signed up successfully.');
  res.redirect('/dash');
  });


// Get login page
router.get('/login', function(req, res, next){
  res.render('login', { title: 'Maintenance Tracker' })
  });

// Post to login page and login
router.post('/login', function(req, res, next){
  var email = req.body.email
  var password = req.body.password
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(data){
      res.redirect('/dash');
  }, function(error) {
      return res.send(error && error.message);
  });
});


// Get dashboard
router.get('/dash', function(req, res, next){
  res.render('dash', { title: 'Maintenance Tracker' })
  });

// Post a request from dashboard
router.post('/dash', function(req, res, next){
  var maintenanceRequester = req.body.requester;
  var requesterPossession = req.body.possession;
  var possessionDetails = req.body.details;
  console.log(maintenanceRequester, requesterPossession, possessionDetails)
  var newRequest = new maintenanceRequest();
  newRequest.createRequest(maintenanceRequester, requesterPossession, possessionDetails);
  console.log('Done.')
});


// Get error page
router.get('/error', function(req, res, next){
  res.render('error', { title: 'Maintenance Tracker' })
  });

module.exports = router;
