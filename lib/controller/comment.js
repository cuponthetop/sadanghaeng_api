'use strict';

function CommentController () {

}

CommentController.prototype.getComment  = function (req, res, next) {
  req = req;
  res = res;
  next = next;
  return "test";
};


module.exports = new CommentController();