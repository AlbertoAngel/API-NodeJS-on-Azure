'use strict';
var port = process.env.PORT || 8000; // first change

var Http = require('http');
var Express = require('express');
var BodyParser = require('body-parser');
var Swaggerize = require('swaggerize-express');
var swaggerUi = require('swaggerize-ui'); // second change
var Path = require('path');
var cors = require('cors')

var App = Express();
App.use(cors())

var Server = Http.createServer(App);

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
    extended: true
}));

App.use(Swaggerize({
    api: Path.resolve('./config/swagger.json'),
    handlers: Path.resolve('./handlers'),
    docspath: '/swagger' // fourth change
}));

// change four
App.use('/docs', swaggerUi({
    docs: '/swagger'  
  }));


Server.listen(port, function () { // fifth change
    //App.swagger.api.host = this.address().address + ':' + this.address().port;
    //console.log('App running on %s:%d', this.address().address, this.address().port);
    App.set(undefined); // sixth and final change
});


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};