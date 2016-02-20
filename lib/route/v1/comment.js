"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  , CommentCtrl = require('../../controller/comment')
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
comment.post('/comments', UserCtrl.permitStudent, CommentCtrl.addComment);

/**
 * @api {get} /comments/:cid/remove a comment
 * @apiName removeComment
 * @apiGroup Comment
 *
 * @apiUse SuccessCode
 * 
 * @apiUse CommentRemovalFailed
 */
comment.get('/comments/:cid/remove', UserCtrl.permitOwnerOrAdmin, CommentCtrl.removeComment);

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
 * @apiUse AlreadyVoted
 * @apiUse AddVoteFailed
 *
 */
comment.post('/comments/:cid/votes', UserCtrl.permitStudent, CommentCtrl.loadComment, CommentCtrl.voteComment);

/**
 * @api {post} /comments/:cid/reportes Report the comment
 * @apiName reportComment
 * @apiGroup Comment
 *
 * @apiUse SuccessCode
 * 
 * @apiUse CommentReportFailed
 * @apiUse CommentReportAlready

 */
comment.post('/comments/:cid/reports', UserCtrl.permitStudent, CommentCtrl.loadComment, CommentCtrl.reportComment);

/**
 * @api {post} /comments Add new comment
 * @apiName PostComment
 * @apiGroup Comment
 *
 * @apiUse SuccessCode
 * @apiSuccess {String} value comment id of newly created comment
 *
 * @apiUse CommentAddFailed
 *
 */
comment.post('/comments', UserCtrl.permitStudentOrAdmin, CommentCtrl.addComment);

// MANAGEMENT


module.exports = comment;