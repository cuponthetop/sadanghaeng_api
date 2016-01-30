"use strict";

var express = require('express')
  , rateLimit = require('express-rate-limit')
  , stat = require('./v1/stat')
  , user = require('./v1/user')
  ;

var api = express();

var limiter = rateLimit({ });

api.use(limiter);

api.use('/v1', stat);
api.use('/v1', user);

module.exports = api;