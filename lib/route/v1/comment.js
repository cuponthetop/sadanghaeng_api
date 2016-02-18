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
 *
 * @apiSuccess {String} value vote id of new vote
 */
comment.post('/comments/:cid/votes', UserCtrl.requireUser, CommentCtrl.loadComment, CommentCtrl.voteComment);

/**
 * @api {post} /comments/:cid/reportes Report the comment
 * @apiName reportComment
 * @apiGroup Comment
 *
 */
comment.post('/comments/:cid/reports', UserCtrl.requireUser, CommentCtrl.loadComment, CommentCtrl.reportComment);

/**
 * @api {post} /comments Add new comment
 * @apiName PostComment
 * @apiGroup Comment
 *
 * @apiUse SuccessCode
 *
 * @apiUse CommentAddFailed
 *
 * @apiSuccess {String} value comment id of newly created comment
 */
comment.post('/comments', UserCtrl.requireUser, UserCtrl.permitStudentOrAdmin, CommentCtrl.addComment);

// MANAGEMENT


module.exports = comment;