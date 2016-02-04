'use strict';

var Q = require('q')
  , UnivModel = require('../model/university')
  ;

var UniversityController = function () { };

UniversityController.prototype.getUniversity = function (req, res, next) {
  req = req;
  res = res;
  next = next;
  return "test";
};

UniversityController.prototype.getUniversityFromEmail = function (email) {
  var emailDomain = email.replace(/.*@/, "");

  var deferred = Q.defer();

  UnivModel.find({ emailDomainList: emailDomain }).exec()
  .then(function (universities) {
    if (universities.length === 0) {
      deferred.reject('none of universities we support have ' + emailDomain);
    } else if (universities.length > 1) {
      deferred.reject('many of universities we support have ' + emailDomain + 'as their email!!');      
    } else {
      deferred.resolve(universities[0]);
    }
  }, function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

module.exports = new UniversityController();