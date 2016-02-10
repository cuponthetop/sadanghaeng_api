"use strict";

var express = require('express')
  , PostCtrl = require('../../controller/post')
  ;

var post = express();

post.post('/posts', function () {
  
});

/**
 * 포스트 리스트 가져오는 API
 */
post.get('/posts', PostCtrl.getPosts);

post.get('/posts/:pid', PostCtrl.getPost);

post.get('/posts/:pid/comments', PostCtrl.getCommentsOnPost);

post.post('/posts/:pid/votes', function () {
  
});

post.post('/posts/:pid/reports', function () {
  
});

// MANAGEMENT


module.exports = post;