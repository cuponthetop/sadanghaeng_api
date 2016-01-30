"use strict";

var express = require('express')
  // , UserCtrl = require('../../controller/user')
  // , UniversityCtrl = require('../../controller/university')
  // , PostCtrl = require('../../controller/post')
  // , config = require('../../../config/config')
  ;

var university = express();

university.post('/universities/', function () {
  
});

university.get('/universities/:univ', function () {
  
});

university.get('/universities/:univ/search', function () {
  
});

module.exports = university;