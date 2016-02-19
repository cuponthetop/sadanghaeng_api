"use strict";

var express = require('express')
  , CommentCtrl = require('../../controller/comment')
  // , config = require('../../../config/config')
  ;

var comment = express();

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
 * @apiUse AddVoteFailed
 * @apiUse AddVoteFailed
 */
comment.post('/comments/:cid/votes', CommentCtrl.loadComment, CommentCtrl.voteComment);

/**
 * @api {post} /comments/:cid/reportes Report the comment
 * @apiName reportComment
 * @apiGroup Comment
 *
 */
comment.post('/comments/:cid/reports', CommentCtrl.loadComment, CommentCtrl.reportComment);

// MANAGEMENT


module.exports = comment;