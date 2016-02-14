'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  ;

describe('Get All University Posts API', () => {

	describe('#getPosts', () => {
		it('should get posts for user\'s university', (done) => {

		});

		it('posts for other universities should not show', (done) => {

		});

		it('should not allow anonymous users to get posts', (done) => {

		});
	});

});

describe('Get Individual Post API', () => {

	describe('#getPost', () => {
		it('should get the correct individual post', (done) => {

		});

		it('should only allow members of university to see the individual post', (done) => {

		});

		it('should not allow anonymous users to get a post', (done) => {

		});
	});

});