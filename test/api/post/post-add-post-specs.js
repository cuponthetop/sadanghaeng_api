'use-strict';

process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai')
  , PostCtrl = require('../../../lib/controller/post')
  , status = require('../../../lib/server/status')
  , request = require('../../helper/setup-supertest')('http://localhost:3001')
  , mongoInit = require('../../init/mongo-init')
  , postInit = require('../../init/posts-init')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  ;

describe('PostController', () => {

  before((done) => {
    mongoInit.connect().then(postInit).catch(console.log).fin(done);
  });

  after((done) => {
    postInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe("#addPost", () => {
    /* 익명의 사용자 접근 여부 테스트 */
    it('should not allow access to anonymous users', (done) => {
      request
        .post('/api/v1/posts')
        .send({
          title: 'testPost4',
          text: 'testPost4',
          univid: '56ac6f7b9b0d0b0457673daf'
        })
        .toPromise()
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    /* 관리자 접근 여부 테스트 => 계속 fail 남 아ㅏㅇ라 마아람라ㅣ마람 */
    it('should allow access to admin users', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/posts')
            .send({
              title: 'testPost4',
              text: 'testPost4',
              univid: '56ac6f7b9b0d0b0457673daf'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          // res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
          // res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    /* 게시물 제목 */
    // 1: 게시물 제목이 있어야
    it('should not have empty title', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/posts')
            .send({
              // title: ,
              text: 'testPost4',
              univid: '56ac6f7b9b0d0b0457673daf'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.TitleOfPostIsInvalid.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    // 2: 게시물 제목에 space나 newline만 있으면 안 됨
    it('should have title with not only white space and newline but also meaningful words', (done) => {
      // login('test@test.com', 'test')
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/posts')
            .send({
              title: '    \n    ',
              text: 'testPost4',
              univid: '56ac6f7b9b0d0b0457673daf'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.TitleOfPostIsInvalid.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    /* 게시물 내용 */
    // 1: 게시물 내용이 있어야
    it('should not have empty text', (done) => {
      // login('test@test.com', 'test')
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/posts')
            .send({
              title: 'testPost4',
              // text: 'testPost4',
              univid: '56ac6f7b9b0d0b0457673daf'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.TextOfPostIsInvalid.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
    // 2: 게시물 내용에 space나 newline만 있으면 안 됨
    it('should have text with not only white space and newline but also meaningful words', (done) => {
      // login('test@test.com', 'test')
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/posts')
            .send({
              title: 'testPost4',
              text: '    \n   ',
              univid: '56ac6f7b9b0d0b0457673daf'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.TextOfPostIsInvalid.code);
          res.body.value.should.have.property('message');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    /* 맞는 pid 인가 */
    it('should get the right pid of the post', (done) => {
      var pid = -1;
      login('test@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/posts')
            .send({
              title: 'testPostTitle4',
              text: 'testPostText4',
              univid: '56ac6f7b9b0d0b0457673daf'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          res.body.value.should.exist;
          pid = res.body.value;
          return request
            .get('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.value.should.have.property('title', 'testPostTitle4');
          res.body.value.should.have.property('text', 'testPostText4');
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

  });
});