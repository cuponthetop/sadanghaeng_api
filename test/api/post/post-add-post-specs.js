'use-strict';

process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai')
  , PostCtrl = require('../../../lib/controller/post')
  // , UserCtrl = require('../../../lib/controller/user')
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

    it('should not allow access to anonymous users', (done) => {
      request
        .post('/api/v1/posts')
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          // res.body.value.should.not.exist();
          res.body.value.should.have.property('message');
          done();
        });
    });

    // it('should not allow access to other users', (done) => {
    //   login('test@test.com', 'test').then(() => {
    //     request
    //       .post('/api/v1/posts')
    //       .send({
    //         title: 'testPost4',
    //         text: 'testPost4'
    //       })
    //       .end((err, res) => {
    //         res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
    //         // res.body.value.should.not.exist();
    //         res.body.value.should.have.property('message');
    //         logout().then(done);
    //       });
    //   });
    // });
    it('should allow access to admin users', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
        request
          .post('/api/v1/posts')
          .send({
            title: 'testPost4',
            text: 'testPost4'
          })
          .end((err, res) => {
            res.body.status.should.be.equal(0);
            res.body.value.should.have.property('message');
            logout().then(done);
          });
      });
    });

    it('should write a title of the post', (done) => {
      login('test@test.com', 'test').then(() => {
        request
        .post('/api/v1/posts')
        .send({
          // title: null,
          text: 'testPost4'
        })
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.TitleOfPostIsInvalid.code);
          res.body.value.should.have.property('message');
          logout().then(done);
        });
      });
    });
    it('should write not only white space and newline but also something meaningful in a title of the post', (done) => {
      login('test@test.com', 'test').then(() => {
        request
        .post('/api/v1/posts')
        .send({
          title: "       ",
          text: 'testPost4'
        })
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.TitleOfPostIsInvalid.code);
          res.body.value.should.have.property('message');
          logout().then(done);
        });
      });
    });
    it('should write some texts of the post', (done) => {
      login('test@test.com', 'test').then(() => {
        request
          .post('/api/v1/posts')
          .send({
            title: 'testPost4'
            // text: null,
          })
          .end((err, res) => {
            res.body.status.should.be.equal(status.codes.TextOfPostIsInvalid.code);
            res.body.value.should.have.property('message');
            logout().then(done);
          });
      });
    });
    it('should write not only white space and newline but also something meaningful in text of the post', (done) => {
      login('test@test.com', 'test').then(() => {
        request
        .post('/api/v1/posts')
        .send({
          title: "testPost4",
          text: '        '
        })
        .end((err, res) => {
          res.body.status.should.be.equal(status.codes.TextOfPostIsInvalid.code);
          res.body.value.should.have.property('message');
          logout().then(done);
        });
      });
    });
    it('should get the right pid of the post', (done) => {
      var pid = -1;
      login('test@test.com', 'test').then(() => {
        request
          .post('/api/v1/posts')
          .send({
            title: 'testPostTitle4',
            text: 'testPostText4'
          })
          .end((err, res) => {
            res.body.status.shoud.be.equal(0);
            res.body.value.should.exist();
            pid = res.body.value;
            request
              .get('/posts/' + pid)
              .end((err, res) => {
                expect(res.body.value).to.include.members({
                  title: 'testPostTitle4',
                  text: 'testPostText4'
                });
                logout().then(done);
              });
          });
      });
            // done();
        // })
        // .then( function () {
        //   request
        //     .get('/posts/' + pid)
        //     .end((err, res) => {
        //       expect(res.body.value).to.include.members({
        //         title: 'testPostTitle4',
        //         text: 'testPostText4',
        //         author: 'testPostAuthor4',
        //         university: 'testPostUniv4'
        //       });
        //     });
        //     done();
        // });
    });
  });
});