"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  , CommentCtrl = require('../../controller/comment')
  ;

var comment = express();

comment.use('/comments', UserCtrl.requireUser);

/**
 * @api {delete} /comments/:cid/remove a comment
 * @apiName removeComment
 * @apiGroup Comment
 *
 * @apiPermission student
 * @apiPermission admin
 *
 * @apiParam {ObjectId} :cid Comment's unique ID.
 *
 * @apiUse SuccessCode
 *
 * @apiUse CommentRemovalFailed
 * @apiUse UserPermissionNotAllowed
 */
comment.delete('/comments/:cid/remove', CommentCtrl.loadComment, UserCtrl.permitOwnerOrAdmin, CommentCtrl.removeComment);

/**
 * @api {post} /comments/:cid/votes Add a vote for a comment
 * @apiName VoteComment
 * @apiGroup Comment
 *
 * @apiPermission student
 *
 * @apiParam {ObjectId} :cid Comment's unique ID.
 * @apiParam {ObjectId} uid user's ID.
 * @apiParam {String} voteType type of vote; up or down.
 *
 * @apiUse SuccessCode
 *
 * @apiUse CommentNotFound
 * @apiUse AlreadyVoted
 * @apiUse AddVoteFailed
 * @apiUse WrongVote
 * @apiUse CommentOwnerCanNotVote
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 *
 */
comment.post('/comments/:cid/votes', CommentCtrl.loadComment, UserCtrl.permitStudent, CommentCtrl.voteComment);

/**
 * @api {post} /comments/:cid/reportes Report the comment
 * @apiName reportComment
 * @apiGroup Comment
 *
 * @apiPermission student
 *
 * @apiParam {ObjectId} :cid Comment's unique ID.
 * @apiParam {ObjectId} uid user's ID.
 *
 * @apiUse SuccessCode
 *
 * @apiUse CommentReportFailed
 * @apiUse CommentReportAlready
 * @apiUse CommentNotFound
 * @apiUse CantReportSelf
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed


 */
comment.post('/comments/:cid/reports', CommentCtrl.loadComment, UserCtrl.permitStudent, CommentCtrl.reportComment);

/**
 * @api {post} /comments Add new comment
 * @apiName PostComment
 * @apiGroup Comment
 *
 * @apiPermission student
 *
 * @apiParam {String} value text of new comment
 * @apiParam {ObjectId} pid post ID of post that comment is being written for.
 *
 * @apiUse SuccessCode
 *
 * @apiSuccess {String} value comment id of newly created comment
 *
 * @apiUse CommentAddFailed
 * @apiUse EmptyComment
 * @apiUse UnknownError
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 *
 */
comment.post('/comments', CommentCtrl.findPost, UserCtrl.permitStudent, CommentCtrl.addComment);

// MANAGEMENT


module.exports = comment;