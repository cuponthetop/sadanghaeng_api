'use strict';

var Comment = require('../model/comment')
,   response = require('../server/response')
,   status = require('../server/status')
;

var CommentController = function () { };

// todo: make test code
CommentController.prototype.removeComment = function (req, res) {
  Comment.findOneAndRemove({ _id: req.params.cid }, function (err, results) {
    results = results;
    if (err) {
      response.respondError(req, res, status.codes.CommentRemovalFailed.code); 
      return;
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
          return;
        }
      });
};


module.exports = new CommentController();