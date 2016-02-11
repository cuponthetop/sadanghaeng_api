'use strict';

var UserModel = require('../model/user')
  , response = require('../server/response')
  , status = require('../server/status')
  , config = require('../../config/config')
  , uuid = require('uuid')
  , Q = require('q')
  , bcrypt = require('bcrypt')
  , UnivCtrl = require('./university')
  , logger = require('../server/logger')
  , request = require('request')
  ;

var UserController = function () { };

UserController.prototype.getUser = function (req, res) {
  if (req.info.user !== undefined) {
    req.info.user.hashed_password = null;

    response.respondSuccess(req, res, req.info.user);
  } else {
    response.respondError(req, res, status.codes.UserNotFound.code);
  }
};

UserController.prototype.updateUser = function (req, res) {
  if (req.info.user !== undefined) {
    req.info.user.nickname = req.body.nickname;

    if (req.body.password !== undefined) {
      req.info.user.hashed_password = hashPassword(req.body.password);
    }

    req.info.user.save().then((savedUser) => {
      savedUser.hashed_password = null;
      // password changed, kickout the user from session
      if (req.body.password !== undefined) {
        req.session.destroy();
      }
      response.respondSuccess(req, res, savedUser);
    }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.UserUpdateFailed.code, null);
    });
  } else {
    response.respondError(req, res, status.codes.UserNotFound.code, null);
  }
};

///

UserController.prototype.requireUser = function (req, res, next) {
  if (req.session.accessToken === undefined &&
    req.session.refreshToken === undefined) {
    return response.respondError(req, res, status.codes.UserAuthRequired.code, null);
  }

  request.post({
    url: config.auth.uri + 'auth/v1/authorise',
    headers: { 'Authorization': 'Bearer ' + req.session.accessToken }
  }, (err, innerResponse, body) => {
    try {
      var bodyJson = JSON.parse(body);

      switch (innerResponse.statusCode) {
        case 200:
          loadUserOnRequest(req, res, bodyJson.userId).then(next,
            (errCode) => {
              response.respondError(req, res, errCode, null);
            });

          break;
        case 400:
          break;
        case 401:
          request.post({
            url: config.auth.uri + 'auth/v1/token',
            auth: { user: config.auth.clientId, pass: config.auth.clientSecret },
            form: {
              grant_type: 'refresh_token',
              refresh_token: req.session.refreshToken
            }
          }, (err2, innerResponse2, body2) => {
            var body2Json = JSON.parse(body2);

            if (innerResponse2.statusCode === 200) {

              req.session.accessToken = body2Json.access_token;
              req.session.refreshToken = body2Json.refresh_token;
            } else {
              response.respondError(req, res, status.codes.UnknownError, null);
            }
          });
          break;
        default:
          break;
      }
    }
    catch (e) {

    }
  });
};

var loadUserOnRequest = function (req, res, userId) {
  var deferred = Q.defer();

  UserModel.findOne({ _id: userId }).exec().then((user) => {
    if (req.info === undefined) {
      req.info = {};
    }
    req.info.user = user;
    deferred.resolve();
  }, (err) => {
    logger.error(err);
    deferred.reject(status.codes.UserNotFound.code);
  });

  return deferred.promise;
};

var getUserIdFromEmail = function (email) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then((user) => {
    if (user.verified) {

      deferred.resolve(user._id.toString());

    } else {
      deferred.reject(status.codes.UserNotVerified.code);
    }
  }, (err) => {
    logger.error(err);
    deferred.reject(status.codes.UserNotFound.code);
  });

  return deferred.promise;
};

var isLoggedIn = function (req) {
  return (req.session.accessToken !== undefined || req.session.refreshToken !== undefined);
};

///

UserController.prototype.login = function (req, res) {
  if (true === isLoggedIn(req)) {
    response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code, null);
  } else {
    getUserIdFromEmail(req.body.email).then((userId) => {
      request.post({
        url: config.auth.uri + 'auth/v1/token',
        auth: { user: config.auth.clientId, pass: config.auth.clientSecret },
        form: {
          grant_type: 'password',
          username: userId,
          password: req.body.password
        }
      }, (err, innerResponse, body) => {
        try {
          var bodyJson = JSON.parse(body);

          if (innerResponse.statusCode === 200) {

            req.session.accessToken = bodyJson.access_token;
            req.session.refreshToken = bodyJson.refresh_token;

            response.respondSuccess(req, res, null);
          } else {
            response.respondError(req, res, status.codes.UserCredentialsNotMatch.code, body);
          }
        }
        catch (e) {
        }
      });
    }, (errCode) => {
      response.respondError(req, res, errCode, null);
    });
  }
};

UserController.prototype.logout = function (req, res) {
  if (false === isLoggedIn(req)) {
    response.respondError(req, res, status.codes.UserLoggingOutWhenNotLoggedIn.code, null);
  } else {
    req.session.destroy();
    response.respondSuccess(req, res, null);
  }
};

///

UserController.prototype.generateResetToken = function (req, res) {
  if (true === isLoggedIn(req)) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }
  var email = req.body.email;

  generateResetTokenWorker(email).then((user) => {
    // TODO: send email
    user = user;
    //

    response.respondSuccess(req, res, null);
  }, (errCode) => {
    response.respondError(req, res, errCode, null);
  });
};

UserController.prototype.generateVerifyToken = function (req, res) {
  if (true === isLoggedIn(req)) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }
  var email = req.body.email;

  generateVerifyTokenWorker(email).then((user) => {
    // TODO: send email
    user = user;
    //

    response.respondSuccess(req, res, null);
  }, (errCode) => {
    response.respondError(req, res, errCode, null);
  });
};

UserController.prototype.register = function (req, res) {
  if (true === isLoggedIn(req)) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }
  var fields = {
    email: req.body.email,
    password: req.body.password
  };

  registerWork(fields).then((user) => {
    response.respondSuccess(req, res, user._id.toString());
  }, (errCode) => {
    response.respondError(req, res, errCode);
  });
};

var registerWork = function (fields) {
  fields.hashed_password = hashPassword(fields.password);
  fields.nickname = 'default nickname';
  delete fields.password;

  var deferred = Q.defer();

  UserModel.findOne({ email: fields.email }).exec().then((user) => {
    if (null === user) {
      // 학교 이메일 주소 체크
      UnivCtrl.getUniversityFromEmail(fields.email).then((university) => {
        if (null !== university) {
          var user = new UserModel(fields);

          user.univID = university;

          user.save().then((savedUser) => {
            deferred.resolve(savedUser);
          }, (err) => {
            logger.error(err);
            deferred.reject(status.codes.UserUpdateFailed.code);
          });
        } else {
          // university is null => not found?
          deferred.reject(status.codes.UnknownError.code);
        }
      }, (err) => {
        logger.error(err);
        deferred.reject(err);
      });
    } else {

      logger.debug('requested email: ' + fields.email + ' is already in use');
      deferred.reject(status.codes.UserEmailAlreadyInUse.code);
    }
  }, (err) => {

    logger.error(err);
    deferred.reject(status.codes.UnknownError.code);
  });

  return deferred.promise;
};

UserController.prototype.verifyUser = function (req, res) {
  if (true === isLoggedIn(req)) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }

  var email = req.body.email
    , verifyToken = req.body.verifyToken
    ;

  verifyUserWorker(email, verifyToken).then((user) => {
    user = user;
    response.respondSuccess(req, res, null);
  }, (errCode) => {
    response.respondError(req, res, errCode, null);
  });
};

///

var hashPassword = function (password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

UserController.prototype.resetPassword = function (req, res) {
  if (true === isLoggedIn(req)) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }

  var email = req.body.email
    , resetToken = req.body.resetToken
    , newPassword = req.body.newPassword
    ;

  resetPasswordWorker(email, resetToken, newPassword).then((user) => {
    user = user;

    response.respondSuccess(req, res, null);
  }, (errCode) => {
    response.respondError(req, res, errCode, null);
  });
};

var generateResetTokenWorker = function (email) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then((user) => {
    if (null === user) {
      deferred.reject(status.codes.UserNotFound.code);
    }
    var expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + config.user.resetTokenLifeTime);

    user.reset_token = uuid.v4();
    user.reset_token_expires = expireDate;

    user.save().then((savedUser) => {
      deferred.resolve(savedUser);
    }, (err) => {
      logger.error(err);
      deferred.reject(status.codes.UserUpdateFailed.code);
    });
  }, (err) => {
    logger.error(err);
    deferred.reject(status.codes.UserNotFound.code);
  });

  return deferred.promise;
};

var generateVerifyTokenWorker = function (email) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then(function (user) {
    if (null === user) {
      deferred.reject(status.codes.UserNotFound.code);
    } else if (user.verified) {
      deferred.reject(status.codes.UserAlreadyVerified.code);
    }

    var expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + config.user.verifyTokenLifeTime);

    user.verify_token = uuid.v4();
    user.verify_token_expires = expireDate;

    user.save().then((savedUser) => {
      deferred.resolve(savedUser);
    }, (err) => {
      logger.error(err);
      deferred.reject(status.codes.UserUpdateFailed.code);
    });
  }, (err) => {
    logger.error(err);
    deferred.reject(status.codes.UserNotFound.code);
  });

  return deferred.promise;
};

var resetPasswordWorker = function (email, resetToken, newPassword) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then((user) => {
    if (null === user) {
      deferred.reject(status.codes.UserNotFound.code);
    } else if (user.reset_token !== resetToken) {
      deferred.reject(status.codes.UserTokenMismatch.code);
    } else if (user.reset_token_expires < new Date()) {
      deferred.reject(status.codes.UserTokenAlreadyExpired.code);
    } else {
      user.hashed_password = hashPassword(newPassword);

      user.reset_token = null;
      user.reset_token_expires = null;

      user.save().then((savedUser) => {
        deferred.resolve(savedUser);
      }, (err) => {
        logger.error(err);
        deferred.reject(status.codes.UserUpdateFailed.code);
      });
    }
  });

  return deferred.promise;
};

var verifyUserWorker = function (email, verifyToken) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then((user) => {
    if (null === user) {
      deferred.reject(status.codes.UserNotFound.code);
    } else if (user.verified) {
      deferred.reject(status.codes.UserAlreadyVerified.code);
    } else if (user.verify_token !== verifyToken) {
      deferred.reject(status.codes.UserTokenMismatch.code);
    } else if (user.verify_token_expires < new Date()) {
      deferred.reject(status.codes.UserTokenAlreadyExpired.code);
    } else {
      user.verify_token = null;
      user.verify_token_expires = null;

      user.verified = true;

      user.save().then((savedUser) => {
        deferred.resolve(savedUser);
      }, (err) => {
        logger.error(err);
        deferred.reject(status.codes.UserUpdateFailed.code);
      });
    }
  }, (err) => {
    logger.error(err);
    deferred.reject(status.codes.UserNotFound.code);
  });

  return deferred.promise;
};

module.exports = new UserController();