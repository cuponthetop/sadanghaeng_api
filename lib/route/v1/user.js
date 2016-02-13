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
 * @apiUse  InvalidEmailAddress
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
 * @apiUse SuccessCode
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
 * @apiUse SuccessCode
 * @apiSuccess {String} value user id of newly registered user.
 *
 * @apiUse UserEmailAlreadyInUse
 * @apiUse InvalidEmailAddress
 */
user.post('/users/register', UserCtrl.register);

/**
 * @api {get} /users/verify Generate verification token for User
 * @apiName GenerateVerificationToken
 * @apiGroup User
 *
 * @apiParam {String} email User's email address.
 *
 * @apiUse SuccessCode
 *
 * @apiUse InvalidEmailAddress
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
 * @apiUse SuccessCode
 *
 * @apiUse UserAlreadyVerified
 * @apiUse InvalidEmailAddress
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
 * @apiUse SuccessCode
 *
 * @apiUse InvalidEmailAddress
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
 * @apiUse SuccessCode
 *
 * @apiUse InvalidEmailAddress
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
 * @apiPermission owner
 * @apiPermission admin
 *
 * @apiParam {ObjectId} :userid User's unique ID.
 *
 * @apiUse SuccessCode
 * @apiUse UserModel
 *
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 * @apiUse UserNotFound
 * @apiUse UserNotVerified
 */
user.get('/users/:userid', UserCtrl.requireUser, UserCtrl.permitOwnerOrAdmin, UserCtrl.getUser);

/**
 * @api {put} /users/:userid Update User information
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiPermission owner
 *
 * @apiParam {ObjectId} :userid User's unique ID.
 * @apiParam {String} nickname User's new nickname.
 * @apiParam {String} password User's new password.
 *
 * @apiUse SuccessCode
 * @apiUse UserModel
 *
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 * @apiUse UserNotFound
 * @apiUse UserUpdateFailed
 * @apiUse UserNotVerified
 */
user.put('/users/:userid', UserCtrl.requireUser, UserCtrl.permitOwner, UserCtrl.updateUser);

/**
 * @api {delete} /users/:userid Destroy User information
 * @apiName DestroyUser
 * @apiGroup User
 *
 * @apiPermission owner admin
 *
 * @apiParam {ObjectId} :userid User's unique ID.
 *
 * @apiUse SuccessCode
 * @apiUse UserModel
 *
 * @apiUse UserAuthRequired
 * @apiUse UserPermissionNotAllowed
 * @apiUse UserNotFound
 * @apiUse UserRemovalFailed
 */
user.delete('/users/:userid', UserCtrl.requireUser, UserCtrl.permitAdmin, UserCtrl.destroyUser);

/**
 * @api {post} /users/:userid/report Report User
 * @apiName ReportUser
 * @apiGroup User
 *
 * @apiPermission member
 *
 * @apiParam {ObjectId} :userid User's unique ID.
 *
 * @apiUse SuccessCode
 *
 * @apiUse UserAuthRequired
 * @apiUse UserNotFound
 * @apiUse CantReportSelf
 * @apiUse UserUpdateFailed
 * @apiUse UserNotVerified
 */
user.post('/users/:userid/report', UserCtrl.requireUser, UserCtrl.reportUser);

module.exports = user;