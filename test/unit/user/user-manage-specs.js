'use strict';

process.env.NODE_ENV = 'test';

var request = require('supertest');
var chai = require('../../helper/setup-chai');
var expect = chai.expect;
var app = require('../../../lib/server/test-server');

describe('UserController', function () {
  describe('#getUser', function () {
    it('respond with json', function (done) {
      request(app)
        .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          console.log(JSON.stringify(res));
          expect(res.body.value.email).to.equal('test@test.com');
          done();
        });
    });
  });
});

