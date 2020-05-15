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
    var htmlString = "";
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/header1.html'), function (err, data) {
        htmlString = htmlString + data.toString();
        fs.readFile(path.join('D:/home/site/wwwroot' + '/views/weedEncyclopedia.html'), function (err, data) {
            htmlString = htmlString + data.toString().substr(1).replace("Weed Encyclopaedia", "Plant Collection").replace("Weed Control", "Plant Collection");
            if (!req.session.acookie) {
                res.send(htmlString + "<div></div>");
            } else {
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
                var queryString = 'SELECT * from native_flora where common_name in (' + list + ');';
                connection.query(queryString, function (error, results, fields) {
                    htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container col-md-12" id="collapseOne"><div class="row d-flex col-md-8">';
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
                    for (var t = 0; t < results.length; t++) {
                        htmlString = htmlString + '<div><a class="block-20" style="background-image: url(\'' + results[t].img_link + '\');width:150px;height:150px"></a ></div>';
                        if (results[t].min_height < minheight) { minheight = results[t].min_height; }
                        if (results[t].max_height > maxheight) { maxheight = results[t].max_height; }
                        for (var i = 0; i < color.length; i++) {
                            if (results[t].flower_color.indexOf(color[i]) != -1) {
                                colorsPresent[i] = true
                            }
                        }
                        for (var i = 0; i < season.length; i++) {
                            if (results[t].flower_time.indexOf(season[i]) != -1 || results[t].flower_time.indexOf("eason") != -1 ) {
                                seasonPresent[i] = true
                            }
                        }
                        for (var i = 0; i < texture.length; i++) {
                            if (results[t].soil_texture.indexOf(texture[i]) != -1) {
                                texturePresent[i] = true
                            }
                        }
                        
                    }

                    for (var i = 0; i < texture.length; i++) {
                        if (texturePresent[i] == true) {
                            textureString = textureString + texture[i] + ",";
                        }
                    }
                    for (var i = 0; i < season.length; i++) {
                        if (seasonPresent[i] == true) {
                            seasonString = seasonString + season[i] + ",";
                        }
                    }
                    for (var i = 0; i < color.length; i++) {
                        if (colorsPresent[i] == true) {
                            colorString = colorString + color[i] + ",";
                        }
                    }
                    htmlString = htmlString + '</div><div class="container col-md-4">';
                    htmlString = htmlString + '<table style="width:100%;text-align:center"><tr><th style="text-align:center">Garden Overview</th></tr><tr>';
                    htmlString = htmlString + "<td>Height:<br/> " + minheight + " - " + maxheight + "meters</td></tr>";
                    htmlString = htmlString + "<tr><td>Soil Textures:<br/> " + textureString.substr(0, textureString.length - 1) + "</td></tr>";
                    htmlString = htmlString + "<tr><td>Seasons:<br/> " + seasonString.substr(0, seasonString.length - 1) + "</td></tr>";
                    htmlString = htmlString + "<tr><td>Flower Colors:<br/> " + colorString.substr(0, colorString.length - 1) + "</td></tr>";
                    htmlString = htmlString + "</table>";
                    htmlString = htmlString + "</div></div></section>";
                    res.send(htmlString);
                });
                
                
            }
        });
    });
});

module.exports = router;