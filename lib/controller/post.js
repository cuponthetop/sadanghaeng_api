'use strict';

var Post = require('../model/post')
,   response = require('../server/response')
,   status = require('../server/status');

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
		}

		// delete post
		post.remove(function (err, p) {
			if (err) {
				console.log(err);
			} else {
				// no need to format
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
	});
};

PostController.prototype.reportPost = function (req, res) {
	// find post for which vote goes to -> push into votes array
	let newFeedback = Post.findOneAndUpdate({ id: req.params.pid }, { $push: { votes: req.body.vote }}, 
		function (err) {
			return res.send(500, 'Server error');
		}
	)
};

PostController.prototype.getCommentsOnPost = function (req, res) {
  Post
    .find({ _id: req.params.pid })
    .sort({ written: 1})
    .select('comments')
    .exec(function (err, comments) {
      if(err) {
        response.respondError(req, res, status.codes.CommentsOnPostGottenFailed.code);
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
    //, written:  //default 있어서 안씀 
    //, edited: //
  , votes: [] // 이렇게 하는게 맞나? 
  , comments: [] // 이렇게 하는게 맞나?
  , reported: [] // 이렇게 하는게 맞나?
  });

  Post.save(newPost);
};

// todo : make test code
PostController.prototype.getVotesOnPost = function (req, res) {
  Post
    .find( {_id: req.params.pid } )
    .select('votes')
    .sort({ written: 1})
    .exec(function (err, votes) {
      if(err) {
        response.respondError(req, res, status.codes.CommentsOnPostGottenFailed.code);
      }
      response.respondSuccess(req, res, votes);
    });
};

// todo : make test code
PostController.prototype.voteForPost = function (req, res) {
  var newVotes = [];
  res = res;
  
  Post.find({ _id: req.body.pid} )
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