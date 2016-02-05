'use strict';

process.env.NODE_ENV = 'test';

var request = require('supertest');
var chai = require('../../helper/setup-chai');
var expect = chai.expect;
var app = request('http://localhost:3001');

describe('UserController', () => {
  describe('#getUser', () => {
    it('respond with json', (done) => {
      app
        .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
        .set('Accept', 'application/json')
        .end( (err, res) => {
          console.log(JSON.stringify(res));
          expect(res.body.value.email).to.equal('test@test.com');
          done();
        });
    });
  });
});

