/*
 * This route renders the website's home page
 */

'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');



/* GET home page. */
router.get('/', function (req, res) {
    //checks if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');//redirects to authenticate page if not authenticated
    }
    //renders the website's home page
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/Page2.html'));
});

module.exports = router;
