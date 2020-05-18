'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const session = require('express-session')
const passwordProtected = require('express-password-protect')


var routes = require('./routes/index');
var authenticate = require('./routes/authenticate');
var weedIdentifier = require('./routes/weedIdentifier');
var weedControl = require('./routes/weedControl');
var weedManagement = require('./routes/weedManagement');
var gardenCare = require('./routes/gardenCare');
var gardens = require('./routes/gardens');
var weedEncyclopedia = require('./routes/weedEncyclopedia');
var weedDescription = require('./routes/weedDescription');
var weedPrevention = require('./routes/weedPrevention');
var searchPlants = require('./routes/searchPlants');
var error404 = require('./routes/error404');
<<<<<<< HEAD
var plantCollection = require('./routes/plantCollection');
var stores = require('./routes/stores');
=======
var stores = require('./routes/stores');
var mulchCal = require('./routes/mulchCal');
var compostCal = require('./routes/compostCal');
var calculatorService = require('./routes/calculatorService');

>>>>>>> 820a77237847b622372b472fe7e972ea699aaaa7
var app = express();
app.use(session({ secret: 'XASDASDA', cookie: { maxAge: 60000*60*2 }}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/authenticate', authenticate);
app.use('/', routes);
app.use('/error404', error404);
app.use('/weedIdentifier', weedIdentifier);
app.use('/weedControl', weedControl);
app.use('/plantCollection', plantCollection);
app.use('/gardenCare', gardenCare);
app.use('/gardens', gardens);
app.use('/weedManagement', weedManagement);
app.use('/weedEncyclopedia', weedEncyclopedia);
app.use('/weedDescription', weedDescription);
app.use('/weedPrevention', weedPrevention);
<<<<<<< HEAD
app.use('/searchPlants', searchPlants);
app.use('/stores', stores);

=======
app.use('/mulchCal', mulchCal);
app.use('/compostCal', compostCal);
app.use('/stores', stores);
app.use('/calculatorService', calculatorService);
>>>>>>> 820a77237847b622372b472fe7e972ea699aaaa7


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    if (req.accepts('html')) {
        res.sendFile(path.join('D:/home/site/wwwroot' + '/views/404error.html'));
        return;
    }
    next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
