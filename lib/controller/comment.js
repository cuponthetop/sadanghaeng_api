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