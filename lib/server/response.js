"use strict";

var status = require('./status')
  , _ = require('underscore')
  , logger = require('./logger')
  ;

var respondError = function (req, res, statusObj, value) {
  var code = 1, message = "An unknown error occurred";
  var newValue = value;
  if (typeof statusObj === "number") {
    code = statusObj;
    message = status.getSummaryByCode(code);
  } else if (typeof statusObj.code !== "undefined") {
    code = statusObj.code;
    message = statusObj.summary;
  } else if (typeof statusObj.message !== "undefined") {
    message = statusObj.message;
  }

  if (typeof newValue === "object") {
    if (newValue !== null && _.has(value, "message")) {
      // make sure this doesn't get obliterated
      value.origValue = value.message;
      message += " (Original error: " + value.message + ")";
    }
    newValue = _.extend({ message: message }, value);
  } else {
    newValue = { message: message, origValue: value };
  }
  var response = { status: code, value: newValue };
  logger.debug("Responding to client with error: " + JSON.stringify(response));

  res.status(500).json(response);
};

var respondSuccess = function (req, res, value) {
  var response = { status: status.codes.Success.code, value: value };

  if (typeof response.value === "undefined") {
    response.value = '';
  }

  var printResponse = _.clone(response);
  var maxLen = 1000;
  if (printResponse.value !== null &&
    typeof printResponse.value.length !== "undefined" &&
    printResponse.value.length > maxLen) {
    printResponse.value = printResponse.value.slice(0, maxLen) + "...";
  }
  res.jsonResp = JSON.stringify(printResponse);
  logger.debug("Responding to client with success: " + res.jsonResp);

  res.status(200).json(response);
};

exports.respondRateLimit = function (req, res) {
  respondError(req, res, status.codes.RateLimitExceeded, null);
};

exports.checkMissingParams = function (req, res, params, strict) {
  if (typeof strict === "undefined") {
    strict = false;
  }
  var missingParamNames = [];
  _.each(params, function (param, paramName) {
    if (typeof param === "undefined" || (strict && !param)) {
      missingParamNames.push(paramName);
    }
  });
  if (missingParamNames.length > 0) {
    var missingList = JSON.stringify(missingParamNames);

    var response = { status: status.codes.InsufficientParameter.code, value: missingList };

    logger.debug("Missing params for request: " + missingList);

    res.status(400).json(response);

    return false;
  } else {
    return true;
  }
};

exports.respondError = respondError;
exports.respondSuccess = respondSuccess;