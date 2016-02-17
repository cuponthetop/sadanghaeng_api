"use strict";

var express = require('express')
  , CommentCtrl = require('../../controller/comment')
  , UserCtrl = require('../../controller/user')
  // , config = require('../../../config/config')
  ;

var comment = express();

comment.get('/comments/:cid', function () {
  
});

/**
 * @api {post} /comments Add new comment
 * @apiName PostComment
 * @apiGroup Comment
 *
 * @apiUse SuccessCode
 *
 * @apiUse CommentAddFailed
 */
comment.post('/comments', UserCtrl.requireUser, UserCtrl.permitStudentOrAdmin, CommentCtrl.addComment);

/**
 * @api {post} /comments/:cid/votes Add a vote for a comment
 * @apiName VoteComment
 * @apiGroup Comment
 *
 * @apiParam {ObjectId} :cid Comment's unique ID.
 *
 * @apiUse SuccessCode
 *
 * @apiUse CommentNotFound
 * @apiUse AlreadyVoteFailed
 * @apiUse AddVoteFailed
 */
comment.post('/comments/:cid/votes', UserCtrl.requireUser, UserCtrl.permitStudentOrAdmin, CommentCtrl.voteComment);

/**
 * @api {post} /comments/:cid/reportes Report the comment
 * @apiName reportComment
 * @apiGroup Comment
 *
 */
comment.post('/comments/:cid/reports', UserCtrl.requireUser, UserCtrl.permitStudentOrAdmin, CommentCtrl.reportComment);

// MANAGEMENT


module.exports = comment;