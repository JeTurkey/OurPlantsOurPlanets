/*
 * This route renders the garden planner page
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

//connection to database
connection.connect();

//initiate parser that will read search form date
var urlencodedParser = bodyParser.json();

/*GET Garden Planner Page*/
router.get('/', function (req, res) {
    //checks if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    //reads search plants.html and renders header, navbar, hero image and search form
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/searchPlants.html'), function (err, data) {
        //query to get all plants in the database
        var queryString = "SELECT * from native_flora";
        var htmlString = data.toString();

        //runs sql query
        connection.query(queryString, function (error, results, fields) {
            if (error) var name = 'problem';
            //begins section for plant results
            htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container">' +
                '<div class="row d-flex justify-content-center">';
            var divNumber = 0; //hold number of paginations for results

            //for loop to render each plant in the database
            for (var i = 0; i < results.length; i++) {
                //conditianal increments pagination number for every twelve results
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    //begins pagination div
                    htmlString = htmlString +
                        '<div style="display:none" class="number-content row col-md-12 col-sm-12" id="' + Math.ceil((i + 1) / 12) + '">';
                }

                var plantName = results[i].common_name;

                //adds filler to plant name to maintian height consistency of cards
                 if (plantName.length <= 33) {
                     plantName = plantName + ' <span style="color:white"><br />__________________________________________</span>';
                }

                var fill = "";
                //adds filler to plant description to maintian height consistency of cards
                 if (results[i].flower_color.length < 23) {
                     fill = '<span style="color: white"><br />____</span>';
                }

                var image = '/images/native_plants/' + results[i].common_name.split(' ').join('_') + '.jpg';
                //assigns image if image in the database in null 
                if (results[i].img_link == "" || !results[i].img_link) {
                    image = "/images/no-image.jpg";
                }
                //renders content in each card
                htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end">' +
                    '<a class="block-20" style="background-image: url(\'' + image + '\');"></a >' +
                    '<div class="text p-4 float-right d-block"><h3 class="heading mb-0"><a>' + plantName + '</a></h3><p>' +
                    "Flower Color: " + results[i].flower_color + '<br />' + "Height: " + results[i].min_height + " - " +
                    results[i].max_height + 'm<br />' + "Season:" + results[i].flower_time + '<br />' +
                    "Soil Texture: " + results[i].soil_texture + fill +
                    '</p><p><a class="btn btn-primary" style="font-size:12px"  onClick="addToColl(\'' + results[i].common_name +
                    '\')">Add to Collection</a></p></div></div></div>';

                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</div>'; //ends pagination div
                }
            }
            htmlString = htmlString + '</div></div></section>'; //ends results section

            //begins pagination section
            if (results.length > 12) {
                htmlString = htmlString + '<div class="container row col-md-12 bg-light" id="collapseThree">' +
                    '<div class="col text-center"><div class="block-27"><ul>';
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    //if-else sets the first page as active in the pagination
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
                htmlString = htmlString + '</ul></div></div></div>'; //ends pagination div
            }

            //includes necessary scripts
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>' +
                ' <script src = "/javascripts/weedPaginate.js" ></script ><script src = "/javascripts/addToCollection.js" ></script >';
            //renders footer and sends response
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + data.toString();
                res.send(htmlString);
            });
        });
    });
});

//post request
router.post('/', urlencodedParser, function (req, res) {
    //checks if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }

     //reads search plants.html and renders header, navbar, hero image and search form
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/searchPlants.html'), function (err, data) {

        //process input string to prevent xss attacks
        req.body.subject = req.body.subject.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

        //generates sql query for all input combinations
        var queryString = "SELECT * from native_flora where common_name like '%" + req.body.subject + "%'";
        if (req.body.color != "Any") {
            queryString = queryString + " AND flower_color like '%" + req.body.color + "%'";
        }
        if (req.body.season != "Any") {
            queryString = queryString + " AND flower_time like '%" + req.body.season + "%'";
        }
        if (req.body.texture != "Any") {
            queryString = queryString + " AND soil_texture like '%" + req.body.texture + "%'";
        }
        if (req.body.height != "Any") {
            if (req.body.height == "Short") {
                queryString = queryString + " AND max_height <= 1";
            }
            if (req.body.height == "Medium") {
                queryString = queryString + " AND max_height >= 1 AND max_height <= 5";
            }
            if (req.body.height == "Tall") {
                queryString = queryString + " AND max_height >= 5";
            }
        }
        var htmlString = data.toString();

        //runs sql query
        connection.query(queryString, function (error, results, fields) {
            if (error) var name = 'problem';

            //renders number of results
            htmlString = htmlString + '<div class="bg-light" style="width:100%;text-align:center"><div>';
            if (results.length == 0) {
                htmlString = htmlString + "<b><i>No results were found for the given criteria</i></b>";
            } else {
                htmlString = htmlString + "<b><i>" + results.length + " results found</i></b>"
            }
            htmlString = htmlString + '</div></div>'

            //begins section for plant results
            htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container">' +
                '<div class="row d-flex justify-content-center">';
            var divNumber = 0; //hold number of paginations for results

            //for loop to render each plant in the database
            for (var i = 0; i < results.length; i++) {
                //conditianal increments pagination number for every twelve results
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    //begins pagination div
                    htmlString = htmlString +
                        '<div style="display:none" class="number-content row col-md-12 col-sm-12" id="' + Math.ceil((i + 1) / 12) + '">';
                }

                var plantName = results[i].common_name;

                //adds filler to plant name to maintian height consistency of cards
                if (plantName.length <= 33) {
                    plantName = plantName + ' <span style="color:white"><br />__________________________________________</span>';
                }

                var fill = "";
                //adds filler to plant description to maintian height consistency of cards
                if (results[i].flower_color.length < 23) {
                    fill = '<span style="color: white"><br />____</span>';
                }

                var image = '/images/native_plants/' + results[i].common_name.split(' ').join('_') + '.jpg';
                //assigns image if image in the database in null 
                if (results[i].img_link == "" || !results[i].img_link) {
                    image = "/images/no-image.jpg";
                }
                //renders content in each card
                htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end">' +
                    '<a class="block-20" style="background-image: url(\'' + image + '\');"></a >' +
                    '<div class="text p-4 float-right d-block"><h3 class="heading mb-0"><a>' + plantName + '</a></h3><p>' +
                    "Flower Color: " + results[i].flower_color + '<br />' + "Height: " + results[i].min_height + " - " +
                    results[i].max_height + 'm<br />' + "Season:" + results[i].flower_time + '<br />' +
                    "Soil Texture: " + results[i].soil_texture + fill +
                    '</p><p><a class="btn btn-primary" style="font-size:12px"  onClick="addToColl(\'' + results[i].common_name +
                    '\')">Add to Collection</a></p></div></div></div>';

                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</div>'; //ends pagination div
                }
            }
            htmlString = htmlString + '</div></div></section>'; //ends results section

            //begins pagination section
            if (results.length > 12) {
                htmlString = htmlString + '<div class="container row col-md-12 bg-light" id="collapseThree">' +
                    '<div class="col text-center"><div class="block-27"><ul>';
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    //if-else sets the first page as active in the pagination
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
                htmlString = htmlString + '</ul></div></div></div>'; //ends pagination div
            }

            //includes necessary scripts
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>' +
                ' <script src = "/javascripts/weedPaginate.js" ></script ><script src = "/javascripts/addToCollection.js" ></script >';
            //renders footer and sends response
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + data.toString();
                res.send(htmlString);
            });
        });
    });
});

//the following post request adds a plant to the user's collection
router.post('/clicked', urlencodedParser, function (req, res, next) {
    //checks if user is authenticated
    if (!req.session.cookie) {
        req.session.acookie = req.body.name;
    }
    else {
        //adds plant to the cookie
        req.session.acookie = req.session.acookie +","+ req.body.name;
    }
    //saves the cookie
    req.session.save();
    //sends success response
    res.json(req.session.acookie);
});
            
        
module.exports = router;