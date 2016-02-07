'use strict';

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

CommentController.prototype.feedback = function (req, res) {
	// find comment for which vote goes to -> push into votes array
	let newFeedback = Comments.findOneAndUpdate({ id: req.params.cid }, { $push: { votes: req.body.vote }}, 
		function (err) {
			return res.send(500, 'Server error');
		}
	)
}

CommentController.prototype.getComment = function (req, res, next) {
  req = req;
  res = res;
  next = next;
  return "test";
};


module.exports = new CommentController();