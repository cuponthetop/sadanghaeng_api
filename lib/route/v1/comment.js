"use strict";

var express = require('express')
  , CommentCtrl = require('../../controller/comment')
  // , config = require('../../../config/config')
  ;

var comment = express();

comment.post('/comments', CommentCtrl.addComment);

comment.get('/comments/:cid', function () {
  
});

comment.post('/comments/:cid/votes', CommentCtrl.voteComment);

/**
 * @api {post} /comments/:cid/reportes Report the comment
 * @apiName reportComment
 * @apiGroup Comment
 *
 */
comment.post('/comments/:cid/reports', CommentCtrl.reportComment);

// MANAGEMENT


module.exports = comment;