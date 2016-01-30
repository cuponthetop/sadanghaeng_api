"use strict";

var express = require('express')
  , rateLimit = require('express-rate-limit')
  , user = require('./v1/user')
  , stat = require('./v1/stat')
  ;

var api = express();

var limiter = rateLimit({ });

api.use(limiter);

api.use('/v1', user);
api.use('/v1', stat);

module.exports = api;