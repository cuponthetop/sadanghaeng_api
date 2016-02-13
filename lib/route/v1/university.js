"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  , UnivCtrl = require('../../controller/university')
  ;

var university = express();

university.use('/universities', UserCtrl.requireUser);

/**
 * @api {get} /universities/:univid/posts Get posts in University
 * @apiName GetPostsInUniversity
 * @apiGroup University
 *
 * @apiPermission student
 * @apiPermission admin
 *
 * @apiUse SuccessCode
 *
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 * @apiUse UnivNotFound
 * @apiUse InvalidPageNumberRequested
 * @apiUse InvalidSortRequested
 * @apiUse InvalidFilterRequested
 */

university.get('/universities/:univid/posts', UnivCtrl.permitStudentOrAdmin, UnivCtrl.getPostsInUniv);

/**
 * @api {get} /universities/:univid/search Search for posts in University
 * @apiName Search
 * @apiGroup University
 *
 * @apiPermission student
 * @apiPermission admin
 *
 * @apiUse SuccessCode
 *
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 * @apiUse UnivNotFound
 * @apiUse InvalidPageNumberRequested
 * @apiUse InvalidSortRequested
 * @apiUse InvalidQueryRequested
 */
university.get('/universities/:univid/search', UnivCtrl.permitStudentOrAdmin, UnivCtrl.searchPosts);

/**
 * @api {get} /universities/:univid Get University Information
 * @apiName GetUniversity
 * @apiGroup University
 *
 * @apiPermission admin
 *
 * @apiParam {ObjectId} :univid University's unique ID
 *
 * @apiUse SuccessCode
 * @apiUse UniversityModel
 *
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 * @apiUse UnivNotFound
 */
university.get('/universities/:univid', UserCtrl.permitAdmin, UnivCtrl.getUniversity);

/**
 * @api {put} /universities/:univid Update University Information
 * @apiName UpdateUniversity
 * @apiGroup University
 *
 * @apiPermission admin
 *
 * @apiParam {ObjectId} :univid University's unique ID
 * @apiParam {String} name University's name
 * @apiParam {String} displayName University's displayName
 * @apiParam {String[]} emailDomainList
 *
 * @apiUse SuccessCode
 *
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 * @apiUse UnivNotFound
 * @apiUse UnivUpdateFailed
 * @apiUse InvalidEmailDomain
 */
university.put('/universities/:univid', UserCtrl.permitAdmin, UnivCtrl.updateUniversity);

/**
 * @api {delete} /universities/:univid Destroy University
 * @apiName DestroyUniversity
 * @apiGroup University
 *
 * @apiPermission admin
 *
 * @apiParam {ObjectId} :univid University's unique ID
 *
 * @apiUse SuccessCode
 *
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 * @apiUse UnivNotFound
 * @apiUse UnivRemovalFailed
 */
university.delete('/universities/:univid', UserCtrl.permitAdmin, UnivCtrl.destroyUniversity);

/**
 * @api {post} /universities Create University Information
 * @apiName CreateUniversity
 * @apiGroup University
 *
 * @apiPermission admin
 *
 * @apiParam {String} name University's name
 * @apiParam {String} displayName University's displayName
 * @apiParam {String[]} emailDomainList
 *
 * @apiUse SuccessCode
 * @apiSuccess {String} value university id of newly created university
 *
 * @apiUse UnivUpdateFailed
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 * @apiUse UnivAlreadyExisting
 * @apiUse InvalidEmailDomain
 */
university.post('/universities', UserCtrl.permitAdmin, UnivCtrl.createUniversity);

module.exports = university;