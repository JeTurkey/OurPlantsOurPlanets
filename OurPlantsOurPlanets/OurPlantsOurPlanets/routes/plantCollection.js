/*
 * This route renders the plant collection page
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

//post request
//this post route deletes plants from the plant combination on user request
router.post('/', function (req, res) {
    //removes the plant from the cookie
    req.session.acookie = req.session.acookie.split("," + req.query.id).join("");
    //redirects to the plant collection page
    res.redirect("/plantCollection");
});


/* GET plant collection page. */
router.get('/', function (req, res) {
    //checks if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }

    //initiaates html string that will be rendered on the front end
    var htmlString = "";

    //reads and renders header, navbar
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/header1.html'), function (err, data) {
        htmlString = htmlString + data.toString();

        //reads and renders hero image division
        fs.readFile(path.join('D:/home/site/wwwroot' + '/views/weedEncyclopedia.html'), function (err, data) {
            //sets the correct page title and hero image
            htmlString = htmlString + data.toString().substr(1)
                .replace("Weed Encyclopaedia", "Garden Planner").replace("bg-weedcontrol", "IMG-20200518-WA0003 (1)");

            //checks if plants plants have been added to the collection
            if (!req.session.acookie) {
                htmlString = htmlString + '<section class="ftco-section">' +
                    '<div class="col-md-12 heading-section" style="text-align:center;margin-top:10px;margin-bottom:10px">' +
                    '<p>There are currently no plants in your collection. Please add more plants to expore plant combinations!</p>' +
                    '</div></section>';
                //renders footer and sends final response
                fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                    htmlString = htmlString + data.toString();
                    res.send(htmlString);
                });
            } else {

                //processes cookie and formats into a list
                var plants = req.session.acookie.split(",");
                var list = "";
                for (var p = 0; p < plants.length; p++) {
                    if (p != plants.length - 1) {
                        plants[p] = "'" + plants[p] + "',";
                    }
                    else {
                        plants[p] = "'" + plants[p] + "'";
                    }
                    list = list + plants[p];
                }

                //sql query to get all plants in collection
                var queryString = 'SELECT * from native_flora where common_name in (' + list + ');';

                //runs sql query
                connection.query(queryString, function (error, results, fields) {
                    //begins section for plant combinations
                    htmlString = htmlString + '<section class="ftco-section">' +
                        '<div class="col-md-12 heading-section" style="text-align:center;margin-top:10px;margin-bottom:10px">' +
                        '<span class="subheading" style="width:100%;text-align:center"> Step 2 </span>' +
                        '<h2 class="mb-4" style="width:100%;text-align:center">Design Ideas</h2></div></section>';
                    htmlString = htmlString + '<section class="ftco-section container"><div class="row" id="collapseOne">' +
                        '<div class="row d-flex col-md-8 justify-content-center align-items-center" style="">';
                    var maxheight = 0;
                    var minheight = 1000;
                    
                    var color = ['Pink', 'White', 'Purple', 'Plum', 'Ivory', 'Red', 'Yellow', 'Black', 'Cream', 'Orange', 'Brown', 'Green'];
                    var colorsPresent = [false, false, false, false, false, false, false, false, false, false, false, false];
                    var season = ['Spring', 'Summer', 'Autumn', 'Winter'];
                    var seasonPresent = [false, false, false, false];
                    var texture = ['Sa', 'Lo', 'Cl', 'Li'];
                    var texturePresent = [false, false, false, false];
                    var textureString = "";
                    var seasonString = "";
                    var colorString = "";

                    //for loop to display combination and generate summarized garden data
                    for (var t = 0; t < results.length; t++) {
                        //renders plant image
                        htmlString = htmlString +
                            '<div><a class="block-20" style="background-image: url(\'' + results[t].img_link + '\');width:150px;height:150px">' +
                            '</a ></div>';

                        //computes minumum height
                        if (results[t].min_height < minheight) { minheight = results[t].min_height; }

                        //computes maximum height
                        if (results[t].max_height > maxheight) { maxheight = results[t].max_height; }

                        //checks which colors are present in the combination
                        for (var i = 0; i < color.length; i++) {
                            if (results[t].flower_color.indexOf(color[i]) != -1) {
                                colorsPresent[i] = true
                            }
                        }

                        //checks which blooming seasons are present in the collection
                        for (var i = 0; i < season.length; i++) {
                            if (results[t].flower_time.indexOf(season[i]) != -1 || results[t].flower_time.indexOf("eason") != -1 ) {
                                seasonPresent[i] = true
                            }
                        }

                        //checks which soil textures are present in the collection
                        for (var i = 0; i < texture.length; i++) {
                            if (results[t].soil_texture.indexOf(texture[i]) != -1) {
                                texturePresent[i] = true
                            }
                        }
                        
                    }

                    //creates summarized soil texture string
                    for (var i = 0; i < texture.length; i++) {
                        if (texturePresent[i] == true) {
                            textureString = textureString + texture[i] + ",";
                        }
                    }

                    //creates summarized seasons string
                    for (var i = 0; i < season.length; i++) {
                        if (seasonPresent[i] == true) {
                            seasonString = seasonString + season[i] + ",";
                        }
                    }

                    //creates summarized color string
                    for (var i = 0; i < color.length; i++) {
                        if (colorsPresent[i] == true) {
                            colorString = colorString + color[i] + ",";
                        }

                    }
                    htmlString = htmlString + '</div><div class="container col-md-4">';

                    //begins garden summary table
                    htmlString = htmlString + '<table style="width:100%;text-align:center;margin-left:20px;border:1px solid #4e9525">' +
                        '<tr><th style="text-align:center;background-color:#4e9525;color:white;padding:8px">Garden Overview</th></tr><tr>';
                    //renders row for suumarized height
                    htmlString = htmlString + "<td><b>Height:</b><br/> " + minheight + " - " + maxheight + "meters</td></tr>";
                    //renders row for summarized soil texture
                    htmlString = htmlString + "<tr><td><b>Soil Textures:</b><br/> " +
                        textureString.substr(0, textureString.length - 1) + "</td></tr>";
                    //renders row for summarized blooming seasons
                    htmlString = htmlString + "<tr><td><b>Seasons:</b><br/> " + seasonString.substr(0, seasonString.length - 1) + "</td></tr>";
                    //renders row for summarized flower colors
                    htmlString = htmlString + "<tr><td><b>Flower Colors:</b><br/> " + colorString.substr(0, colorString.length - 1) + "</td></tr>";
                    htmlString = htmlString + "</table>";
                    htmlString = htmlString + "</div></div></section>"; // ends combination section

                    //for loop to generate detailed collection table
                    for (var t = 0; t < results.length; t++) {
                        if (t == 0) {
                            //renders title and subtitle of table
                            htmlString = htmlString + '<section class="ftco-section">' +
                                '<div class="col-md-12 heading-section" style="text-align:center;margin-top:60px;margin-bottom:15px">' +
                                '<span class="subheading" style="width:100%;text-align:center"> Your Plants </span>' +
                                '<h2 class="mb-4" style="width:100%;text-align:center">Plants in Your Collection</h2></div>' +
                                '</section><section class="ftco-section">';
                            //begins table
                            htmlString = htmlString +
                                '<table class="container col-md12 table-responsive-sm" style="width:100%; border:1px solid #4e9525">';
                            //renders table header
                            htmlString = htmlString + '<tr style="background-color:#4e9525;color:white;text-align:center">' +
                                '<th>Image</th><th style="padding:10px">Name</th><th>Minimum Height</th><th>Maximum Height</th>' +
                                '<th>Flower Color</th><th>Flower Time</th><th>Soil Texture</th><th style="color:#4e9525">Edit</th></tr>';
                        }

                        //renders each row of table
                        htmlString = htmlString + '<tr style="text-align:center">';
                        htmlString = htmlString + '<td>' +
                            '<a class="block-20" style="background-image: url(\'' + results[t].img_link + '\');width:120px;height:120px"></a>' + '</td>';
                        htmlString = htmlString + '<td>' + results[t].common_name + '</td>';
                        htmlString = htmlString + '<td>' + results[t].min_height + '</td>';
                        htmlString = htmlString + '<td>' + results[t].max_height + '</td>';
                        htmlString = htmlString + '<td>' + results[t].flower_color + '</td>';
                        htmlString = htmlString + '<td>' + results[t].flower_time + '</td>';
                        htmlString = htmlString + '<td>' + results[t].soil_texture + '</td>';
                        htmlString = htmlString + '<td>' +
                            '<form autocomplete="off" action="/plantCollection?id=' + results[t].common_name + '" method="POST">' +
                            '<input type="submit" value="Remove" class="btn btn-primary" style="font-size:medium;margin-top:5px"></form>' +
                            '</td>';
                        htmlString = htmlString + '</tr>';
                    }
                    htmlString = htmlString + "</table></section>";//ends table section
                    //reads and renders footer
                    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                        htmlString = htmlString + data.toString();
                        res.send(htmlString);
                    });
                });
                
                
            }
        });
    });
});

module.exports = router;