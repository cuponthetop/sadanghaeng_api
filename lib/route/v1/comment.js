"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  , CommentCtrl = require('../../controller/comment')
  , UserCtrl = require('../../controller/user')
  // , config = require('../../../config/config')
  ;

var comment = express();

comment.use('/comments', UserCtrl.requireUser);
/**
 * @api {post} /comments Add new comment
 * @apiName PostComment
 * @apiGroup Comment
 *
 * @apiUse SuccessCode
 *
 * @apiUse CommentAddFailed
 */
comment.post('/comments', CommentCtrl.addComment);

/**
 * @api {get} /comments/:cid/remove a comment
 * @apiName removeComment
 * @apiGroup Comment
 */
comment.get('/comments/:cid/remove', CommentCtrl.removeComment);

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