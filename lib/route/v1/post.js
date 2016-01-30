"use strict";

var express = require('express')
  // , PostCtrl = require('../../controller/post')
  // , config = require('../../../config/config')
  ;

var post = express();

post.post('/posts', function () {
  
});

post.get('/posts/:pid', function () {
  
});

post.get('/posts/:pid/comments', function () {
  
});

post.post('/posts/:pid/votes', function () {
  
});

post.post('/posts/:pid/reports', function () {
  
});

// MANAGEMENT


module.exports = post;