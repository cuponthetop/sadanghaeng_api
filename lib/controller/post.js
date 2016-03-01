'use strict';

var Post = require('../model/post')
  , UnivModel = require('../model/university')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , status = require('../server/status')
  , Comment = require('../model/comment')
  , ObjectId = require('mongoose').Types.ObjectId
  ;

/* Variables */
var PostController = function () { };

var regExCheckEmptyText = /(^\s*)(\s*$)/;

/* Functions only in post */
var makeCommentInfoObj = function (curUserIdStr, comment) {
  var didVote = comment.votes.find((el) => { return el.uid.toString() === curUserIdStr; });

  var voteStat = makeVoteStat(comment.votes);

  return {
    cid: comment._id,
    author: comment.authorNickname,
    text: comment.text,
    written: comment.written,
    edited: comment.edited,
    // voteCount: comment.voteScore,
    likeCount: voteStat.likeCount,
    dislikeCount: voteStat.dislikeCount,
    reportCount: comment.reported.length,

    didVote: undefined !== didVote,
    didVoteType: (undefined === didVote) ? null : didVote.voteType,
    didReport: undefined !== comment.reported.find((el) => { return el.toString() === curUserIdStr; })
  };
};

var makePostInfo = function (curUserIdStr, post, comments) {
  var didVote = post.votes.find((el) => { return el.uid.toString() === curUserIdStr; });
  var voteStat = makeVoteStat(post.votes);

  return {
    pid: post._id.toString(),
    title: post.title,
    text: post.text,
    author: post.authorNickname,
    written: post.written,
    edited: post.edited,

    readCount: post.readCount,
    // voteCount: post.voteScore,
    likeCount: voteStat.likeCount,
    dislikeCount: voteStat.dislikeCount,
    reportCount: post.reported.length,

    didVote: undefined !== didVote,
    didVoteType: (undefined === didVote) ? null : didVote.voteType,
    didReport: undefined !== post.reported.find((el) => { return el.toString() === curUserIdStr; }),

    commentCount: post.comments.length,
    comments: comments
  };
};

var makeVoteStat = function (votesArr) {
  return votesArr.map((el) => {
    var isLike = ('up' === el.voteType);

    return {
      likeCount: isLike ? 1 : 0,
      dislikeCount: !isLike ? 1 : 0
    };
  })
    .reduce((prev, cur) => {
      return {
        likeCount: prev.likeCount + cur.likeCount,
        dislikeCount: prev.dislikeCount + cur.dislikeCount
      };
    }, { likeCount: 0, dislikeCount: 0 });
};

var sanitizeObjectId = function (proposedId) {
  var objID;

  try {
    objID = new ObjectId(proposedId);
  } catch (e) {
    return false;
  }

  return proposedId === objID.toString();
};

/* Export Functions */
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
      , author: req.info.user._id
      , authorNickname: req.info.user.nickname
      , university: req.info.user.university
    });

    newPost
      .save(function (err, savedPost) {
        if (err) {
          // console.error(err);
          response.respondError(req, res, status.codes.PostAddedFailed.code, null);
        } else {
          response.respondSuccess(req, res, savedPost._id.toString());
        }
      });
  }
};

PostController.prototype.deletePost = function (req, res) {
  Post.findOneAndRemove({ _id: req.info.post._id }).exec().then((post) => {
    post = post;
    response.respondSuccess(req, res);
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.PostRemoveFailed.code);
  });
};

PostController.prototype.findUniversity = function (req, res, next) {
  if (false === sanitizeObjectId(req.body.univid)) {
    response.respondError(req, res, status.codes.UnivNotFound.code);
  } else {
    UnivModel
      .findOne({ _id: req.body.univid })
      .exec()
      .then((univ) => {
        if (null === univ) {
          response.respondError(req, res, status.codes.UnivNotFound.code);
        } else {
          req.info = req.info || {};
          req.info.univid = univ._id.toString();
          next();
        }
      }, (err) => {
        logger.error(err);
        response.respondError(req, res, status.codes.UnivNotFound.code);
      });
  }
};

PostController.prototype.getPost = function (req, res) {
  var receivedCommentsIdArr = req.info.post.comments;

  if (req.info.post.author._id.toString() !== req.info.user._id.toString()) {
    // increment readCount
    req.info.post.readCount = req.info.post.readCount + 1;
  }

  req.info.post.save().then((savedPost) => {
    Comment
      .find({ _id: { $in: receivedCommentsIdArr } })
      .populate({ path: 'author', options: { written: -1 } })
      .sort({ written: -1 })
      .exec()
      .then((rawComments) => {
        var comments = rawComments.map(makeCommentInfoObj.bind(undefined, req.info.user._id.toString()));
        response.respondSuccess(req, res, makePostInfo(req.info.user._id.toString(), savedPost, comments));
      }, (err) => {
        logger.error(err);
        response.respondError(req, res, status.codes.CommentsOnPostGottenFailed.code);
      });
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.PostAddedFailed.code);

  });
};

PostController.prototype.loadPost = function (req, res, next) {
  var pid;

  if (undefined !== req.params &&
    undefined !== req.params.pid) {
    pid = req.params.pid;
  } else if (undefined !== req.query &&
    undefined !== req.query.pid) {
    pid = req.query.pid;
  }
  if ((undefined === pid ||
    false === sanitizeObjectId(pid))) {
    response.respondError(req, res, status.codes.PostNotFound.code);
  } else {
    Post
      .findOne({ _id: pid })
      .populate({ path: 'author' })
      .exec()
      .then((post) => {
        if (null === post) {
          response.respondError(req, res, status.codes.PostNotFound.code);
        } else {
          req.info = req.info || {};
          req.info.post = post;
          next();
        }
      }, (err) => {
        logger.error(err);
        response.respondError(req, res, status.codes.PostNotFound.code);
      });
  }
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
    post.reported.push(req.info.user._id);
    post.save(function (err, newReport) {
      if (err) {
        response.respondError(req, res, status.codes.AddReportFailed.code);
      } else {
        response.respondSuccess(req, res, newReport._id.toString());
      }
    });
  }
};

PostController.prototype.updateVoteOnPost = function (req, res) {
  var newVoteType = req.body.voteType;
  var curUserIdStr = req.info.user._id.toString();
  var post = req.info.post;

  if (post === undefined || post === null) {
    response.respondError(req, res, status.codes.PostNotFound.code);
  } else if (undefined !== post.votes.find((el) => { return el.uid.toString() === curUserIdStr; })) {
    response.respondError(req, res, status.codes.PostVotedAlready.code);
  } else if (newVoteType === null || newVoteType === undefined) {
    response.respondError(req, res, status.codes.EmptyVote.code);
  } else if (newVoteType !== 'up' && newVoteType !== 'down') {
    // else if statement doesnt pass test when !== but passes when != but doesnt pass JSHint when != (passes when !==)
    response.respondError(req, res, status.codes.WrongVote.code);
  } else {
    var addition = (newVoteType === 'up') ? 1 : -1;

    post.voteScore = post.voteScore + addition;
    post.votes.push({
      uid: req.info.user._id,
      voteType: newVoteType
    });

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