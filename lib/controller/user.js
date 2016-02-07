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
  UserModel.findOne({ _id: req.params.id }).exec().then((user) => {
    delete user.hashed_password;

    response.respondSuccess(req, res, user);
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.UserNotFound.code);
  });
};

UserController.prototype.updateUser = function (req, res) {
  UserModel.findOne({ _id: req.params.id }).exec().then((user) => {

    user.nickname = req.body.nickname;

    user.save().then((savedUser) => {
      delete savedUser.hashed_password;

      response.respondSuccess(req, res, savedUser);
    }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.UserUpdateFailed.code, null);
    });
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.UserNotFound.code, null);
  });
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

    switch (innerResponse.statusCode) {
      case 200:
        loadUserOnSession(req, res, body.userId);

        next();
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
          try {
            var body2Json = JSON.parse(body2);

            if (innerResponse2.statusCode === 200) {

              req.session.accessToken = body2Json.access_token;
              req.session.refreshToken = body2Json.refresh_token;
            } else {
              response.respondError(req, res, status.codes.UnknownError, null);
            }
          }
          catch (e) {

          }
        });
        break;
      default:
        break;
    }
  });
};

var loadUserOnSession = function (req, res, userId) {
  UserModel.findOne({ _id: userId }).exec().then((user) => {
    req.session.user = user;
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.UserNotFound.code, null);
  });
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
  if (true === isLoggedIn()) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }
  var userId = req.user.userId;

  generateResetTokenWorker(userId).then((user) => {
    // TODO: send email
    user = user;
    //

    response.respondSuccess(req, res, null);
  }, (errCode) => {
    response.respondError(req, res, errCode, null);
  });
};

UserController.prototype.generateVerifyToken = function (req, res) {
  if (true === isLoggedIn()) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }
  var userId = req.user.userId;

  generateVerifyTokenWorker(userId).then((user) => {
    // TODO: send email
    user = user;
    //

    response.respondSuccess(req, res, null);
  }, (errCode) => {
    response.respondError(req, res, errCode, null);
  });
};

UserController.prototype.register = function (req, res) {
  if (true === isLoggedIn()) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }
  var user = {
    email: req.body.email,
    password: req.body.password
  };

  registerWork(user).then((user) => {
    user = user;
    response.respondSuccess(req, res, null);
  }, (errCode) => {
    response.respondError(req, res, errCode);
  });
};

var registerWork = function (fields) {
  fields.hashed_password = hashPassword(fields.password);
  delete fields.password;

  var deferred = Q.defer();

  getUserIdFromEmail(fields.email).then(() => {
    logger.error('requested email: ' + fields.email + 'is already in use');
    deferred.reject(status.codes.UserEmailAlreadyInUse.code);
  }, (err) => {
    if (err === status.codes.UserNotFound) {
      // 학교 이메일 주소 체크
      UnivCtrl.getUniversityFromEmail(fields.email).then((university) => {
        if (!university) {
          var user = new UserModel(fields);
          user.univID = university._id;
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
      logger.error(err);
      deferred.reject(err);
    }
  });

  return deferred.promise;
};

UserController.prototype.verifyUser = function (req, res) {
  if (true === isLoggedIn()) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }

  var userId = req.body.userId
    , verifyToken = req.body.verifyToken
    ;

  verifyUserWorker(userId, verifyToken).then((user) => {
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
  if (true === isLoggedIn()) {
    return response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  }

  var userId = req.body.userId
    , resetToken = req.body.resetToken
    , newPassword = req.body.newPassword
    ;

  resetPasswordWorker(userId, resetToken, newPassword).then((user) => {
    user = user;

    response.respondSuccess(req, res, null);
  }, (errCode) => {
    response.respondError(req, res, errCode, null);
  });
};

var generateResetTokenWorker = function (userId) {
  var deferred = Q.defer();

  UserModel.findOne({ _id: userId }).exec().then((user) => {
    if (!user) {
      deferred.reject(status.codes.UserNotFound.code);
    }
    var expireDate = new Date();
    expireDate.setDate(expireDate.getTime() + config.user.resetTokenLifetime);

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

var generateVerifyTokenWorker = function (userId) {
  var deferred = Q.defer();

  UserModel.findOne({ _id: userId }).exec().then(function (user) {
    if (!user) {
      deferred.reject(status.codes.UserNotFound.code);
    } else if (user.verified) {
      deferred.reject(status.codes.UserAlreadyVerified.code);
    }

    var expireDate = new Date();
    expireDate.setDate(expireDate.getTime() + config.user.verifyTokenLifetime);

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

var resetPasswordWorker = function (userId, resetToken, newPassword) {
  var deferred = Q.defer();

  UserModel.findOne({ _id: userId }).exec().then((user) => {
    if (!user) {
      deferred.reject(status.codes.UserNotFound.code);
    } else if (user.reset_token !== resetToken) {
      deferred.reject(status.codes.UserTokenMismatch.code);
    } else if (user.reset_token_expires < new Date()) {
      deferred.reject(status.codes.UserTokenAlreadyExpired.code);
    }

    user.hashed_password = hashPassword(newPassword);

    delete user.reset_token;
    delete user.reset_token_expires;

    user.save().then((savedUser) => {
      deferred.resolve(savedUser);
    }, (err) => {
      logger.error(err);
      deferred.reject(status.codes.UserUpdateFailed.code);
    });
  });

  return deferred.promise;
};

var verifyUserWorker = function (userId, verifyToken) {
  var deferred = Q.defer();

  UserModel.findOne({ _id: userId }).exec().then((user) => {
    if (!user) {
      deferred.reject(status.codes.UserNotFound.code);
    } else if (user.verified) {
      deferred.reject(status.codes.UserAlreadyVerified.code);
    } else if (user.verify_token !== verifyToken) {
      deferred.reject(status.codes.UserTokenMismatch.code);
    } else if (user.verify_token_expires < new Date()) {
      deferred.reject(status.codes.UserTokenAlreadyExpired.code);
    }

    delete user.verify_token;
    delete user.verify_token_expires;

    user.verified = true;

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

module.exports = new UserController();