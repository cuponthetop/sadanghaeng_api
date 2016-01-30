"use strict";

var express = require('express')
  , rateLimit = require('express-rate-limit')
  , user = require('./v1/user')
  ;

var api = express();

var limiter = rateLimit({ });

api.use(limiter);

api.use('/v1', user);

module.exports = api;