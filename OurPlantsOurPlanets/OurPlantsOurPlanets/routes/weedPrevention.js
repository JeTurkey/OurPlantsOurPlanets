/*
 * This route renders the weed prevention page
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

//create database connection
connection.connect();


/* GET weed prevention page. */
router.get('/', function (req, res) {
    //check if user is authenticated
    if (!req.session.allowedAccess) {
        res.redirect('/authenticate');
    }
    else {
        var htmlString = "";
        //renders header and navbar
        fs.readFile(path.join('D:/home/site/wwwroot' + '/views/header1.html'), function (err, data) {
            htmlString = htmlString + data.toString();
            htmlString = htmlString.replace("&#65279", "");
            //renders hero image
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/weedEncyclopedia.html'), function (err, data) {
                //sets corrects heading and image for the page
                htmlString = htmlString + data.toString().substr(1)
                    .replace("Weed Encyclopaedia", "Be proactive, and Stay Ahead of Weeds").replace("Weed Control", "Weed Prevention");
                //sets heading and subheading of page
                htmlString = htmlString +
                    '<section id="care-area" class="ftco-section"><div class="container"><div class="row justify-content-center mb-5" >' +
                    ' <div class="col-md-10 text-center heading-section" >' +
                    '<span class="subheading" style="width:100%;text-align:center"> Weed Prevention </span>' +
                    '<h2 class="mb-4">Weed Growth Predictions</span></div></div>';
                //sets page content
                htmlString = htmlString + "<p style=\"font-weight:500;text-align:center\">" +
                    "Prevention is better than cure! Help prevent weeds from germinating throughout the year near your locality."+
                "The best way to manage weeds is to prevent them from becoming established in the first place," +
                    " check our weed predictor to help you through the coming months!" + "</p>";
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "Spetember", "October", "November", "December"];

                //sql query to get predictions for current month
                var queryString = 'SELECT weed.common_name, img_link,basic_description,month from weed ' +
                    'join germination on weed.common_name=germination.common_name where month = "' + months[new Date().getMonth()] + '"';
                //runs query
                connection.query(queryString, function (error, results, fields) {
                    if (error) var name = 'problem';

                    //starts first month section
                    htmlString = htmlString + '<section class="ftco-section bg-light">' +
                        '<div class="row justify-content-center" style="background-color:#4e9525;color:white;margin-bottom:0">' +
                        '<div class="btn btn-link" style="font-size:25px;margin:0;width:100%" type="button" ' +
                        'data-toggle="collapse" data-target="#collapseOne"">' +
                        '<div class="btn btn-link c1 h2" style="font-size:25px;color:white;text-decoration:none;margin:0;float:left" ' +
                        'type="button" data-toggle="collapse" data-target="#collapseOne""> </div>' +
                        '<h2 class="btn btn-link h2" style="font-size: 25px;color:white;text-decoration:none; margin: 0" type="button" ' +
                        'data-toggle="collapse" data-target="#collapseOne"" > ' + months[(new Date().getMonth())] + '</h2 ></div ></div > ';
                   
                    var divNumber = 0; // holds pagination number

                    //renders pagination above list
                    if (results.length > 6) {
                        htmlString = htmlString + '<div class="container row" id="collapseOne"><div class="col text-center">' +
                            '<div class="block-27"><ul>';
                        for (var j = 0; j < Math.ceil(results.length / 6); j++) {
                            if (j == 0) {
                                htmlString = htmlString +
                                    '<li class="number justify-content-center align-items-center active" ' +
                                    'style="margin:10px;margin-bottom:20px"> ';
                            } else {
                                htmlString = htmlString +
                                    '<li class="number  justify-content-center align-items-center" style="margin:10px;margin-bottom:20px"> ';
                            }
                            htmlString = htmlString + '<button style="background-color:Transparent;border:none;outline:none" ' +
                                'class="number-name" value="' + (j + 1) + '" id="' + (j + 1) +
                                'buttonb" onClick="paginateWeed(this.value)" >' + (j + 1);
                            htmlString = htmlString + '</button></li>';
                        }
                        htmlString = htmlString + '</ul></div></div></div>';
                    }
                    htmlString = htmlString + '<div class="container" id="collapseOne"><div class="row d-flex justify-content-center">';

                    //for loop renders cards in the month
                    for (var i = 0; i < results.length; i++) {
                        if (Math.ceil((i + 1) / 6) > divNumber) {
                            divNumber = divNumber + 1;
                            htmlString = htmlString + '<div style="display:none" class="number-content row col-md-12 col-sm-12" id="' +
                                Math.ceil((i + 1) / 6) + '">';
                        }

                        //adds filler to keep card height consistent
                        var replacement = results[i].common_name;
                        var filler = ' <span style="color:white">';
                        for (var k = 0; k < 15; k++) {
                            filler = filler + "_ ";
                        }
                        filler = filler + '</span>';
                        replacement = filler;

                        var idUrl = results[i].common_name;
                        var image = '/images/weeds/' + results[i].common_name.split(' ').join('_') + '.jpg';

                        //assigns default image if image link is not valid
                        if (!results[i].img_link) {
                            image = "/images/no-image.jpg";
                        }

                        //renders indivdual cards
                        htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end">' +
                            '<a href="/weedDescription?id=' + idUrl + '" class="block-20" style="background-image: url(\'' +
                            image + '\');"></a ><div class="text p-4 float-right d-block"><h3 class="heading mb-0">' +
                            '<a href="/weedDescription?id=' + idUrl + '">' + results[i].common_name + '</a></h3><p style="height:3px">' +
                            replacement + '</p><p><a href="/weedDescription?id=' + idUrl +
                            '" class="btn btn-primary" style="font-size:13px">Read more</a></p></div></div></div>';

                        if ((((i + 1) % 6) == 0) || ((i + 1) == results.length)) {
                            htmlString = htmlString + '</div>';//ends pagination section
                        }

                    }
                    htmlString = htmlString + '</div></div>';

                    //renders pagination below cards
                    if (results.length > 6) {
                        htmlString = htmlString + '<div class="container row" id="collapseOne"><div class="col text-center">' +
                            '<div class="block-27"><ul>';
                        for (var j = 0; j < Math.ceil(results.length / 6); j++) {
                            if (j == 0) {
                                htmlString = htmlString +
                                    '<li class="number justify-content-center align-items-center active" style="margin:10px;margin-bottom:20px"> ';
                            } else {
                                htmlString = htmlString +
                                    '<li class="number  justify-content-center align-items-center" style="margin:10px;margin-bottom:20px"> ';
                            }
                            htmlString = htmlString +
                                '<button style="background-color:Transparent;border:none;outline:none" class="number-name" value="' +
                                (j + 1) + '" id="' + (j + 1) + 'buttona" onClick="paginateWeed(this.value)" >' + (j + 1);
                            htmlString = htmlString + '</button></li>';
                        }
                        htmlString = htmlString + '</ul></div></div></div>';
                    }

                    //sql query to get results for the next month
                    var queryString = 'SELECT weed.common_name, img_link,basic_description,month from weed ' +
                        ' join germination on weed.common_name=germination.common_name where month = "' +
                        months[(new Date().getMonth()) + 1] + '"';

                    //runs query
                    connection.query(queryString, function (error, results, fields) {
                        //begins next month section
                        htmlString = htmlString + '<div class="row justify-content-center" style="background-color:#4e9525;color:white;' +
                            'margin-bottom:0;margin-top:15px">' +
                            '<div class="btn btn-link collapsed" style = "font-size:25px;margin:0;width:100%" type = "button" ' +
                            'data-toggle="collapse" data-target="#collapseTwo"">' +
                            '<div class="btn btn-link c2 collapsed h2" ' +
                            'style="font-size:25px;color:white;text-decoration:none;margin:0;float:left" type="button" ' +
                            'data-toggle="collapse" data-target="#collapseTwo""> </div>' +
                            '<h2 class="btn btn-link collapsed h2" style = "font-size: 25px;color:white;text-decoration:none; margin: 0" ' +
                            'type="button" data-toggle="collapse" data-target="#collapseTwo"" > ' +
                            months[(new Date().getMonth()) + 1] + '</h2 ></div ></div > ';
                        htmlString = htmlString + '<div class="container collapse" id="collapseTwo"><div class="row d-flex justify-content-center">';

                        var divNumber = 0; //hold number of paginations
                        //add paginations above results
                        if (results.length > 6) {
                            htmlString = htmlString + '<div class="container row collapse" id="collapseTwo">' +
                                '<div class="col text-center"><div class="block-27"><ul>';
                            for (var j = 0; j < Math.ceil(results.length / 6); j++) {
                                if (j == 0) {
                                    htmlString = htmlString +
                                        '<li class="number justify-content-center align-items-center active" ' +
                                        'style="margin:10px;margin-bottom:20px"> ';
                                } else {
                                    htmlString = htmlString + '<li class="number  justify-content-center align-items-center" ' +
                                        'style="margin:10px;margin-bottom:20px"> ';
                                }
                                htmlString = htmlString + '<button style="background-color:Transparent;border:none;outline:none" ' +
                                    'class="number-name" value="' + (j + 1) + 'n" id="' + (j + 1) +
                                    'nbuttonb" onClick="paginateWeed(this.value)" >' + (j + 1);
                                htmlString = htmlString + '</button></li>';
                            }
                            htmlString = htmlString + '</ul></div></div></div>';
                        }

                        //for loop renders cards for the next month
                        for (var i = 0; i < results.length; i++) {
                            if (Math.ceil((i + 1) / 6) > divNumber) {
                                divNumber = divNumber + 1;
                                htmlString = htmlString + '<div style="display:none" class="number-content1 row col-md-12 col-sm-12" id="' +
                                    Math.ceil((i + 1) / 6) + 'n">';
                            }
                            //filler for name to keep card height consistent
                            var replacement = results[i].common_name;
                            var filler = ' <span style="color:white">';
                            for (var k = 0; k < 15; k++) {
                                filler = filler + "_ ";
                            }
                            filler = filler + '</span>';
                            replacement = filler;

                            var idUrl = results[i].common_name;
                            var image = '/images/weeds/' + results[i].common_name.split(' ').join('_') + '.jpg';
                            //replace image link if it is invalid
                            if (!results[i].img_link) {
                                image = "/images/no-image.jpg";
                            }

                            //render individual cards
                            htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end">' +
                                '<a href="/weedDescription?id=' + idUrl + '" class="block-20" style="background-image: url(\'' + image +
                                '\');"></a ><div class="text p-4 float-right d-block"><h3 class="heading mb-0">' +
                                '<a href="/weedDescription?id=' + idUrl + '">' + results[i].common_name +
                                '</a></h3><p style="height:3px">' + replacement + '</p><p><a href="/weedDescription?id=' + idUrl +
                                '" class="btn btn-primary" style="font-size:13px">Read more</a></p></div></div></div>';
                            if ((((i + 1) % 6) == 0) || ((i + 1) == results.length)) {
                                htmlString = htmlString + '</div>'; // end pagination div
                            }
                        }
                        htmlString = htmlString + '</div></div>';// end results div
                        //render pagination below results
                        if (results.length > 6) {
                            htmlString = htmlString + '<div class="container row collapse" id="collapseTwo"><div class="col text-center"><div class="block-27"><ul>';
                            for (var j = 0; j < Math.ceil(results.length / 6); j++) {
                                if (j == 0) {
                                    htmlString = htmlString + '<li class="number justify-content-center align-items-center active" style="margin:10px"> ';
                                } else {
                                    htmlString = htmlString + '<li class="number  justify-content-center align-items-center" style="margin:10px"> ';
                                }
                                htmlString = htmlString + '<button style="background-color:Transparent;border:none;outline:none" class="number-name" value="' + (j + 1) + 'n" id="' + (j + 1) + 'nbutton" onClick="paginateWeed(this.value)" >' + (j + 1);
                                htmlString = htmlString + '</button></li>';
                            }
                            htmlString = htmlString + '</ul></div></div></div>';
                        }

                        //sql query to get predictions 2 months later
                        var queryString = 'SELECT weed.common_name, img_link,basic_description,month from weed ' +
                            'join germination on weed.common_name=germination.common_name where month = "' +
                            months[(new Date().getMonth()) + 2] + '"';

                        //runs query
                        connection.query(queryString, function (error, results, fields) {
                            //begins section for two months later
                            htmlString = htmlString + '<div class="row justify-content-center" style="background-color:#4e9525;color:white;' +
                                'margin-bottom:0;margin-top:15px"><div class="btn btn-link collapsed" style = "font-size:25px;margin:0;' +
                                'width:100%" type = "button" data-toggle="collapse" data-target="#collapseThree"">' +
                                '<div class="btn btn-link c3 collapsed h2" ' +
                                'style="font-size:25px;color:white;text-decoration:none;margin:0;float:left" type="button" ' +
                                'data-toggle="collapse" data-target="#collapseThree""> </div>' +
                                '<h2 class="btn btn-link collapsed h2" style="font-size: 25px;color:white;text-decoration:none; margin: 0"' +
                                ' type="button" data-toggle="collapse" data-target="#collapseThree"" > ' +
                                months[(new Date().getMonth()) + 2] + '</h2 ></div ></div > ';

                            //renders pagination above results
                            if (results.length > 6) {
                                htmlString = htmlString + '<div class="container row collapse" id="collapseThree"><div class="col text-center"><div class="block-27"><ul>';
                                for (var j = 0; j < Math.ceil(results.length / 6); j++) {
                                    if (j == 0) {
                                        htmlString = htmlString +
                                            '<li class="number justify-content-center align-items-center active" style="margin:10px"> ';
                                    } else {
                                        htmlString = htmlString +
                                            '<li class="number justify-content-center align-items-center" style="margin:10px"> ';
                                    }
                                    htmlString = htmlString +
                                        '<button style="background-color:Transparent;border:none;outline:none" class="number-name" value="' +
                                        (j + 1) + 'nn" id="' + (j + 1) + 'nnbutton" onClick="paginateWeed(this.value)" >' + (j + 1);
                                    htmlString = htmlString + '</button></li>';
                                }
                                htmlString = htmlString + '</ul></div></div></div>';
                            }
                            htmlString = htmlString + '<div class="container collapse" id="collapseThree">' +
                                '<div class="row d-flex justify-content-center">';

                            var divNumber = 0; //holds number of paginations

                            //renders card for 2 month prediction results
                            for (var i = 0; i < results.length; i++) {
                                //conditional incrementents pagination number
                                if (Math.ceil((i + 1) / 6) > divNumber) {
                                    divNumber = divNumber + 1;
                                    htmlString = htmlString +
                                        '<div style="display:none" class="number-content2 row col-md-12 col-sm-12" id="' +
                                        Math.ceil((i + 1) / 6) + 'nn">';
                                }

                                //adds filler to name keep card heights consistent
                                var replacement = results[i].common_name;

                                var filler = ' <span style="color:white">';
                                for (var k = 0; k < 15; k++) {
                                    filler = filler + "_ ";
                                }
                                filler = filler + '</span>';
                                replacement = filler;

                                var idUrl = results[i].common_name;
                                var image = '/images/weeds/'+results[i].common_name.split(' ').join('_')+'.jpg';
                                //sets image if image link is invalid
                                if (!results[i].img_link) {
                                    image = "/images/no-image.jpg";
                                }
                                //renders cards
                                if (results[i].common_name != "wild garlic") {
                                    htmlString = htmlString + '<div class="col-md-4 d-flex"><div class="blog-entry justify-content-end">' +
                                        '<a href="/weedDescription?id=' + idUrl + '" class="block-20" style="background-image: url(\'' +
                                        image + '\');"></a ><div class="text p-4 float-right d-block"><h3 class="heading mb-0">' +
                                        '<a href="/weedDescription?id=' + idUrl + '">' + results[i].common_name +
                                        '</a></h3><p style="height:3px">' + replacement + '</p><p><a href="/weedDescription?id=' + idUrl +
                                        '" class="btn btn-primary" style="font-size:13px">Read more</a></p></div></div></div>';
                                } else {
                                    htmlString = htmlString + '<div class=" d-flex"><div class="blog-entry justify-content-end">' +
                                        '<a href="/weedDescription?id=' + idUrl + '" class="block-20" style="background-image: url(\'' +
                                        image + '\');"></a ><div class="text p-4 float-right d-block"><h3 class="heading mb-0">' +
                                        '<a href="/weedDescription?id=' + idUrl + '">' + results[i].common_name +
                                        '</a></h3><p style="height:3px">' + replacement + '</p><p><a href="/weedDescription?id=' + idUrl +
                                        '" class="btn btn-primary" style="font-size:13px">Read more</a></p></div></div></div>';

                                }
                                    if ((((i + 1) % 6) == 0) || ((i + 1) == results.length)) {
                                    htmlString = htmlString + '</div>';
                                }
                            }
                            htmlString = htmlString + '</div></div>';// ends results section
                            //renders pagination below results
                            if (results.length > 6) {
                                htmlString = htmlString + '<div class="container row collapse" id="collapseThree">' +
                                    '<div class="col text-center"><div class="block-27"><ul>';
                                for (var j = 0; j < Math.ceil(results.length / 6); j++) {
                                    if (j == 0) {
                                        htmlString = htmlString +
                                            '<li class="number justify-content-center align-items-center active" style="margin:10px"> ';
                                    } else {
                                        htmlString = htmlString +
                                            '<li class="number justify-content-center align-items-center" style="margin:10px"> ';
                                    }
                                    htmlString = htmlString +
                                        '<button style="background-color:Transparent;border:none;outline:none" class="number-name" value="' +
                                        (j + 1) + 'nn" id="' + (j + 1) + 'nnbuttonb" onClick="paginateWeed(this.value)" >' + (j + 1);
                                    htmlString = htmlString + '</button></li>';
                                }
                                htmlString = htmlString + '</ul></div></div></div></div></section></section>';
                            }

                            //renders footer,adds scripts and returns final response
                            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/PreventionTips.html'), function (err, data) {
                                htmlString = htmlString + data.toString();
                                //renders necessary scripts
                                htmlString = htmlString +
                                    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>' +
                                    ' <script src = "/javascripts/weedPaginate.js" ></script >';
                                fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {

                                    htmlString = htmlString + data.toString();
                                    res.send(htmlString);
                                });
                            });
                        });

                    });
                });
            });
        });
    }
    });

module.exports = router;
