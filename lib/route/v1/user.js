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

// user.post('/users/register', function (req, res, next) {
//   var user = {
//     email: req.body.email,
//     password: req.body.password
//   };

//   User.register(user, function (err, user) {
//     if (err) return next(err);
//     user = user;

//     res.status(200).send();
//   });
// });

// user.get('/users/verify', function (req, res, next) {
//   var email = req.user.email;

//   User.generateVerifyToken(email, function (err, user) {
//     if (err) return next(err);

//     // TODO: send email
//     user = user;
//     //
//     res.status(200).send();
//   });
// });

// user.post('/users/verify', function (req, res, next) {

//   next();
// });

// user.get('/users/reset_password', function (req, res, next) {
//   var email = req.user.email;

//   User.generateResetToken(email, function (err, user) {
//     if (err) return next(err);

//     // TODO: send email
//     user = user;
//     //
//     res.status(200).send();
//   });
// });

// user.post('/users/reset_password', function (req, res, next) {

//   next();
// });

module.exports = user;