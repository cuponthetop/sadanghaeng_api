'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:5001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , UserData = require('../../init/json/users.json')
  , UnivData = require('../../init/json/universitys.json')
  , PostData = require('../../init/json/posts.json')
  , CommentData = require('../../init/json/comments.json')
  ;


describe('Statistics API', () => {

  describe('#getUserStat', () => {
    it('should properly retrieve basic stats', (done) => {
      request
        .get('/api/v1/stats/users')
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.property('count', UserData.filter((user) => { return user.verified; }).length);
        })
        .then(done)
        .catch(done)
        .done();
    });
  });

  describe('#getUnivStat', () => {
    it('should properly retrieve basic stats', (done) => {
      request
        .get('/api/v1/stats/universities')
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.property('count', UnivData.length);
        })
        .then(done)
        .catch(done)
        .done();
    });
  });

  describe('#getPostStat', () => {
    it('should properly retrieve basic stats', (done) => {
      request
        .get('/api/v1/stats/posts')
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.property('count', PostData.length);
        })
        .then(done)
        .catch(done)
        .done();
    });
  });

  describe('#getCommentStat', () => {
    it('should properly retrieve basic stats', (done) => {
      request
        .get('/api/v1/stats/comments')
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.property('count', CommentData.length);
        })
        .then(done)
        .catch(done)
        .done();
    });
  });
});

