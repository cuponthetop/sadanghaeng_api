'use strict';
process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , request = require('../../helper/setup-supertest')('http://localhost:3001')
  , UserModel = require('../../../lib/model/user')
  , mongoInit = require('../../init/mongo-init')
  , userInit = require('../../init/users-init')
  ;

describe('User API Register', () => {
  var test3Id;
  var test4Id;

  before((done) => {
    mongoInit.connect().then(userInit).catch(console.log).fin(done);
  });

  after((done) => {
    userInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#register user', () => {

    it('should not allow user to use duplicate email address', (done) => {
      request
        .post('/api/v1/users/register')
        .send({
          email: 'test@test.com',
          password: 'definitelywrongpassword',
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserEmailAlreadyInUse.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow user to use weird email address', (done) => {
      request
        .post('/api/v1/users/register')
        .send({
          email: 'test@test.fqf##..s.com',
          password: 'definitelywrongpassword',
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidEmailAddress.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow new user to register', (done) => {
      request
        .post('/api/v1/users/register')
        .send({
          email: 'test3@test.com',
          password: 'test3',
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          test3Id = res.body.value;
          res.body.status.should.be.equal(0);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow new user to register #2', (done) => {
      request
        .post('/api/v1/users/register')
        .send({
          email: 'test4@test3.com',
          password: 'test4',
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          test4Id = res.body.value;
          res.body.status.should.be.equal(0);
        })
        .then(done)
        .catch(done)
        .done();
    });
  });

  describe('#verify user', () => {

    it('should not allow access to not verified user', (done) => {
      request
        .post('/api/v1/users/login')
        .send({
          email: 'test3@test.com',
          password: 'test3'
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserNotVerified.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not generate tokens for not registered user', (done) => {
      request
        .get('/api/v1/users/verify')
        .send({ email: 'notregistered@test.com' })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserNotFound.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not generate tokens for user with weird email address', (done) => {
      request
        .get('/api/v1/users/verify')
        .send({ email: 'test3@test!#.a.com' })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidEmailAddress.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow users to generate verification token', (done) => {
      request
        .get('/api/v1/users/verify')
        .send({ email: 'test3@test.com' })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          return request
            .get('/api/v1/users/verify')
            .send({ email: 'test4@test3.com' })
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

    it('should reject verification request from user with weird email', (done) => {
      request
        .post('/api/v1/users/verify')
        .send({
          email: 'test3@test41.gdg...com',
          verifyToken: "totalweird"
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidEmailAddress.code);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should properly verify user', (done) => {
      UserModel.findOne({ _id: test3Id }).exec().then((user) => {
        request
          .post('/api/v1/users/verify')
          .send({
            email: 'test3@test.com',
            verifyToken: user.verify_token
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

    it('should allow access to verified user', (done) => {
      request
        .post('/api/v1/users/login')
        .send({
          email: 'test3@test.com',
          password: 'test3'
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          request.destroy();
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not verify user with invalid token', (done) => {
      request
        .post('/api/v1/users/verify')
        .send({
          email: 'test4@test3.com',
          verifyToken: 'definitelywrongverificationtoken'
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

    it('should not verify user with expired token', (done) => {
      UserModel.findOneAndUpdate({ _id: test4Id }, { verify_token_expires: new Date(1) }).exec().then((user) => {

        request
          .post('/api/v1/users/verify')
          .send({
            email: 'test4@test3.com',
            verifyToken: user.verify_token
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

    it('should not allow verified users to generate verification token', (done) => {
      request
        .get('/api/v1/users/verify')
        .send({ email: 'test3@test.com' })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAlreadyVerified.code);
        })
        .then(done)
        .catch(done)
        .done();
    });
  });
});

