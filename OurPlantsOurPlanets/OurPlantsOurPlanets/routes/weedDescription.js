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
    //res.render('index', { title: path.join(__dirname +'/views/weedIdentifier.cshtml')  });
    var htmlString = "";
    fs.readFile(path.join('D:/home/site/wwwroot' + '/views/header1.html'), function (err, data) {
        htmlString = htmlString + data.toString();
        htmlString = htmlString.replace("&#65279", "");
        fs.readFile(path.join('D:/home/site/wwwroot' + '/views/weedEncyclopedia.html'), function (err, data) {
            htmlString = htmlString + data.toString().substr(1).replace("Weed Encyclopaedia", req.query.id).replace("bg-weedcontrol","IMG-20200518-WA0001");
            var queryString = 'select weed.common_name,weed.scientific_name,weed.img_link,weed.appearance_description,weed.basic_description,weed.stems_description,weed.leaves_description,weed.flowers_description, weed.fruit_description,weed.seeds_description,weed.root_description,weed.control_description, GROUP_CONCAT(DISTINCT leave_category SEPARATOR ", ") as leaf, GROUP_CONCAT(DISTINCT stem_type SEPARATOR ", ") as stem, GROUP_CONCAT(DISTINCT color SEPARATOR ", ") as flower, GROUP_CONCAT(DISTINCT fruit_type SEPARATOR ", ") as fruit, GROUP_CONCAT(DISTINCT seeds_type SEPARATOR ", ") as seed from weed left outer join leaves ON weed.common_name = leaves.common_name left outer join stems on weed.common_name = stems.common_name left outer join flowers on weed.common_name = flowers.common_name left outer join fruit on weed.common_name = fruit.common_name left outer join seeds on seeds.common_name = weed.common_name  where weed.common_name="' + req.query.id +'"  GROUP by weed.common_name';
            connection.query(queryString, function (error, results, fields) {
                if (error) var name = 'problem';
                htmlString = htmlString + '<section class="ftco-section align-content-center" style="background:Transparent">';
                htmlString = htmlString + '<div class="row justify-content-center mb-5" > <div class="col-md-10 text-center heading-section" >';
                htmlString = htmlString + '<h1 class="heading-section">' + results[0].common_name + '</h1>';
                htmlString = htmlString + '<b><i>' + results[0].appearance_description + '</i></b>';
                htmlString = htmlString + '</div></div>';
                htmlString = htmlString + '<section class="ftco-section bg-light" id="descRow"><div class="container"><div class="row d-flex">';
                htmlString = htmlString + '<div class="desc d-flex justify-content-center align-items-center active"> ';
                htmlString = htmlString + '<a style="background-color:Transparent;border:none" class="desc-name" value="' + "Anatomy" + '" id="' + "Anatomy" + 'button" href="#Anatomy" >' + "Anatomy";
                htmlString = htmlString + '</a></div>';
                
                htmlString = htmlString + '<div class="desc d-flex justify-content-center align-items-center">';
                htmlString = htmlString + '<a style="background-color:Transparent;border:none" class="desc-name" value="' + "Impact" + '" id="' + "Impact" + 'button" href="#Impact" >' + "Impact";
                htmlString = htmlString + '</a></div>';
                htmlString = htmlString + '<div class="desc d-flex justify-content-center align-items-center">';
                htmlString = htmlString + '<a style="background-color:Transparent;border:none" class="desc-name" value="' + "ControlMethods" + '" id="' + "ControlMethods" + 'button" href="#ControlMeasures" >' + "Control"+'<span style="color:Transparent;">_</span>'+"Measures";
                htmlString = htmlString + '</a></div>';
                htmlString = htmlString + '</div></div></section>';
                htmlString = htmlString + '<div style="display:none;margin:7px" class="desc-content" id="Anatomy">';
                htmlString = htmlString + '<section class="ftco-section bg-light" id="descRow"><div class="container"><div class="row d-flex">';
                htmlString = htmlString + '<table class= "col-md-4" style="display:inline-block;"><tr>';
                htmlString = htmlString + '<td colspan="2" style="background-color:transparent;width:350px"><a class="block-20" style="background-image: url(\'' + results[0].img_link + '\');"></a ></td></tr>';
                if (results[0].leaf) {
                    htmlString = htmlString + '<tr style="text-align:center"><td><b>Leaf</b></td><td id="leaf">' + results[0].leaf + '</td></tr>';
                }
                
                htmlString = htmlString + '<tr style="text-align:center"><td><b>Stem</b></td><td id="stem">' + results[0].stem + '</td></tr>';
                htmlString = htmlString + '<tr style="text-align:center"><td><b>Flower</b></td><td id="flower">' + results[0].flower + '</td></tr>';
                htmlString = htmlString + '<tr style="text-align:center"><td><b>Fruit</b></td><td id="fruit">' + results[0].fruit + '</td></tr>';
                htmlString = htmlString + '<tr style="text-align:center"><td><b>Seed</b></td><td id="seed">' + results[0].seed + '</td></tr></table>';
                htmlString = htmlString + '<div class="col-md-8" style="display:inline-block">';
                htmlString = htmlString + '<p><b style="color:black">Scientific Name: </b>' + results[0].scientific_name + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Leaf: </b>' + results[0].leaves_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Stem: </b>' + results[0].stems_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Flower: </b>' + results[0].flowers_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Fruit: </b>' + results[0].fruit_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Root: </b>' + results[0].root_description + '</p>';
                htmlString = htmlString + '<p><b style="color:black">Seeds: </b>' + results[0].seeds_description + '</p>';
                htmlString = htmlString + '</div></div></div></section></div>';
                htmlString = htmlString + '<div style="display:none;margin-top:15px" class="desc-content" id="ControlMethods">';
                var controlMethods = results[0].control_description.split("$$");
                for (var b = 0; b < controlMethods.length; b++) {
                    htmlString = htmlString + '<li style="list-style-position:outside;margin-left: 1em;">' + controlMethods[b] + '</li>';
                }
                
                htmlString = htmlString + "</ul></div>";
                queryString = 'SELECT * from impact_assessment where common_name="' + req.query.id + '"';
                connection.query(queryString, function (error, results, fields) {
                    htmlString = htmlString + '<div style="display:none;text-align:center" class="desc-content" id="Impact">';
                    if (results.length > 0) {
                        htmlString = htmlString + '<div class="row justify-content-center" style="width:100%">';
                        htmlString = htmlString + '<div id="canvas-holder" style="width:50%"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div><canvas id = "chart-area" style = "display: block; width: 952px; height: 476px;" width = "952" height = "476" class="chartjs-render-monitor" ></canvas ></div >';
                        htmlString = htmlString + "</div>";
                        
                        var impactLevels = [0, 0, 0, 0, 0];
                        htmlString = htmlString + '<table style="width:80%;margin-left:10%;margin-right:10%;border:1px solid grey;border-collapse:collapse"><tr><th style="border:1px solid grey;padding:5px">Impact Type</th><th style="border:1px solid grey;padding:5px">Impact Description</th><th style="border:1px solid grey;padding:5px">Impact Level</th></tr>';
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].impact_level != "") {
                                htmlString = htmlString + '<tr><td style="border:1px solid grey;padding:5px">' + results[i].impact_type + '</td><td style="border:1px solid grey;padding:5px">' + results[i].impact_description + '</td><td style="border:1px solid grey;padding:5px">' + results[i].impact_level + '</td></tr>';
                                impactLevels[i] = results[i].impact_level;
                            }
                        }
                        htmlString = htmlString + '<script>' + "var chartColors = window.chartColors; var color = Chart.helpers.color;var config = {data: {datasets: [{data: [" + impactLevels[0] + ", " + impactLevels[1] + ", " + impactLevels[2] + ", " + impactLevels[3] + ", " + impactLevels[4]+"], backgroundColor: [color(chartColors.red).alpha(0.5).rgbString(), color(chartColors.orange).alpha(0.5).rgbString(), color(chartColors.yellow).alpha(0.5).rgbString(), color(chartColors.green).alpha(0.5).rgbString(), color(chartColors.blue).alpha(0.5).rgbString(),], label: 'My dataset'}], labels: ['Restrict human access', 'Injurious To People', 'Impact water quality', 'Injurious to fauna', 'Food Source To Pests']}, options: { responsive: true, legend: { position: 'bottom', }, title: { display: true, text: 'Major Impacts of the Weed' }, scale: { ticks: { beginAtZero: true }, reverse: false }, animation: { animateRotate: false, animateScale: true } }}; window.onload = function () { var ctx = document.getElementById('chart-area'); window.myPolarArea = Chart.PolarArea(ctx, config); }; " + '</script>';

                        htmlString = htmlString + '</table>';
                        htmlString = htmlString + '<div class="row justify-content-center" style="width:100%">';
                        htmlString = htmlString + '<div style="margin-top:8px"><h4>*Impact Levels</h4><p style="font-size:13px">0:Negligible | 1:Low | 2:Low-Medium | 3:Medium | 4:Medium High | 5:High</p></div>';
                        htmlString = htmlString + "</div>";
                        htmlString = htmlString + '</div ></section > ';
                        
                    }
                });
            });
            fs.readFile(path.join('D:/home/site/wwwroot' + '/views/footer.html'), function (err, data) {
                htmlString = htmlString + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <script src = "/javascripts/weedDetailedDesc.js" ></script >';
                htmlString = htmlString + data.toString();
                res.send(htmlString);
            });
        });
    });
   
});

module.exports = router;
