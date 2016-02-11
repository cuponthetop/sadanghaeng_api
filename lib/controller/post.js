'use strict';

var Post = require('../model/post');

var PostController = function () { };

PostController.prototype.getPosts = function (req, res) {
  // get uni details .. 아직 로그인 세션 디테일 어딨는지 몰름 
  let userUni = req.session.?;
  // 일단 written으로 sort했는대 edited이 우선이 되야지만 if edited을 어덯게 추가할지 몰라서 이렇게
  Post.find({ university: userUni }, { sort: { written: -1} }, function (err, posts) {
    if (err) {
    	return res.send(500, 'Internal server error');
    } 
    // fetch posts in array
    res.status(200).json(posts.map(function(p){
	   	return {
	   		title: p.title,
	   		text: p.text,
	   		written: p.written,
	   		edited: p.edited,
	   		votes: p.votes
    	}
    }));
	});
};

PostController.prototype.getPost = function (req, res) {
	Post.findOne({_id:req.params.pid}, function (err, post) {
		// if server can't find post
		if (err) {
			return res.send(500, 'Internal server error');
	  	} 
	  	if (post) {
	  		// fetch post
		    res.status(200).json({
		    	title: post.title,
		    	text: post.text,
		    	written: post.written,
		    	edited: post.edited,
		    	votes: post.votes,
		    	comments: post.comments
		    });
	   	} else {
			return res.send('Sorry, post does not exist');
	   }
  	});
};

PostController.prototype.deletePost = function (req, res) {
	Post.findOne({ _id:req.params.pid}, function (err, post) {
		if (err) {
			return res.send(500, 'Internal server error');
		} else {

			// delete post
			post.remove(function (err, p) {
				if (err) {
					console.log(err);
				} else {
					res.format({
						// redirect after deletion
						html: function() {
							res.redirect('/hello');
						},
						//return deleted item in JSON
						json: function() {
							res.json({
								deletedPost: p
							});
						}
					});
				}
			});
		}
	});
};

PostController.prototype.feedback = function (req, res) {
	// find post for which vote goes to -> push into votes array
	let newFeedback = Post.findOneAndUpdate({ id: req.params.pid }, { $push: { votes: req.body.vote }}, 
		function (err) {
			return res.send(500, 'Server error');
		}
	)
};


module.exports = new PostController();