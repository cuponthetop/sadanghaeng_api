'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  ;

describe('Add Comment API', () => {

	describe('#postComment', () => {
		it('should not allow anonymous users to post new comment', (done) => {

		});

		it('should allow logged-in users to post new comment', (done) => {

		});

		it('should have a title', (done) => {

		});

		it('should not be an empty post', (done) => {

		});
	});

});
