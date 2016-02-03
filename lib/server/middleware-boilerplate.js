"use strict";

var bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , session = require('express-session')
  , helmet = require('helmet')
  , logger = require('morgan')
  , errorhandler = require('errorhandler')
  , mongoose = require('mongoose')
  ;

module.exports = function (app, env) {
  var config = require('../../config/config');
  // 몽고 db 연결
  var dbUri = config.db.uri + config.db.dbName;
  var dbOptions = { username: config.db.username, password: config.db.password };
  mongoose.connect(dbUri, dbOptions);

  // 기본 환경 변수와 포트 넘버 셋팅
  app.set('env', env.NODE_ENV || 'development');
  app.set('port', env.PORT || 3001);

  // 세션 관련 초기화
  app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true
    // cookie: { secure: true }
  }));

  // 기초 보안
  app.use(helmet());

  // dev 환경에서의 패킷 로거와 에러 스택트레이스 설정
  var currentEnv = app.get('env');

  if ('development' === currentEnv ||
      'production' === currentEnv) {
    app.use(logger('dev'));
  }

  // http body-parser for POST, etc.
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // method override for DELETE, PUT, etc.
  app.use(methodOverride());

  // dev 환경에서의 에러 스택트레이스 설정
  if ('development' === currentEnv) {
    app.use(errorhandler());
  }

  // end of middleware boilerplate  
};