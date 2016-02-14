"use strict";

var express = require('express')
	, StatCtrl = require('../../controller/stat')
  ;

var stat = express();

stat.get('/stats/users', StatCtrl.getUserStat);

stat.get('/stats/universities', StatCtrl.getUnivStat);

stat.get('/stats/posts', StatCtrl.getPostStat);

stat.get('/stats/comments', StatCtrl.getCommentStat);

module.exports = stat;