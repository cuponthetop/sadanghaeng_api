'use strict';

var User = require('../model/user');

function UserController () {

}

UserController.prototype.getUser  = function (req, res, next) {

  User.find({}, function(err, users) {
    res.status(200).json(users);
  });
};


module.exports = new UserController();