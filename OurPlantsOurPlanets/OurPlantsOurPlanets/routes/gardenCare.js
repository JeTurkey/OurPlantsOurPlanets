'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET identifier page. */
router.get('/', function (req, res) {
    //res.render('index', { title: path.join(__dirname +'/views/weedIdentifier.cshtml')  });
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/gardens.html'));
});

module.exports = router;
