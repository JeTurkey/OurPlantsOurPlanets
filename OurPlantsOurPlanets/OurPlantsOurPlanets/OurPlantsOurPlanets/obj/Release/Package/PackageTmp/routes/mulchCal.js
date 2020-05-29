/*
 * this route renders the mulch calculator page
 */
'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET mulch calculator page. */
router.get('/', function (req, res) {
    //checks if the user is authenticates
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate'); //redirects to authenticate page in unaunthenticated
    }
    //renders the mulch calculator page
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/mulchCal.html'));
});

module.exports = router;
