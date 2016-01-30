"use strict";

var express = require('express')
  , rateLimit = require('express-rate-limit')
  , stat = require('./v1/stat')
  ;

var api = express();

var limiter = rateLimit({ });

api.use(limiter);

api.use('/v1', stat);

module.exports = api;