process.env.NODE_ENV = 'test';

//npm module
var config = require('../../config/config');
var mongoose = require('mongoose');
var Q = require('q');

// 몽고 db 연결
var dbUri = config.db.uri + config.db.dbName;
var dbOptions = { username: config.db.username, password: config.db.password };
mongoose.connect(dbUri, dbOptions);

var Post = require('../../lib/model/post');
var User = require('../../lib/model/user');
var Univ = require('../../lib/model/university');
var Comment = require('../../lib/model/comment');
var PostData = require('./json/posts.json');
var UserData = require('./json/users.json');
var UnivData = require('./json/universitys.json');
var CommentData = require('./json/comments.json');

function clearTestDb() {
  return Q.all([
    Post.remove({}),
    User.remove({}),
    Univ.remove({}),
    Comment.remove({})
  ]);
}

function insertTestDb() {
  return Q.all([
    Post.create(PostData),
    User.create(UserData),
    Univ.create(UnivData),
    Comment.create(CommentData)
  ]);
}

Q.fcall(clearTestDb)
  .then(insertTestDb)
  .catch(function (error) {
    console.log(error);
  })
  .done(function () {
    process.exit(0);
  });
