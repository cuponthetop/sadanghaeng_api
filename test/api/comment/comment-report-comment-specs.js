'use-strict';

var chai = require('../../helper/setup-chai')
  , CommentCtrl = require('../../../lib/controller/comment')
  , status = require('../../../lib/server/status')
  , request = require('../../helper/setup-supertest')('http://localhost:3001')
  , mongoInit = require('../../init/mongo-init')
  , commentInit = require('../../init/comments-init')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  ;

describe('CommentController', () => {
	
	before((done) => {
		mongoInit.connect().then(commentInit).catch(console.log).fin(done);
	});
	after((done) => {
		commentInit().then(mongoInit.disconnect).catch(console.log).fin(done);
	});

	describe('#reportComment', () => {
		/* 익명의 사용자 접근 여부 테스트 */
    it('should not allow access to anonymous users', (done) => {
      request
        .post('/api/v1/comments/77ac6f7b9b0d0b0457673daf/reports')
        .send({
           reported: '21bc6f7b900d0aa457673daf'
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
    /* 잘 report 되는지 */
    it('should report the comment well', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/77ac6f7b9b0d0b0457673daf/reports')
            .send({
              reported: '21bc6f7b900d0aa457673daf'
            })
            .toPromise();
        })
        .then((res) => {
          // console.log("This is LLLLLLLLLLLLog : " + JSON.stringify(res));
          res.body.status.should.be.equal(0);
        })
        // .then(commentInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
    /* report한 사람이 또 report 하지는 않는지 */
    /* 바로 위의 test에 종속됨 */
    it('should not allow user who reported again to report', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .post('/api/v1/comments/77ac6f7b9b0d0b0457673daf/reports')
            .send({
              reported: '21bc6f7b900d0aa457673daf'
            })
            .toPromise();
        })
        .then((res) => {
          // console.log("This is LLLLLLLLLLLLog : " + JSON.stringify(res));
          res.body.status.should.be.equal(505);
        })
        .then(commentInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
    /* 관리자 접근 여부 테스트 / 관리자는 report 못 해야 */ // => 되도 상관 없...는 건 민주주의에 어긋나나...
    // it('should not allow access to admin users', (done) => {
    //   login('admin@test.com', 'test')
    //     .then(() => {
    //       return request
    //         .post('/api/v1/comments/77ac6f7b9b0d0b0457673daf/reports')
    //         .send({
    //           reported: '21bc6f7b900d0aa457673daf'
    //         })
    //         .toPromise();
    //     })
    //     .then((res) => {
    //       // console.log("This is LLLLLLLLLLLLog : " + JSON.stringify(res));
    //       res.body.status.should.be.equal(0);
    //       res.body.value.should.have.length(24);
    //     })
    //     // .then(commentInit)
    //     .then(logout)
    //     .then(done)
    //     .catch(done)
    //     .done();
    // });
    // /*  */
    // it('', (done) => {});
    // /*  */
    // it('', (done) => {});



	});
});

// { // user
//     "_id": "21bc6f7b900d0aa457673daf",
//     "email": "test2@test.com",
//     "nickname": "test2",
//     "hashed_password": "$2a$10$aZB36UooZpL.fAgbQVN/j.pfZVVvkHxEnj7vfkVSqwBOBZbB/IAAK",
//     "verified": true,
//     "admin": false,
//     "university": "56ac6f7b9b0d0b0457673daf",
//     "memberSince": "2016-01-01T08:11:10.000Z",
//     "reported": []
//   }

// { // comment
//     "_id": "77ac6f7b9b0d0b0457673daf",
//     "text": "test comment 1",
//     "author": "11bc6f7b9b0d0b0457673daf",
//     "postID": "34bc6f7b9b0d0b0457673daf",
//     "written": "2016-01-02T08:11:10.000Z",
//     "edited": "2016-01-02T08:11:10.000Z",
//     "votes": [],
//     "voteScore": 0,
//     "reported": []
//   }