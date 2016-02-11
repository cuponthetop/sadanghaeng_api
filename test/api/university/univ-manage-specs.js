'use strict';

process.env.NODE_ENV = 'test';

var request = require('supertest-session')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')
  , UnivModel = require('../../../lib/model/university')
  , UnivData = require('../../init/json/universities.json')
  , mongoose = require('mongoose')
  , config = require('../../../config/config')
  ;


describe('University API Manage', () => {

  before((done) => {
    // 몽고 db 연결
    var dbUri = config.db.uri + config.db.dbName;
    var dbOptions = {
      username: config.db.username,
      password: config.db.password
    };
    mongoose.connect(dbUri, dbOptions);

    UnivModel.remove({}).exec().then(
      UnivModel.create(UnivData).then(() => {
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
    UnivModel.remove({}).exec().then(
      UnivModel.create(UnivData).then(() => {
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

  describe('#getUniversity', () => {
    var univId = '56ac6f7b9b0d0b0457673daf';

    it('should not allow access to anonymous users', (done) => {
      request
        .get('/api/v1/universities/' + univId)
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.not.have.property('displayName');
          done();
        });
    });

    it('should not allow access to other users', (done) => {
      login.login(request, 'test2@test.com', 'test').then(() => {
        request
          .get('/api/v1/universities/' + univId)
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.not.have.property('displayName');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should allow access to admin users', (done) => {
      login.login(request, 'admin@test.com', 'test').then(() => {
        request
          .get('/api/v1/universities/' + univId)
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.displayName.should.be.equal('testUniv');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });
  });

  describe('#createUniversity', () => {

  });
  
  describe('#destroyUniversity', () => {

  });


  describe('#updateUniversity', () => {

  });
});

