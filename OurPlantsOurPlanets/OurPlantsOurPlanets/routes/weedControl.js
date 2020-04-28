'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET weed control page. */
router.get('/', function (req, res) {
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/weedControl.html'));
});

module.exports = router;
