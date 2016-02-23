'use strict';

process.env.NODE_ENV = 'test';

var request = require('../../helper/setup-supertest')('http://localhost:3001')
  , chai = require('../../helper/setup-chai')
  , status = require('../../../lib/server/status')
  , login = require('../../helper/login')(request)
  , logout = require('../../helper/logout')(request)
  , mongoInit = require('../../init/mongo-init')
  , postsInit = require('../../init/posts-init')
  , commentsInit = require('../../init/comments-init')
  , CommentModel = require('../../../lib/model/comment')
  ;

describe('Delete Post API', () => {

  before((done) => {
    mongoInit.connect().then(postsInit).catch(console.log).fin(done);
  });

  after((done) => {
    postsInit().then(mongoInit.disconnect).catch(console.log).fin(done);
  });

  describe('#deletePost', () => {
    var pid = "35bc6f7b9b0d0b0457673daf";

    it('should not allow anonymous users to delete post', (done) => {
      request
        .delete('/api/v1/posts/' + pid)
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserAuthRequired.code);
          res.body.value.should.have.property('message');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should not allow non-owners to delete the post', (done) => {
      login('test2@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(status.codes.UserPermissionNotAllowed.code);
        })
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow the owner to delete the post', (done) => {
      login('test@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
        .then(postsInit)
        .then(commentsInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should allow the admin to delete the post', (done) => {
      login('admin@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          res.body.status.should.be.equal(0);
        })
        .then(postsInit)
        .then(commentsInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
    });

    it('should delete the comments dependent on the post', (done) => {
      var promise = CommentModel
      .find({ 'postID': pid })
      .exec((err, mustExist) => {
        chai.expect(mustExist).to.exist;
      });

      promise.then(() => {
        login('test@test.com', 'test')
        .then(() => {
          return request
            .delete('/api/v1/posts/' + pid)
            .toPromise();
        })
        .then((res) => {
          CommentModel
            .find({ 'postID': pid })
            .exec((err, mustBeNull) => {
              chai.expect(mustBeNull).to.be.empty;
            });
        })
        .then(postsInit)
        .then(commentsInit)
        .then(logout)
        .then(done)
        .catch(done)
        .done();
      });
    });

  });
});