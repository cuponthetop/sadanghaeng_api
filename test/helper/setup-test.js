'use strict';

var request = require('supertest-session')('http://localhost:3001');

module.exports = function () {
  request
    .post('/api/v1/users/login')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
};