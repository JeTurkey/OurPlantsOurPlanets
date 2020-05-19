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
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET identifier page. */
router.get('/', function (req, res) {
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/stores.html'), function (err, data) {
        var queryString = 'SELECT * from garden_supplier';
        var htmlString = "";
        connection.query(queryString, function (error, results, fields) {
            var divNumber = 0;
            for (var i = 0; i < results.length; i++) {
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    htmlString = htmlString + '<table style="display:none" class="number-content col-md-12 col-sm-12" id="' + Math.ceil((i + 1) / 12) + '"><tr style="background-color:#4e9525;color:white;text-align:center"><td style="padding:10px">Store Name</td><td>Rating</td><td>Address</td><td style="padding:10px">Postcode</td></tr>';
                }
                htmlString = htmlString + '<tr style="text-align:center">';
                htmlString = htmlString + '<td style="padding:10px">' + results[i].store_name + '</td>';
                htmlString = htmlString + '<td>' + results[i].rating + '</td>';
                htmlString = htmlString + '<td>' + results[i].address + '</td>';
                htmlString = htmlString + '<td style="padding:10px">' + results[i].postcode + '</td>';
                htmlString = htmlString + '</tr>';
                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</table>';
                }
            }
            if (results.length > 12) {
                htmlString = htmlString + '<div class="container row col-md-12 bg-light" id="collapseThree"><div class="col text-center"><div class="block-27"><ul>';
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    if (j == 0) {
                        htmlString = htmlString + '<li class="number justify-content-center align-items-center active" style="margin:10px"> ';
                    } else {
                        htmlString = htmlString + '<li class="number justify-content-center align-items-center" style="margin:10px"> ';
                    }
                    htmlString = htmlString + '<button style="background-color:Transparent;border:none;outline:none" class="number-name" value="' + (j + 1) + '" id="' + (j + 1) + 'button" onClick="paginateWeed(this.value)" >' + (j + 1);
                    htmlString = htmlString + '</button></li>';
                }
                htmlString = htmlString + '</ul></div></div></div>';
            }
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <script src = "/javascripts/weedPaginate.js" ></script >';
            res.send(data.toString().replace("@RenderTableHere", htmlString));
        });
    });
    //res.render('index', { title: path.join(__dirname +'/views/weedIdentifier.cshtml')  });
    //res.sendFile(path.join('D:/home/site/wwwroot' + '/views/stores.html'));
});

router.post('/', urlencodedParser, function (req, res) {
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/stores.html'), function (err, data) {
        if (req.body.postcode == "Any" || req.body.postcode == "") {
            var queryString = "SELECT * from garden_supplier";
            if (req.body.rating != "Any") {
                if (req.body.rating == "two") {
                    queryString = queryString + " where rating < 2"
                }
                if (req.body.rating == "four") {
                    queryString = queryString + " where rating < 4 and rating >= 2"
                }
                if (req.body.rating == "five") {
                    queryString = queryString + " where rating < 4 and rating >= 2"
                }
            }
        }
        else {
            var queryString = "SELECT * from garden_supplier where postcode = " + req.body.postcode;
            if (req.body.rating != "Any") {
                if (req.body.rating == "two") {
                    queryString = queryString + " and rating < 2"
                }
                if (req.body.rating == "four") {
                    queryString = queryString + " and rating < 4 and rating >= 2"
                }
                if (req.body.rating == "five") {
                    queryString = queryString + " and rating < 4 and rating >= 2"
                }
            }
        }
        var htmlString = "";
        connection.query(queryString, function (error, results, fields) {
            var divNumber = 0;
            for (var i = 0; i < results.length; i++) {
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    htmlString = htmlString + '<table style="display:none" class="number-content" id="' + Math.ceil((i + 1) / 12) + '"><tr style="background-color:#4e9525;color:white;text-align:center"><td style="padding:10px">Store Name</td><td>Rating</td><td>Address</td><td style="padding:10px">Postcode</td></tr>';
                }
                htmlString = htmlString + '<tr style="text-align:center">';
                htmlString = htmlString + '<td style="padding:10px">' + results[i].store_name + '</td>';
                htmlString = htmlString + '<td>' + results[i].rating + '</td>';
                htmlString = htmlString + '<td>' + results[i].address + '</td>';
                htmlString = htmlString + '<td style="padding:10px">' + results[i].postcode + '</td>';
                htmlString = htmlString + '</tr>';
                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</table>';
                }
            }
            if (results.length > 12) {
                htmlString = htmlString + '<div class="container row col-md-12 bg-light" id="collapseThree"><div class="col text-center"><div class="block-27"><ul>';
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    if (j == 0) {
                        htmlString = htmlString + '<li class="number justify-content-center align-items-center active" style="margin:10px"> ';
                    } else {
                        htmlString = htmlString + '<li class="number justify-content-center align-items-center" style="margin:10px"> ';
                    }
                    htmlString = htmlString + '<button style="background-color:Transparent;border:none;outline:none" class="number-name" value="' + (j + 1) + '" id="' + (j + 1) + 'button" onClick="paginateWeed(this.value)" >' + (j + 1);
                    htmlString = htmlString + '</button></li>';
                }
                htmlString = htmlString + '</ul></div></div></div>';
            }
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <script src = "/javascripts/weedPaginate.js" ></script >';
            res.send(data.toString().replace("@RenderTableHere", htmlString));
        });
    });
    //res.render('index', { title: path.join(__dirname +'/views/weedIdentifier.cshtml')  });
    //res.sendFile(path.join('D:/home/site/wwwroot' + '/views/stores.html'));
});

module.exports = router;
