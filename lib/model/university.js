"use strict";

var mongoose = require('mongoose')
  // , config = require('../../config/config')
  , Schema = mongoose.Schema
  ;

var UniversitySchema = new Schema({
  // 학교 이름
  name: { type: String, unique: true, required: true },
  // 학교를 어떻게 보여줄 지
  displayName: { type: String, unique: true, required: true },
  // 이메일 주소의 체크 로직
  emailFormatList: { type: [String], required: true },
  // 학교에 소속된 포스팅
  // posts: { type: [String], required: true }
});

mongoose.model('universitys', UniversitySchema);

var UniversityModel = mongoose.model('universitys');
module.exports = UniversityModel;