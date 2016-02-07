'use-strict';

process.env.NODE_ENV = 'test';

var chai = require('../../helper/setup-chai');
var CommentCtrl = require('../../../lib/controller/comment');

describe('CommentController', () => {
  describe('#getCommentsOnPost', () => {

    var config = require('../../../config/config');
    var mongoose = require('mongoose');
    var wasConnected = mongoose.connection.readyState;

    before(() => {
      // 몽고 db 연결
      var dbUri = config.db.uri + config.db.dbName;
      var dbOptions = { username: config.db.username, password: config.db.password };
      mongoose.connect(dbUri, dbOptions);
    });

    after(() => {
      mongoose.disconnect();
    });

    // it('should reject an invalid post ID', (done) => {
    //   CommentCtrl.getCommentsOnPost('34bc6f7b9b0d0b0457673dad') // pid 맨끝자리를 f에서 d로 바꿈
    //     .should.be.rejectedWith('not valid post ID(pid)')
    //     .notify(done);
    // });

    // it('should return right comments', (done) => {
    //   CommentCtrl.getCommentsOnPost('34bc6f7b9b0d0b0457673daf')
    //     .should.eventually.equal('77ac6f7b9b0d0b0457673daf')
    //     .notify(done);
    // });

  });

  describe('removeComment', () => {

  });

  describe('reportComment', () => {

  });

});

// ~/test/init/json/comments.js
// [
//   {
//     "_id": "77ac6f7b9b0d0b0457673daf",
//     "text": "test comment 1",
//     "author": "11bc6f7b9b0d0b0457673daf",
//     "postID": "34bc6f7b9b0d0b0457673daf",
//     "written": "2016-01-02T08:11:10.000Z",
//     "edited": "2016-01-02T08:11:10.000Z",
//     "votes": []
//   }
// ]