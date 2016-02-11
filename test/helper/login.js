"use strict";

var chai = require('./setup-chai')
  , status = require('../../lib/server/status')
  , Q = require('q')
  ;

module.exports.login = function (request, email, password) {
  var deferred = Q.defer();

  request
    .post('/api/v1/users/login')
    .send({
      email: email,
      password: password,
    })
    .end((err, res) => {
      res.body.status.should.be.equal(0);
      deferred.resolve();
    });

  return deferred.promise;
};

module.exports.logout = function (request) {
  var deferred = Q.defer();

  request
    .post('/api/v1/users/logout')
    .send({})
    .end((err, res) => {
      res.body.status.should.be.equal(0);
      deferred.resolve();
    });

  return deferred.promise;
};