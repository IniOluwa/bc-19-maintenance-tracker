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
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data) {
    res.redirect('/dash');
  }, function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      return res.send(error && error.message);
  });
  console.log('Signed up successfully.');
});


// Get login page
router.get('/login', function(req, res, next){
  res.render('login', { title: 'Maintenance Tracker' })
  });

// Post to login page and login
router.post('/login', function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(data){
      console.log(data.providerData[0].uid, data.uid, data.email);
      var theUser = data.providerData[0].uid;
      res.redirect('/dash');
      // res.render('dash', { user: theUser })
  }, function(error) {
      return res.send(error && error.message);
  });
});


// Get dashboard
router.get('/dash', function(req, res, next){
  var user = firebase.auth().currentUser;
  res.render('dash', { title: 'Maintenance Tracker', user: user.displayName })
})


// Post a request from dashboard
router.post('/dash', function(req, res, next){
  var maintenanceRequester = req.body.requester;
  var requesterPossession = req.body.possession;
  var possessionDetails = req.body.details;
  var requesterContact = req.body.contact;
  var newRequest = new maintenanceRequest();
  newRequest.createRequest(maintenanceRequester, requesterPossession, possessionDetails, requesterContact);
  console.log('Done.')
});


// Get error page
router.get('/error', function(req, res, next){
  res.render('error', { title: 'Maintenance Tracker' })
  });

// Get profile page
router.get('/profile', function(req, res, next){
  var user = firebase.auth().currentUser;
  console.log(user)
  if(user !== null){
    // console.log(user.providerData);
  }
  res.render('profile', { title: 'Maintenance Tracker', user: user.displayName })
})

// Post from profile page
router.post('/profile', function(req, res, next){
  var displayName = req.body.displayName;
  var photoURL = req.body.photoURL;
  console.log(displayName, photoURL)
  var user = firebase.auth().currentUser;
  if(user !== null){
    // console.log(user);
    user.updateProfile({
      displayName: displayName,
      photoURL: photoURL
    }).then(function() {
      // Update successful.
      console.log('Update successful')
    }, function(error) {
      // An error happened.
      console.log(error);
    });
  }
})

module.exports = router;
