// BASE SETUP
require('dotenv').config();

// Call the expedient packages
var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var routes = require('./routes/index');
var flash = require('connect-flash')
// var provider = firebase.auth.GoogleAuthProvider();

// configure firebase with app
// Initialize Firebase
var config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket,
};
firebase.initializeApp(config);

global.database = firebase.database();

// Add scope for goole auth
// provider.addScope('https://www.googleapis.com/auth/plus.login');

// Views engine declaration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Declaring static directory
app.use(express.static(__dirname + '/public'));

// configure app to use bodyParser()
// this enables getting data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Routes declaration
app.use(logger('dev'));
app.use('/', routes);

//  Flash messages
app.all('/', function(req, res, next){
    req.flash('error', 'You have an error');
    req.flash('success', 'Successful')
    req.flash('/error')
});

app.use(flash());

// App server port
app.listen(3000, function() {
    console.log('Server running at port 3000.');
});
