"use strict";

var express = require('express')
  , rateLimit = require('express-rate-limit')
  , v1 = require('./v1/stat')
  ;

var api = express();

var limiter = rateLimit({ });

api.use(limiter);

api.use('/v1', v1);

module.exports = api;