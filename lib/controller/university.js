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

var isValidEmail = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

UniversityController.prototype.getUniversityFromEmail = function (email) {
  var deferred = Q.defer();

  var emailDomain = email.replace(/.*@/, "");

  if (false === isValidEmail(email)) {
    deferred.reject('not valid email address');
  } else {
    UnivModel.find({ emailDomainList: emailDomain }).exec()
      .then(function (universities) {
        if (universities.length === 0) {
          deferred.reject('none of universities we support have ' + emailDomain);
        } else if (universities.length > 1) {
          deferred.reject('many of universities we support have ' + emailDomain + ' as their email!!');
        } else {
          deferred.resolve(universities[0]._id.toString());
        }
      }, function (err) {
        deferred.reject(err);
      });
  }

  return deferred.promise;
};

module.exports = new UniversityController();