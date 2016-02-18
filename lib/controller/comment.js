'use strict';

var Comment = require('../model/comment')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , status = require('../server/status')
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
  } else {
      // create new comment
      let newComment = {
        text: req.body.text,
        author: req.body.author,
        postID: req.body.postID,
        univID: req.body.univID,
        written: Date.now(),
        edited: Date.now(),
      };

      let addComment = new Comment(newComment);
      // insert/save new comment
      addComment.save().then((comment) => {
        response.respondSuccess(req, res, comment._id.toString());
      }, (err) => {
        logger.error(err);
        response.respondError(req, res, status.codes.CommentAddFailed.code);
      });

      // save(function (err, comment) {
      //   if (err) {
      //     response.respondError(req, res, status.codes.CommentAddFailed.code);
      //   } else {
      //        response.respondSuccess(req, res, comment);
      //     }
      // });
    }
};

CommentController.prototype.voteComment = function (req, res) {
  Comment.findOne({ _id: req.params.cid }).exec().then((comment) => {
    if (comment === null) {
      response.respondError(req, res, status.codes.CommentNotFound.code);
    } else if (undefined !== comment.reported.find((duplicate) => { return duplicate.toString() === req.info.user._id.toString(); })) {
      response.respondError(req, res, status.codes.AlreadyVoted.code);
    } else {
        if (req.body.vote === null || undefined) {
          response.respondError(req, res, status.codes.EmptyVote.code);
        } else if (req.body.vote.type !== 'upvote' || 'downvote') {
          // else if statement doesnt pass test when !== but passes when != but doesnt pass JSHint when != (passes when !==)
          response.respondError(req, res, status.codes.WrongVote.code);
        } else {
          comment.votes.push({ uid: req.info.user._id, type: req.body.vote }).save(function (err, newVote) {
              if (err) {
                response.respondError(req, res, status.codes.AddVoteFailed.code);
              } else {
                      response.respondSuccess(req, res, newVote._id.toString());
              }
          });
        }
      }
  });
};

// todo: make test code
CommentController.prototype.removeComment = function (req, res) {
  Comment.findOneAndRemove({ _id: req.params.cid }, function (err, results) {
    results = results;
    if (err) {
      response.respondError(req, res, status.codes.CommentRemovalFailed.code); 
    } else {
      response.respondSuccess(req, res, null);
    }
  });
};

// todo: make test code
CommentController.prototype.reportComment = function (req, res) {
  
  // report한 id를 담는다 // 그 id를 담는 변수가 이게 맞나 모르겠네ㅜㅜ
  var newReported = req.info.reported;

  // report한 id가 이미 report한 id인지 아닌지 확인
  for(var i=0 ; i<req.info.comment.reported.length ; i++) {
    if(req.info.comment.reported[i] === req.info.reported) {
      response.respondError(req, res, status.codes.CommentReportAlready.code);
      return;
    } 
  }

  Comment
    .update({ _id: req.params.cid }
        // req.info.uid: report한 사람 id
      , { votes: { $push: { uid: req.info.uid, reported: newReported } } }
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