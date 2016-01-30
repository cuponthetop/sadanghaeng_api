"use strict";

var mongoose = require('mongoose')
  // , uuid = require('uuid')
  // , config = require('../../config/config')
  , Schema = mongoose.Schema
  ;

var PostSchema = new Schema({
  postID: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  
  author: { type: String, required: true },
  university: { type: String, required: true },
  
  written: { type: Date, required: true },
  
  votes: {},
  comments: {},
});

mongoose.model('posts', PostSchema);

var CommentModel = mongoose.model('posts');
module.exports = CommentModel;