"use strict";

var path = require('path')
  , _ = require('underscore')
  ;

var nodeEnv = process.env.NODE_ENV || 'development';

var config = { 
  db: '', 
  session: '',
  user: ''
};

module.exports = _.mapObject(config, function (val, configName) {
  var configPath = path.resolve(__dirname, nodeEnv, configName + '.js');
  return require(configPath);
});