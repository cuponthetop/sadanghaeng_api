'use strict';

function UserController () {

}

UserController.prototype.getUser  = function (req, res, next) {
  req = req;
  res = res;
  next = next;
  return "test";
};


module.exports = new UserController();