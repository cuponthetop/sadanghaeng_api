"use strict";

process.env.NODE_ENV = 'production';

var mongoose = require('mongoose')
  , config = require('../../../config/config')
  , Q = require('q')
  ;

module.exports.connect = function () {

  // 몽고 db 연결
  var dbUri = config.db.uri + config.db.dbName;
  var dbOptions = {
    username: config.db.username,
    password: config.db.password
  };

  return Q(mongoose.connect(dbUri, dbOptions));
};

module.exports.disconnect = function () {
  return Q(mongoose.disconnect()).timeout(300);
};