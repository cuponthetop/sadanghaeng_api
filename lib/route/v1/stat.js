"use strict";

var express = require('express')
	, StatCtrl = require('../../controller/stat')
  ;

var stat = express();

/**

 * @api {get} /stats/users Get User Statistics
 * @apiname GetUserStat
 * @apiGroup Stat
 *
 * @apiUse SuccessCode
 * @apiSuccess {Object} value returned value
 * @apiSuccess {Number} value.count number of users
 *
 * @apiUse CouldNotFetchCount
 */
stat.get('/stats/users', StatCtrl.getUserStat);

/**
 * @api {get} /stats/universities Get University Statistics
 * @apiname GetUnivStat
 * @apiGroup Stat
 *
 * @apiUse SuccessCode
 * @apiSuccess {Object} value returned value
 * @apiSuccess {Number} value.count number of universities
 *
 * @apiUse CouldNotFetchCount
 */
stat.get('/stats/universities', StatCtrl.getUnivStat);

stat.get('/stats/universities/:univid/posts', StatCtrl.getUnivPostStat);

/**
 * @api {get} /stats/posts Get Post Statistics
 * @apiname GetPostStat
 * @apiGroup Stat
 *
 * @apiUse SuccessCode
 * @apiSuccess {Object} value returned value
 * @apiSuccess {Number} value.count number of posts
 *
 * @apiUse CouldNotFetchCount
 */
stat.get('/stats/posts', StatCtrl.getPostStat);

/**
 * @api {get} /stats/comments Get Comment Statistics
 * @apiname GetCommentStat
 * @apiGroup Stat
 *
 * @apiUse SuccessCode
 * @apiSuccess {Object} value returned value
 * @apiSuccess {Number} value.count number of comments
 *
 * @apiUse CouldNotFetchCount
 */
stat.get('/stats/comments', StatCtrl.getCommentStat);

module.exports = stat;