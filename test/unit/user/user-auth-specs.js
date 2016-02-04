"use strict";
process.env.NODE_ENV = 'test';

// var assert = require('assert')
//   , request = require('supertest')('http://localhost:3001')
//   ;

// describe('User Auth', function () {
//   var clientSecretBase64 = new Buffer('123').toString('base64');
//   var clientCredentials = 'garim-test' + clientSecretBase64;

//   it('should allow tokens to be requested', function (done) {
//     request
//       .post('/auth/v1/token')
//       .type('form')
//       .auth(clientCredentials, '')
//       .send({
//         grant_type: 'password',
//         username: '11bc6f7b9b0d0b0457673daf',
//         password: 'test',
//         client_id: 'garim-test',
//         client_secret: '123'
//       })
//       .expect(200)
//       .end(function (err, res) {
//         assert(res.body.access_token, 'Ensure the access_token was set');
//         assert(res.body.refresh_token, 'Ensure the refresh_token was set');

//         done();
//       });
//   });


// });
