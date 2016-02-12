'use strict';
process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , request = require('supertest-session')('http://localhost:3001')
  , UserModel = require('../../../lib/model/user')
  , UserData = require('../../init/json/users.json')
  , mongoose = require('mongoose')
  , config = require('../../../config/config')
  ;

describe('User API Reset Password', () => {
  var testId = '11bc6f7b9b0d0b0457673daf';
  var test2Id = '21bc6f7b900d0aa457673daf';

  before((done) => {
    // 몽고 db 연결
    var dbUri = config.db.uri + config.db.dbName;
    var dbOptions = {
      username: config.db.username,
      password: config.db.password
    };
    mongoose.connect(dbUri, dbOptions);

    UserModel.remove({}).exec().then(
      UserModel.create(UserData).then(() => {
        done();
      }, (err) => {
        console.log(err);
        done();
      }), (err) => {
        console.log(err);
        done();
      });
  });

  after((done) => {
    UserModel.remove({}).exec().then(
      UserModel.create(UserData).then(() => {
        mongoose.disconnect();
        done();
      }, (err) => {
        console.log(err);
        mongoose.disconnect();
        done();
      }), (err) => {
        console.log(err);
        mongoose.disconnect();
        done();
      });
  });

  describe('#reset password', () => {

    it('should not generate reset password token for unregistered user', (done) => {
      request
        .get('/api/v1/users/reset_password')
        .send({ email: 'definitelynotregistered@test.com' })
        .expect(500)
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserNotFound.code);
          done();
        });
    });

    it('should reject reset password request from user with weird email address', (done) => {
      request
        .get('/api/v1/users/reset_password')
        .send({ email: 'test2@we!r%..test.com' })
        .expect(500)
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.InvalidEmailAddress.code);
          done();
        });
    });

    it('should generate reset password token', (done) => {
      request
        .get('/api/v1/users/reset_password')
        .send({ email: 'test@test.com' })
        .expect(200)
        .end((err, res) => {
          res.body.status.should.be.equal(0);
        });
      request
        .get('/api/v1/users/reset_password')
        .send({ email: 'test2@test.com' })
        .expect(200)
        .end((err, res) => {
          res.body.status.should.be.equal(0);
          done();
        });
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
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserTokenMismatch.code);
          done();
        });
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
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserTokenAlreadyExpired.code);
            done();
          });
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
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            done();
          });
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
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserCredentialsNotMatch.code);
          done();
        });
    });

    it('should allow user to use new password to login', (done) => {
      request
        .post('/api/v1/users/login')
        .send({
          email: 'test2@test.com',
          password: 'newpassword'
        })
        .expect(200)
        .end((err, res) => {
          res.body.status.should.be.equal(0);
          done();
        });
    });
  });
});

