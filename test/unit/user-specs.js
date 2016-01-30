'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../../lib/server/server');

describe('UserController',function(){
    describe('#getUser', function() {
        it('respond with json', function(done){
            request(app)
                .get('/user/'+'test')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done)
                .end(function(err, res){
                    if (err) {
                        return done(err);
                    }
                    expect(res.body.name).to.exist;
                    done();
                });
        });
    });


});

