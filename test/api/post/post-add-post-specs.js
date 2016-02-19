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
      /* 익명의 사용자 접근 여부 테스트 */
      it('should not allow access to anonymous users', (done) => {
        request
        .post('/api/v1/posts')
        .send({ 
          'title': 'testPost4',
          'text': 'testPost4',
          'author': '11bc6f7b9b0d0b0457673daf',
          'university': '56ac6f7b9b0d0b0457673daf' 
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
          'title': 'testPost4',
          'text': 'testPost4',
          'author': '11bc6f7b9b0d0b0457673daf',
          'university': '56ac6f7b9b0d0b0457673daf' 
        })
          .toPromise();
        })
        .then((res) => {
          // console.log("This is LLLLLLLLLLLLog : " + JSON.stringify(res));
          res.body.status.should.be.equal(0);
          res.body.value.should.have.length(24);
        })
        .then(postInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
      });
      /* 게시물 제목 */
      // 1: 게시물 제목이 있어야
      it('should not have empty title', (done) => {
        // login('test2@test.com', 'test')
        login('admin@test.com', 'test')
        .then(() => {
          return request
          .post('/api/v1/posts')
          .send( { 
          // 'title': ,
          'text': 'testPost4',
          'author': '11bc6f7b9b0d0b0457673daf',
          'university': '56ac6f7b9b0d0b0457673daf' 
        } )
          .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.TitleOfPostIsInvalid.code);
          res.body.value.should.have.property('message');
        })
        .then(postInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
      });
    // 2: 게시물 제목에 space나 newline만 있으면 안 됨
    it('should have title with not only white space and newline but also meaningful words', (done) => {
      // login('test@test.com', 'test')
      login('admin@test.com', 'test')
      .then(() => {
        return request
        .post('/api/v1/posts')
        .send({ 
          'title': '    \n    ',
          'text': 'testPost4',
          'author': '11bc6f7b9b0d0b0457673daf',
          'university': '56ac6f7b9b0d0b0457673daf' 
        })
        .toPromise();
      })
      .then((res) => {
        res.body.status.should.be.equal(status.codes.TitleOfPostIsInvalid.code);
        res.body.value.should.have.property('message');
      })
         .then(postInit)
      .then(logout)
      .then(done)
      .catch(done)
      .done();
    });
    /* 게시물 내용 */
    // 1: 게시물 내용이 있어야
    it('should not have empty text', (done) => {
     // login('test@test.com', 'test')
     login('admin@test.com', 'test')
     .then(() => {
      return request
      .post('/api/v1/posts')
      .send({ 
        'title': 'testPost4',
        // 'text': 'testPost4',
        'author': '11bc6f7b9b0d0b0457673daf',
        'university': '56ac6f7b9b0d0b0457673daf' 
      })
      .toPromise();
    })
     .then((res) => {
      res.body.status.should.be.equal(status.codes.TextOfPostIsInvalid.code);
      res.body.value.should.have.property('message');
    })
     .then(postInit)
     .then(logout)
     .then(done)
     .catch(done)
     .done();
   });
    // 2: 게시물 내용에 space나 newline만 있으면 안 됨
    it('should have text with not only white space and newline but also meaningful words', (done) => {
     // login('test@test.com', 'test')
     login('admin@test.com', 'test')
     .then(() => {
      return request
      .post('/api/v1/posts')
      .send({ 
        'title': 'testPost4',
        'text': '    \n   ',
        'author': '11bc6f7b9b0d0b0457673daf',
        'university': '56ac6f7b9b0d0b0457673daf' 
      })
      .toPromise();
    })
     .then((res) => {
      res.body.status.should.be.equal(status.codes.TextOfPostIsInvalid.code);
      res.body.value.should.have.property('message');
    })
     .then(postInit)
     .then(logout)
     .then(done)
     .catch(done)
     .done();
   });
  });
});

// {
//     "_id": "11bc6f7b9b0d0b0457673daf",
//     "email": "test@test.com",
//     "nickname": "test",
//     "hashed_password": "$2a$10$aZB36UooZpL.fAgbQVN/j.pfZVVvkHxEnj7vfkVSqwBOBZbB/IAAK",
//     "verified": true,
//     "admin": false,
//     "university": "56ac6f7b9b0d0b0457673daf",
//     "memberSince": "2016-01-01T08:11:10.000Z",
//     "reported": []
//   },

//  describe("#addPost", () => {

//    /* 익명의 사용자 접근 여부 테스트 */
//    it('should not allow access to anonymous users', (done) => {
//      request
//        .post('/api/v1/posts')
//        .end((err, res) => {
//          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
//          // res.body.value.should.not.exist();
//          res.body.value.should.have.property('message');
//          done();
//        });
//    });

//    // it('should not allow access to other users', (done) => {
//    //   login('test@test.com', 'test').then(() => {
//    //     request
//    //       .post('/api/v1/posts')
//    //       .send({
//    //         title: 'testPost4',
//    //         text: 'testPost4'
//    //       })
//    //       .end((err, res) => {
//    //         res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
//    //         // res.body.value.should.not.exist();
//    //         res.body.value.should.have.property('message');
//    //         logout().then(done);
//    //       });
//    //   });
//    // });
//    /* 관리자 접근 여부 테스트 */
//    it('should allow access to admin users', (done) => {
//      login('admin@test.com', 'test')
//        .then(() => {
//        request
//          .post('/api/v1/posts')
//          .send({
//            title: 'testPost4',
//            text: 'testPost4'
//          })
//          .end((err, res) => {
//            res.body.status.should.be.equal(0);
//            res.body.value.should.have.property('message');
//            logout().then(done);
//          });
//      });
//    });
//    /* 글 제목 테스트 */
//    it('should write a title of the post', (done) => {
//      login('test@test.com', 'test').then(() => {
//        request
//        .post('/api/v1/posts')
//        .send({
//          // title: null,
//          text: 'testPost4'
//        })
//        .end((err, res) => {
//          res.body.status.should.be.equal(status.codes.TitleOfPostIsInvalid.code);
//          res.body.value.should.have.property('message');
//          logout().then(done);
//        });
//      }); 
//    });
//    it('should write not only white space and newline but also something meaningful in a title of the post', (done) => {
//      login('test@test.com', 'test').then(() => {
//        request
//        .post('/api/v1/posts')
//        .send({
//          title: "       ",
//          text: 'testPost4'
//        })
//        .end((err, res) => {
//          res.body.status.should.be.equal(status.codes.TitleOfPostIsInvalid.code);
//          res.body.value.should.have.property('message');
//          logout().then(done);
//        });
//      });
//    });
//    /* 글 내용 테스트 */
//    it('should write some texts of the post', (done) => {
//      login('test@test.com', 'test').then(() => {
//        request
//          .post('/api/v1/posts')
//          .send({
//            title: 'testPost4'
//            // text: null,
//          })
//          .end((err, res) => {
//            res.body.status.should.be.equal(status.codes.TextOfPostIsInvalid.code);
//            res.body.value.should.have.property('message');
//            logout().then(done);
//          });
//      });
//    });
//    it('should write not only white space and newline but also something meaningful in text of the post', (done) => {
//      login('test@test.com', 'test').then(() => {
//        request
//        .post('/api/v1/posts')
//        .send({
//          title: "testPost4",
//          text: '        '
//        })
//        .end((err, res) => {
//          res.body.status.should.be.equal(status.codes.TextOfPostIsInvalid.code);
//          res.body.value.should.have.property('message');
//          logout().then(done);
//        });
//      });
//    });
//    /* 맞는 pid 인가 */
//    it('should get the right pid of the post', (done) => {
//      var pid = -1;
//      login('test@test.com', 'test').then(() => {
//        request
//          .post('/api/v1/posts')
//          .send({
//            title: 'testPostTitle4',
//            text: 'testPostText4'
//          })
//          .end((err, res) => {
//            res.body.status.shoud.be.equal(0);
//            res.body.value.should.exist();
//            pid = res.body.value;
//            request
//              .get('/posts/' + pid)
//              .end((err, res) => {
//                expect(res.body.value).to.include.members({
//                  title: 'testPostTitle4',
//                  text: 'testPostText4'
//                });
//                logout().then(done);
//              });
//          });
//      });
//            // done();
//        // })
//        // .then( function () {
//        //   request
//        //     .get('/posts/' + pid)
//        //     .end((err, res) => {
//        //       expect(res.body.value).to.include.members({
//        //         title: 'testPostTitle4',
//        //         text: 'testPostText4',
//        //         author: 'testPostAuthor4',
//        //         university: 'testPostUniv4'
//        //       });
//        //     });
//        //     done();
//        // });
//    });
//  });
// });