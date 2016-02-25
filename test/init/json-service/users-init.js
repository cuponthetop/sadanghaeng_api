"use strict";

var UserModel = require('../../../lib/model/user')
  , UserData = require('./users.json')
  , Q = require('q')
  ;

module.exports = function () {

  var deferred = Q.defer();

  UserModel.remove({}).exec()
    .then(UserModel.create(UserData)
      .then(deferred.resolve, deferred.reject),
      deferred.reject);

  return deferred.promise;
};
