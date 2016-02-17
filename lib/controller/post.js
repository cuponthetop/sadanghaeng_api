'use strict';

var Post = require('../model/post')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , status = require('../server/status')
  ,	UserCtrl = require('./user.js')
  , Comment = require('../model/comment')
  ;

var PostController = function () { };

var regExCheckEmptyText = /(^\s*)(\s*$)/;

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

PostController.prototype.reportPost = function (req, res) {
	Post.findOne({ id: req.params.cid }).exec().then((post) => {
	    if (post === null) {
	      response.respondError(req, res, status.codes.PostNotFound.code);
	    } else if (undefined !== post.reported.find((duplicate) => { return duplicate.toString() === req.info.user._id.toString(); })) {
	      response.respondError(req, res, status.codes.AlreadyReported.code);
	    } else {
	      post.reported.push(req.info.user._id).save(function (err, newReport) {
	        if (err) {
	        	response.respondError(req, res, status.codes.AddReportFailed.code);
	        }
	        response.respondSuccess(req, res, newReport);
	      });
	    }
	});
};

PostController.prototype.getCommentsOnPost = function (req, res) {
  var commentsInfo = []
    , receivedCommentsIdArr = req.info.post.comments
    ;

  var makeCommentInfoObj = function(nickname, writtenDate, likeVoteCount) {
    return {
      'nickname': nickname
    , 'writtenDate': writtenDate
    , 'likeVoteCount': likeVoteCount
    };
  };

  Comment
    .find({ _id: { $in: receivedCommentsIdArr } })
    .populate({ path: 'author' })
    .exec()
      .then(function (err, comments) {
        if (err) {
          response.respondError(req, res, status.codes.CommentsOnPostGottenFailed.code);
        } else {
          commentsInfo = comments.map(function (comment) {
            return makeCommentInfoObj(comment.author.nickname, comment.written, comment.voteScore);
          });
        }
      })
    .then(function () {
      commentsInfo.sort(function (date1, date2) { return date1 - date2; }); // synchronous func
      response.respondSuccess(req, res, commentsInfo);
    });
};


PostController.prototype.addPost = function (req, res) {
  res = res;

  var newPost = new Post({
  //   title: req.body.title
  // , text: req.body.text
  // , author: req.body.author
  // , university: req.body.university
    title: req.info.post.title
  , text: req.info.post.text
  , author: req.info.post.author
  , university: req.info.post.university
  });

  // Test whether the title is continuum of space or newline
  if (regExCheckEmptyText.test(newPost.title)) {
    response.respondError(req, res, status.codes.TitleOfPostIsInvalid.code);
    return;
  }
  // Test whether the text is continuum group of space or newline
  if (regExCheckEmptyText.test(newPost.text)) {
    response.respondError(req, res, status.codes.TextOfPostIsInvalid.code);
    return;
  }

  newPost
    .save()
    .then(function (err, savedPost) {
      if (err) {
        response.respondError(req, res, status.codes.PostAddedFailed.code, null);
      } else {
        response.respondSuccess(req, res, savedPost._id.toString());
      }
    });
};

PostController.prototype.updateVote = function (req, res) {
  var newVote = req.info.vote;

  for(var i=0 ; i<req.info.post.vote.length ; i++) {
    if (req.info.post.vote[i] === req.info.reported) {
      response.respondError(req, res, status.codes.PostVotedAlready.code);
      return;  
    }
  }
  
  Post
    .update({ _id: req.params.pid })
      // req.info.uid: vote한 사람 id
    , { $push: { votes: { uid: req.info.uid, voteType: newVote } } }
    , function (err, results) {
        results = results;
        if (err) {
          response.respondError(req, res, status.codes.UpdateVoteFailed.code);
        }
      }
    .then(function () {
      if(newVote === 'up') {
        Post
          .update({ _id: req.params.pid })
          , { $inc: { voteScore: 1 } }
          , function (err, result) { 
            result = result;
            if (err) {
              response.respondError(req, res, status.codes.UpdateVoteInDBFailed.code);
            } else {
              response.respondSuccess(req, res, null);
            }
          };
        
      } else if (newVote === 'down') {
        Post
          .update({ _id: req.params.pid })
        , { $inc: { voteScore: -1 } }
        , function (err, result) {
          result = result;
          if (err) {
            response.respondError(req, res, status.codes.UpdateVoteInDBFailed.code);
          } else {
            response.respondSuccess(req, res, null);
          }
        };
      } 
    });
};

// // todo : make test code
// PostController.prototype.getVotesOnPost = function (req, res) {
//   Post
//     .find({ _id: req.params.pid })
//     .select('votes')
//     .sort({ written: 1 })
//     .exec(function (err, votes) {
//       if (err) {
//         response.respondError(req, res, status.codes.CommentsOnPostGottenFailed.code);
//       } else {
//         response.respondSuccess(req, res, votes);
//       }
//     });
// };

// // todo : make test code
// PostController.prototype.voteForPost = function (req, res) {
//   var newVotes = [];
//   res = res;

//   Post.find({ _id: req.body.pid })
//     .select('votes')
//     .exec(function (err, votes) {
//       newVotes = votes;
//     });
 
//   // then
//   newVotes.push(req.body.vote); 

// //   Post
// //     .update({ _id: req.body.pid }
// //              , { votes: newVotes }
// //              , function(err, results) {
// //                  // do something
// //                });


// };

module.exports = new PostController();