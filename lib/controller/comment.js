'use strict';

var Comment = require('../model/comment')
,   response = require('../server/response')
,   logger = require('../server/logger')
,   status = require('../server/status')
;

var CommentController = function () { };

CommentController.prototype.loadComment = function (req, res, next) {
  Comment.findOne({ _id: req.params.cid }).exec().then((comment) => {
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
  }
  // create new comment
	let comment = new Comment({
		text: req.body.text,
		author: req.body.author,
		postID: req.body.postID,
		univID: req.body.univID,
		written: Date.now(),
		edited: Date.now(),
	});
	// insert/save new comment
	comment.save(function(err, comment) {
		if (err) {
			response.respondError(req, res, status.codes.CommentAddFailed.code);
		}
		response.respondSuccess(req, res, comment);
	});
};

CommentController.prototype.voteComment = function (req, res) {
	Comment.findOne({ _id: req.params.cid }).exec().then((comment) => {
    if (comment === null) {
      response.respondError(req, res, status.codes.CommentNotFound.code);
    } else if (undefined !== comment.reported.find((duplicate) => { return duplicate.toString() === req.info.user._id.toString(); })) {
      response.respondError(req, res, status.codes.AlreadyVoted.code);
    } else {
      comment.votes.push({ uid: req.info.user._id, type: req.body.vote }).save(function (err, newVote) {
        if (err) {
          response.respondError(req, res, status.codes.AddVoteFailed.code);
        }
        response.respondSuccess(req, res, newVote);
      });
    }
	});
};

// todo: make test code
CommentController.prototype.removeComment = function (req, res) {
  Comment.findOneAndRemove({ _id: req.params.cid }, function (err, results) {
    results = results;
    if (err) {
      response.respondError(req, res, status.codes.CommentRemovalFailed.code); // todo: error code 
    }
  });
};

// todo: make test code
CommentController.prototype.reportComment = function (req, res) {
  var newReported = [];
  // var newReportedElement; // todo: initialize this
  
  Comment.find({ _id: req.params.cid })
    .select('reported')
    .exec(function (err, reported) {
      newReported = reported;
    });
  //then /////////////////////////
  newReported.push(req.body.vote);
  ////////////////////////////////
               
  Comment
    .update({ _id: req.params.cid }
      , { reported: newReported }
      , function (err, results) {
        results = results;
        if (err) {
          response.respondError(req, res, status.codes.CommentUpdateFailed.code);
        }
      });
};

module.exports = new CommentController();