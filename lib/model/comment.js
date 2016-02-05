"use strict";

var mongoose = require('mongoose')
  // , config = require('../../config/config')
  , Schema = mongoose.Schema
  ;

var CommentSchema = new Schema({
  text: { type: String, required: true },

  author: { type: Schema.Types.ObjectId, required: true },
  postID: { type: Schema.Types.ObjectId, required: true },
  
  written: { type: Date, default: Date.now() },
  edited: { type: Date, default: Date.now() },

  votes: { type: [{ uid: Schema.Types.ObjectId, type: String }] }
});

mongoose.model('comments', CommentSchema);

var CommentModel = mongoose.model('comments');
module.exports = CommentModel;