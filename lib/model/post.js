"use strict";

var mongoose = require('mongoose')
// , uuid = require('uuid')
// , config = require('../../config/config')
  , Schema = mongoose.Schema
  ;

var PostSchema = new Schema({
  // 게시물 제목
  title: { type: String, required: true },
  // 게시물 내용
  text: { type: String, required: true },

  authorNickname: { type: String },
  // 게시물 글쓴이
  author: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  // 게시물이 달린 대학
  university: { type: Schema.Types.ObjectId, required: true },

  // 게시물이 쓰인 날짜
  written: { type: Date, default: Date.now },
  // 게시물이 수정된 날짜
  edited: { type: Date, default: Date.now },

  readCount: { type: Number, required: true, default: 0 },

  // Vote 정보
  votes: { type: [{ uid: Schema.Types.ObjectId, voteType: String }] },
  voteScore: { type: Number, required: true, default: 0 },
  // 게시물에 달린 댓글
  comments: { type: [Schema.Types.ObjectId] },
  // 게시물을 신고한 사람 id
  reported : { type: [Schema.Types.ObjectId] }
});


PostSchema.index({ university: 1 });
PostSchema.index({ author: 1 });
PostSchema.index({ written: -1 });


mongoose.model('posts', PostSchema);

var PostModel = mongoose.model('posts');
module.exports = PostModel;