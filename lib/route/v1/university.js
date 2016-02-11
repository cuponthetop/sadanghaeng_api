"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  , UnivCtrl = require('../../controller/university')
  ;

var university = express();

university.all('/universities', UserCtrl.requireUser);

/**
 * @api {get} /universities/:univid/search Search for posts in University
 * @apiName Search
 * @apiGroup University
 *
 *
 */
university.get('/universities/:univid/search', UnivCtrl.permitStudent, UnivCtrl.searchPosts);

/**
 * @api {get} /universities/:univid Get University Information
 * @apiName GetUniversity
 * @apiGroup University
 *
 */
university.get('/universities/:univid', UserCtrl.permitAdmin, UnivCtrl.getUniversity);

/**
 * @api {put} /universities/:univid Update University Information
 * @apiName UpdateUniversity
 * @apiGroup University
 */
university.put('/universities/:univid', UserCtrl.permitAdmin, UnivCtrl.updateUniversity);

/**
 * @api {delete} /universities/:univid Destroy University
 * @apiName DestroyUniversity
 * @apiGroup University
 */
university.delete('/universities/:univid', UserCtrl.permitAdmin, UnivCtrl.destroyUniversity);

/**
 * @api {post} /universities Create University Information
 * @apiName CreateUniversity
 * @apiGroup University
 */
university.post('/universities', UserCtrl.permitAdmin, UnivCtrl.createUniversity);


module.exports = university;