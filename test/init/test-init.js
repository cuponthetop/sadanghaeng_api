process.env.NODE_ENV = 'test';


var config = require('../../config/config');
var mongoose = require('mongoose');
// 몽고 db 연결
var dbUri = config.db.uri + config.db.dbName;
var dbOptions = { username: config.db.username, password: config.db.password };
mongoose.connect(dbUri, dbOptions);

var Post = require('../../lib/model/post');
var PostData = require('./json/posts.json');

Post.remove({}, function() {
    Post.create(PostData, function(err, result) {
        process.exit(0);
    });
});
