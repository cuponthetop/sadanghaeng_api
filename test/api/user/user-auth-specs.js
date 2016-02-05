"use strict";
process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai')
  , should = chai.should()
  , request = require('supertest')('http://localhost:3001')
  ;

describe('User API Auth', () => {
  var refreshToken = '';
  var accessToken = '';

  describe('#access without token', () => {
    it('should not permit access to generateResetToken for user without a valid access token', (done) => {
      request
        .get('/api/v1/users/password_reset')
        .send({
          id: '11bc6f7b9b0d0b0457673daf'
        })
        .expect(200)
        .end((err, res) => {
          res.body
            .should.have.property('status', 401).and
            .notify(done);
        });
    });
  });

  describe('#login', () => {

    it('should not allow users with wrong password to get token', (done) => {
      request
        .post('/api/v1/users/login')
        .send({
          email: 'test@test.com',
          password: 'definitelywrongpassword',
        })
        .expect(400)
        .end((err, res) => {
          res.body
            .should.have.property('status', 400).and
            .should.have.property('message')
            .notify(done);
        });
    });

    it('should allow users to login', (done) => {
      request
        .post('/api/v1/users/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .expect(200)
        .end((err, res) => {
          accessToken = res.body.value.access_token;
          refreshToken = res.body.value.refresh_token;

          res.body.value
            .should.have.property('access_token').and
            .should.have.property('refresh_token')
            .notify(done);
        });
    });


  });

  describe('#access with token', () => {
    it('should allow access to generateResetToken', (done) => {
      request
        .get('/api/v1/users/password_reset')
        .send({
          id: '11bc6f7b9b0d0b0457673daf'
        })
        .expect(200)
        .end((err, res) => {
          res.body
            .should.have.property('status', 0).and
            .notify(done);
        });
    });
  });

  describe('#token refresh', () => {
    it('should refresh access token and keep access to generateResetToken', (done) => {

      // wait till access token gets invalidated

      request
        .get('/api/v1/users/password_reset')
        .send({
          id: '11bc6f7b9b0d0b0457673daf'
        })
        .expect(200)
        .end((err, res) => {
          res.body
            .should.have.property('status', 0).and
            .notify(done);
        });
    });
  });

  describe('#logout', () => {
    it('should allow users to logout and invalidate access token and refresh token', (done) => {

      request
        .post('/api/v1/users/logout')
        .send({})
        .expect(200)
        .end((err, res) => {
          res.body
            .should.have.property('status', 0).and
            .notify(done);
            
          // test for invalidating session
        });
    });


    it('should do nothing when non-logged-in user tries to logout', (done) => {

      request
        .post('/api/v1/users/logout')
        .send({})
        .expect(200)
        .end((err, res) => {
          res.body
            .should.have.property('status', 0).and
            .notify(done);
        });
    });
  });

});
