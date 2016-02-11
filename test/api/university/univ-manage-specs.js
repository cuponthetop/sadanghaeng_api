'use strict';

process.env.NODE_ENV = 'test';

var request = require('supertest-session')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')
  , UnivModel = require('../../../lib/model/university')
  , UnivData = require('../../init/json/universitys.json')
  , mongoose = require('mongoose')
  , config = require('../../../config/config')
  ;


describe('University API Manage', () => {

  var newUnivId = '';

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
    it('should not allow anonymous users to create university', (done) => {
      request
        .post('/api/v1/universities')
        .send({
          name: 'testUniv4',
          displayName: 'testUniv4',
          emailDomainList: ['test4.com']
        })
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
          done();
        });
    });

    it('should not allow normal users to create university', (done) => {
      login.login(request, 'test2@test.com', 'test').then(() => {
        request
          .post('/api/v1/universities')
          .send({
            name: 'testUniv4',
            displayName: 'testUniv4',
            emailDomainList: ['test4.com']
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.have.property('message');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should not allow admin users to create university with invalid email domain', (done) => {
      login.login(request, 'admin@test.com', 'test').then(() => {
        request
          .post('/api/v1/universities')
          .send({
            name: 'testUniv4',
            displayName: 'testUniv4',
            emailDomainList: ['test4']
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.InvalidEmailDomain.code);
            res.body.value.should.have.property('message');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should not allow admin users to create university with existing university name', (done) => {
      login.login(request, 'admin@test.com', 'test').then(() => {
        request
          .post('/api/v1/universities')
          .send({
            name: 'testUniv3',
            displayName: 'testUniv4',
            emailDomainList: ['test4.com']
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UnivAlreadyExisting.code);
            res.body.value.should.have.property('message');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should allow admin users to create university', (done) => {
      login.login(request, 'admin@test.com', 'test').then(() => {
        request
          .post('/api/v1/universities')
          .send({
            name: 'testUniv4',
            displayName: 'testUniv4',
            emailDomainList: ['test4.com']
          })
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            newUnivId = res.body.value;
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });
  });

  describe('#updateUniversity', () => {
    it('should not allow anonymous users to update university', (done) => {
      request
        .put('/api/v1/universities/' + newUnivId)
        .send({
          name: 'shouldnot accept this',
          displayName: 'should not accept this',
          emailDomainList: ['should not accept this']
        })
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
          done();
        });
    });

    it('should not allow normal users to update university', (done) => {
      login.login(request, 'test@test.com', 'test').then(() => {
        request
          .put('/api/v1/universities/' + newUnivId)
          .send({
            name: 'shouldnotaccept',
            displayName: 'shouldnotaccept',
            emailDomainList: ['shouldnotaccepts']
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.have.property('message');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should not allow admin users to update university with invalid email domain', (done) => {
      login.login(request, 'admin@test.com', 'test').then(() => {
        request
          .put('/api/v1/universities/' + newUnivId)
          .send({
            name: 'changeUniv4',
            displayName: 'changeUniv4',
            emailDomainList: ['test4']
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.InvalidEmailDomain.code);
            res.body.value.should.have.property('message');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should allow admin users to update university', (done) => {
      login.login(request, 'admin@test.com', 'test').then(() => {
        request
          .put('/api/v1/universities/' + newUnivId)
          .send({
            name: 'changeUniv4',
            displayName: 'changeUniv4',
            emailDomainList: ['test4.com']
          })
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.should.have.property('value', null);
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });
  });

  describe('#destroyUniversity', () => {
    it('should not allow anonymous users to destroy university', (done) => {
      request
        .delete('/api/v1/universities/' + newUnivId)
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
          done();
        });
    });

    it('should not allow normal users to destroy university', (done) => {
      login.login(request, 'test@test.com', 'test').then(() => {
        request
          .delete('/api/v1/universities/' + newUnivId)
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
            res.body.value.should.have.property('message');
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });

    it('should allow admin users to destroy university', (done) => {
      login.login(request, 'admin@test.com', 'test').then(() => {
        request
          .delete('/api/v1/universities/' + newUnivId)
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.should.have.property('value', null);
            login.logout(request).then(() => {
              done();
            });
          });
      });
    });
  });

});

