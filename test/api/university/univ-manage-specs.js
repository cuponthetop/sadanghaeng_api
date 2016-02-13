'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , univInit = require('../../init/universitys-init')
  ;


describe('University API Manage', () => {

  var newUnivId = '';

  before((done) => {
    mongoInit.connect().then(univInit).catch(console.log).fin(done);
  });

  after((done) => {
    univInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });


  describe('#getUniversity', () => {
    var univId = '56ac6f7b9b0d0b0457673daf';

    it('should not allow access to anonymous users', (done) => {
      request
        .get('/api/v1/universities/' + univId)
        .expect(500)
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.not.have.property('displayName');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow access to other users', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/universities/' + univId)
            .expect(500).toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
          res.body.value.should.not.have.property('displayName');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow access to admin users', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/universities/' + univId)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.displayName.should.be.equal('testUniv');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
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
        }).toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow normal users to create university', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/universities')
            .send({
              name: 'testUniv4',
              displayName: 'testUniv4',
              emailDomainList: ['test4.com']
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow admin users to create university with invalid email domain', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/universities')
            .send({
              name: 'testUniv4',
              displayName: 'testUniv4',
              emailDomainList: ['test4']
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidEmailDomain.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow admin users to create university with existing university name', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/universities')
            .send({
              name: 'testUniv3',
              displayName: 'testUniv4',
              emailDomainList: ['test4.com']
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UnivAlreadyExisting.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow admin users to create university', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/universities')
            .send({
              name: 'testUniv4',
              displayName: 'testUniv4',
              emailDomainList: ['test4.com']
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          newUnivId = res.body.value;
          logout().then(done);
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
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
          done();
        });
    });

    it('should not allow normal users to update university', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .put('/api/v1/universities/' + newUnivId)
            .send({
              name: 'shouldnotaccept',
              displayName: 'shouldnotaccept',
              emailDomainList: ['shouldnotaccepts']
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
          res.body.value.should.have.property('message');
          logout().then(done);
        });
    });

    it('should not allow admin users to update university with invalid email domain', (done) => {
      login('admin@test.com', 'test').then(() => {
        return request
          .put('/api/v1/universities/' + newUnivId)
          .send({
            name: 'changeUniv4',
            displayName: 'changeUniv4',
            emailDomainList: ['test4']
          })
          .toPromise();
      })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidEmailDomain.code);
          res.body.value.should.have.property('message');
          logout().then(done);
        });
    });

    it('should allow admin users to update university', (done) => {
      login('admin@test.com', 'test').then(() => {
        return request
          .put('/api/v1/universities/' + newUnivId)
          .send({
            name: 'changeUniv4',
            displayName: 'changeUniv4',
            emailDomainList: ['test4.com']
          })
          .toPromise();
      })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.should.have.property('value', null);
          logout().then(done);
        });
    });
  });

  describe('#destroyUniversity', () => {
    it('should not allow anonymous users to destroy university', (done) => {
      request
        .delete('/api/v1/universities/' + newUnivId)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
          done();
        });
    });

    it('should not allow normal users to destroy university', (done) => {
      login('test@test.com', 'test').then(() => {
        return request
          .delete('/api/v1/universities/' + newUnivId)
          .toPromise();
      })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
          res.body.value.should.have.property('message');
          logout().then(done);
        });
    });

    it('should allow admin users to destroy university', (done) => {
      login('admin@test.com', 'test').then(() => {
        return request
          .delete('/api/v1/universities/' + newUnivId)
          .toPromise();
      })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.should.have.property('value', null);
          logout().then(done);
        });
    });
  });
});

