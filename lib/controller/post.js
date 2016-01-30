'use strict';

function PostController () {

}

PostController.prototype.getPost  = function (req, res, next) {
  req = req;
  res = res;
  next = next;
  return "test";
};


module.exports = new PostController();