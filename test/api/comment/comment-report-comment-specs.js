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
    var cID = '77ac6f7b9b0d0b0457673daf';

    /* 익명의 사용자 접근 여부 테스트 */
    it('should not allow access to anonymous users', (done) => {
      request
        .post('/api/v1/comments/' + cID + '/reports')
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
            .post('/api/v1/comments/' + cID + '/reports')
            .send({
              reported: '21bc6f7b900d0aa457673daf'
            })
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
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
            .post('/api/v1/comments/' + cID + '/reports')
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
    //         .post('/api/v1/comments/' + cID + 'reports')
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