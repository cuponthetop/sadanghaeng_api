'use strict';

var Post = require('../model/post');

var PostController = function () { };

PostController.prototype.getPosts = function (req, res) {
  // get uni details .. 아직 로그인 세션 디테일 어딨는지 몰름 
  let userUni = ;
  // 일단 written으로 sort했는대 edited이 우선이 되야지만 if edited을 어덯게 추가할지 몰라서 이렇게
  Post.find({ university: university }, { sort: { written: -1} }, function (err, posts) {
    if (err) {
    	return res.send(500, 'Internal server error');
    }
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
		if (!post) {
			return 'Sorry, post does not exist';
		}

		if (err) {
			return res.send(500, 'Internal server error');
	  	}
	    res.status(200).json({
	    	title: post.title,
	    	text: post.text,
	    	written: post.written,
	    	edited: post.edited,
	    	votes: post.votes
	    	comments: post.comments
	    });
  	});
};



module.exports = new PostController();