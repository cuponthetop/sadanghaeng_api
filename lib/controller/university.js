'use strict';

function UniversityController () {

}

UniversityController.prototype.getUniversity  = function (req, res, next) {
  req = req;
  res = res;
  next = next;
  return "test";
};


module.exports = new UniversityController();