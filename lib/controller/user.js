'use strict';

var User = require('../model/user')
  , response = require('../server/response')
  , status = require('../server/status')
  ;

var UserController = function () { };

UserController.prototype.getUser = function (req, res) {
  User.findOne({ _id: req.params.id }, function (err, user) {
    response.respondSuccess(req, res, user, null);
  });
};

UserController.prototype.updateUser = function (req, res) {
  User.findOne({ _id: req.params.id }).exec().then(function (user) {

    user.nickname = req.params.nickname;

    user.save().then(function (savedUser) {
      response.respondSuccess(req, res, savedUser, null);
    }, function (err) {
      err = err;
      response.respondError(req, res, status.codes.UserUpdateFailed.code, null);
    });
  }, function (err) {
    err = err;
    response.respondError(req, res, status.codes.UserNotFound.code, null);
  });
};

module.exports = new UserController();