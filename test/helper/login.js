"use strict";

var chai = require('./setup-chai')
  , status = require('../../lib/server/status')
  , request = require('supertest-session')('http://localhost:3001')
  , Q = require('q')
  ;

module.exports.login = function (email, password) {
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

module.exports.logout = function () {
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