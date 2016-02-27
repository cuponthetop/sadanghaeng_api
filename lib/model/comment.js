"use strict";

var mongoose = require('mongoose')
// , config = require('../../config/config')
  , Schema = mongoose.Schema
  ;

var CommentSchema = new Schema({
  // 댓글 내용
  text: { type: String, required: true },
  // 댓글 글쓴이
  author: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  // 댓글이 달린 게시물(post)의 ID
  postID: { type: Schema.Types.ObjectId, required: true, ref: 'posts' },
  // 댓글 달린 날짜
  written: { type: Date, default: Date.now },
  // 댓글이 수정된 날짜
  edited: { type: Date, default: Date.now },
  // 댓글에 vote한 사람들 id
  votes: { type: [{ uid: Schema.Types.ObjectId, voteType: String }] },
  // 댓글 vote 점수
  voteScore: { type: Number, required: true, default: 0 },
  // 댓글을 신고한 사람들 id
  reported: { type: [Schema.Types.ObjectId] }
});

mongoose.model('comments', CommentSchema);

CommentSchema.index({ postID: 1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ written: -1 });

var CommentModel = mongoose.model('comments');
module.exports = CommentModel;