"use strict";

var UnivModel = require('../../lib/model/university')
  , UnivData = require('../init/json/universitys.json')
  , Q = require('q')
  ;

module.exports = function () {

  var deferred = Q.defer();

  UnivModel.remove({}).exec()
    .then(UnivModel.create(UnivData)
      .then(deferred.resolve, deferred.reject),
      deferred.reject);

  return deferred.promise;
};
