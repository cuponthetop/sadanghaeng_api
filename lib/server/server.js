"use strict";

var middleware = require('./middleware-boilerplate')
  , express = require('express')
  , routes = require('../route/all')
  ;

var app = express();

// middleware
middleware(app, process.env);

// add routing
app.use('/api', routes);

app.use(function (req, res) {
  res.status('404').send();
});

// serve
app.listen(app.get('port'), function () {
  console.log('Express server listening on port:', app.get('port'));
});

module.exports = app;
