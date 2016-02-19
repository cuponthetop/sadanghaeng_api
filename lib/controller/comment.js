'use strict';

var CommentModel = require('../model/comment')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , status = require('../server/status')
  ;

var CommentController = function () { };

CommentController.prototype.loadComment = function (req, res, next) {
  CommentModel.findOne({ _id: req.params.cid }).exec().then((comment) => {
    req.info = req.info || {};
    req.info.comment = comment;
    next();
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.CommentNotFound.code);
  });
};

CommentController.prototype.addComment = function (req, res) {
  // check if comment has text
  if (req.body.text === '' || null || undefined) {
    response.respondError(req, res, status.codes.EmptyComment.code);
  } else {
    // TODO: check pid for validity

    // create new comment
    let newComment = {
      text: req.body.text,
      author: req.info.user._id.toString(),
      postID: req.body.pid,
      univID: req.info.user.university.toString(),
      written: Date.now(),
      edited: Date.now(),
    };

    let addComment = new CommentModel(newComment);
    // insert/save new comment
    addComment.save().then((comment) => {
      response.respondSuccess(req, res, comment._id.toString());
    }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.CommentAddFailed.code);
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
    response.respondError(req, res, status.codes.EmptyVote.code);
  } else if (req.body.voteType !== 'up' || 'down') {
    // else if statement doesnt pass test when !== but passes when != but doesnt pass JSHint when != (passes when !==)
    response.respondError(req, res, status.codes.WrongVote.code);
  } else if (curUserIdStr === comment.author.toString()) {
    response.respondError(req, res, status.codes.CommentOwnerCanNotVote.code);
  } else {
    var addition = (req.body.voteType === 'up') ? 1 : -1;

    comment.voteScore = comment.voteScore + addition;
    comment.votes.push({ uid: req.info.user._id, type: req.body.vote });

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

CommentController.prototype.removeComment = function (req, res) {
  CommentModel.findOneAndRemove({ _id: req.params.cid }, function (err, results) {
    results = results;
    if (err) {
      response.respondError(req, res, status.codes.CommentRemovalFailed.code);
    } else {
      response.respondSuccess(req, res, null);
    }
  });
};

CommentController.prototype.reportComment = function (req, res) {
  // report한 id를 담음
  var newReported = req.body.reported;

  // report한 id가 이미 report한 id인지 아닌지 확인
  for (var i = 0; i < req.info.comment.reported.length; i++) {
    if (JSON.stringify(req.info.comment.reported[i]) === "\"" + newReported + "\"") {
      response.respondError(req, res, status.codes.CommentReportAlready.code);
      return;
    }
  }
  // DB 정보를 Update
  CommentModel
    .update({ _id: req.params.cid }
      , { $push: { reported: newReported } }
      , function (err, results) {
        results = results;
        if (err) {
          response.respondError(req, res, status.codes.CommentReportFailed.code);
        } else {
          response.respondSuccess(req, res, null);
        }
      });
};

module.exports = new CommentController();