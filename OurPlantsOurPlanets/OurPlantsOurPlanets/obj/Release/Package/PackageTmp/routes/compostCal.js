'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET identifier page. */
router.get('/', function (req, res) {
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    //res.render('index', { title: path.join(__dirname +'/views/weedIdentifier.cshtml')  });
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/compostCal.html'));
});

module.exports = router;
