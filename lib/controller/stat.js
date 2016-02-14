'use strict';

var Univ = require('../model/university')
,	User = require('../model/user')
,	status = require('../server/status')
,   response = require('../server/response')
;

var StatController = function () {};

StatController.prototype.getUserStat = function (req, res) {
	User.find().count().then((err, count) => {
		if (err) {
			response.respondError(req, res, status.codes.CouldNotFetchCount.code);
		}
		response.respondSuccess(req, res, count);
	});
};

StatController.prototype.getUnivStat = function (req, res) {
	Univ.find().count().then((err, count) => {
		if (err) {
			response.respondError(req, res, status.codes.CouldNotFetchCount.code);
		}
		response.respondSuccess(req, res, count);
	});
};

module.exports = new StatController();