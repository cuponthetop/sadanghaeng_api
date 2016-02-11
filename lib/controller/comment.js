'use strict';

var Comment = require('../model/comment')
,   response = require('../server/response')
,   status = require('../server/status')
;

var CommentController = function () { };

CommentController.prototype.addComment = function (req, res) {
	// create new comment
	let comment = new Comments({
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
			return res.send(500, 'Server error');
		}
		res.json({ id: comment._id });
	});
};

CommentController.prototype.voteComment = function (req, res) {
	// find comment for which vote goes to -> push into votes array
	let newFeedback = Comments.findOneAndUpdate({ id: req.params.cid }, { $push: { votes: req.body.vote }}, 
		function (err) {
			return res.send(500, 'Server error');
		}
	)
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