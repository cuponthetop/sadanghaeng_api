'use strict';

var UnivModel = require('../model/university')
  , UserModel = require('../model/user')
  , PostModel = require('../model/post')
  , CommentModel = require('../model/comment')
  , status = require('../server/status')
  , response = require('../server/response')
  , logger = require('../server/logger')
  , config = require('../../config/config')
  ;

var StatController = function () { };

StatController.prototype.getUserStat = function (req, res) {
  UserModel.find({ verified: true }).count().exec().then((count) => {
    response.respondSuccess(req, res, { count: count });
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.CouldNotFetchCount.code);
  });
};

StatController.prototype.getUnivStat = function (req, res) {
  UnivModel.find().count().exec().then((count) => {
    response.respondSuccess(req, res, { count: count });
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.CouldNotFetchCount.code);
  });
};

StatController.prototype.getUnivPostStat = function (req, res) {
  if (undefined !== req.query.filter && 'hot' === req.query.filter) {
    var best = PostModel.find({ university: req.params.univid });
    best.where('voteScore').gte(config.post.hotThreshold);
    best.count().exec().then((count) => {
      response.respondSuccess(req, res, { count: count });
  }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.CouldNotFetchCount.code);
    });
  } else {
    PostModel.find({university: req.params.univid}).count().exec().then((count) => {
      response.respondSuccess(req, res, { count: count });
  }, (err) => {
      logger.error(err);
      response.respondError(req, res, status.codes.CouldNotFetchCount.code);
    });
  }
};

StatController.prototype.getPostStat = function (req, res) {
  PostModel.find().count().exec().then((count) => {
    response.respondSuccess(req, res, { count: count });
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.CouldNotFetchCount.code);
  });
};

StatController.prototype.getCommentStat = function (req, res) {
  CommentModel.find().count().exec().then((count) => {
    response.respondSuccess(req, res, { count: count });
  }, (err) => {
    logger.error(err);
    response.respondError(req, res, status.codes.CouldNotFetchCount.code);
  });
};

module.exports = new StatController();