'use strict';

var UserModel = require('../model/user')
  , response = require('../server/response')
  , status = require('../server/status')
  , config = require('../../config/config')
  , uuid = require('uuid')
  , Q = require('q')
  , bcrypt = require('bcrypt')
  , UnivCtrl = require('./university')
  ;

var UserController = function () { };

UserController.prototype.getUser = function (req, res) {
  UserModel.findOne({ _id: req.params.id }, function (err, user) {
    response.respondSuccess(req, res, user, null);
  });
};

UserController.prototype.updateUser = function (req, res) {
  UserModel.findOne({ _id: req.params.id }).exec().then(function (user) {

    user.nickname = req.params.nickname;

    user.save().then(function (savedUser) {
      response.respondSuccess(req, res, savedUser, null);
    }, function (err) {
      err = err;
      response.respondError(req, res, status.codes.UserUpdateFailed.code, null);
    });
  }, function (err) {
    err = err;
    response.respondError(req, res, status.codes.UserNotFound.code, null);
  });
};

UserController.prototype.generateResetToken = function (email) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then(function (user) {
    if (!user) {
      deferred.reject('no such user found: ' + email);
    }
    var expireDate = new Date();
    expireDate.setDate(expireDate.getTime() + config.user.resetTokenLifetime);

    user.reset_token = uuid.v4();
    user.reset_token_expires = expireDate;

    user.save().then(function (savedUser) {
      deferred.resolve(savedUser);
    }, function (err) {
      deferred.reject(err);
    });
  }, function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

UserController.prototype.generateVerifyToken = function (email) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then(function (user) {
    if (!user) {
      deferred.reject('no such user found: ' + email);
    } else if (user.verified) {
      deferred.reject('user already verified oneself');
    }

    var expireDate = new Date();
    expireDate.setDate(expireDate.getTime() + config.user.verifyTokenLifetime);

    user.verify_token = uuid.v4();
    user.verify_token_expires = expireDate;

    user.save().then(function (savedUser) {
      deferred.resolve(savedUser);
    }, function (err) {
      deferred.reject(err);
    });
  }, function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

UserController.prototype.register = function (fields) {
  fields.hashed_password = hashPassword(fields.password);
  delete fields.password;

  var deferred = Q.defer();

  // 학교 이메일 주소 체크
  UnivCtrl.getUniversityByEmail(fields.email).then(function (university) {
    if (!university) {
      var user = new UserModel(fields);
      user.univID = university._id;
      user.save().then(function (savedUser) {
        deferred.resolve(savedUser);
      }, function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.reject('university if null?!');
    }
  }, function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

UserController.prototype.verifyUser = function (email, verifyToken) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then(function (user) {
    if (!user) {
      deferred.reject('no such user found: ' + email);
    } else if (user.verified) {
      deferred.reject('user already verified oneself');
    } else if (user.verify_token !== verifyToken) {
      deferred.reject('verification token mismatch');
    } else if (user.verify_token_expires < new Date()) {
      deferred.reject('verification token already expired');
    }

    delete user.verify_token;
    delete user.verify_token_expires;

    user.verified = true;

    user.save().then(function (savedUser) {
      deferred.resolve(savedUser);
    }, function (err) {
      deferred.reject(err);
    });
  }, function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

var hashPassword = function (password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

UserController.prototype.resetPassword = function (email, resetToken, newPassword) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then(function (user) {
    if (!user) {
      deferred.reject('no such user found: ' + email);
    } else if (user.reset_token !== resetToken) {
      deferred.reject('password reset token not matching');
    } else if (user.reset_token_expires < new Date()) {
      deferred.reject('password reset token already expired');
    }

    user.hashed_password = hashPassword(newPassword);

    delete user.reset_token;
    delete user.reset_token_expires;

    user.save().then(function (savedUser) {
      deferred.resolve(savedUser);
    }, function (err) {
      deferred.reject(err);
    });
  });

  return deferred.promise;
};

module.exports = new UserController();