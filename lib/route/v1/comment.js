"use strict";

var express = require('express')
  , CommentCtrl = require('../../controller/comment')
  // , config = require('../../../config/config')
  ;

var comment = express();

comment.post('/comments', CommentCtrl.addComment);

comment.get('/comments/:cid', function () {
  
});

comment.post('/comments/:cid/votes', CommentCtrl.feedback);

comment.post('/comments/:cid/reports', CommentCtrl.feedback);

// MANAGEMENT


module.exports = comment;