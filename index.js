require('dotenv').config();

var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var firebase = require('firebase');
var routes = require('./routes/index');

var config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket,
};
firebase.initializeApp(config);

global.database = firebase.database();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use('/', routes);

app.listen(3000, function() {
    console.log('Server running at port 3000.');
});