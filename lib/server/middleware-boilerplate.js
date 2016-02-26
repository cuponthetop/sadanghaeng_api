"use strict";

var bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , session = require('express-session')
  , helmet = require('helmet')
  , morgan = require('morgan')
  , logger = require('./logger.js')
  , errorhandler = require('errorhandler')
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(session)
  ;

module.exports = function (app, env) {
  var config = require('../../config/config');
  // 몽고 db 연결
  var dbUri = config.db.uri + config.db.dbName;
  var dbOptions = { username: config.db.username, password: config.db.password };
  mongoose.connect(dbUri, dbOptions);

  // 기본 환경 변수와 포트 넘버 셋팅
  app.set('env', env.NODE_ENV || 'development');
  app.set('port', env.PORT || 5001);

  // 세션 관련 초기화
  app.use(session({
    store: new MongoStore({
      //mongooseConnection: mongoose.connection//,
      url: dbUri,
      //      collection: 'garim-sessions'
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false
    // cookie: { secure: true }
  }));

  // 기초 보안
  // app.use(helmet());

  if ('development' !== currentEnv &&
    'test' !== currentEnv) {

    app.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
      res.setHeader("Access-Control-Max-Age", "3600");
      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      next();
    });
  } else {
    app.use(helmet());
  }

  // dev 환경에서의 패킷 로거와 에러 스택트레이스 설정
  var currentEnv = app.get('env');

  if ('development' === currentEnv ||
    'production' === currentEnv) {
    app.use(morgan('dev'));
  }


  var _ = require('underscore');

  // Copied the morgan compile function over so that cooler formats
  // may be configured
  var compile = function (fmt) {
    fmt = fmt.replace(/"/g, '\\"');
    var js = '  return "' + fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g,
      function (_, name, arg) {
        return '"\n    + (tokens["' + name + '"](req, res, "' + arg + '") || "-") + "';
      }) + '";';
    // jshint evil:true
    return new Function('tokens, req, res', js);
  };
  var requestStartLoggingFormat = compile('-->' + ' ' + ':method' + ' ' +
    ':url');
  // Copied the morgan format.dev function, modified to use colors package
  // and custom logging line
  var requestEndLoggingFormat = function (tokens, req, res) {
    var fn = compile('<-- :method :url :status' +
      ' :response-time ms - :res[content-length]');
    return fn(tokens, req, res);
  };
  app.use(morgan(function (tokens, req, res) {
    // morgan output is redirected straight to winston
    logger.info(requestEndLoggingFormat(tokens, req, res),
      (res.jsonResp || ''));
  }));

  // http body-parser for POST, etc.
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(morgan(function (tokens, req, res) {
    // morgan output is redirected straight to winston
    var data = '';
    try {
      if (req.body) {
        var body = _.clone(req.body);
        if (body.password) delete body.password;
        if (body.newPassword) delete body.newPassword;
        data = data + 'body: ' + JSON.stringify(body).substring(0, 1000) + ', ';
      }
      if (req.query) data = data + 'query: ' + JSON.stringify(req.query).substring(0, 1000) + ', ';
      if (req.params) data = data + 'params: ' + JSON.stringify(req.params).substring(0, 1000);
    } catch (ign) { }
    logger.info(requestStartLoggingFormat(tokens, req, res), data);
  }, { immediate: true }));


  // method override for DELETE, PUT, etc.
  app.use(methodOverride());

  // dev 환경에서의 에러 스택트레이스 설정
  if ('development' === currentEnv) {
    app.use(errorhandler());
  }

  // end of middleware boilerplate
};