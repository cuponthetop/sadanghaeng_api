'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , commentInit = require('../../init/comments-init')
  ;

describe('Add Comment API', () => {

	before((done) => {
		mongoInit.connect().then(commentInit).catch(console.log).fin(done);
	});		

	after((done) => {
		commentInit().then(mongoInit.disconnect).catch(console.log).fin(done);
	});

	describe('#postComment', () => {
		
		// wrong error
		// it('should not allow anonymous users to post new comment', (done) => {
 	// 		request
		// 		.post('/api/v1/comments/')
		// 		.send({text: 'malicious text'})
		// 		.end((err, res) => {
		// 			res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
		// 			res.body.value.should.have.property('message');
		// 			done();
		// 		});
		// });

		it('should not be an empty post', (done) => {
			login('test@test.com', 'test').then(() => {
				request
				.post('/api/v1/comments/')
				.send({text: ''})
				.end((err, res) => {
					res.body.status.shoud.be.equal(status.codes.EmptyComment.code);
            		res.body.value.should.have.property('message');
				});
			logout().then(done);
			});
		});

		it('should allow logged-in users to post new comment', (done) => {
			login('test@test.com', 'test').then(() => {
				request
				.post('/api/v1/comments/')
				.send({text: 'yay im logged in'})
				.end((err, res) => {
					res.body.status.shoud.be.equal(0);
            		res.body.value.should.exist();
            		request
            			.get('/api/v1/comments/')
            			.end((err, res) => {
            				expect(res.body.value).to.include.members({ text: 'yay im logged in' });
            			});
				});
			logout().then(done);
			});
		});
	});

});
