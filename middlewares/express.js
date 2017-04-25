module.exports = function(app) {
  var bodyParser = require('body-parser'),
    morgan = require('morgan')
    /*formidable = require('formidable')
    /*fs = require('fs'), 
    path = require('path')*/
  ;

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

};