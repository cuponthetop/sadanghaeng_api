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
 * @apiParam {email} email User's unique ID (email address).
 * @apiParam {password} password User's password.
 *
 * @apiError {} 
 */
user.post('/users/login', UserCtrl.login);

/**
 * @api {post} /users/logout Request Logout from session
 * @apiName Logout
 * @apiGroup User
 *
 * @apiError {} 
 */
user.post('/users/logout', UserCtrl.logout);

/**
 * @api {get} /users/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {ObjectId} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 */
user.get('/users/:id', UserCtrl.requireUser, UserCtrl.getUser);

/**
 * @api {put} /users/:id Update User information
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {ObjectId} id User's unique ID.
 * @apiParam {String} User's new nickname.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 */
user.put('/users/:id', UserCtrl.requireUser, UserCtrl.updateUser);

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