"use strict";

var mongoose = require('mongoose')
  // , config = require('../../config/config')
  , Schema = mongoose.Schema
  ;

var UniversitySchema = new Schema({
  name: { type: String, unique: true, required: true },
  displayName: {type: String, unique: true, required: true }
});

mongoose.model('universitys', UniversitySchema);

var UniversityModel = mongoose.model('universitys');
module.exports = UniversityModel;