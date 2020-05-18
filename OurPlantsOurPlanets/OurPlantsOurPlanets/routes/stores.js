'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 50760,
    user: 'azure',
    password: '6#vWHD_$',
    database: 'opopdb'
});
connection.connect();

/* GET identifier page. */
router.get('/', function (req, res) {
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/stores.html'), function (err, data) {
        var queryString = 'SELECT * from garden_supplier';
        var htmlString = "";
        connection.query(queryString, function (error, results, fields) {
            for (var i = 0; i < results.length; i++) {
                htmlString = htmlString + '<tr>';
                htmlString = htmlString + '<td style="padding:10px">' + results[i].store_name + '</td>';
                htmlString = htmlString + '<td>' + results[i].rating + '</td>';
                htmlString = htmlString + '<td>' + results[i].address + '</td>';
                htmlString = htmlString + '<td>' + results[i].postcode + '</td>';
                htmlString = htmlString + '</tr>';
            }
            res.send(data.toString().replace("@RenderTableHere", htmlString));
        });
    });
    //res.render('index', { title: path.join(__dirname +'/views/weedIdentifier.cshtml')  });
    //res.sendFile(path.join('D:/home/site/wwwroot' + '/views/stores.html'));
});

module.exports = router;
