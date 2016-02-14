"use strict";

var mongoose = require('mongoose')
// , config = require('../../config/config')
  , Schema = mongoose.Schema
  ;

var UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  nickname: { type: String, required: true },

  hashed_password: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false },
  admin: { type: Boolean, required: true, default: false },

  reset_token: { type: String },
  reset_token_expires: Date,
  verify_token: { type: String },
  verify_token_expires: Date,

  university: { type: Schema.Types.ObjectId, required: true, ref: 'universitys' },
  memberSince: { type: Date, default: Date.now() },

  reported: { type: [Schema.Types.ObjectId] }
});

UserSchema.index({ email: 1 }, { unique: true });


mongoose.model('users', UserSchema);

var UserModel = mongoose.model('users');
module.exports = UserModel;