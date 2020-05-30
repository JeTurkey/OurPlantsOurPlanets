/*
 * This route renders the compost calculator
 */
'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

/* GET compost calculator page. */
router.get('/', function (req, res) {
    //checks if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');//redirects to authentication page if not authenticated
    }
    //renders the compost caluculator page
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/compostCal.html'));
});

module.exports = router;
