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
 * @api {get} /posts Get all posts
 * @apiName GetPosts
 * @apiGroup Posts
 *
 * @apiUse SuccessCode
 *
 * @apiUse GetPostsFailed
 */
// post.get('/posts', PostCtrl.getPosts);

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
 *
* @apiSuccess {String} value post id of fetched individual post
 */
post.get('/posts/:pid', UserCtrl.requireUser, UserCtrl.permitStudentOrAdmin, PostCtrl.loadPost, PostCtrl.getPost);

/**
 * @api {get} /posts/:pid/comments Request comments on the post
 * @apiName GetCommentsOnPost
 * @apiGroup Post
 *
 */
post.get('/posts/:pid/comments', UserCtrl.requireUser, UserCtrl.permitStudentOrAdmin, PostCtrl.getCommentsOnPost);

/**
 * @api {post} /posts/:pid/votes Vote for the post
 * @apiName voteForPost
 * @apiGroup Post
 *
 */
post.post('/posts/:pid/votes', UserCtrl.requireUser, UserCtrl.permitStudentOrAdmin, PostCtrl.voteForPost);

/**
 * @api {post} /posts/:pid/reports Get individual post
 * @apiName ReportPost
 * @apiGroup Posts
 *
 * @apiParam {ObjectId} :pid Post's unique ID.
 *
 * @apiUse SuccessCode
 *
 * @apiUse PostNotFound
 * @apiUse AlreadyReported
 * @apiUse AddReportFailed
 *
 * @apiSuccess {String} value post id of reported post
 */
post.post('/posts/:pid/reports', UserCtrl.requireUser, UserCtrl.permitStudentOrAdmin, PostCtrl.reportPost);

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
 *
 */
post.delete('/posts/:pid', UserCtrl.requireUser, UserCtrl.permitOwnerOrAdmin, PostCtrl.deletePost);

// MANAGEMENT


module.exports = post;