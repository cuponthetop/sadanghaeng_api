"use strict";

var mongoose = require('mongoose')
  // , config = require('../../config/config')
  , Schema = mongoose.Schema
  ;

var CommentSchema = new Schema({
  email: { type: String, unique: true, required: true },
});

mongoose.model('comments', CommentSchema);

var CommentModel = mongoose.model('comments');
module.exports = CommentModel;