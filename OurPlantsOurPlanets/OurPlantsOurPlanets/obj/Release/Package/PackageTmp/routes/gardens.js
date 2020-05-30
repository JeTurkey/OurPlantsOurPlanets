/*
 * this route renders the community gardens page
 */
'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

//initiate body parser that will read search form input
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//database credentials
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 50760,
    user: 'azure',
    password: '6#vWHD_$',
    database: 'opopdb'
});

//makes database connection
connection.connect();

/* GET community gardens page. */
router.get('/', function (req, res) {
    //checks if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate'); //redirects to home page if not authenticates
    }
    //reads gardens.html and renders header, navbar, hero image and seach form
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/gardens.html'), function (err, data) {
        //renders correct title of the community gardens page
        var htmlString = data.toString().replace('Say Bye to Weed Worries', 'Stay Connected')
            .replace('<span>Weed Control <', '<span>Community Gardens <');

        //sql query to get all community gardens
        var queryString = "SELECT * from community_garden";

        //runs above query
        connection.query(queryString, function (error, results, fields) {
            //begins section for community gardens list
            htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container">' +
                '<div class="row d-flex justify-content-center">';

            var divNumber = 0; //holds the number of paginstions for the list

            //for loop to render each comunity garden
            for (var i = 0; i < results.length; i++) {
                //if statement changes the duv number and starts new div after every 12 results
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    //id of each div is equal to its pagination page number
                    htmlString = htmlString + '<div style="display:none"' +
                        'class="number-content row col-md-12 col-sm-12 " id="' + Math.ceil((i + 1) / 12) + '">';
                }

                //holds the community garden name
                var replacement = results[i].store_name;
                //if name is too short a filler to maintain consistent card height
                if (results[i].store_name.length <= 33) {
                    var remaining = 35 - results[i].store_name.length;
                    var filler = ' <span style="color:white;white-space:pre-line">';
                    for (var k = 0; k < remaining; k++) {
                        filler = filler + "_";
                    }
                    replacement = replacement + filler + '</span>';
                }

                //holds the community garden's address
                var replacement1 = results[i].address;

                //if address is short, filler is added to maintain consistent card height
                if (results[i].store_name.length <= 83) {
                    var remaining = 91 - results[i].address.length;
                    var filler = ' <span style="color:white;white-space:pre-line">';
                    for (var k = 0; k < remaining; k++) {
                        filler = filler + "_";
                    }
                    if (results[i].address.length <= 37) {
                        filler = filler+" _________"
                    }
                    replacement1 = replacement1 + filler + '</span>';
                }

                //holds the image link of the community garden
                var image = results[i].img_link;

                //sets an image if image link does not exist
                if (!results[i].img_link) {
                    image = "/images/no-image.jpg";
                }

                //holds community garden of the website
                var website = results[i].website;
                if (!results[i].website) {
                    website = "#";
                }

                htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end">' +
                    '<a href="'+website+'" class="block-20" style="background-image: url(\'' + image + '\');"></a >' +
                    '<div class="text p-4 float-right d-block" style="text-align:left">' +
                    '<a href="'+website+'"><h3 class="heading mb-0" style="color:black;">' + replacement + '</h3></a><p>';

                //for loop to generate rating in terms of stars
                //rating is rounded in order to generate half stars
                for (var r = 0; r < 5; r++) {
                    if (results[i].rating >= r + 1) {
                        htmlString = htmlString + '<span class="fa fa-star checked" ></span >';
                    }
                    else {
                        if (Math.round(results[i].rating * 2) == ((r + 1) * 2) - 1) {
                            htmlString = htmlString + '<span class="fa fa-star-half-full checked" ></span >';
                        }
                        if (Math.round(results[i].rating * 2) == ((r + 1) * 2)) {
                            htmlString = htmlString + '<span class="fa fa-star checked" ></span >';
                        }
                        if (Math.round(results[i].rating * 2) <= ((r + 1) * 2) - 2) {
                            htmlString = htmlString + '<span class="fa fa-star" ></span>';
                        }
                    }
                    
                }
                htmlString = htmlString + '</p ><p>';
                //address is rendered in thebelow line
                htmlString = htmlString + replacement1;
                htmlString = htmlString + '</p></div ></div ></div > '; //ends each commuity garden result

                //if statement end the pagination div
                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</div>';
                }
            }
            htmlString = htmlString + '</div></div></section>'; // ends the results section

            //creates pagination buttons
            if (results.length > 12) {
                //begins pagination buttons section
                htmlString = htmlString + '<section class="ftco-section bg-light">' +
                    '<div class="container row col-md-12 bg-light" id="collapseThree">' +
                    '<div class="col text-center"><div class="block-27"><ul>';

                //for loop generates each pagination button
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    //if statement sets the default active pagination button
                    if (j == 0) {
                        htmlString = htmlString +
                            '<li class="number justify-content-center align-items-center active" style="margin:10px"> ';
                    } else {
                        htmlString = htmlString +
                            '<li class="number justify-content-center align-items-center" style="margin:10px"> ';
                    }
                    //renders actual pagination button
                    htmlString = htmlString +
                        '<button ' +
                        'style="background-color:Transparent;border:none;outline:none" class="number-name"' +
                        ' value="' + (j + 1) + '" id="' + (j + 1) + 'button" onClick="paginateWeed(this.value)" >' + (j + 1);
                    htmlString = htmlString + '</button></li>';
                }
                htmlString = htmlString + '</ul></div></div></div></section>'; //end the pagination section
            }

            //adds necessary scripts
            htmlString = htmlString +
                '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>' +
                ' <script src = "/javascripts/weedPaginate.js" ></script >';

            //reads and renders page footer
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + data.toString();
                res.send(htmlString);
            });
        });
        });
});

//post page for community gardens
router.post('/', urlencodedParser, function (req, res) {
    //checks if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate'); //redirects to home page if not authenticates
    }
    //reads gardens.html and renders header, navbar, hero image and seach form
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/gardens.html'), function (err, data) {
        //renders correct title of the community gardens page
        var htmlString = data.toString().replace('Say Bye to Weed Worries', 'Stay Connected')
            .replace('<span>Weed Control <', '<span>Community Gardens <');

        //the followinf if-else statement creates an sql query for all input combinations
        if (req.body.postcode == "Any" || req.body.postcode == "") {
            var queryString = "SELECT * from community_garden";
            if (req.body.rating != "Any") {
                if (req.body.rating == "two") {
                    queryString = queryString +" where rating < 2"
                }
                if (req.body.rating == "four") {
                    queryString = queryString + " where rating < 4 and rating >= 2"
                }
                if (req.body.rating == "five") {
                    queryString = queryString + " where rating < 5 and rating >= 4"
                }
            }
        }
        else {
            var queryString = "SELECT * from community_garden where postcode = " + req.body.postcode;
            if (req.body.rating != "Any") {
                if (req.body.rating == "two") {
                    queryString = queryString + " and rating < 2"
                }
                if (req.body.rating == "four") {
                    queryString = queryString + " and rating < 4 and rating >= 2"
                }
                if (req.body.rating == "five") {
                    queryString = queryString + " and rating < 5 and rating >= 4"
                }
            }
        }


        connection.query(queryString, function (error, results, fields) {
            //begins section for community gardens list
            htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container">' +
                '<div class="row d-flex justify-content-center">';

            //renders number of results
            htmlString = htmlString + '<div class="bg-light" style="width:100%;text-align:center;margin-bottom:10px"><div>';
            if (results.length == 0) {
                htmlString = htmlString + "<b><i>No results were found for the given criteria</i></b>";
            } else {
                htmlString = htmlString + "<b><i>" + results.length + " results found</i></b>"
            }
            htmlString = htmlString + '</div></div>'

            var divNumber = 0; //holds the number of paginstions for the list

            //for loop to render each comunity garden
            for (var i = 0; i < results.length; i++) {
                //if statement changes the duv number and starts new div after every 12 results
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    //id of each div is equal to its pagination page number
                    htmlString = htmlString + '<div style="display:none"' +
                        'class="number-content row col-md-12 col-sm-12 " id="' + Math.ceil((i + 1) / 12) + '">';
                }

                //holds the community garden name
                var replacement = results[i].store_name;
                //if name is too short a filler to maintain consistent card height
                if (results[i].store_name.length <= 33) {
                    var remaining = 35 - results[i].store_name.length;
                    var filler = ' <span style="color:white;white-space:pre-line">';
                    for (var k = 0; k < remaining; k++) {
                        filler = filler + "_";
                    }
                    replacement = replacement + filler + '</span>';
                }

                //holds the community garden's address
                var replacement1 = results[i].address;

                //if address is short, filler is added to maintain consistent card height
                if (results[i].store_name.length <= 83) {
                    var remaining = 91 - results[i].address.length;
                    var filler = ' <span style="color:white;white-space:pre-line">';
                    for (var k = 0; k < remaining; k++) {
                        filler = filler + "_";
                    }
                    if (results[i].address.length <= 37) {
                        filler = filler + " _________"
                    }
                    replacement1 = replacement1 + filler + '</span>';
                }

                //holds the image link of the community garden
                var image = results[i].img_link;

                //sets an image if image link does not exist
                if (!results[i].img_link) {
                    image = "/images/no-image.jpg";
                }

                //holds community garden of the website
                var website = results[i].website;
                if (!results[i].website) {
                    website = "#";
                }

                htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end">' +
                    '<a href="' + website + '" class="block-20" style="background-image: url(\'' + image + '\');"></a >' +
                    '<div class="text p-4 float-right d-block" style="text-align:left">' +
                    '<a href="' + website + '"><h3 class="heading mb-0" style="color:black;">' + replacement + '</h3></a><p>';

                //for loop to generate rating in terms of stars
                //rating is rounded in order to generate half stars
                for (var r = 0; r < 5; r++) {
                    if (results[i].rating >= r + 1) {
                        htmlString = htmlString + '<span class="fa fa-star checked" ></span >';
                    }
                    else {
                        if (Math.round(results[i].rating * 2) == ((r + 1) * 2) - 1) {
                            htmlString = htmlString + '<span class="fa fa-star-half-full checked" ></span >';
                        }
                        if (Math.round(results[i].rating * 2) == ((r + 1) * 2)) {
                            htmlString = htmlString + '<span class="fa fa-star checked" ></span >';
                        }
                        if (Math.round(results[i].rating * 2) <= ((r + 1) * 2) - 2) {
                            htmlString = htmlString + '<span class="fa fa-star" ></span>';
                        }
                    }

                }
                htmlString = htmlString + '</p ><p>';
                //address is rendered in thebelow line
                htmlString = htmlString + replacement1;
                htmlString = htmlString + '</p></div ></div ></div > '; //ends each commuity garden result

                //if statement end the pagination div
                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</div>';
                }
            }
            htmlString = htmlString + '</div></div></section>'; // ends the results section

            //creates pagination buttons
            if (results.length > 12) {
                //begins pagination buttons section
                htmlString = htmlString + '<section class="ftco-section bg-light">' +
                    '<div class="container row col-md-12 bg-light" id="collapseThree">' +
                    '<div class="col text-center"><div class="block-27"><ul>';

                //for loop generates each pagination button
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    //if statement sets the default active pagination button
                    if (j == 0) {
                        htmlString = htmlString +
                            '<li class="number justify-content-center align-items-center active" style="margin:10px"> ';
                    } else {
                        htmlString = htmlString +
                            '<li class="number justify-content-center align-items-center" style="margin:10px"> ';
                    }
                    //renders actual pagination button
                    htmlString = htmlString +
                        '<button ' +
                        'style="background-color:Transparent;border:none;outline:none" class="number-name"' +
                        ' value="' + (j + 1) + '" id="' + (j + 1) + 'button" onClick="paginateWeed(this.value)" >' + (j + 1);
                    htmlString = htmlString + '</button></li>';
                }
                htmlString = htmlString + '</ul></div></div></div></section>'; //end the pagination section
            }

            //adds necessary scripts
            htmlString = htmlString +
                '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>' +
                ' <script src = "/javascripts/weedPaginate.js" ></script >';

            //reads and renders page footer
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + data.toString();
                res.send(htmlString);
            });
        });
    });
});


module.exports = router;
