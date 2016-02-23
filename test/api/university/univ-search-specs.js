'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  ;


describe('University API Search', () => {
  var univId = '56ac6f7b9b0d0b0457673daf';
  var univ3Id = '77cc6f7b9b0d0b0457673daa';

  describe('#searchPosts invalid', () => {

    before((done) => {
      login('test@test.com', 'test')
        .catch(console.log)
        .fin(done);
    });

    after((done) => {
      logout()
        .catch(console.log)
        .fin(done);
    });

    it('should reject search with empty query', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          fields: ['title']
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.EmptyQueryStringRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject search with invalid page number #1', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          page: -1,
          fields: ['title']
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidPageNumberRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject search with invalid page number #2', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          page: 10001,
          fields: ['title']
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidPageNumberRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject search with invalid sort', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          sort: 'dwq',
          fields: ['title']
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidSortRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject search with empty search field', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test'
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidSearchFieldRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject search with invalid search field', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          fields: ['titlse']
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidSearchFieldRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject search with invalid perPage #1', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          perPage: -1,
          fields: ['title']
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidPerPageRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject search with invalid perPage #2', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          perPage: 31,
          fields: ['title']
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidPerPageRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject search with invalid perPage #3', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          perPage: 0,
          fields: ['title']
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidPerPageRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });
  });

  describe('#searchPosts permission', () => {
    it('should not allow anonymous user to search', (done) => {
      request
        .get('/api/v1/universities/' + univ3Id + '/search')
        .send({
          query: 'test',
          fields: ['title']
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow user not in a university to search posts', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/universities/' + univ3Id + '/search')
            .send({
              query: 'test',
              fields: ['title']
            })
            .expect(500)
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

    it('should allow students to search posts in a university', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/universities/' + univId + '/search')
            .send({
              query: 'Test',
              fields: ['title']
            })
            .expect(200)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(5);
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow admin to search wherever', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/universities/' + univ3Id + '/search')
            .send({
              query: 'Test',
              fields: ['title']
            })
            .expect(200)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(1);
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow admin to query non-existing univ', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/universities/' + 'nonexisting' + '/search')
            .send({
              query: 'Test',
              fields: ['title']
            })
            .expect(500)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UnivNotFound.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
  });

  describe('#searchPosts valid', () => {

    before((done) => {
      login('test@test.com', 'test')
        .catch(console.log)
        .fin(done);
    });

    after((done) => {
      logout()
        .catch(console.log)
        .fin(done);
    });

    it('should search with valid query string', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          fields: ['title']
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(5);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow adjusting perPage', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          perPage: 1,
          fields: ['title']
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(1);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should search with valid page number #1', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          page: 2,
          perPage: 1,
          fields: ['title']
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(1);
          res.body.value[0].should.have.property('title', 'Test Post4');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should search with valid page number #2', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          page: 2,
          perPage: 3,
          fields: ['title']
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(2);
          res.body.value[0].should.have.property('title', 'Test Post2');
          res.body.value[0].should.have.property('readCount', 2);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should sort search with ascending order', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          sort: 'asc',
          fields: ['title']
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(5);
          res.body.value[0].should.have.property('written');
          res.body.value[4].should.have.property('written');

          res.body.value[0].written.should.be.below(res.body.value[4].written);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should sort search with descending order', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Test',
          sort: 'desc',
          fields: ['title']
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(5);

          res.body.value[0].should.have.property('written');
          res.body.value[4].should.have.property('written');

          res.body.value[0].written.should.be.above(res.body.value[4].written);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow single search field query (title)', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Post',
          fields: ['title']
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(5);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow single search field query (text)', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: '22Test',
          fields: ['text']
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(1);
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow combined field query', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/search')
        .send({
          query: 'Text,',
          fields: ['title', 'text']
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(5);
        })
        .then(done)
        .catch(done)
        .done();
    });

  });
});
