"use strict";

var PostModel = require('../../../lib/model/post')
  , PostData = require('./posts.json')
  , Q = require('q')
  ;

module.exports = function () {

  var deferred = Q.defer();

  PostModel.remove({}).exec()
    .then(PostModel.create(PostData)
      .then(deferred.resolve, deferred.reject),
      deferred.reject);

  return deferred.promise;
};
