'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET identifier page. */
router.get('/', function (req, res) {
    //res.render('index', { title: path.join(__dirname +'/views/weedIdentifier.cshtml')  });
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/weedManagement.html'));
});

module.exports = router;
