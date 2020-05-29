/*
 * This route renders the store locator page
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

//database connection
connection.connect();

//initiate body parser to reas form data
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET store locator page. */
router.get('/', function (req, res) {
    //check if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }

    //reads and renders stores.html 
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/stores.html'), function (err, data) {

        //sql query to get all garden suppliers
        var queryString = 'SELECT * from garden_supplier';
        var htmlString = "";

        //runs sql query
        connection.query(queryString, function (error, results, fields) {
            var divNumber = 0; // holds the number of paginations

            //for loop renders each store result row
            for (var i = 0; i < results.length; i++) {
                //conditional increments the number of paginations for every 12 rows
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    //starts table for each pagination
                    htmlString = htmlString +
                        '<table style="display:none;border:solid;border-color:#4e9525" class="number-content col-md-12 col-sm-12" id="' +
                        Math.ceil((i + 1) / 12) + '"><tr style="background-color:#4e9525;color:white;text-align:center">' +
                        '<td style="padding:10px">Store Name</td><td>Rating</td><td>Address</td><td style="padding:10px">Postcode</td></tr>';
                }

                //renders each table row
                htmlString = htmlString + '<tr style="text-align:center">';
                htmlString = htmlString + '<td style="padding:10px">' + results[i].store_name + '</td>';
                htmlString = htmlString + '<td>' + results[i].rating + '</td>';
                htmlString = htmlString + '<td>' + results[i].address + '</td>';
                htmlString = htmlString + '<td style="padding:10px">' + results[i].postcode + '</td>';
                htmlString = htmlString + '</tr>';

                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</table>'; //ends pagination div
                }
            }
            //starts pagination section
            if (results.length > 12) {
                htmlString = htmlString + '<div class="container row col-md-12 bg-light" id="collapseThree">' +
                    '<div class="col text-center"><div class="block-27"><ul>';
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    //sets 1 to be active by default in pagination section
                    if (j == 0) {
                        htmlString = htmlString +
                            '<li class="number justify-content-center align-items-center active" style="margin:10px"> ';
                    } else {
                        htmlString = htmlString +
                            '<li class="number justify-content-center align-items-center" style="margin:10px"> ';
                    }
                    //renders pagination button
                    htmlString = htmlString +
                        '<button style="background-color:Transparent;border:none;outline:none" class="number-name" value="' +
                        (j + 1) + '" id="' + (j + 1) + 'button" onClick="paginateWeed(this.value)" >' + (j + 1);
                    htmlString = htmlString + '</button></li>';
                }
                htmlString = htmlString + '</ul></div></div></div>'; //ends pagination
            }

            //includes necessary scripts
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>' +
                ' <script src = "/javascripts/weedPaginate.js" ></script >';
            
            res.send(data.toString().replace("@RenderTableHere", htmlString));//sends response
        });
    });
});

router.post('/', urlencodedParser, function (req, res) {
    //check if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }

    //reads and renders stores.html 
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/stores.html'), function (err, data) {

        //if-else generates sql query for all input combinations
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

        //runs sql query
        connection.query(queryString, function (error, results, fields) {
            var divNumber = 0; // holds the number of paginations

            //renders number of results
            htmlString = htmlString + '<div class="bg-light" style="width:100%;text-align:center;margin-bottom:10px"><div>';
            if (results.length == 0) {
                htmlString = htmlString + "<b><i>No results were found for the given criteria</i></b>";
            } else {
                htmlString = htmlString + "<b><i>" + results.length + " results found</i></b>"
            }
            htmlString = htmlString + '</div></div>'

            //for loop renders each store result row
            for (var i = 0; i < results.length; i++) {
                //conditional increments the number of paginations for every 12 rows
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    //starts table for each pagination
                    htmlString = htmlString +
                        '<table style="display:none;border:solid;border-color:#4e9525" class="number-content col-md-12 col-sm-12" id="' +
                        Math.ceil((i + 1) / 12) + '"><tr style="background-color:#4e9525;color:white;text-align:center">' +
                        '<td style="padding:10px">Store Name</td><td>Rating</td><td>Address</td><td style="padding:10px">Postcode</td></tr>';
                }

                //renders each table row
                htmlString = htmlString + '<tr style="text-align:center">';
                htmlString = htmlString + '<td style="padding:10px">' + results[i].store_name + '</td>';
                htmlString = htmlString + '<td>' + results[i].rating + '</td>';
                htmlString = htmlString + '<td>' + results[i].address + '</td>';
                htmlString = htmlString + '<td style="padding:10px">' + results[i].postcode + '</td>';
                htmlString = htmlString + '</tr>';

                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</table>'; //ends pagination div
                }
            }
            //starts pagination section
            if (results.length > 12) {
                htmlString = htmlString + '<div class="container row col-md-12 bg-light" id="collapseThree">' +
                    '<div class="col text-center"><div class="block-27"><ul>';
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    //sets 1 to be active by default in pagination section
                    if (j == 0) {
                        htmlString = htmlString +
                            '<li class="number justify-content-center align-items-center active" style="margin:10px"> ';
                    } else {
                        htmlString = htmlString +
                            '<li class="number justify-content-center align-items-center" style="margin:10px"> ';
                    }
                    //renders pagination button
                    htmlString = htmlString +
                        '<button style="background-color:Transparent;border:none;outline:none" class="number-name" value="' +
                        (j + 1) + '" id="' + (j + 1) + 'button" onClick="paginateWeed(this.value)" >' + (j + 1);
                    htmlString = htmlString + '</button></li>';
                }
                htmlString = htmlString + '</ul></div></div></div>'; //ends pagination
            }

            //includes necessary scripts
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>' +
                ' <script src = "/javascripts/weedPaginate.js" ></script >';

            res.send(data.toString().replace("@RenderTableHere", htmlString));//sends response
        });
    });
});

module.exports = router;
