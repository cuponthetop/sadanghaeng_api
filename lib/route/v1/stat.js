"use strict";

var express = require('express')
	, StatCtrl = require('../../controller/stat')
  // , UserCtrl = require('../../controller/user')
  // , UniversityCtrl = require('../../controller/university')
  // , PostCtrl = require('../../controller/post')
  // , CommentCtrl = require('../../controller/comment')
  // , config = require('../../../config/config')
  ;

var stat = express();

stat.get('/stats/users', StatCtrl.getUserStat);

stat.get('/stats/universities', StatCtrl.getUnivStat);

stat.get('/stats/posts', function () {
  
});

stat.get('/stats/comments', function () {
  
});

module.exports = stat;