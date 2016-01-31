'use strict';

var Post = require('../model/post');

function PostController () {

}

PostController.prototype.getPosts  = function (req, res, next) {
  Post.find({}, function(err, posts) {
    res.status(200).json(posts);
  });
};

PostController.prototype.getPost  = function (req, res, next) {
  Post.findOne({_id:req.params.pid}, function(err, post) {
    res.status(200).json(post);
  });
};



module.exports = new PostController();