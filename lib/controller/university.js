'use strict';

var Q = require('q')
  , UnivModel = require('../model/university')
  , PostModel = require('../model/post')
  , status = require('../server/status')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , _ = require('underscore')
  , config = require('../../config/config')
  , ObjectId = require('mongoose').Types.ObjectId
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

var generateSearchQuery = function (params) {
  var query = PostModel.find({ university: params.univId });

  var sortArg = { written: params.sort };

  if (undefined !== params.query) {
    query.or(params.fields.map((fieldName) => {
      var out = {};
      out[fieldName] = { $regex: params.query, $options: 'i' };
      return out;
    }));
  }

  if (undefined !== params.filter && 'hot' === params.filter) {
    query.where('voteScore').gte(config.post.hotThreshold);
  }

  if (undefined !== params.age) {
    var ageAnchor = new Date();
    ageAnchor.setTime(ageAnchor.getTime() - (params.age * 3600 * 24 * 1000));
    query.where('written').gte(ageAnchor);
  }

  return query
    .skip((params.page - 1) * params.perPage)
    .limit(params.perPage)
    .sort(sortArg)
    .populate({
      path: 'author',
      populate: { path: 'university', model: 'universitys' }
    });
};

var makeVoteStat = function (votesArr) {
  return votesArr.map((el) => {
    var isLike = ('up' === el.voteType);

    return {
      likeCount: isLike ? 1 : 0,
      dislikeCount: !isLike ? 1 : 0
    };
  })
  .reduce((prev, cur) => {
    return {
      likeCount: prev.likeCount + cur.likeCount,
      dislikeCount: prev.dislikeCount + cur.dislikeCount
    };
  }, { likeCount: 0, dislikeCount: 0});
};

var doSearch = function (params) {
  var deferred = Q.defer();

  UnivModel.findOne({ _id: params.univId }).exec().then((univ) => {
    if (null === univ) {
      deferred.reject(status.codes.UnivNotFound.code);
    } else {
      generateSearchQuery(params)
        .exec()
        .then((posts) => {
          var result = posts.map((post) => {
            var voteStat = makeVoteStat(post.votes);

            return {
              pid: post._id.toString(),
              title: post.title,
              // text: post.text,
              author: post.author.nickname,
              written: post.written,
              edited: post.edited,
              readCount: post.readCount,
              // voteCount: post.voteScore,
              likeCount: voteStat.likeCount,
              dislikeCount: voteStat.dislikeCount,
              commentCount: post.comments.length,
              reportCount: post.reported.length
            };
          });
          deferred.resolve(result);
        }, (err) => {
          logger.error(err);
          deferred.reject(status.codes.UnknownError.code);
        });
    }
  }, (err) => {
    logger.error(err);
    deferred.reject(status.codes.UnivNotFound.code);
  });

  return deferred.promise;
};

var sanitizeObjectId = function (proposedId) {
  var objID;

  try {
    objID = new ObjectId(proposedId);
  } catch (e) {
    return false;
  }

  return proposedId === objID.toString();
};

UniversityController.prototype.searchPosts = function (req, res) {
  if (undefined !== req.query.page &&
    (0 >= req.query.page || config.post.maxPage < req.query.page)) {
    response.respondError(req, res, status.codes.InvalidPageNumberRequested.code);
  } else if (undefined !== req.query.sort &&
    (-1 === config.post.sortTypes.indexOf(req.query.sort))) {
    response.respondError(req, res, status.codes.InvalidSortRequested.code);
  } else if (undefined !== req.query.perPage &&
    (0 >= req.query.perPage || config.post.maxPerPage < req.query.perPage)) {
    response.respondError(req, res, status.codes.InvalidPerPageRequested.code);
  } else if (undefined === req.query.query || '' === req.query.query) {
    response.respondError(req, res, status.codes.EmptyQueryStringRequested.code);
  } else if (undefined !== req.query.fields &&
    (false === Array.isArray(req.query.fields) || false === req.query.fields.every((field) => { return config.post.searchFields.indexOf(field) !== -1; }))) {
    response.respondError(req, res, status.codes.InvalidSearchFieldRequested.code);
  } else if (undefined === req.query.fields) {
    response.respondError(req, res, status.codes.InvalidSearchFieldRequested.code);
  } else if (false === sanitizeObjectId(req.params.univid)) {
    response.respondError(req, res, status.codes.UnivNotFound.code);
  } else {
    var searchParam = {
      // TODO: sanitize
      univId: req.params.univid,
      query: req.query.query,
      page: req.query.page || 1,
      sort: req.query.sort || config.post.defaultSort,
      fields: req.query.fields,
      perPage: req.query.perPage || config.post.defaultPerPage,
    };

    doSearch(searchParam)
      .then((posts) => {
        response.respondSuccess(req, res, posts);
      })
      .catch((errCode) => {
        response.respondError(req, res, errCode);
      })
      .done();
  }
};

UniversityController.prototype.getPostsInUniv = function (req, res) {
  if (undefined !== req.query.page &&
    (0 >= req.query.page || config.post.maxPage < req.query.page)) {
    response.respondError(req, res, status.codes.InvalidPageNumberRequested.code);
  } else if (undefined !== req.query.sort &&
    (-1 === config.post.sortTypes.indexOf(req.query.sort))) {
    response.respondError(req, res, status.codes.InvalidSortRequested.code);
  } else if (undefined === req.query.filter ||
    undefined !== req.query.filter &&
    (-1 === config.post.filterTypes.indexOf(req.query.filter))) {
    response.respondError(req, res, status.codes.InvalidFilterRequested.code);
  }
  else if (undefined !== req.query.perPage &&
    (0 >= req.query.perPage || config.post.maxPerPage < req.query.perPage)) {
    response.respondError(req, res, status.codes.InvalidPerPageRequested.code);
  } else if (undefined !== req.query.age &&
    (0 >= req.query.age || config.post.maxAge < req.query.age)) {
    response.respondError(req, res, status.codes.InvalidAgeRequested.code);
  } else if (false === sanitizeObjectId(req.params.univid)) {
    response.respondError(req, res, status.codes.UnivNotFound.code);
  } else {
    var searchParam = {
      // TODO: sanitize
      univId: req.params.univid,
      page: req.query.page || 1,
      sort: req.query.sort || config.post.defaultSort,
      filter: req.query.filter || config.post.filter,
      perPage: req.query.perPage || config.post.defaultPerPage,
      age: req.query.age || config.post.defaultAge
    };

    if (!req.query.age) {
      delete searchParam.age;
    }

    doSearch(searchParam)
      .then((posts) => {
        response.respondSuccess(req, res, posts);
      })
      .catch((errCode) => {
        response.respondError(req, res, errCode);
      })
      .done();
  }
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