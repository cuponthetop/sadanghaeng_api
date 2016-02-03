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
var PostData = require('./json/posts.json');

function clearTestDb() {
    return Q.all([
        Post.remove({}),
        User.remove({})
    ]);
}

function insertTestDb() {
    return Q.all([
        Post.create(PostData)
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
