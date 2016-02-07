"use strict";

var codes = {
  Success: {
    code: 0,
    summary: 'success'
  },
  UnknownError: {
    code: 1,
    summary: 'Unknown Error has occured! We are doomed!'
  },
  InsufficientParameter: {
    code: 10,
    summary: 'Supplied parameters were not sufficient for' +
    'handling request'
  },

  UserNotFound: {
    code: 101,
    summary: 'Requested User was not found on DB'
  },
  UserUpdateFailed: {
    code: 102,
    summary: 'User update failed'
  },
  UserTokenMismatch: {
    code: 103,
    summary: 'provided token mismatch'
  },
  UserTokenAlreadyExpired: {
    code: 104,
    summary: 'provided token is already expired'
  },
  UserAlreadyVerified: {
    code: 105,
    summary: 'user already verified oneself'
  },

  UserAuthRequired: {
    code: 111,
    summary: 'user authentication is required'
  },
  UserAlreadyLoggedIn: {
    code: 112,
    summary: 'user is trying to login but this user' +
    'was already logged in as an user'
  },
  UserLoggingOutWhenNotLoggedIn: {
    code: 113,
    summary: 'user is trying to logout but this user' +
    'is not logged in as any user'
  },
  UserCredentialsNotMatch: {
    code: 114,
    summary: 'provided user credential is not correct'
  },

  RateLimitExceeded: {
    code: 40004,
    summary: 'Too many requests, please try again later.'
  }
};

if (typeof module !== "undefined") {
  module.exports.codes = codes;
  module.exports.getSummaryByCode = function (code) {
    code = parseInt(code, 10);
    for (var c in codes) {
      if (typeof codes[c].code !== "undefined" && codes[c].code === code) {
        return codes[c].summary;
      }
    }
    return 'An error occurred';
  };
}