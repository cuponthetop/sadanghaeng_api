"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  , PostCtrl = require('../../controller/post')
  ;

var post = express();

post.use('/posts', UserCtrl.requireUser);
/**
 * @api {get} /posts Get all posts
 * @apiName GetPosts
 * @apiGroup Posts
 *
 * @apiUse SuccessCode
 *
 * @apiUse GetPostsFailed
 */
post.get('/posts', PostCtrl.loadPost, PostCtrl.getPosts);

/**
 * @api {get} /posts/:pid Get individual post
 * @apiName GetPost
 * @apiGroup Posts
 *
 * @apiParam {ObjectId} :pid Post's unique ID.
 *
 * @apiUse SuccessCode
 *
 * @apiUse CouldNotFindPost
 */
post.get('/posts/:pid', PostCtrl.loadPost, PostCtrl.getPost);

post.post('/posts',  UserCtrl.permitAdmin, PostCtrl.loadPost, PostCtrl.addPost);
/**
 * @api {get} /posts/:pid/comments Request comments on the post
 * @apiName GetCommentsOnPost
 * @apiGroup Post
 *
 */
post.get('/posts/:pid/comments', PostCtrl.loadPost, PostCtrl.getCommentsOnPost);

/**
 * @api {post} /posts/:pid/votes Vote for the post
 * @apiName voteForPost
 * @apiGroup Post
 *
 */
post.post('/posts/:pid/votes', PostCtrl.voteForPost);

post.post('/posts/:pid/reports', PostCtrl.reportPost);

/**
 * @api {delete} /posts/:pid Get individual post
 * @apiName DeletePost
 * @apiGroup Posts
 *
 * @apiParam {ObjectId} :pid Post's unique ID.
 *
 * @apiUse SuccessCode
 *
 * @apiUse CouldNotFindPost
 * @apiUse PostRemoveFailed
 */
post.delete('/posts/:pid', PostCtrl.deletePost);

// MANAGEMENT


module.exports = post;