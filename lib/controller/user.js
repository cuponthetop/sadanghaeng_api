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
  , mailer = require('../server/mailer')
  , agent = require('superagent-promise')(require('superagent'), Q.Promise)
  ;

var UserController = function () { };

UserController.prototype.destroyUser = function (req, res) {
  UserModel.findOneAndRemove({ _id: req.params.userid }).exec().then((user) => {
    if (null === user) {
      response.respondError(req, res, status.codes.UserNotFound.code);
    } else {
      response.respondSuccess(req, res, null);
    }
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.UserRemovalFailed.code);
  });
};

UserController.prototype.reportUser = function (req, res) {
  if (req.info.user._id.toString() === req.params.userid) {
    response.respondError(req, res, status.codes.CantReportSelf.code);
  } else {
    UserModel.findOne({ _id: req.params.userid }).exec().then((user) => {
      if (null === user) {
        response.respondError(req, res, status.codes.UserNotFound.code);
      } else if (false === user.verified) {
        response.respondError(req, res, status.codes.UserNotVerified.code);
      } else if (undefined !== user.reported.find((t) => { return t.toString() === req.info.user._id.toString(); })) {
        response.respondError(req, res, status.codes.AlreadyReported.code);
      } else {
        user.reported.push(req.info.user._id);

        user.save().then((savedUser) => {
          savedUser = savedUser;
          response.respondSuccess(req, res, null);
        }, (err) => {
          logger.error(err);
          response.respondError(req, res, status.codes.UserUpdateFailed.code);
        });
      }
    }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.UserNotFound.code);
    });
  }
};

UserController.prototype.getUser = function (req, res) {
  UserModel
    .findOne({ _id: req.params.userid })
    .exec()
    .then((user) => {
      if (null === user) {
        response.respondError(req, res, status.codes.UserNotFound.code);
      } else {
        user.hashed_password = null;
        response.respondSuccess(req, res, user);
      }
    }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.UserNotFound.code);
    });
};

UserController.prototype.updateUser = function (req, res) {
  if (req.info.user !== undefined) {
    if (req.body.nickname !== undefined) {
      req.info.user.nickname = req.body.nickname;
    }

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
var isOwner = function (req) {
  var ownerId = "";

  if (req.params !== undefined &&
    req.params.userid !== undefined) {
    ownerId = req.params.userid;
  } else if (req.info.post !== undefined) {
    ownerId = req.info.post.author.toString();
  } else if (req.info.comment !== undefined) {
    ownerId = req.info.comment.author.toString();
  }

  // console.log(req.info.user._id.toString() === ownerId);
  return req.info.user._id.toString() === ownerId;
};

var isAdmin = function (req) {
  return req.info.user.admin;
};

var isStudent = function (req) {
  var univId = '';

  if (req.params !== undefined &&
    req.params.univid !== undefined) {
    univId = req.params.univid;
  } else if (req.info.post !== undefined) {
    univId = req.info.post.university.toString();
  } else if (req.info.comment !== undefined) {
    univId = req.info.comment.postID.university.toString();
  } else if (req.info.univid !== undefined) {
    univId = req.info.univid;
  }
  return req.info.user.university._id.toString() === univId;
};

UserController.prototype.permitStudent = function (req, res, next) {
  if (undefined === req.info ||
    undefined === req.info.user) {
    response.respondError(req, res, status.codes.UserAuthRequired.code);
  } else if (false === isStudent(req)) {
    response.respondError(req, res, status.codes.UserPermissionNotAllowed.code);
  } else {
    next();
  }
};

UserController.prototype.permitStudentOrAdmin = function (req, res, next) {
  if (undefined === req.info ||
    undefined === req.info.user) {
    response.respondError(req, res, status.codes.UserAuthRequired.code);
  } else if (false === isStudent(req) &&
    false === isAdmin(req)) {
    response.respondError(req, res, status.codes.UserPermissionNotAllowed.code);
  } else {
    next();
  }
};

UserController.prototype.permitOwner = function (req, res, next) {
  if (true === isOwner(req)) {
    next();
  } else {
    response.respondError(req, res, status.codes.UserPermissionNotAllowed.code);
  }
};

UserController.prototype.permitOwnerOrAdmin = function (req, res, next) {
  if (true === isOwner(req) ||
    true === isAdmin(req)) {
    next();
  } else {
    response.respondError(req, res, status.codes.UserPermissionNotAllowed.code);
  }
};

UserController.prototype.permitAdmin = function (req, res, next) {
  if (true === isAdmin(req)) {
    next();
  } else {
    response.respondError(req, res, status.codes.UserPermissionNotAllowed.code);
  }
};

UserController.prototype.requireUser = function (req, res, next) {
  if (false === isLoggedIn(req)) {
    return response.respondError(req, res, status.codes.UserAuthRequired.code, null);
  }

  agent
    .post(config.auth.uri + 'auth/v1/authorise')
    .set('Authorization', 'Bearer ' + req.session.accessToken)
    .end()
    .then((innerResponse) => {

      switch (innerResponse.status) {
        case 200:

          loadUserOnRequest(req, res, innerResponse.body.userId)
            .then(next)
            .catch((errCode) => {
              response.respondError(req, res, errCode);
            })
            .done();
          break;
        case 400:
          break;
        case 401:
          agent
            .post(config.auth.uri + 'auth/v1/token')
            .auth(config.auth.clientId, config.auth.clientSecret)
            .type('form')
            .send({
              grant_type: 'refresh_token',
              refresh_token: req.session.refreshToken
            })
            .end()
            .then((innerResponse2) => {
              if (innerResponse2.status === 200) {

                req.session.accessToken = innerResponse2.body.access_token;
                req.session.refreshToken = innerResponse2.body.refresh_token;
              } else {
                response.respondError(req, res, status.codes.UnknownError, null);
              }
            })
            .catch((err) => {
              logger.error(err);
              response.respondError(req, res, status.codes.UnknownError, null);
            })
            .done();
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.UnknownError, null);
    })
    .done();
};

var loadUserOnRequest = function (req, res, userId) {
  var deferred = Q.defer();

  UserModel
    .findOne({ _id: userId })
    .populate({ path: 'university' })
    .exec()
    .then((user) => {
      if (null === user) {
        deferred.reject(status.codes.UserNotFound.code);
      } else {
        req.info = req.info || {};
        req.info.user = user;
        deferred.resolve();
      }
    }, (err) => {
      logger.error(err);
      deferred.reject(status.codes.UserNotFound.code);
    });

  return deferred.promise;
};

var getUserIdFromEmail = function (email) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then((user) => {
    if (null === user) {
      deferred.reject(status.codes.UserNotFound.code);
    } else if (user.verified) {
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
    response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  } else if (false === UnivCtrl.isValidEmailAddress(req.body.email)) {
    response.respondError(req, res, status.codes.InvalidEmailAddress.code);
  } else {
    getUserIdFromEmail(req.body.email)
      .then((userId) => {
        agent
          .post(config.auth.uri + 'auth/v1/token')
          .auth(config.auth.clientId, config.auth.clientSecret)
          .type('form')
          .send({
            grant_type: 'password',
            username: userId,
            password: req.body.password
          })
          .then((innerResponse) => {
            if (innerResponse.status === 200) {

              req.session.accessToken = innerResponse.body.access_token;
              req.session.refreshToken = innerResponse.body.refresh_token;

              response.respondSuccess(req, res, null);
            } else {
              response.respondError(req, res, status.codes.UserCredentialsNotMatch.code, JSON.stringify(innerResponse.body));
            }
          })
          .catch((err) => {
            response.respondError(req, res, status.codes.UserCredentialsNotMatch.code, err);
          })
          .done();
      })
      .catch((errCode) => {
        response.respondError(req, res, errCode);
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
    response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  } else if (false === UnivCtrl.isValidEmailAddress(req.body.email)) {
    response.respondError(req, res, status.codes.InvalidEmailAddress.code);
  } else {
    var email = req.body.email;

    generateResetTokenWorker(email).then((user) => {
      var promise;
      // send mail unless in test env
      if (config.mail.isTest) {
        promise = Q({ rejected: [] });
        // promise = mailer.sendMail(config.mail.username, '가림 비밀번호 변경', '비밀번호 변경을 위한 링크는 ' + user.reset_token + ' 입니다.');
      } else {
        // TODO: 이거 하이퍼 링크로 보내게
        promise = mailer.sendMail(user.email, '가림 비밀번호 변경', '비밀번호 변경을 위한 링크는 ' + user.reset_token + ' 입니다.');
      }

      promise
        .then((info) => {
          if (info.rejected.length === 0) {
            response.respondSuccess(req, res, null);
          } else {
            response.respondError(req, res, status.codes.EmailSendFailed.code);
          }
        })
        .catch((err) => {
          logger.error(err);
          response.respondError(req, res, status.codes.EmailSendFailed.code);
        })
        .done();
    }, (errCode) => {
      response.respondError(req, res, errCode);
    });
  }
};

UserController.prototype.generateVerifyToken = function (req, res) {
  if (true === isLoggedIn(req)) {
    response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  } else if (false === UnivCtrl.isValidEmailAddress(req.body.email)) {
    response.respondError(req, res, status.codes.InvalidEmailAddress.code);
  } else {
    var email = req.body.email;

    generateVerifyTokenWorker(email)
      .then((user) => {
        var promise = null;
        // send mail unless in test env
        if (config.mail.isTest) {
          // promise = mailer.sendMail(config.mail.username, '가림 이메일 인증', '이메일 주소 인증을 위한 링크는 ' + user.verify_token + ' 입니다.');
          promise = Q({ rejected: [] });
        } else {
          // TODO: 이거 하이퍼 링크로 보내게
          promise = mailer.sendMail(user.email, '가림 이메일 인증', '이메일 주소 인증을 위한 링크는 ' + user.verify_token + ' 입니다.');
        }

        promise
          .then((info) => {
            if (info.rejected.length === 0) {
              response.respondSuccess(req, res, null);
            } else {
              response.respondError(req, res, status.codes.EmailSendFailed.code);
            }
          })
          .catch((err) => {
            logger.error(err);
            response.respondError(req, res, status.codes.EmailSendFailed.code);
          })
          .done();
      }, (errCode) => {
        response.respondError(req, res, errCode, null);
      });
  }
};

UserController.prototype.register = function (req, res) {
  if (true === isLoggedIn(req)) {
    response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  } else if (false === UnivCtrl.isValidEmailAddress(req.body.email)) {
    response.respondError(req, res, status.codes.InvalidEmailAddress.code);
  } else {
    var fields = {
      email: req.body.email,
      password: req.body.password
    };

    registerWork(fields).then((user) => {
      response.respondSuccess(req, res, user._id.toString());
    }, (errCode) => {
      response.respondError(req, res, errCode);
    });
  }
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

          user.university = university;

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
      }, (errCode) => {
        logger.error(errCode);
        deferred.reject(errCode);
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
    response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  } else if (false === UnivCtrl.isValidEmailAddress(req.body.email)) {
    response.respondError(req, res, status.codes.InvalidEmailAddress.code);
  } else {
    var email = req.body.email
      , verifyToken = req.body.verifyToken
      ;

    verifyUserWorker(email, verifyToken).then((user) => {
      user = user;
      response.respondSuccess(req, res, null);
    }, (errCode) => {
      response.respondError(req, res, errCode, null);
    });
  }
};

///

var hashPassword = function (password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

UserController.prototype.resetPassword = function (req, res) {
  if (true === isLoggedIn(req)) {
    response.respondError(req, res, status.codes.UserAlreadyLoggedIn.code);
  } else if (false === UnivCtrl.isValidEmailAddress(req.body.email)) {
    response.respondError(req, res, status.codes.InvalidEmailAddress.code);
  } else {
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
  }
};

var generateResetTokenWorker = function (email) {
  var deferred = Q.defer();

  UserModel.findOne({ email: email }).exec().then((user) => {
    if (null === user) {
      deferred.reject(status.codes.UserNotFound.code);
    } else {
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
    }
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
    } else {
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
    }
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