"use strict";

var express = require('express')
  , rateLimit = require('express-rate-limit')
  , stat = require('./v1/stat')
  , user = require('./v1/user')
  , university = require('./v1/university')
  , post = require('./v1/post')
  , comment = require('./v1/comment')
  , config = require('../../config/config')
  , response = require('../server/response')
  ;

var api = express();

var overallLimiter = rateLimit({ 
  windowMs: config.rate.windowMs,
  delayAfter: config.rate.delayAfter,
  delayMs: config.rate.delayMs,
  max: config.rate.numRequest,
  handler: response.respondRateLimit
});

api.use(overallLimiter);

api.use('/v1', stat);
api.use('/v1', user);
api.use('/v1', university);
api.use('/v1', post);
api.use('/v1', comment);

module.exports = api;