'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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
    //res.render('index', { title: path.join(__dirname +'/views/weedIdentifier.cshtml')  });
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/gardens.html'), function (err, data) {
        var htmlString = data.toString().replace('Say Bye to Weed Worries', 'Community Gardens').replace('<span>Weed Control <', '<span>Community Gardens <');
        var queryString = "SELECT * from community_garden";
        connection.query(queryString, function (error, results, fields) {
            htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container"><div class="row d-flex">';
            var divNumber = 0;
            if (error) var name = 'problem';
            for (var i = 0; i < results.length; i++) {
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    htmlString = htmlString + '<div style="display:none" class="number-content" id="' + Math.ceil((i + 1) / 12) + '">';
                }
                var replacement = results[i].store_name;
                if (results[i].store_name.length <= 33) {
                    var remaining = 35 - results[i].store_name.length;
                    var filler = ' <span style="color:white;white-space:pre-line">';
                    for (var k = 0; k < remaining; k++) {
                        filler = filler + "_";
                    }
                    replacement = replacement + filler + '</span>';
                }
                var replacement1 = results[i].address;
                if (results[i].store_name.length <= 83) {
                    var remaining = 91 - results[i].address.length;
                    var filler = ' <span style="color:white;white-space:pre-line">';
                    for (var k = 0; k < remaining/2; k++) {
                        filler = filler + "_ ";
                    }
                    if (results[i].address.length <= 40) {
                        filler = filler+"_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _"
                    }
                    replacement1 = replacement1 + filler + '</span>';
                }
                var image = "/images/no-image.jpg";
                /*if (!results[i].img_link.endsWith(".jpg")) {
                    image = "/images/no-image.jpg";
                }*/
                //htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end"><a href="/weedDescription?id=' + idUrl + '" class="block-20" style="background-image: url(\'' + image + '\');"></a ><div class="text p-4 float-right d-block"><h3 class="heading mb-0"><a href="/weedDescription?id=' + idUrl + '">' + results[i].common_name + '</a></h3><p>' + replacement + '</p><p><a href="/weedDescription?id=' + idUrl + '" class="btn btn-primary" style="font-size:12px">Read more</a></p></div></div></div>';
                htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end"><div class="text p-4 float-right d-block" style="text-align:left"><h3 class="heading mb-0" style="color:black;">' + replacement + '</h3><p>';
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
                htmlString = htmlString + replacement1;
                htmlString = htmlString +'</p></div ></div ></div > ';
                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</div>';
                }
            }
            htmlString = htmlString + '</div></div></section>';
            if (results.length > 12) {
                htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container"><div class="row d-flex">';
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    if (j == 0) {
                        htmlString = htmlString + '<div class="number d-flex justify-content-center align-items-center active"> ';
                    } else {
                        htmlString = htmlString + '<div class="number d-flex justify-content-center align-items-center"> ';
                    }
                    htmlString = htmlString + '<button style="background-color:Transparent;border:none" class="number-name" value="' + (j + 1) + '" id="' + (j + 1) + 'button" onClick="paginateWeed(this.value)" >' + (j + 1);
                    htmlString = htmlString + '</button></div>';
                }
                htmlString = htmlString + '</div></div></section>';
            }
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <script src = "/javascripts/weedPaginate.js" ></script >';
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + data.toString();
                res.send(htmlString);
            });
        });
        });
});


router.post('/', urlencodedParser, function (req, res) {
    //res.render('index', { title: path.join(__dirname +'/views/weedIdentifier.cshtml')  });
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/gardens.html'), function (err, data) {
        var htmlString = data.toString().replace('Say Bye to Weed Worries', 'Community Gardens').replace('<span>Weed Control <', '<span>Community Gardens <');
        if (req.body.postcode == "Any" || req.body.postcode == "") {
            var queryString = "SELECT * from community_garden";
        }
        else {
            var queryString = "SELECT * from community_garden where postcode = " + req.body.postcode;
        }
        connection.query(queryString, function (error, results, fields) {
            htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container"><div class="row d-flex">';
            var divNumber = 0;
            if (error) var name = 'problem';
            for (var i = 0; i < results.length; i++) {
                if (Math.ceil((i + 1) / 12) > divNumber) {
                    divNumber = divNumber + 1;
                    htmlString = htmlString + '<div style="display:none" class="number-content" id="' + Math.ceil((i + 1) / 12) + '">';
                }
                var replacement = results[i].store_name;
                if (results[i].store_name.length <= 33) {
                    var remaining = 35 - results[i].store_name.length;
                    var filler = ' <span style="color:white;white-space:pre-line">';
                    for (var k = 0; k < remaining; k++) {
                        filler = filler + "_";
                    }
                    replacement = replacement + filler + '</span>';
                }
                var replacement1 = results[i].address;
                if (results[i].store_name.length <= 83) {
                    var remaining = 91 - results[i].address.length;
                    var filler = ' <span style="color:white;white-space:pre-line">';
                    for (var k = 0; k < remaining / 2; k++) {
                        filler = filler + "_ ";
                    }
                    if (results[i].address.length <= 40) {
                        filler = filler + "_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _"
                    }
                    replacement1 = replacement1 + filler + '</span>';
                }
                var image = "/images/no-image.jpg";
                /*if (!results[i].img_link.endsWith(".jpg")) {
                    image = "/images/no-image.jpg";
                }*/
                //htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end"><a href="/weedDescription?id=' + idUrl + '" class="block-20" style="background-image: url(\'' + image + '\');"></a ><div class="text p-4 float-right d-block"><h3 class="heading mb-0"><a href="/weedDescription?id=' + idUrl + '">' + results[i].common_name + '</a></h3><p>' + replacement + '</p><p><a href="/weedDescription?id=' + idUrl + '" class="btn btn-primary" style="font-size:12px">Read more</a></p></div></div></div>';
                htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end"><div class="text p-4 float-right d-block" style="text-align:left"><h3 class="heading mb-0" style="color:black;">' + replacement + '</h3><p>';
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
                htmlString = htmlString + replacement1;
                htmlString = htmlString + '</p></div ></div ></div > ';
                if ((((i + 1) % 12) == 0) || ((i + 1) == results.length)) {
                    htmlString = htmlString + '</div>';
                }
            }
            htmlString = htmlString + '</div></div></section>';
            if (results.length > 12) {
                htmlString = htmlString + '<section class="ftco-section bg-light"><div class="container"><div class="row d-flex">';
                for (var j = 0; j < Math.ceil(results.length / 12); j++) {
                    if (j == 0) {
                        htmlString = htmlString + '<div class="number d-flex justify-content-center align-items-center active"> ';
                    } else {
                        htmlString = htmlString + '<div class="number d-flex justify-content-center align-items-center"> ';
                    }
                    htmlString = htmlString + '<button style="background-color:Transparent;border:none" class="number-name" value="' + (j + 1) + '" id="' + (j + 1) + 'button" onClick="paginateWeed(this.value)" >' + (j + 1);
                    htmlString = htmlString + '</button></div>';
                }
                htmlString = htmlString + '</div></div></section>';
            }
            htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <script src = "/javascripts/weedPaginate.js" ></script >';

            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + data.toString();
                res.send(htmlString);
            });
        });
    });
});


module.exports = router;
