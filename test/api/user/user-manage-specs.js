'use strict';

process.env.NODE_ENV = 'test';

var request = require('supertest-session')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')
  , UserModel = require('../../../lib/model/user')
  , UserData = require('../../init/json/users.json')
  , mongoose = require('mongoose')
  , config = require('../../../config/config')
  ;


describe('User API Manage', () => {

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

  describe('#getUser', () => {
    it('should not allow access to anonymous users', (done) => {
      request
        .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.not.have.property('email');
          done();
        });
    });

    it('should not allow access to other users', (done) => {
      login.login(request, 'test2@test.com', 'test').then(() => {
        request
          .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.not.have.property('email');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should allow access to owner users', (done) => {
      login.login(request, 'test@test.com', 'test').then(() => {
        request
          .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.email.should.be.equal('test@test.com');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should allow access to admin users', (done) => {
      login.login(request, 'admin@test.com', 'test').then(() => {
        request
          .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.email.should.be.equal('test@test.com');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });
  });

  describe('#updateUser', () => {

    it('should not allow access to anonymous users', (done) => {
      request
        .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
        .send({
          nickname: 'should not update'
        })
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.not.have.property('nickname');
          done();
        });
    });

    it('should not allow access to other users', (done) => {
      login.login(request, 'test2@test.com', 'test').then(() => {
        request
          .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .send({
            nickname: 'should not update'
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.not.have.property('nickname');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should allow access to owner users', (done) => {
      login.login(request, 'test@test.com', 'test').then(() => {
        request
          .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .send({
            nickname: "should update"
          })
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.nickname.should.be.equal('should update');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should not allow access to admin users', (done) => {
      login.login(request, 'admin@test.com', 'test').then(() => {
        request
          .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .send({
            nickname: 'should not update'
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.not.have.property('nickname');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should expire login session after changing password', (done) => {
      login.login(request, 'test@test.com', 'test').then(() => {
        request
          .put('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .send({
            password: 'test2'
          })
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.nickname.should.be.equal('should update');

            request
              .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
              .end((err, res) => {
                res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
                res.body.value.should.not.have.property('email');
                done();
              });
          });
      });
    });

    it('should allow login with new password', (done) => {
      login.login(request, 'test@test.com', 'test2').then(() => {
        request
          .get('/api/v1/users/' + '11bc6f7b9b0d0b0457673daf')
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.email.should.be.equal('test@test.com');
            done();
          });
      });
    });

  });
});

