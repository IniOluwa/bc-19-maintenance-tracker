// Initialize dependencies
var express = require('express');
var app = express();
var router = express.Router();
var jsonParser = require('body-parser').json();
var firebase = require('firebase');
var flash = require('connect-flash');
var maintenanceRequest = require('../models/index.js')
var NewAdmin = require('../models/admin.js')



// Get index page
router.get('/', function(req, res, next) {
  res.render('index');
  });


// Get signup page
router.get('/signup', function(req, res, next){
  res.render('signup')
  });

//  Post to signup page and create account
router.post('/signup', function(req, res, next){
  var email = req.body.email
  var password = req.body.password
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data) {
    var user = firebase.auth().currentUser;
    firebase.database().ref('users/').push({
      userId: email,
      role: 'Staff',
      uniqueId: user.uid
    });
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
  res.render('login', { message: 'Login as staff'})
  });

// Post to login page and login
router.post('/login', function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(data){
    res.redirect('/dash');
  }, function(error) {
      return res.send(error && error.message);
  });
});


// Get dashboard
router.get('/dash', function(req, res, next){
  var userRequests = firebase.database().ref('requests/');
  if (userRequests !== null){

  userRequests.on('value', function(snapshot) {
    var requestsTable = snapshot.val();
    var results = [];

    Object.keys(requestsTable).forEach(function(key, value) {
      results.push(requestsTable[key]);
    });

    var user = firebase.auth().currentUser;
    if (user === null) {
      res.send("User is not logged in.")
    }
    res.render('dash', { user: user, requests: results });
  });
}else{
    res.render('dash');
  };
});


// Post a request from dashboard
router.post('/dash', function(req, res, next){
  var user = firebase.auth().currentUser;
  if(user === null){
    res.send('User is not logged in.')
  }
  var maintenanceRequester = user.email;
  var possession = req.body.possession;
  var possessionDetails = req.body.details;
  var possessionOwner = req.body.requester;
  var possessionOwnerContact = req.body.contact;
  var newRequest = new maintenanceRequest();
  newRequest.createRequest(maintenanceRequester, possession, possessionDetails, possessionOwner, possessionOwnerContact);
  console.log('Done.')
  res.redirect('dash')
});


// Get error page
router.get('/error', function(req, res, next){
  res.render('error', { error: 'Error!' })
  });

// Get profile page
router.get('/profile', function(req, res, next){
  var user = firebase.auth().currentUser;
  if(user === null){
    res.send("User is not logged in.")
  }
  res.render('profile', { user: user })
})

// Post from profile page
router.post('/profile', function(req, res, next){
  var displayName = req.body.displayName;
  var photoURL = req.body.photoURL;
  var user = firebase.auth().currentUser;
  if(user !== null){
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
  };
  res.redirect('dash')
});

router.get('/admin/login', function(req, res, next){
  res.render('admin/admin-login', { message: 'Login as administrator' })
})

router.post('/admin/login', function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(data){
      var user = firebase.auth().currentUser;
      if(user.uid !== process.env.uid){
        res.send('You do not have administrator rights.')
      }else{
        res.redirect('/admin/dash');        
      }
  }, function(error) {
      return res.send(error && error.message);
  });
});

router.get('/admin/dash', function(req, res, next){
var userRequests = firebase.database().ref('requests/');

  userRequests.on('value', function(snapshot) {
    var requestsTable = snapshot.val();
    var results = [];

    Object.keys(requestsTable).forEach(function(key, value) {
      results.push(requestsTable[key]);
    });

    var user = firebase.auth().currentUser;
    if (user === null) {
      res.send("User is not logged in.")
    }
    res.render('dash', { user: user, requests: results })
  });
});

module.exports = router;
