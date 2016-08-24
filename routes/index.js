var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.method == 'GET') { 
        database.ref('users/').push({
        username: 'name',
        email: 'email',
        profile_picture : 'imageUrl'
      });
      res.render('index', { title: 'Maintenance Tracker' });
    }
});

module.exports = router;