"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  , PostCtrl = require('../../controller/post')
  ;

var post = express();

post.use('/posts', UserCtrl.requireUser);

/**
 * @api {get} /posts/:pid Get individual post
 * @apiName GetPost
 * @apiGroup Post
 * 
 * @apiPermission student
 * @apiPermission admin
 *
 * @apiParam {ObjectId} :pid Post's unique ID.
 *
 * @apiUse SuccessCode
 *
 * @apiUse PostNotFound
 * @apiUse CommentsOnPostGottenFailed
 * @apiUse PostAddedFailed
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 *
 */
post.get('/posts/:pid', PostCtrl.loadPost, UserCtrl.permitStudentOrAdmin, PostCtrl.getPost);

/**
 * @api {post} /posts add post
 * @apiName AddPost
 * @apiGroup Post
 * 
 * @apiPermission student
 *
 * @apiParam {string} title post title
 * @apiParam {string} text post content(text)
 * 
 * @apiUse SuccessCode
 *
 * @apiUse PostAddedFailed
 * @apiUse TitleOfPostIsInvalid
 * @apiUse TextOfPostIsInvalid
 * @apiUse UnivNotFound
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 */
post.post('/posts', PostCtrl.findUniversity, UserCtrl.permitStudent, PostCtrl.addPost);

/**
 * @apiIgnore deprecated
 * @api {get} /posts/:pid/comments Request comments on the post
 * @apiName GetCommentsOnPost
 * @apiGroup Post
 *
 */
// post.get('/posts/:pid/comments', UserCtrl.permitStudentOrAdmin, PostCtrl.loadPost, PostCtrl.getCommentsOnPost);

/**
 * @api {post} /posts/:pid/votes Add Vote for the post and update voteScore in db
 * @apiName updateVoteOnPost
 * @apiGroup Post
 * 
 * @apiPermission student
 *
 * @apiParam {ObjectId} :pid Post's unique ID.
 * @apiParam {string} voteType type of vote(up/down)
 * 
 * @apiUse SuccessCode
 *
 * @apiUse PostNotFound
 * @apiUse EmptyVote
 * @apiUse WrongVote
 * @apiUse PostVotedAlready
 * @apiUse UpdateVoteInDBFailed
 * @apiUse PostOwnerCanNotVote
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 *
 */
post.post('/posts/:pid/votes', PostCtrl.loadPost, UserCtrl.permitStudent, PostCtrl.updateVoteOnPost);

/**
 * @api {post} /posts/:pid/reports Report post
 * @apiName ReportPost
 * @apiGroup Post
 * 
 * @apiPermission student
 *
 * @apiParam {ObjectId} :pid Post's unique ID.
 * @apiSuccess {String} value post id of reported post
 *
 * @apiUse SuccessCode
 *
 * @apiUse PostNotFound
 * @apiUse AlreadyReported
 * @apiUse AddReportFailed
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 *
 */
post.post('/posts/:pid/reports', PostCtrl.loadPost, UserCtrl.permitStudent, PostCtrl.reportPost);

/**
 * @api {delete} /posts/:pid Delete post
 * @apiName DeletePost
 * @apiGroup Post
 * 
 * @apiPermission owner
 * @apiPermission admin
 *
 * @apiParam {ObjectId} :pid Post's unique ID.
 *
 * @apiUse SuccessCode
 *
 * @apiUse PostNotFound
 * @apiUse PostRemoveFailed
 * @apiUse UserPermissionNotAllowed
 *
 */
post.delete('/posts/:pid', PostCtrl.loadPost, UserCtrl.permitOwnerOrAdmin, PostCtrl.deletePost);

// MANAGEMENT


module.exports = post;