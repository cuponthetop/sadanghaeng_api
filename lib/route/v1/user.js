"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  ;

var user = express();

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {ObjectId} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 */
user.get('/users/:id', UserCtrl.getUser);

/**
 * @api {put} /user/:id Update User information
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {ObjectId} id Users unique ID.
 * @apiParam {String} User's new nickname.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 */
user.put('/users/:id', UserCtrl.updateUser);

module.exports = user;