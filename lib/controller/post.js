'use strict';

var Post = require('../model/post')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , status = require('../server/status')
  ,	UserCtrl = require('./user.js');

var PostController = function () { };

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

PostController.prototype.getPosts = function (req, res) {
 	// get/check university .. 아직 로그인 세션 디테일 어딨는지 몰름 
	let userUni = req.session.university;

	// 일단 written으로 sort했는대 edited이 우선이 되야지만 if edited을 어덯게 추가할지 몰라서 이렇게
	Post.find({ university: userUni }, { sort: { written: -1} }, function (err, posts) {
	    if (err) {
	    	response.respondError(req, res, status.codes.GetPostsFailed.code);
	    } 
    	// fetch posts in array
	    response.respondSuccess(req, res, posts.map(function(p){
		   	return {
		   		title: p.title,
		   		text: p.text,
		   		written: p.written,
		   		edited: p.edited,
		   		votes: p.votes
	    	};
	    }));
	});
};

PostController.prototype.getPost = function (req, res) {
	Post.findOne({_id:req.params.pid}, function (err, post) {
		// if server can't find post
		if (err) {
			response.respondError(req, res, status.codes.CouldNotFindPost.code);
	  	} 
	  	if (post) {
	  		// fetch post
	  		let gotPost = {
		    	title: post.title,
		    	text: post.text,
		    	written: post.written,
		    	edited: post.edited,
		    	votes: post.votes,
		    	comments: post.comments
		    };
		    response.respondSuccess(req, res, gotPost);
	   	} 
  	});
};

PostController.prototype.deletePost = function (req, res, next) {
	Post.findOne({ _id:req.params.pid}, function (err, post) {
		if (err) {
			response.respondError(req, res, status.codes.CouldNotFindPost.code);
		}
		if (post) {
			// check if owner or admin
			UserCtrl.permitOwnerOrAdmin(req, res, next);

			// delete post
			Post.remove(function (err, post) {
				if (err) {
					response.respondError(req, res, status.codes.PostRemoveFailed.code);
				} 
				response.respondSuccess(req, res, post);		
			});
		}
	});
};

// PostController.prototype.reportPost = function (req, res) {
	// find post for which report goes to
	// let report = Post.findOne({ id: req.params.pid }, function (err, post) {
	// 	if (err) {
	// 		response.respondError(req, res, status.codes.CouldNotFindPost.code);
	// 	}
		//  find if report already exists
		// let reports = post.reported; 
		// for (var i=0; i < reports.length; i++) {
		// 	if (req.info.user._id == i[uid]) {
		// 		response.respondError(req, res, status.codes.AlreadyReported.code);
		// 	}
		// 	Post.update(post, { $push: { uid: req.info.user._id, report : req.body.report } }, function (err, updated) {
		// 		if (err) {

		// 		}
		// 		response.respondSuccess(req, res, updated);
		// 	});
		// }
// 	}); 
// };

PostController.prototype.getCommentsOnPost = function (req, res) {
  Post
    .find({ _id: req.params.pid })
    .sort({ written: 1 })
    .select('comments')
    .exec(function (err, comments) {
      if (err) {
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
    .find({ _id: req.params.pid })
    .select('votes')
    .sort({ written: 1 })
    .exec(function (err, votes) {
      if (err) {
        response.respondError(req, res, status.codes.CommentsOnPostGottenFailed.code);
      }
      response.respondSuccess(req, res, votes);
    });
};

// todo : make test code
PostController.prototype.voteForPost = function (req, res) {
  var newVotes = [];
  res = res;

  Post.find({ _id: req.body.pid })
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