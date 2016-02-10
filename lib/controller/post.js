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
  Post
    .find({ _id: req.params.pid })
    .sort({ written : 1})
    .select(comments)
    .exec(function (err, comments) {
      res.status(200).json(comments);
    });

};

PostController.prototype.addPost = function (req, res) {

  var newPost = new Post({
    title: req.body.title
  , text: req.body.text
  , author: req.body.author
  , university: req.body.university
    //, written:  //default 있어서 안씀 
    //, edited: //
  , votes: [] // 이렇게 하는게 맞나? 
  , comments: [] // 이렇게 하는게 맞나?
  , reported: [] // 이렇게 하는게 맞나?
  });

  Post.save(newPost);
};

// todo : make test code
PostController.prototype.getVotesOnPost = function (req, res) {
  Post
    .find( {_id: req.params.pid } )
    .select(votes)
    .sort(written)
    .exec(function (err, votes) {
      res.status(200),json(votes);
    });
};

// todo : make test code
PostController.prototype.voteForPost = function (req, res) {
  var newVotes = [];
  
  Post.find({ _id: req.body.pid} )
      .select(votes)
      .exec(function (err, votes) {
        newVotes = votes;
      }); 
  // then
  newVotes.push(req.body.vote); 
  
  Post
    .update({ _id: req.body.pid }
             , { votes: newVotes }
             , function(err, results) {
                 // do something
               });
};

module.exports = new PostController();