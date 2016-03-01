'use strict';

var CommentModel = require('../model/comment')
  , PostModel = require('../model/post')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , status = require('../server/status')
  ;

var CommentController = function () { };

var regExCheckEmptyText = /(^\s*)(\s*$)/;

CommentController.prototype.addComment = function (req, res) {
  // check if comment has text
  if (regExCheckEmptyText.test(req.body.text) || req.body.text === undefined) {
    response.respondError(req, res, status.codes.EmptyComment.code);
  } else {
    // TODO: check pid for validity

    // create new comment
    let newComment = {
      text: req.body.text,
      author: req.info.user._id.toString(),
      authorNickname: req.info.user.nickname,
      postID: req.body.pid,
      univID: req.info.user.university.toString(),
      written: Date.now(),
      edited: Date.now(),
    };

    let addComment = new CommentModel(newComment);
    // insert/save new comment
    addComment.save().then((comment) => {
      req.info.post.comments.push(comment);

      // save into post
      req.info.post.save().then(() => {
        response.respondSuccess(req, res, comment._id.toString());
      }, (err) => {
        CommentModel.findOneAndRemove({ _id: comment._id }).exec().then(() => {
          logger.error(err);
          response.respondError(req, res, status.codes.CommentAddFailed.code);
        }, (removalErr) => {
          logger.error(removalErr);
          response.respondError(req, res, status.codes.UnknownError.code);
        });
      });
    }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.CommentAddFailed.code);
    });
  }
};

// find uses body param
CommentController.prototype.findPost = function (req, res, next) {
  PostModel.findOne({ _id: req.body.pid }).exec().then((post) => {
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
};

// load uses params embedded in url
CommentController.prototype.loadComment = function (req, res, next) {
  CommentModel
    .findOne({ _id: req.params.cid })
    .populate({ path: 'postID' })
    .exec()
    .then((comment) => {
      if (null === comment) {
        response.respondError(req, res, status.codes.CommentNotFound.code);
      } else {
        req.info = req.info || {};
        req.info.comment = comment;
        next();
      }
    }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.CommentNotFound.code);
    });
};

CommentController.prototype.removeComment = function (req, res) {
  var pid = req.info.comment.postID;
  var cid = req.info.comment._id;

  CommentModel.findOneAndRemove({ _id: cid }, () => {
    PostModel.findOneAndUpdate({ _id: pid }, { $pull: { comments: cid } }).exec().then(
      () => {
        response.respondSuccess(req, res, null);
      }, (err) => {
        logger.error(err);
        response.respondError(req, res, status.codes.CommentRemovalFailed.code);
      });
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.CommentRemovalFailed.code);
  });
};

CommentController.prototype.reportComment = function (req, res) {
  var comment = req.info.comment;

  if (comment === null) {
    response.respondError(req, res, status.codes.CommentNotFound.code);
  } if (req.info.user._id.toString() === comment.author.toString()) {
    response.respondError(req, res, status.codes.CantReportSelf.code);
  } else if (undefined !== comment.reported.find((duplicate) => { return duplicate.toString() === req.info.user._id.toString(); })) {
    response.respondError(req, res, status.codes.CommentReportAlready.code);
  } else {
    comment.reported.push(req.info.user._id);
    comment.save(function (err, newReport) {
      if (err) {
        response.respondError(req, res, status.codes.CommentReportFailed.code);
      } else {
        response.respondSuccess(req, res, newReport._id.toString());
      }
    });
  }
};

CommentController.prototype.voteComment = function (req, res) {
  var comment = req.info.comment;
  var curUserIdStr = req.info.user._id.toString();

  if (comment === undefined || comment === null) {
    response.respondError(req, res, status.codes.CommentNotFound.code);
  } else if (undefined !== comment.votes.find((el) => { return el.uid.toString() === curUserIdStr; })) {
    response.respondError(req, res, status.codes.AlreadyVoted.code);
  } else if (req.body.voteType === null || req.body.voteType === undefined) {
    response.respondError(req, res, status.codes.WrongVote.code);
  } else if (req.body.voteType !== 'up' && req.body.voteType !== 'down') {
    // else if statement doesnt pass test when !== but passes when != but doesnt pass JSHint when != (passes when !==)
    response.respondError(req, res, status.codes.WrongVote.code);
  } else {
    var addition = (req.body.voteType === 'up') ? 1 : -1;

    comment.voteScore = comment.voteScore + addition;
    comment.votes.push({
      uid: req.info.user._id,
      voteType: req.body.voteType
    });

    comment.save(function (err, newVote) {
      if (err) {
        response.respondError(req, res, status.codes.AddVoteFailed.code);
      } else {
        newVote = newVote;
        response.respondSuccess(req, res, null);
      }
    });
  }
};

module.exports = new CommentController();