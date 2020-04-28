'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 50760,
    user: 'azure',
    password: '6#vWHD_$',
    database: 'opopdb'
});

var name = "hi";

connection.connect();

connection.query('SELECT common_name from weed limit 1', function (error, results, fields) {
    if (error) name = 'problem';
    name = 'The solution is: ' + results[0].common_name;
});

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('index', { title: path.join(__dirname +'/views/Page2.cshtml')  });
    res.sendFile(path.join('D:/home/site/wwwroot' + '/views/Page2.html'));
});

module.exports = router;
