"use strict";

var mongoose = require('mongoose')
  // , uuid = require('uuid')
  // , config = require('../../config/config')
  , Schema = mongoose.Schema
  ;

var PostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },

  author: { type: Schema.Types.ObjectId, required: true },
  university: { type: Schema.Types.ObjectId, required: true },

  written: { type: Date, default: Date.now() },
  edited: { type: Date, default: Date.now() },

  votes: { type: [{ uid: Schema.Types.ObjectId, type: String }] },
  comments: { type: [Schema.Types.ObjectId] },
});

mongoose.model('posts', PostSchema);

var PostModel = mongoose.model('posts');
module.exports = PostModel;