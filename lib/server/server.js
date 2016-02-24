"use strict";

var middleware = require('./middleware-boilerplate')
  , express = require('express')
  , routes = require('../route/all')
  , ejs = require('ejs')
  , favicon = require('serve-favicon')
  , path = require('path')
  ;

var app = express();

// middleware
middleware(app, process.env);

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../../views/pages'));

app.use(favicon(__dirname + '/../../public/icons.ico/favicon.ico'));
app.use(express.static(__dirname + '/../../public'));

// add routing
app.use('/api', routes);

app.get('/universities/:univid/user/:uid', function (req, res) {
  res.render('main', {uid: req.params.uid, univid: req.params.univid});
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.get('/post/:pid', function (req, res) {
  res.render('post', {pid: req.params.pid});
});

app.get('/search', function (req, res) {
  res.render('search');
});

app.get('/write', function (req, res) {
  res.render('write');
});

app.get('/mypage/:uid', function (req, res) {
  res.render('mypage', {uid: req.params.uid});
});

app.use(function (req, res) {
  res.status('404').send();
});

// serve
app.listen(app.get('port'), function () {
  console.log('Express server listening on port:', app.get('port'));
});

module.exports = app;
