'use-strict';

var chai = require('../../helper/setup-chai')
  , CommentCtrl = require('../../../lib/controller/comment')
  , status = require('../../../lib/server/status')
  , request = require('../../helper/setup-supertest')('http://localhost:3001')
  , mongoInit = require('../../init/mongo-init')
  , commentInit = require('../../init/comments-init')
  , postInit = require('../../init/posts-init')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  ;

describe('Remove Comment API', () => {
	before((done) => {
    mongoInit.connect().then(commentInit).catch(console.log).fin(done);
  });

  after((done) => {
    commentInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#removeComment', () => {
  	var pid = '34bc6f7b9b0d0b0457673daf';
  	var cid = '77ac6f7b9b0d0b0457673daf';
		/* 익명의 사용자 접근 여부 테스트 */
    it('should not allow access to anonymous users', (done) => {

      request
        .delete('/api/v1/comments/' + cid + '/remove')
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });
    /* 관리자 접근 여부 테스트 / 관리자는 remove 할수 있어야 */
    it('should allow access to admin users', (done) => {
    	login('admin@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/comments/' + cid + '/remove')
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
        .then(postInit)
        .then(commentInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
    /* removeComment 시 본 post에서 제대로 comment가 제거되는지 확인 */
    it('should remove a comment in the right post', (done) => {
    	login('test@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/comments/' + cid + '/remove')
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
          request
          	.get('/api/v1/posts/' + pid)
          	.toPromise();
        })
        .then((res) => {
        	res.value.commentCount.should.equal(0);
        })
        .then(postInit)
        .then(commentInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
    /* owner가 아니고 admin이 아닌 사람이 removeComment 가능한지 확인 */
    it('shold not remove a comment if the user is not the owner or admin', (done) => {
    	login('test2@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/comments/' + cid + '/remove')
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.not.equal(106);
          request
          	.get('/api/v1/posts/' + pid)
          	.toPromise();
        })
        .then((res) => {
        	res.value.commentCount.should.equal(1);
        })
        .then(postInit)
        .then(commentInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });
    // /*  */
    // it('', (done) => {});
  });
});




// post.json
// {
// 	"_id": "34bc6f7b9b0d0b0457673daf",
// 	"title": "Test Post1",
// 	"text": "11Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text",

// 	"author": "11bc6f7b9b0d0b0457673daf",
// 	"university": "56ac6f7b9b0d0b0457673daf",

// 	"written": "2016-02-09T08:11:10.000Z",
// 	"edited": "2016-02-09T08:11:10.000Z",

// 	"votes": [{ "uid": "21bc6f7b900d0aa457673daf", "voteType": "up" }],
// 	"voteScore": 1,
// 	"comments": ["77ac6f7b9b0d0b0457673daf"]
// }

// comment.json
// {
// 	"_id": "77ac6f7b9b0d0b0457673daf",
// 	"text": "test comment 1",
// 	"author": "11bc6f7b9b0d0b0457673daf",
// 	"postID": "34bc6f7b9b0d0b0457673daf",
// 	"written": "2016-01-02T08:11:10.000Z",
// 	"edited": "2016-01-02T08:11:10.000Z",
// 	"votes": [],
// 	"voteScore": 0,
// 	"reported": []
// }

// user.json
// {
// 	"_id": "11bc6f7b9b0d0b0457673daf",
// 	"email": "test@test.com",
// 	"nickname": "test",
// 	"hashed_password": "$2a$10$aZB36UooZpL.fAgbQVN/j.pfZVVvkHxEnj7vfkVSqwBOBZbB/IAAK",
// 	"verified": true,
// 	"admin": false,
// 	"university": "56ac6f7b9b0d0b0457673daf",
// 	"memberSince": "2016-01-01T08:11:10.000Z",
// 	"reported": []
// }