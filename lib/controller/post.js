'use strict';

var Post = require('../model/post');

var PostController = function () { };

PostController.prototype.getPosts = function (req, res) {
  Post.find({}, function (err, posts) {
    res.status(200).json(posts);
  });
};

PostController.prototype.getPost = function (req, res) {
  Post.findOne({ _id: req.params.pid }, function (err, post) {
    res.status(200).json(post);
  });
};

PostController.prototype.getCommentsOnPost = function (req, res) {
  Post.find({ _id: req.params.pid }, function (err, comments) {
    res.status(200).json(comments);
  });
};

PostController.prototype.addPost = function (req, res) {

  var newPost = new Post({
    title: req.body.title,
    text: req.body.text,
    author: req.body.author,
    university: req.body.university,
    // written:  //default 있어서 안씀 
    // edited: //
    votes: null, // 이렇게 하는게 맞나? 
    comments: null // 이렇게 하는게 맞나?
  });

  Post.save(newPost);
};





module.exports = new PostController();