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

post.get('/posts/:pid/comments', function () {
  
});

post.post('/posts/:pid/votes', function () {
  
});

post.post('/posts/:pid/reports', function () {
  
});

post.delete('/posts/:pid', PostCtrl.deletePost);

// MANAGEMENT


module.exports = post;