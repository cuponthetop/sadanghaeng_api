'use strict';

var Post = require('../model/post')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , status = require('../server/status');

var PostController = function () { };

PostController.prototype.loadPost = function (req, res, next) {
  Post.findOne({ _id: req.params.pid }).exec().then((post) => {
    req.info = req.info || {};
    req.info.post = post;
    next();
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.PostNotFound.code);
  });
};

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
    .sort({ written: 1 })
    .select('comments')
    .exec(function (err, comments) {
      if (err) {
        response.respondError(req, res, status.codes.CommentsOnPostGottenFailed.code);
        return;
      }
      response.respondSuccess(req, res, comments);
    });

};

PostController.prototype.addPost = function (req, res) {
  res = res;
  var newPost = new Post({
    title: req.body.title
  , text: req.body.text
  , author: req.body.author
  , university: req.body.university
  });

  newPost.save(); // todo: consider callback func .then(respondSuccess 함수 ) 해줘야 client가 성공한걸 앎
};

// todo : make test code
PostController.prototype.getVotesOnPost = function (req, res) {
  Post
    .find({ _id: req.params.pid })
    .select('votes')
    .sort({ written: 1 })
    .exec(function (err, votes) {
      if (err) {
        response.respondError(req, res, status.codes.CommentsOnPostGottenFailed.code);
        return;
      }
      response.respondSuccess(req, res, votes);
    });
};

// todo : make test code
PostController.prototype.voteForPost = function (req, res) {
  var newVotes = [];
  res = res;

  Post.find({ _id: req.body.pid })
    .select('votes')
    .exec(function (err, votes) {
      newVotes = votes;
    });
  // then
  newVotes.push(req.body.vote); 

  // Post
  //   .update({ _id: req.body.pid }
  //            , { votes: newVotes }
  //            , function(err, results) {
  //                // do something
  //              });
};

module.exports = new PostController();