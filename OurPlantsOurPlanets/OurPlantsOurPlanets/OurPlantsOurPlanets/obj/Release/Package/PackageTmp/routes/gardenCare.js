/*
 * This page renders the garden calander page
 * The garden care page contains monthly gardening tips
 */
'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET Garden Calander page. */
router.get('/', function (req, res) {
    //chack for authentication
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');//redirects to authenticate page if user is not authenticated
    }
    //renders garden calander page
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/gardenCare.html'));
});

module.exports = router;
