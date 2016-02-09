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
 * @api {post} /users/register Register new User
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String} email User's email address.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {Number} status
 * @apiSuccess {String} value user id of newly registered user.
 *
 * @apiUse UserEmailAlreadyInUse
 */
user.post('/users/register', UserCtrl.register);

/**
 * @api {get} /users/verify Generate verification token for User
 * @apiName GenerateVerificationToken
 * @apiGroup User
 *
 * @apiParam {String} email User's email address.
 *
 * @apiSuccess {Number} status
 *
 * @apiUse UserAlreadyVerified
 * @apiUse UserNotFound
 */
user.get('/users/verify', UserCtrl.generateVerifyToken);

/**
 * @api {post} /users/register Verify User's email address
 * @apiName VerifyUser
 * @apiGroup User
 *
 * @apiParam {String} email User's email address.
 * @apiParam {String} verifyToken verification token
 *
 * @apiSuccess {Number} status
 *
 * @apiUse UserAlreadyVerified
 * @apiUse UserNotFound
 * @apiUse UserTokenAlreadyExpired
 * @apiUse UserTokenMismatch
 * @apiUse UserUpdateFailed
 */
user.post('/users/verify', UserCtrl.verifyUser);

/**
 * @api {get} /users/reset_password Generate reset token for password reset
 * @apiName GenerateResetToken
 * @apiGroup User
 *
 * @apiParam {String} email User's email address.
 *
 * @apiSuccess {Number} status
 *
 * @apiUse UserNotVerified
 * @apiUse UserNotFound
 */
user.get('/users/reset_password', UserCtrl.generateResetToken);

/**
 * @api {post} /users/reset_password Reset User's password
 * @apiName ResetPassword
 * @apiGroup User
 *
 * @apiParam {String} email User's email address.
 * @apiParam {String} resetToken password reset token
 * @apiParam {String} newPassword new password
 *
 * @apiSuccess {Number} status
 *
 * @apiUse UserNotVerified
 * @apiUse UserNotFound
 * @apiUse UserTokenAlreadyExpired
 * @apiUse UserTokenMismatch
 * @apiUse UserUpdateFailed
 */
user.post('/users/reset_password', UserCtrl.resetPassword);

/**
 * @api {get} /users/:userid Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {ObjectId} id User's unique ID.
 *
 * @apiSuccess {Number} status  status of request
 * @apiSuccess {Object} value   User Information
 * @apiSuccess {String} value._id User unique id
 * @apiSuccess {String} value.email   User email address
 * @apiSuccess {String} value.nickname  User nickname
 * @apiSuccess {Boolean} value.verified is verified User
 * @apiSuccess {String} value.reset_token User password reset token
 * @apiSuccess {Date}   value.reset_token_expires password reset token expiration date
 * @apiSuccess {String} value.verify_token User verification token
 * @apiSuccess {Date}   value.verify_token_expires verification token expiration date
 * @apiSuccess {String} value.univID  University ID User is in
 * @apiSuccess {Date}   value.memberSince When user registered
 * @apiSuccess {Number} value.reportCounts The number of times this user was reported by other users
 *
 * @apiUse UserAuthRequired
 * @apiUse UserNotFound
 * @apiUse UserNotVerified
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
 * @apiSuccess {Number} status
 *
 * @apiUse UserAuthRequired
 * @apiUse UserNotFound
 * @apiUse UserUpdateFailed
 * @apiUse UserNotVerified
 */
user.put('/users/:userid', UserCtrl.requireUser, UserCtrl.updateUser);

module.exports = user;