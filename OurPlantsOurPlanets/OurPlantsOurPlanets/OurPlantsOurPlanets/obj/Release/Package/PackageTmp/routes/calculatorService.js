/*
 * This route renders the mulch calculator
 */
'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET mulch calculator page page. */
router.get('/', function (req, res) {
    //if statement checks if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    //mulch calculator html page is rendered in the line below
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/calculatorService.html'));
});

module.exports = router;
