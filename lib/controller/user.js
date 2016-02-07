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
  ;

var UserController = function () { };

UserController.prototype.getUser = function (req, res) {
  UserModel.findOne({ _id: req.params.id }, (err, user) => {
    response.respondSuccess(req, res, user);
  });
};

UserController.prototype.updateUser = function (req, res) {
  UserModel.findOne({ _id: req.params.id }).exec().then((user) => {

    user.nickname = req.params.nickname;

    user.save().then((savedUser) => {
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
  req = req;
  res = res;
  next();

  var userId = null;
  loadUser(userId);
};

var loadUser = function (userId) {
  userId = userId;
};

///

UserController.prototype.login = function (req, res) {
  req = req;
  res = res;
};

UserController.prototype.logout = function (req, res) {
  req = req;
  res = res;
};

///

UserController.prototype.generateResetToken = function (req, res) {
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

UserController.prototype.register = function (fields) {
  fields.hashed_password = hashPassword(fields.password);
  delete fields.password;

  var deferred = Q.defer();

  // 학교 이메일 주소 체크
  UnivCtrl.getUniversityByuserId(fields.userId).then((university) => {
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

  return deferred.promise;
};

UserController.prototype.verifyUser = function (req, res) {
  var userId = req.params.userId
    , verifyToken = req.params.verifyToken
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
  var userId = req.params.userId
    , resetToken = req.params.resetToken
    , newPassword = req.params.newPassword
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