'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , commentInit = require('../../init/comments-init')
  ;

describe('Vote comment API', () => {


  before((done) => {
    mongoInit.connect().then(commentInit).catch(console.log).fin(done);
  });

  after((done) => {
    commentInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#voteComment', () => {
    var cid = '77ac6f7b9b0d0b0457673daf';

    it('should not allow anonymous users to vote', (done) => {
      request
        .post('/api/v1/comments/' + cid + '/votes')
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('vote should not be empty', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ type: '' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.shoud.be.equal(status.codes.EmptyVote.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('vote should be only up- or down-vote', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ type: 'lol' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.WrongVote.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should get right post to vote on and allow logged-in users to vote', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ type: 'upvote' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.shoud.be.equal(0);
          res.body.value.should.exist();
          return request
            .get('/api/v1/comments/' + cid)
            .toPromise();
        })
        .then((res) => {
          res.body.value.should.have.property('votes', 'upvote');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should only allow user to vote once', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ type: 'upvote' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.shoud.be.equal(0);
          return request
            .post('/api/v1/comments/' + cid + '/votes')
            .send({ type: 'downvote' })
            .toPromise();
        })
        .then((res) => {
          res.body.status.shoud.be.equal(status.codes.AlreadyVoted.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
  });

});