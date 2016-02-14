'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  ;


describe('Vote comment API', () => {

	describe('#voteComment', () => {
		it('should not allow anonymous users to vote', (done) => {

		});

		it('should allow logged-in users to vote for comment', (done) => {

		});

		it('should only allow user to vote once', (done) => {

		});
	});

});

// it 