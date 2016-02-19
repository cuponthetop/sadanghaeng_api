'use strict';

var Post = require('../model/post')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , status = require('../server/status')
  , Comment = require('../model/comment')
  ;

var PostController = function () { };

var regExCheckEmptyText = /(^\s*)(\s*$)/;

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

PostController.prototype.getPost = function (req, res) {
  var didVote = req.info.post.votes.find((el) => { return el.uid.toString() === req.info.user._id.toString(); });

  response.respondSuccess(req, res, {
    pid: req.info.post._id.toString(),
    title: req.info.post.title,
    text: req.info.post.text,
    author: req.info.post.author.nickname,
    written: req.info.post.written,
    edited: req.info.post.edited,

    voteCount: req.info.post.voteScore,
    reportCount: req.info.post.reported.length,

    didVote: undefined !== didVote,
    didVoteType: (undefined === didVote) ? null : didVote.voteType,
    didReport: undefined !== req.info.post.reported.find((el) => { return el.toString() === req.info.user._id.toString(); }),

    commentCount: req.info.post.comments.length,
  });
};

PostController.prototype.deletePost = function (req, res) {
  Post.findOneAndRemove({ _id: req.params.pid }).exec().then((post) => {
    post = post;
    response.respondSuccess(req, res);
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.PostRemoveFailed.code);
  });
};


PostController.prototype.reportPost = function (req, res) {
  var post = req.info.post;

  if (post === null) {
    response.respondError(req, res, status.codes.PostNotFound.code);
  } if (req.info.user._id.toString() === post.author.toString()) {
    response.respondError(req, res, status.codes.CantReportSelf.code);
  } else if (undefined !== post.reported.find((duplicate) => { return duplicate.toString() === req.info.user._id.toString(); })) {
    response.respondError(req, res, status.codes.AlreadyReported.code);
  } else {
    post.reported.push(req.info.user._id).save(function (err, newReport) {
      if (err) {
        response.respondError(req, res, status.codes.AddReportFailed.code);
      } else {
        response.respondSuccess(req, res, newReport._id.toString());
      }
    });
  }
};

PostController.prototype.getCommentsOnPost = function (req, res) {
  var receivedCommentsIdArr = req.info.post.comments;

  var makeCommentInfoObj = function (comment) {
    var didVote = comment.votes.find((el) => { return el.uid.toString() === req.info.user._id.toString(); });

    return {
      author: comment.author.toString(),
      written: comment.written,
      edited: comment.edited,
      voteCount: comment.voteScore,
      reportCount: comment.reported.length,

      didVote: undefined !== didVote,
      didVoteType: (undefined === didVote) ? null : didVote.voteType,
      didReport: undefined !== comment.reported.find((el) => { return el.toString() === req.info.user._id.toString(); })
    };
  };

  Comment
    .find({ _id: { $in: receivedCommentsIdArr } })
    .populate({ path: 'author' })
    .sort({ written: 'desc' })
    .exec()
    .then(function (err, comments) {
      if (err) {
        response.respondError(req, res, status.codes.CommentsOnPostGottenFailed.code);
      } else {
        response.respondSuccess(req, res, comments.map(makeCommentInfoObj));
      }
    });
};


PostController.prototype.addPost = function (req, res) {
  if (regExCheckEmptyText.test(req.body.title) || req.body.title === undefined) {
    // Test whether the title is continuum of space or newline
    response.respondError(req, res, status.codes.TitleOfPostIsInvalid.code);
  } else if (regExCheckEmptyText.test(req.body.text) || req.body.text === undefined) {
    // Test whether the text is continuum group of space or newline
    response.respondError(req, res, status.codes.TextOfPostIsInvalid.code);
  } else {
    var newPost = new Post({
      title: req.body.title
      , text: req.body.text
      , author: req.info.user._id.toString()
      , university: req.info.user.university.toString()
    });

    newPost
      .save(function (err, savedPost) {
        if (err) {
          console.error(err);
          response.respondError(req, res, status.codes.PostAddedFailed.code, null);
        } else {
          response.respondSuccess(req, res, savedPost._id.toString());
        }
      });
  }
};

PostController.prototype.updateVoteOnPost = function (req, res) {
  var newVoteType = req.body.vote.voteType;
  var curUserIdStr = req.info.user._id.toString();
  var post = req.info.post;

  if (post === undefined || post === null) {
    response.respondError(req, res, status.codes.PostNotFound.code);
  } else if (undefined !== post.votes.find((el) => { return el.uid.toString() === curUserIdStr; })) {
    response.respondError(req, res, status.codes.PostVotedAlready.code);
  } else if (newVoteType === null || newVoteType === undefined) {
    response.respondError(req, res, status.codes.EmptyVote.code);
  } else if (newVoteType !== 'up' || 'down') {
    // else if statement doesnt pass test when !== but passes when != but doesnt pass JSHint when != (passes when !==)
    response.respondError(req, res, status.codes.WrongVote.code);
  } else if (curUserIdStr === req.info.post.author.toString()) {
    response.respondError(req, res, status.codes.PostOwnerCanNotVote.code);
  } else {
    var addition = (newVoteType === 'up') ? 1 : -1;

    post.voteScore = post.voteScore + addition;
    post.votes.push({ uid: req.info.user._id, type: req.body.vote });

    post.save(function (err, newVote) {
      if (err) {
        response.respondError(req, res, status.codes.UpdateVoteFailed.code);
      } else {
        newVote = newVote;
        response.respondSuccess(req, res, null);
      }
    });
  }
};

module.exports = new PostController();