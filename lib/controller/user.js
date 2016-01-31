'use strict';

var User = require('../model/user')
  , response = require('../server/response')
  ;

var UserController = function () { };

UserController.prototype.getUser = function (req, res) {
  User.findOne({ _id: req.params.id }, function (err, user) {
    response.respondSuccess(req, res, user, null);
    // res.status(200).json(user);
  });
};


module.exports = new UserController();