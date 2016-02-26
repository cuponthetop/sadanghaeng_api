"use strict";

var pmx = require('pmx').init({
  http          : true, // HTTP routes logging (default: true)
  ignore_routes : [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
  errors        : true, // Exceptions loggin (default: true)
  custom_probes : true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
  network       : true, // Network monitoring at the application level
  ports         : true  // Shows which ports your app is listening on (default: false)
});

var middleware = require('./middleware-boilerplate')
  , express = require('express')
  , routes = require('../route/all')
  // , ejs = require('ejs')
  , favicon = require('serve-favicon')
  , path = require('path')
  , UserCtrl = require('../controller/user')
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

app.get('/', function (req, res) {
  res.redirect('/main');
});

app.use('/main', function (req, res, next) {
  if ((req.session.accessToken !== undefined || req.session.refreshToken !== undefined)) {
    next();
  } else {
    res.redirect('/login');
  }
}, UserCtrl.requireUser);

app.get('/main', function (req, res) {
  if (req.info && req.info.user) {
    res.redirect('/universities/'+req.info.user.university._id.toString()+'/user/'+req.info.user._id.toString());
  } else {
    res.redirect('/login');
  }
});

app.get('/universities/:univid/user/:uid', function (req, res) {
  res.render('main', {uid: req.params.uid, univid: req.params.univid});
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.get('/signup-new', function (req, res) {
  res.render('signup-new');
});

app.get('/post/:pid', function (req, res) {
  res.render('post', {pid: req.params.pid});
});

app.get('/search/:univid', function (req, res) {
  res.render('search', {univid: req.params.univid});
});

app.use('/write', UserCtrl.requireUser);

app.get('/write/:univid', function (req, res) {
  res.render('write', {uid: req.info.user._id.toString(), univid: req.params.univid});
});

app.use('/mypage', UserCtrl.requireUser);

app.get('/mypage/:uid', function (req, res) {
  res.render('mypage', {uid: req.params.uid, nickname: req.info.user.nickname});
});

app.use(function (req, res) {
  res.status('404').send();
});

app.use(pmx.expressErrorHandler());

// serve
app.listen(app.get('port'), function () {
  console.log('Express server listening on port:', app.get('port'));
});
module.exports = app;
