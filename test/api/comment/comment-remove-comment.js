// 'use-strict';

// var chai = require('../../helper/setup-chai')
//   , CommentCtrl = require('../../../lib/controller/comment')
//   , status = require('../../../lib/server/status')
//   , request = require('../../helper/setup-supertest')('http://localhost:3001')
//   , mongoInit = require('../../init/mongo-init')
//   , commentInit = require('../../init/comments-init')
//   , login = require('../../helper/login')(request)
//   , logout = require('../../helper/logout')(request)
//   ;

// describe('CommentController', () => {
	
// 	before((done) => {
// 		mongoInit.connect().then(commentInit).catch(console.log).fin(done);
// 	});
// 	after((done) =>) {
// 		commentInit().then(mongoInit.disconnect).catch(console.log).fin(done);
// 	});

// 	describe('#removeComment', () => {
// 		/* 익명의 사용자 접근 여부 테스트 */
//     it('should not allow access to anonymous users', (done) => {
//     });
//     /* 관리자 접근 여부 테스트 / 관리자는 remove 할수 있어야 */
//     it('should allow access to admin users', (done) => {});
//     /*  */
//     it('', (done) => {});
//     /*  */
//     it('', (done) => {});
//     /*  */
//     it('', (done) => {});



// 	});
// });