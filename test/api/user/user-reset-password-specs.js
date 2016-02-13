'use strict';
process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , request = require('../../helper/setup-supertest')('http://localhost:3001')
  , UserModel = require('../../../lib/model/user')
  , mongoInit = require('../../init/mongo-init')
  , userInit = require('../../init/users-init')
  ;

describe('User API Reset Password', () => {
  var testId = '11bc6f7b9b0d0b0457673daf';
  var test2Id = '21bc6f7b900d0aa457673daf';

  before((done) => {
    mongoInit.connect().then(userInit).catch(console.log).fin(done);
  });

  after((done) => {
    userInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });


  describe('#reset password', () => {

    it('should not generate reset password token for unregistered user', (done) => {
      request
        .get('/api/v1/users/reset_password')
        .send({ email: 'definitelynotregistered@test.com' })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserNotFound.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject reset password request from user with weird email address', (done) => {
      request
        .get('/api/v1/users/reset_password')
        .send({ email: 'test2@we!r%..test.com' })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidEmailAddress.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should generate reset password token', (done) => {
      request
        .get('/api/v1/users/reset_password')
        .send({ email: 'test@test.com' })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
        .then(() => {
          return request
            .get('/api/v1/users/reset_password')
            .send({ email: 'test2@test.com' })
            .expect(200)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not accept wrong token', (done) => {
      request
        .post('/api/v1/users/reset_password')
        .send({
          email: 'test@test.com',
          resetToken: 'definitelywrongverificationtoken',
          newPassword: 'thisshouldnotbeaccepted'
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserTokenMismatch.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not accept expired token', (done) => {
      UserModel.findOneAndUpdate({ _id: testId }, { reset_token_expires: new Date(1) }).exec().then((user) => {

        request
          .post('/api/v1/users/reset_password')
          .send({
            email: 'test@test.com',
            resetToken: user.reset_token,
            newPassword: 'thisshouldnotbeaccepted'
          })
          .expect(500)
          .toPromise()
          .then((res) => {
            res.body.status.should.be.equal(status.codes.UserTokenAlreadyExpired.code);
          })
          .then(done)
          .catch(done)
          .done();
      }, (err) => {
        err.should.not.exist;
        done();
      });
    });

    it('should accept reset token and reset users password', (done) => {
      UserModel.findOne({ _id: test2Id }).exec().then((user) => {

        request
          .post('/api/v1/users/reset_password')
          .send({
            email: 'test2@test.com',
            resetToken: user.reset_token,
            newPassword: 'newpassword'
          })
          .expect(200)
          .toPromise()
          .then((res) => {
            res.body.status.should.be.equal(0);
          })
          .then(done)
          .catch(done)
          .done();
      }, (err) => {
        err.should.not.exist;
        done();
      });
    });

    it('should not allow user to use old password to login', (done) => {
      request
        .post('/api/v1/users/login')
        .send({
          email: 'test2@test.com',
          password: 'test'
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserCredentialsNotMatch.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow user to use new password to login', (done) => {
      request
        .post('/api/v1/users/login')
        .send({
          email: 'test2@test.com',
          password: 'newpassword'
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
        .then(done)
        .catch(done)
        .done();
    });
  });
});

