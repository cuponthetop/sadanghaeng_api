'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')
  , logout = require('../../helper/logout')
  ;


describe('University API Posts', () => {
  var univId = '56ac6f7b9b0d0b0457673daf';
  var univ3Id = '77cc6f7b9b0d0b0457673daa';

  describe('#getPostsInUniversity invalid', () => {

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

    it('should reject query with invalid page number #1', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          page: -1
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

    it('should reject query with invalid page number #2', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          page: 10001
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

    it('should reject query with invalid sort', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          sort: 'dwq'
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

    it('should reject query with invalid filter type', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          filter: 'nowbvalidfilter'
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidFilterRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject query with invalid age #1', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          age: -1
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidAgeRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject query with invalid age #2', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          age: 366
        })
        .expect(500)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.InvalidAgeRequested.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should reject query with invalid perPage #1', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          perPage: -1
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

    it('should reject query with invalid perPage #2', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          perPage: 31
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

    it('should reject query with invalid perPage #3', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          perPage: 0
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

  describe('#getPostsInUniversity permission', () => {
    it('should not allow anonymous user to query', (done) => {
      request
        .get('/api/v1/universities/' + univ3Id + '/posts')
        .send({
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

    it('should not allow user not in a university to query posts', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/universities/' + univ3Id + '/posts')
            .send({

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

    it('should allow students to query posts in a university', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/universities/' + univId + '/posts')
            .send({
              filter: 'hot',
              age: 20
            })
            .expect(500)
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

    it('should allow admin to query wherever', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .get('/api/v1/universities/' + univ3Id + '/posts')
            .send({
              filter: 'hot',
              age: 20

            })
            .expect(500)
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
            .get('/api/v1/universities/' + 'nonexisting' + '/posts')
            .send({
              filter: 'hot',
              age: 20
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

  describe('#getPostsInUniversity valid', () => {

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

    it('should query hot topics', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          filter: 'hot',
          age: 20
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(5);
          res.body.value[0].should.have.property('title', 'Test Post1');
          res.body.value[4].should.have.property('title', 'Test Post2');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should query hot topics', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          filter: 'new',
          age: 20
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(5);
          res.body.value[0].should.have.property('title', 'Test Post6');
          res.body.value[4].should.have.property('title', 'Test Post1');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow adjusting perPage', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          filter: 'new',
          perPage: 1,
          age: 20
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

    it('should query with valid page number #1', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          filter: 'new',
          page: 2,
          perPage: 1,
          age: 20
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(1);
          res.body.value[0].should.have.property('title', 'Test Post2');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should query with valid page number #2', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          filter: 'new',
          page: 2,
          perPage: 3,
          age: 20
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(2);
          res.body.value[0].should.have.property('title', 'Test Post4');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should sort query with ascending order', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          filter: 'new',
          sort: 'asc',
          age: 20
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

    it('should sort query with descending order', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          filter: 'new',
          sort: 'desc'
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


    it('should sort query with varying age', (done) => {
      request
        .get('/api/v1/universities/' + univId + '/posts')
        .send({
          filter: 'new',
          age: 7
        })
        .expect(200)
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length.below(5);
        })
        .then(done)
        .catch(done)
        .done();
    });

  });
})
