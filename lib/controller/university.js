'use strict';

var Q = require('q')
  , UnivModel = require('../model/university')
  , status = require('../server/status')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , _ = require('underscore')
  ;

var UniversityController = function () { };

UniversityController.prototype.isValidEmailAddress = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

UniversityController.prototype.isValidEmailDomain = function (emailDomain) {
  var regex = /^((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(emailDomain);
};

UniversityController.prototype.getUniversityFromEmail = function (email) {
  var deferred = Q.defer();

  var emailDomain = email.replace(/.*@/, "");

  if (false === UniversityController.prototype.isValidEmailAddress(email)) {
    deferred.reject(status.codes.InvalidEmailAddress.code);
  } else {
    UnivModel.find({ emailDomainList: emailDomain }).exec()
      .then((universities) => {
        if (universities.length === 0) {
          deferred.reject(status.codes.NotAcceptedEmailAddress.code);
        } else if (universities.length > 1) {
          deferred.reject(status.codes.MultipleAcceptedEmailAddress.code);
        } else {
          deferred.resolve(universities[0]._id.toString());
        }
      }, (err) => {
        logger.error(err);
        deferred.reject(status.codes.UnknownError.code);
      });
  }

  return deferred.promise;
};

UniversityController.prototype.permitStudent = function (req, res, next) {
  req = req;
  res = res;
  next();
};

UniversityController.prototype.searchPosts = function (req, res) {
  req = req;
  res = res;
};

UniversityController.prototype.getPostsInUniv = function (req, res) {
  req = req;
  res = res;
};

UniversityController.prototype.getUniversity = function (req, res) {
  UnivModel.findOne({ _id: req.params.univid }).exec().then((univ) => {
    if (null !== univ) {
      response.respondSuccess(req, res, univ);
    } else {
      response.respondError(req, res, status.codes.UnivNotFound.code);
    }
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.UnivNotFound.code);
  });
};

UniversityController.prototype.createUniversity = function (req, res) {
  var isAllDomainValid = true;
  if (undefined !== req.body.emailDomainList) {
    isAllDomainValid = _.every(req.body.emailDomainList, UniversityController.prototype.isValidEmailDomain);
  }

  if (true === isAllDomainValid) {
    UnivModel.findOne({ name: req.body.name }).exec().then((univ) => {
      if (null === univ) {
        var fields = {
          name: req.body.name,
          displayName: req.body.displayName,
          emailDomainList: req.body.emailDomainList
        };

        var newUniv = new UnivModel(fields);

        newUniv.save().then((savedUniv) => {
          response.respondSuccess(req, res, savedUniv._id.toString());
        }, (err) => {
          logger.error(err);
          response.respondError(req, res, status.codes.UnivUpdateFailed.code);
        });
      } else {
        logger.debug('request univ name: ' + req.body.name + ' is already existing');
        response.respondError(req, res, status.codes.UnivAlreadyExisting.code);
      }
    }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.UnknownError.code);
    });
  } else {
    response.respondError(req, res, status.codes.InvalidEmailDomain.code);
  }
};

UniversityController.prototype.updateUniversity = function (req, res) {
  var isAllDomainValid = true;
  if (undefined !== req.body.emailDomainList) {
    isAllDomainValid = _.every(req.body.emailDomainList, UniversityController.prototype.isValidEmailDomain);
  }

  if (true === isAllDomainValid) {
    UnivModel.findOne({ _id: req.params.univid }).exec().then((univ) => {
      if (null !== univ) {

        if (undefined !== req.body.name) {
          univ.name = req.body.name;
        }

        if (undefined !== req.body.displayName) {
          univ.displayName = req.body.displayName;
        }

        if (undefined !== req.body.emailDomainList) {
          univ.emailDomainList = req.body.emailDomainList;
        }

        univ.save().then((savedUniv) => {
          savedUniv = savedUniv;
          response.respondSuccess(req, res, null);
        }, (err) => {
          logger.error(err);
          response.respondError(req, res, status.codes.UnivUpdateFailed.code);
        });
      } else {
        response.respondError(req, res, status.codes.UnivNotFound.code);
      }
    }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.UnknownError.code);
    });
  } else {
    response.respondError(req, res, status.codes.InvalidEmailDomain.code);
  }
};

UniversityController.prototype.destroyUniversity = function (req, res) {
  UnivModel.findOneAndRemove({ _id: req.params.univid }).exec().then((univ) => {
    if (null === univ) {
      response.respondError(req, res, status.codes.UnivNotFound.code);
    } else {
      response.respondSuccess(req, res, null);
    }
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.UnivRemovalFailed.code);
  });
};

module.exports = new UniversityController();