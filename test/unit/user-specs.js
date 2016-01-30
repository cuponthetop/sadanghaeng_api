'use strict';

 var request = require('supertest');
 var expect = require('chai').expect;
 var app = require('../../lib/server/server');

 describe('UserController', function () {
   describe('#getUser', function () {
     it('respond with json', function (done) {
       request(app)
         .get('/api/v1/users/' + 'test')
         .set('Accept', 'application/json')
         .end(function (err, res) {
           expect(res.body.name).to.equal('test');
           done();
         });
     });
   });


 });

