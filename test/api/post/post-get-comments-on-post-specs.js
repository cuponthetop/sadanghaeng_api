// 'use-strict';

// process.env.NODE_ENV = 'test';

// var chai = require('../../helper/setup-chai')
//   , PostCtrl = require('../../../lib/controller/post')
//   , status = require('../../../lib/server/status')
//   , request = require('../../helper/setup-supertest')('http://localhost:5001')
//   , mongoInit = require('../../init/mongo-init')
//   , postInit = require('../../init/posts-init')
//   , login = require('../../helper/login')(request)
//   , logout = require('../../helper/logout')(request)
//   ;

// describe('PostController', () => {

//   before((done) => {
//     mongoInit.connect().then(postInit).catch(console.log).fin(done);
//   });
//   after((done) => {
//     postInit().then(mongoInit.disconnect).catch(console.log).fin(done);
//   });

//   describe("#getCommentsOnPost", () => {

//   	/* 
//   	 * 익명의 사용자 접근 가능 여부 테스트 
//   	 */
//     it('should not allow access to anonymous users', (done) => {
//     	request
//     		.get('/api/v1/posts/34bc6f7b9b0d0b0457673daf/comments')
//     		.toPromise()
//     		.then((res) => {
//           console.log("This is LLLLLLLLLog : " + JSON.stringify(res));
//     			// expect is not defined 
//     			chai.expect(res.body.status).to.equal(status.codes.UserAuthRequired.code);
//     			chai.expect(res.body.value).have.property('message');
//     			//Cannot read property 'should' of undefined
//     			// res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
//     			// res.body.value.should.have.property('message');
//     		})
//     		.then(done)
//     		.catch(done)
//     		.done();
//     });
//     /* 
//   	 * admin 접근 가능 여부 테스트
//   	 */
//     it('should allow access to admin', (done) => {
//     	login('admin@test.com', 'test')
//     		.then(() => {
//     			request
//     			.get('/api/v1/posts/34bc6f7b9b0d0b0457673daf/comments')
//     			.toPromise()
//     			.then((res) => {
//     				res.body.status.should.be.equal(0);
//     				res.body.value.should.exist;
//     			})
//     			.then(logout)
//     			.then(done)
//     			.catch(done)
//     			.done();
//     		});
//     });
//     /* 
//   	 * 다른 univ 사용자 접근 가능 여부 테스트
//   	 */ // => 어케 해야할지 모르겠댱 testuniv.가 있남
//     // it('should not allow access to another univ users', (done) => {});
//     /* 
//   	 * 해당 comments가 잘 날아오는 지 확인 
//   	 */
//     it('should get the right comment information', (done) => {
//     	login('test2@test.com', 'test')
//     		.then(() => {
//     			request
//     			.get('/api/v1/posts/34bc6f7b9b0d0b0457673daf/comments')
//     			.toPromise()
//     			.then((res) => {
//     				res.body.status.should.be.equal(0);
//     				res.body.value.should.be.equal({
//     					'nickname': 'test'
//     					, 'writtenDate': "2016-02-01T08:11:10.000Z"
//     					, 'likeVoteCount': 1
//     				});
//     			})
//     			.then(logout)
//     			.then(done)
//     			.catch(done)
//     			.done();
//     		});
//     });
//     /* check whether sorted or not */ // there is not a test unit with multiple comments 
//     // it('', (done) => {});
//     /*  */
//     // it('', (done) => {});

//   });
// });

// // {
// //     "_id": "34bc6f7b9b0d0b0457673daf",
// //     "title": "Test Post1",
// //     "text": "11Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text, Test Text",

// //     "author": "11bc6f7b9b0d0b0457673daf",
// //     "university": "56ac6f7b9b0d0b0457673daf",

// //     "written": "2016-02-01T08:11:10.000Z",
// //     "edited": "2016-02-01T08:11:10.000Z",

// //     "votes": [{ "uid": "21bc6f7b900d0aa457673daf", "voteType": "up" }],
// //     "voteScore": 1,
// //     "comments": ["77ac6f7b9b0d0b0457673daf"]
// //   }