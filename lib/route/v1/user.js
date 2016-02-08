"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  ;

var user = express();

/**
 * @api {post} /users/login Request Login session
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam {String} email User's unique ID (email address).
 * @apiParam {String} password User's password.
 *
 * @apiParamExample Request-Example:
 * {
 *   "email": "test@test.com",
 *   "password": "test"
 * }
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "status": "0"
 * }
 *
 * @apiUse  UserCredentialsNotMatch
 * @apiUse  UserAlreadyLoggedIn
 * @apiUse  UserNotVerified
 * @apiUse  UserNotFound
 *
 * @apiErrorExample Error-Response:
 * {
 *   "status": "114",
 *   "value":
 *   {
 *      "message": "provided user credential is not correct"
 *   }
 * }
 */
user.post('/users/login', UserCtrl.login);

/**
 * @api {post} /users/logout Request Logout from session
 * @apiName Logout
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "status": "0"
 * }
 *
 * @apiUse  UserLoggingOutWhenNotLoggedIn
 *
 * @apiErrorExample Error-Response:
 * {
 *   "status": "113",
 *   "value":
 *   {
 *      "message": "user is trying to logout but this user is not logged in as any user"
 *   }
 * }
 */
user.post('/users/logout', UserCtrl.logout);

/**
 * @api {get} /users/:userid Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {ObjectId} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 */
user.get('/users/:userid', UserCtrl.requireUser, UserCtrl.getUser);

/**
 * @api {put} /users/:userid Update User information
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {ObjectId} id User's unique ID.
 * @apiParam {String} User's new nickname.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 */
user.put('/users/:userid', UserCtrl.requireUser, UserCtrl.updateUser);

/**
 * @api {post} /users/register Register new User
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String} email User's email address.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 */
user.post('/users/register', UserCtrl.register);

user.get('/users/verify', UserCtrl.generateVerifyToken);

user.post('/users/verify', UserCtrl.verifyUser);

user.get('/users/reset_password', UserCtrl.generateResetToken);

user.post('/users/reset_password', UserCtrl.resetPassword);

module.exports = user;