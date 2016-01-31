"use strict";

var gulp = require('gulp'),
    path = require('path'),
    mochaStream = require('spawn-mocha-parallel').mochaStream,
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    jscs = require('gulp-jscs'),
    // mongodb = require('mongodb').MongoClient,
    Q = require('q'),
    _ = require('underscore'),
    runSequence = Q.denodeify(require('run-sequence'))
    ;

// var config = require('./config/config');

var JS_SOURCES = ['*.js', 'lib/**/*.js', 'util/**/*.js', 'config/**/*.js'];

gulp.task('jshint', function () {
  return gulp.src(JS_SOURCES)
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
  return gulp.src(JS_SOURCES)
    .pipe(jscs({configPath: __dirname + '/.jscsrc'}));
});

function generateMochaOpts() {
  return {
    flags: {
      //u: 'bdd-with-opts',
      R: process.env.MOCHA_REPORTER || 'nyan',
      'c': true
    },
    env: _.clone(process.env),
    bin: path.join(__dirname,  'node_modules/.bin/mocha'),
    concurrency: 5
  };
}

// gulp.task('init-mongo-universitys', function () {
//   return gulp.src('test/init/json/universitys.json')
//     .pipe(mongoData({
//       mongoUrl: config.db.uri + config.db.dbName,
//       collectionName: 'universitys',
//       dropCollection: true
//     }));
// });

// gulp.task('init-mongo-users', function () {
//   return gulp.src('test/init/json/users.json')
//     .pipe(mongoData({
//       mongoUrl: config.db.uri + config.db.dbName,
//       collectionName: 'users',
//       dropCollection: true
//     }));
// });

// gulp.task('init-mongo-posts', function () {
//   return gulp.src('test/init/json/posts.json')
//     .pipe(mongoData({
//       mongoUrl: config.db.uri + config.db.dbName,
//       collectionName: 'posts',
//       dropCollection: true
//     }));
// });

// gulp.task('init-mongo-comments', function () {
//   return gulp.src('test/init/json/comments.json')
//     .pipe(mongoData({
//       mongoUrl: config.db.uri + config.db.dbName,
//       collectionName: 'comments',
//       dropCollection: true
//     }));
// });

gulp.task('init-mongo', function () {
  return ;
  // return runSequence('init-mongo-universitys', 'init-mongo-users'
  // , 'init-mongo-posts', 'init-mongo-comments');
});

gulp.task('test-unit', function () {
  var opts = generateMochaOpts();
  var mocha = mochaStream(opts);
  
  return gulp.src('test/unit/**/*-specs.js', {read: false})
    .pipe(mocha)
    .on('error', console.warn.bind(console));
});

gulp.task('test', function () {
  return runSequence('init-mongo', 'test-unit');
});

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('default', function () {
  return runSequence('lint', 'test');
});
