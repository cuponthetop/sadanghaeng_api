'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  ;

describe('Delete post API', () => {

	describe('#deletePost', () => {
		it('should not allow anonymous users to delete post', (done) => {
      done();
		});

		it('should not allow non-owners to delete the post', (done) => {
      done();
		});

		it('should allow the owner or admin to delete the post', (done) => {
      done();
		});
	});

});