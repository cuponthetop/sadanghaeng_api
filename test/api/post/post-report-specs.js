'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , postsInit = require('../../init/posts-init')
  ;

describe('Report post API', () => {

	before((done) => {
		mongoInit.connect().then(postsInit).catch(console.log).fin(done);
	});		

	after((done) => {
		postsInit().then(mongoInit.disconnect).catch(console.log).fin(done);
	});

	describe('#reportPost', () => {
		var pid = "35bc6f7b9b0d0b0457673daf";

		it('should not allow anonymous users to report post', (done) => {
			request
				.post('/api/v1/posts/' + pid + '/reports')
				.end((err, res) => {
					res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
					res.body.value.should.have.property('message');
					done();
				});
		});

		it('should throw error if post not found', (done) => {
			login('test@test.com', 'test').then(() => {
				var fakePID = "881929481";
				request
				.post('/api/v1/posts/' + fakePID + '/reports')
				.end((err, res) => {
					res.body.status.shoud.be.equal(status.codes.PostNotFound.code);
            		res.body.value.should.have.property('message');
				});
			logout().then(done);
			});
		});

		it('should allow logged-in users to report post', (done) => {
      		login('test@test.com', 'test').then(() => {
				request
				.post('/api/v1/posts/' + pid + '/reports')
				.end((err, res) => {
					res.body.status.shoud.be.equal(0);
            		res.body.value.should.exist();
            		request
            			.get('/api/v1/posts/' + pid)
            			.end((err, res) => {
            				expect(res.body.value).to.include.members({ reported: ['uid'] });
            			});
				});
			logout().then(done);
			});
		});

		it('should only allow user to report once', (done) => {
			login('test@test.com', 'test').then(() => {
				request
				.post('/api/v1/posts/' + pid + '/reports')
				.end((err, res) => {
					request
					.post('/api/v1/posts/' + pid + '/reports')
					.end((err, res) => {
						res.body.status.shoud.be.equal(status.codes.AlreadyReported.code);
            			res.body.value.should.have.property('message');
					});
				});
			logout().then(done);
			});
		});
	});

});