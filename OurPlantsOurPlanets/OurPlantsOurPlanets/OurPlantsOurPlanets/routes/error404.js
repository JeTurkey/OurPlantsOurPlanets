/*
 * This route renders the 404 page
 * authentication is not required to see this page
 */
'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET 404 page. */
router.get('/', function (req, res) {
    //renders 404 page
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/404error.html'));
});

module.exports = router;