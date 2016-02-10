'use strict';

var Comment = require('../model/comment');

var CommentController = function() {  };

// todo: make test code
CommentController.prototype.removeComment = function(req, res) {
  Comment.findOneAndRemove({ _id: req.params.cid }, function (err, results) {
    if(err) {
      res.status(500).json({ error: "The Comment is Not Removed"});
    }
  })
};

// todo: make test code
CommentController.prototype.reportComment = function(req, res) {
  var newReported = [];
  var newReportedElement; // todo: initialize this
  
  Comment.find({ _id: req.params.cid })
         .select(reported)
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
                if(err) {
                  res.status().json({ err: "The Comment is Not Reported" });
                }
            });
};


module.exports = new CommentController();