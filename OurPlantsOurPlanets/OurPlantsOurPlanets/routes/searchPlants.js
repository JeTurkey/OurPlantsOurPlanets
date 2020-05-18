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
var urlencodedParser = bodyParser.json();
router.get('/', function (req, res) {
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/searchPlants.html'), function (err, data) {
        var queryString = "SELECT * from native_flora";
        var htmlString = data.toString();
        connection.query(queryString, function (error, results, fields) {
            if (error) var name = 'problem';
            /*htmlString = htmlString + '<div class="bg-light" style="width:100%;text-align:center"><div>';
            if (results.length == 0) {
                htmlString = htmlString + "<b><i>No results were found for the given criteria</i></b>";
            } else {
                htmlString = htmlString + "<b><i>" + results.length + " results found</i></b>"
            }
            htmlString = htmlString + '</div></div>'*/
            htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container"><div class="row d-flex">';
            var divNumber = 0;
             for (var i = 0; i < results.length; i++) {
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    htmlString = htmlString + '<div style="display:none" class="number-content" id="' + Math.ceil((i + 1) / 12) + '">';
                 }
                 var plantName = results[i].common_name;
                 if (plantName.length <= 33) {
                     plantName = plantName + ' <span style="color:white"><br />__________________________________________</span>';
                 }
                 var fill = "";
                 if (results[i].flower_color.length < 23) {
                     fill = '<span style="color: white"><br />____</span>';
                 }
                var image = results[i].img_link;
                if (results[i].img_link == "" || !results[i].img_link) {
                    image = "/images/no-image.jpg";
                 }
                 htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end"><a class="block-20" style="background-image: url(\'' + image + '\');"></a ><div class="text p-4 float-right d-block"><h3 class="heading mb-0"><a>' + plantName + '</a></h3><p>' + "Flower Color: " + results[i].flower_color + '<br />' + "Height: " + results[i].min_height + " - " + results[i].max_height + 'm<br />' + "Season:" + results[i].flower_time + '<br />' + "Soil Texture: " + results[i].soil_texture + fill + '</p><p><a class="btn btn-primary" style="font-size:12px"  onClick="addToColl(\'' + results[i].common_name +'\')">Add to Collection</a></p></div></div></div>';
                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</div>';
                }
            }
            htmlString = htmlString + '</div></div></section>';
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
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <script src = "/javascripts/weedPaginate.js" ></script ><script src = "/javascripts/addToCollection.js" ></script >';
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + data.toString();
                res.send(htmlString);
            });
        });
    });
});

router.post('/', urlencodedParser, function (req, res) {
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/searchPlants.html'), function (err, data) {
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
        connection.query(queryString, function (error, results, fields) {
            if (error) var name = 'problem';
            htmlString = htmlString + '<div class="bg-light" style="width:100%;text-align:center"><div>';
            if (results.length == 0) {
                htmlString = htmlString + "<b><i>No results were found for the given criteria</i></b>";
            } else {
                htmlString = htmlString + "<b><i>" + results.length + " results found</i></b>";
            }
            htmlString = htmlString + '</div></div>';
            htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container"><div class="row d-flex">';
            var divNumber = 0;
            for (var i = 0; i < results.length; i++) {
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    htmlString = htmlString + '<div style="display:none" class="number-content" id="' + Math.ceil((i + 1) / 12) + '">';
                }
                var plantName = results[i].common_name;
                if (plantName.length <= 33) {
                    plantName = plantName + ' <span style="color:white"><br />__________________________________________</span>';
                }
                var fill = "";
                if (results[i].flower_color.length < 23) {
                    fill = '<span style="color: white"><br />____</span>';
                }
                var image = results[i].img_link;
                if (results[i].img_link == "" || !results[i].img_link) {
                    image = "/images/no-image.jpg";
                }
                htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end"><a class="block-20" style="background-image: url(\'' + image + '\');"></a ><div class="text p-4 float-right d-block"><h3 class="heading mb-0"><a>' + plantName + '</a></h3><p>' + "Flower Color: " + results[i].flower_color + '<br />' + "Height: " + results[i].min_height + " - " + results[i].max_height + 'm<br />' + "Season:" + results[i].flower_time + '<br />' + "Soil Texture: " + results[i].soil_texture + fill + '</p><p><a class="btn btn-primary" style="font-size:12px"  onClick="addToColl(\'' + results[i].common_name+'\')">Add to Collection</a></p></div></div></div>';
                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</div>';
                }
            }
            htmlString = htmlString + '</div></div></section>';
            if (results.length > 12) {
                console.log('click');
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
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <script src = "/javascripts/weedPaginate.js" ></script ><script src = "/javascripts/addToCollection.js" ></script >';
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + data.toString();
                res.send(htmlString);
            });
        });
    });
});

router.post('/clicked', urlencodedParser, function (req, res, next) {
    if (!req.session.cookie) {
        req.session.acookie = req.body.name;
    }
    else {
        req.session.acookie = req.session.acookie +","+ req.body.name;
    }
    req.session.save();
    res.json(req.session.acookie);
});
            
        
module.exports = router;