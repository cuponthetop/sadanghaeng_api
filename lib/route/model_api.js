"use strict";

/**
 * @apiDefine SuccessCode
 * @apiSuccess {Number} status  status of request
 *
 */

/**
 * @apiDefine UserModel
 * @apiSuccess {Object} value   User Information
 * @apiSuccess {String} value._id User unique id
 * @apiSuccess {String} value.email   User email address
 * @apiSuccess {String} value.nickname  User nickname
 * @apiSuccess {Boolean} value.verified is verified User
 * @apiSuccess {Boolean} value.admin is admin User
 * @apiSuccess {String} value.reset_token User password reset token
 * @apiSuccess {Date}   value.reset_token_expires password reset token expiration date
 * @apiSuccess {String} value.verify_token User verification token
 * @apiSuccess {Date}   value.verify_token_expires verification token expiration date
 * @apiSuccess {String} value.univID  University ID User is in
 * @apiSuccess {Date}   value.memberSince When user registered
 * @apiSuccess {Number} value.reportCounts The number of times this user was reported by other users
 *
 */
