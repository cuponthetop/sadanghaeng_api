"use strict";

var express = require('express')
  , UserCtrl = require('../../controller/user')
  ;

var user = express();

user.get('/users/:id', UserCtrl.getUser);


module.exports = user;