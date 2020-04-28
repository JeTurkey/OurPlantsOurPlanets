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

//make connection to database
connection.connect();

/* GET weed description page. */
router.get('/', function (req, res) {
    //intialize html string that will be deployes
    var htmlString = "";

    //get header file
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/header1.html'), function (err, data) {
        htmlString = htmlString + data.toString();
        //remove additional characters
        htmlString = htmlString.replace("&#65279", "");
        //get encylopedia image section
        fs.readFile(path.join('D:/home/site/wwwroot' + '/views/weedEncyclopedia.html'), function (err, data) {
            //remove characters that are additional and customize title
            htmlString = htmlString + data.toString().substr(1).replace("Weed Encyclopaedia", req.query.id);
            //get required information for weed
            var queryString = 'SELECT * from weed where common_name="' + req.query.id + '"';
            //execute query
            connection.query(queryString, function (error, results, fields) {
                if (error) var name = 'problem';
                //create sectioning in page
                htmlString = htmlString + '<section class="ftco-section align-content-center" style="background:Transparent">';
                htmlString = htmlString + '<div class="row justify-content-center mb-5" > <div class="col-md-10 text-center heading-section" >';
                htmlString = htmlString + '<h1 class="heading-section">' + results[0].common_name + '</h1>';
                htmlString = htmlString + '<b><i>' + results[0].appearance_description + '</i></b>';
                htmlString = htmlString + '</div></div>';
                htmlString = htmlString + '<section class="ftco-section bg-light" id="descRow"><div class="container"><div class="row d-flex">';
                htmlString = htmlString + '<div class="desc d-flex justify-content-center align-items-center active"> ';
                //display tabs with links
                htmlString = htmlString + '<a style="background-color:Transparent;border:none" class="desc-name" value="' + "Anatomy" + '" id="' + "Anatomy" + 'button" href="#Anatomy" >' + "Anatomy";
                htmlString = htmlString + '</a></div>';
                htmlString = htmlString + '<div class="desc d-flex justify-content-center align-items-center">';
                htmlString = htmlString + '<a style="background-color:Transparent;border:none" class="desc-name" value="' + "Impact" + '" id="' + "Impact" + 'button" href="#Impact" >' + "Impact";
                htmlString = htmlString + '</a></div>';
                htmlString = htmlString + '<div class="desc d-flex justify-content-center align-items-center">';
                htmlString = htmlString + '<a style="background-color:Transparent;border:none" class="desc-name" value="' + "ControlMethods" + '" id="' + "ControlMethods" + 'button" href="#ControlMeasures" >' + "Control"+'<span style="color:Transparent;">_</span>'+"Measures";
                htmlString = htmlString + '</a></div>';
                htmlString = htmlString + '</div></div></section>';
                //display anatomy conent
                htmlString = htmlString + '<div style="display:none;margin:7px" class="desc-content" id="Anatomy">';
                htmlString = htmlString + '<img style="float:left;margin:20px 20px 10px 20px" src="' + results[0].img_link + '">';
                htmlString = htmlString + '<p><b style="color:black">Scientific Name: </b>' + results[0].scientific_name + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Leaf: </b>' + results[0].leaves_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Stem: </b>' + results[0].stems_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Flower: </b>' + results[0].flowers_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Fruit: </b>' + results[0].fruit_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Root: </b>' + results[0].root_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Seeds: </b>' + results[0].seeds_description + '</p>';
                htmlString = htmlString + '</div>';
                //display control methods
                htmlString = htmlString + '<div style="display:none" class="desc-content" id="ControlMethods">';
                htmlString = htmlString + '<p>' + results[0].control_description + '</p></div>';
                //get impact related to weed
                queryString = 'SELECT * from impact_assessment where common_name="' + req.query.id + '"';
                //execute query
                connection.query(queryString, function (error, results, fields) {
                    //display table for each impact type
                    htmlString = htmlString + '<div style="display:none" class="desc-content" id="Impact">';
                    if (results.length > 0) {
                        htmlString = htmlString + '<table style="width:80%;margin-left:10%;margin-right:10%;border:1px solid grey;border-collapse:collapse"><tr><th style="border:1px solid grey;padding:5px">Impact Type</th><th style="border:1px solid grey;padding:5px">Impact Description</th><th style="border:1px solid grey;padding:5px">Impact Level</th></tr>';
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].impact_level != "") {
                                htmlString = htmlString + '<tr style="color:black"><td style="border:1px solid grey;padding:5px">' + results[i].impact_type + '</td><td style="border:1px solid grey;padding:5px">' + results[i].impact_description + '</td><td style="border:1px solid grey;padding:5px">' + results[i].impact_level + '</td></tr>';
                            }
                            }
                        htmlString = htmlString + '</table></div></section>';
                    }
                });
            });
            //render footer
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <script src = "/javascripts/weedDetailedDesc.js" ></script >';
                htmlString = htmlString + data.toString();
                //deploy page
                res.send(htmlString);
            });
        });
    });
});

module.exports = router;
