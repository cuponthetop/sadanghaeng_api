"use strict";

var CommentModel = require('../../../lib/model/comment')
  , CommentData = require('./comments.json')
  , Q = require('q')
  ;

module.exports = function () {

  var deferred = Q.defer();

  CommentModel.remove({}).exec()
    .then(CommentModel.create(CommentData)
      .then(deferred.resolve, deferred.reject),
      deferred.reject);

  return deferred.promise;
};
