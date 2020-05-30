/*
 * This route renders the weed management page
 * It is accesses when certain links on the home page is clicked
 */
'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET weed manaagement page. */
router.get('/', function (req, res) {
    //checks if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    //renders weed management page
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/weedManagement.html'));
});

module.exports = router;
