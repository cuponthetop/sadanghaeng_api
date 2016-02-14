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

/**
 * @api {get} /stats/users Fetch number of total users
 * @apiName GetUserStat
 * @apiGroup Stat
 *
 *
 * @apiUse SuccessCode
 *
 * @apiUse CouldNotFetchCount
 */
stat.get('/stats/users', StatCtrl.getUserStat);

/**
 * @api {get} /stats/users Fetch number of total users
 * @apiName GetUserStat
 * @apiGroup Stat
 *
 *
 * @apiUse SuccessCode
 *
 * @apiUse CouldNotFetchCount
 */
stat.get('/stats/universities', StatCtrl.getUnivStat);

stat.get('/stats/posts', function () {
  
});

stat.get('/stats/comments', function () {
  
});

module.exports = stat;