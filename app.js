var express = require('express')
  , load = require('express-load'), 
  app = express()
;

//var fs = require('fs');
//var formidable = require('formidable')
//app.use(formidable);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var session = require('express-session');
app.use(session({
	'secret':'323350932jweifw023jijewk32kzlaeklaeoqpmcecvb',
	maxAge  : new Date(Date.now() + 3600000), //1 Hour
    expires : new Date(Date.now() + 3600000) //1 Hour
}));

load('middlewares')
  .then('models/schema.js')
  .then('controllers')
  .then('routes')
  .then('boot.js')
  .into(app);

//app.use(app.router);
app.use(express.static(__dirname + '/public'));

global.baseURL = "http://localhost:3000/"

module.exports = app;