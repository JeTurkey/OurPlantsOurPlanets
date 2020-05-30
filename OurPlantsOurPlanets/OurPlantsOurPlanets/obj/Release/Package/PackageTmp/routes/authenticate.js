/*
 * This Route is responsible for rendering user authentication
 * If the user enters the correct password, access to all pages is given for 2 hours
 * After 2 hours the user will be asked for authentication again
 */
'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

//database credentials
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 50760,
    user: 'azure',
    password: '6#vWHD_$',
    database: 'opopdb'
});

//make the database connection
connection.connect();

//initiate body parser that will read form input
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//post method
router.post('/submit', urlencodedParser, function (req, res) {
    //password is bandianassrr
    if (req.body.name == "bandianassrr") {
        //sets the cookie to true and allows access for the duration of the entire session
        req.session.allowedAccess =  true;
        res.redirect('/'); //redirects to the home page
    }
    else {
        //renders the same authentication form
        fs.readFile(path.join('D:/home/site/wwwroot' + '/views/passwordPage.html'), function (err, data) {
            //replace statement reders the error message
            res.send(data.toString().replace('action="authenticate/submit"', '').replace('style="display:none"',''));
        });
    }

});

/* GET authentication page. */
router.get('/', function (req, res) {
    //if allowed access is set to false, password page is rendered
    //otherwise, it redirects to the home page
    if (!req.session.allowedAccess) {
        fs.readFile(path.join('D:/home/site/wwwroot' + '/views/passwordPage.html'), function (err, data) {
            res.send(data.toString());
        });
    }
    else {
        res.redirect('/'); //redirects to the home page      
    }
});

module.exports = router;
