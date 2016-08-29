// Initialize dependencies
var express = require('express');
var app = express();
var router = express.Router();
var firebase = require('firebase');
var flash = require('connect-flash');
var maintenanceRequest = require('../models/index.js')
var NewAdmin = require('../models/admin.js')
var Jusibe = require('jusibe');

// Initialize jusibe for sms sending
var publicKey = process.env.publicKey;
var accessToken = process.env.accessToken;
var jusibe = new Jusibe(publicKey, accessToken);


// Get index page
router.get('/', function(req, res) {
  res.render('index');
  });


// Get signup page
router.get('/signup', function(req, res){
  res.render('signup')
  });


//  Post to signup page and create account
router.post('/signup', function(req, res){
  var email = req.body.email;
  var password = req.body.password;
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
  res.redirect('/dash')
});


// Get login page
router.get('/login', function(req, res){
  res.render('login', { message: 'Staff login'})
  });


// Post to login page and login
router.post('/login', function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(data){
    return res.redirect('/dash');
  }, function(error) {
      return res.send(error && error.message);
  });
});

// Dashboard
router.route('/dash')
.get(function(req, res){
  // Get dashboard
  var user = firebase.auth().currentUser;
  if(!user){
    res.redirect('/login');
  };
  var userRequests = firebase.database().ref('requests/');
  userRequests.on('value', function(snapshot) {
    var requestsTable = snapshot.val();
    var results = [];

    Object.keys(requestsTable).forEach(function(key, value) {
      results.push(requestsTable[key]);
    });
    res.render('dash', { user: user, requests: results }); 
  });
})
.post(function(req, res){
// Post a request from dashboard
  var user = firebase.auth().currentUser;
  var maintenanceRequester = user.email;
  var possession = req.body.possession;
  var possessionDetails = req.body.details;
  var possessionOwner = req.body.requester;
  var possessionOwnerContact = req.body.contact;
  var newRequest = new maintenanceRequest();
  newRequest.createRequest(maintenanceRequester, possession, possessionDetails, possessionOwner, possessionOwnerContact);
  // console.log('Done.');
  res.redirect('/dash');
});


// Get error page
router.get('/error', function(req, res){
  res.render('error', { error: 'Error!' })
  });


// Get profile page
router.get('/profile', function(req, res){
  var user = firebase.auth().currentUser;
  if(user === null){
    res.send("User is not logged in.")
  }
  res.render('profile', { user: user })
  // res.partial('profile', { user: user })
});


// Post from profile page
router.post('/profile', function(req, res){
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
  }


  res.redirect('/dash')
});

// Admin Login
router.get('/admin/login', function(req, res){
  res.render('admin/admin-login', { message: 'Administrator login' })
});


router.post('/admin/login', function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(data){
      var user = firebase.auth().currentUser;
      if(user.uid !== process.env.uid){
        res.send('You do not have administrator rights.')
      }
      res.redirect('/admin/dash')        
  }, function(error) {
      return res.send(error && error.message);
  });
});

// Admin dashboard
router.get('/admin/dash', function(req, res){
  var userRequests = firebase.database().ref('requests/');
  var user = firebase.auth().currentUser;
    if(!user){
    res.redirect('/admin/login')
  };
  userRequests.on('value', function(snapshot) {
    requestsTable = snapshot.val();
    results = []
    Object.keys(requestsTable).forEach(function(key, value) {
      results.push(requestsTable[key]);
    });
    res.render('admin/admin-dash', { user: user, requests: results }) 
  });
});

// Post from admin dashboard
router.post('/admin/dash', function(req, res){
    var userRequests = firebase.database().ref('requests/');
    var user = firebase.auth().currentUser;
    if(!user){
      res.redirect('/login')
    };
    var requestOwner = req.body.requestOwner;
    var newPossession = req.body.newPossession;
    var newDetails = req.body.newDetails;
    var newContact = req.body.newContact;
    var oldTime = req.body.oldTime;
    var status = req.body.status;
    var done = req.body.done;
    if (status === null || status === undefined){
      status = 'off'
    }else if(done === null || done === undefined){
      done = 'off'
    };
    userRequests.child(requestOwner).child('request').update(
        {
          objectName: newPossession,
          requestDetails: newDetails,
          timeOfRequest: oldTime,
          isApproved:status,
          timeApproved: Date.now(),
          requestOwner: requestOwner,
          requestOwnerContact: newContact,
          isComplete: done
        }
      )
    var payload = {
    to: newContact,
    from: 'MaintenanceTrack',
    message: 'Your item(s) maintenance on MaintenanceTrack is complete.'
    };
   
    jusibe.sendSMS(payload, function (err, res) {
      if (res.statusCode === 200) console.log(res.body);
      else console.log(err);
    });

  res.redirect('/admin/dash')
});

module.exports = router;
