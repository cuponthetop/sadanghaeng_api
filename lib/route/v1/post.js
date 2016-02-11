"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  , PostCtrl = require('../../controller/post')
  ;

var post = express();

post.all('/posts', UserCtrl.requireUser);

// post.post('/posts', function () {
  
// });

/**
 * 포스트 리스트 가져오는 API
 */
post.get('/posts', PostCtrl.getPosts);

post.get('/posts/:pid', PostCtrl.getPost);

/**
 * @api {get} /posts/:pid/comments Request comments on the post
 * @apiName GetCommentsOnPost
 * @apiGroup Post
 *
 */
post.get('/posts/:pid/comments', PostCtrl.getCommentsOnPost);

/**
 * @api {post} /posts/:pid/votes Vote for the post
 * @apiName voteForPost
 * @apiGroup Post
 *
 */
post.post('/posts/:pid/votes', PostCtrl.voteForPost);

post.post('/posts/:pid/reports', PostCtrl.reportPost);

post.delete('/posts/:pid', PostCtrl.deletePost);

// MANAGEMENT


module.exports = post;