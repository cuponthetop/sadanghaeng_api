"use strict";

var express = require('express')
  // , UserCtrl = require('../../controller/user')
  // , UniversityCtrl = require('../../controller/university')
  // , PostCtrl = require('../../controller/post')
  // , CommentCtrl = require('../../controller/comment')
  // , config = require('../../../config/config')
  ;

var stat = express();

stat.get('/stats/users', function () {
    
});

stat.get('/stats/universities', function () {
  
});

stat.get('/stats/posts', function () {
  
});

stat.get('/stats/comments', function () {
  
});

module.exports = stat;